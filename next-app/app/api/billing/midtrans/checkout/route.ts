/**
 * POST /api/billing/midtrans/checkout — Checkout pembayaran nyata via Midtrans Snap.
 *
 * Alur: auth -> validasi plan -> insert billing_orders (pending, provider='midtrans')
 * -> buat transaksi Snap -> return { token, redirectUrl } untuk Snap.js / redirect.
 *
 * Uang TIDAK bergerak di sini; pembayaran terjadi saat pelanggan
 * menyelesaikan di halaman Midtrans Snap.
 *
 * ENV: MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION.
 */
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getPlan, isCheckoutablePlan } from '@/lib/billing/plans';
import { csrfProtected } from '@/lib/security/csrf';
import { getMidtransConfig, createSnapTransaction } from '@/lib/billing/midtrans';

export const dynamic = 'force-dynamic';

const CheckoutSchema = z.object({
  planId: z.string().min(1, 'planId wajib diisi'),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan billing belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function ok(data: unknown, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}
function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

async function postHandler(request: NextRequest) {
  // 1. Auth wajib.
  let userId: string;
  let userEmail: string | undefined;
  let userName: string | undefined;
  try {
    const supabase = await getServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return bad('Sesi login diperlukan.', 401);
    userId = user.id;
    userEmail = user.email ?? undefined;
    userName = (user.user_metadata?.full_name as string | undefined) ?? undefined;
  } catch {
    return bad('Sesi login diperlukan.', 401);
  }

  // 1b. Rate limit: 10x checkout per menit per pengguna.
  const rl = checkRateLimit(`billing-midtrans-checkout:${userId}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Terlalu banyak percobaan. Coba lagi sebentar.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  // 2. Validasi input.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('Body JSON tidak valid.');
  }
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) return bad(parsed.error.issues[0]?.message ?? 'Input tidak valid.', 422);
  const { planId } = parsed.data;
  if (!isCheckoutablePlan(planId)) {
    return bad(`Paket "${planId}" tidak tersedia untuk checkout.`, 422);
  }

  // 3. Harga dari tabel billing_plans, fallback ke definisi statis.
  let admin;
  try {
    admin = serviceClient();
  } catch {
    return bad('Layanan billing belum dikonfigurasi.', 503);
  }
  const { data: planRow } = await admin
    .from('billing_plans')
    .select('id, name, price_monthly, is_active')
    .eq('id', planId)
    .maybeSingle();
  const plan = getPlan(planId);
  if ((!planRow || !planRow.is_active) && !plan) {
    return bad('Paket tidak ditemukan.', 404);
  }
  const amount = (planRow?.price_monthly as number | undefined) ?? plan?.priceMonthly ?? 0;
  if (amount <= 0) return bad('Paket ini tidak memerlukan pembayaran.', 422);
  const planName = (planRow?.name as string | undefined) ?? plan?.name ?? planId;

  // 4. Konfigurasi Midtrans.
  let cfg;
  try {
    cfg = getMidtransConfig();
  } catch {
    return bad('Layanan pembayaran belum dikonfigurasi.', 503);
  }

  // 5. Buat order: pending, provider='midtrans'.
  const idempotencyKey = randomUUID();
  const { data: order, error: orderError } = await admin
    .from('billing_orders')
    .insert({
      user_id: userId,
      plan_id: planId,
      amount,
      currency: process.env.SUKI_BILLING_CURRENCY || 'IDR',
      status: 'pending',
      provider: 'midtrans',
      idempotency_key: idempotencyKey,
    })
    .select('id, plan_id, amount, currency, status')
    .single();
  if (orderError || !order) {
    return bad('Gagal membuat order. Coba lagi.', 500);
  }

  // 6. Buat transaksi Snap. order_id = UUID order (unik, <= 50 char).
  try {
    const snap = await createSnapTransaction(cfg, {
      orderId: order.id as string,
      amount: order.amount as number,
      planName: `SUKI ${planName}`,
      customerEmail: userEmail,
      customerName: userName,
    });
    return ok(
      {
        order: {
          id: order.id,
          planId: order.plan_id,
          amount: order.amount,
          currency: order.currency,
          status: order.status,
        },
        snapToken: snap.token,
        redirectUrl: snap.redirectUrl,
        clientKey: cfg.clientKey,
        isProduction: cfg.isProduction,
      },
      201,
    );
  } catch (e) {
    // Tandai order gagal agar tidak menggantung.
    await admin.from('billing_orders').update({ status: 'failed' }).eq('id', order.id);
    return bad(e instanceof Error ? e.message : 'Gagal membuat sesi pembayaran.', 502);
  }
}

export const POST = csrfProtected(postHandler);
