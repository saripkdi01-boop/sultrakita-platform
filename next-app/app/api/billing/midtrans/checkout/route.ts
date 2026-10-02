/**
 * BILLING MIDTRANS — POST /api/billing/midtrans/checkout
 *
 * Membuat order langganan + transaksi Snap Midtrans.
 *
 * Alur: auth -> validasi plan -> resolve provider (wajib 'midtrans',
 *   selain itu 503 not_configured jujur) -> insert billing_orders
 *   (pending, provider='midtrans') -> POST Snap API -> simpan
 *   provider_ref = order_id Midtrans -> return redirect_url + snap token
 *   untuk redirect user ke halaman pembayaran Midtrans.
 *
 * KEAMANAN: zod + rate limit 10/menit/pengguna + CSRF double-submit
 * (pola sama dengan /api/billing/checkout). Guard kunci PRODUCTION:
 * kunci `Mid-server-*` (bukan SB-) ditolak kecuali
 * SUKI_BILLING_ALLOW_LIVE='true'.
 *
 * PRASYARAT DB: migrasi 20261003000001_billing_midtrans_status.sql
 * (status 'paid'/'failed'/'expired') — FILE SAJA, belum di-apply.
 */
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { csrfProtected } from '@/lib/security/csrf';
import { getPlan, isCheckoutablePlan } from '@/lib/billing/plans';
import { resolveBillingProvider } from '@/lib/billing/provider';
import {
  createSnapTransaction,
  assertKeyAllowed,
  isProductionKey,
  isProductionMode,
} from '@/lib/billing/midtrans';

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
  // 1. Provider wajib 'midtrans' dan terkonfigurasi — selain itu 503 jujur.
  const resolution = resolveBillingProvider();
  if (resolution.provider !== 'midtrans' || !resolution.configured) {
    return bad(
      'Pembayaran Midtrans belum dikonfigurasi (not_configured). Hubungi admin SukiApps.',
      503,
    );
  }
  try {
    assertKeyAllowed();
  } catch (e) {
    return bad(e instanceof Error ? e.message : 'Kunci Midtrans tidak diizinkan.', 503);
  }

  // 2. Auth wajib.
  let userId: string;
  let userEmail: string | undefined;
  try {
    const supabase = await getServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return bad('Sesi login diperlukan.', 401);
    userId = user.id;
    userEmail = user.email ?? undefined;
  } catch {
    return bad('Sesi login diperlukan.', 401);
  }

  // 3. Rate limit: 10x checkout per menit per pengguna.
  const rl = checkRateLimit(`billing-midtrans-checkout:${userId}`, { limit: 10, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Terlalu banyak percobaan. Coba lagi sebentar.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  // 4. Validasi input.
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

  // 5. Ambil harga dari tabel billing_plans (sumber kebenaran), fallback ke definisi statis.
  let admin;
  try {
    admin = serviceClient();
  } catch {
    return bad('Layanan billing belum dikonfigurasi.', 503);
  }
  const { data: planRow, error: planError } = await admin
    .from('billing_plans')
    .select('id, name, price_monthly, is_active')
    .eq('id', planId)
    .maybeSingle();
  if (planError || !planRow || !planRow.is_active) {
    const fallback = getPlan(planId);
    if (!fallback) return bad('Paket tidak ditemukan.', 404);
  }
  const amount = (planRow?.price_monthly as number | undefined) ?? getPlan(planId)?.priceMonthly ?? 0;
  if (!Number.isInteger(amount) || amount <= 0) {
    return bad('Nominal paket tidak valid.', 500);
  }
  const planName = (planRow?.name as string | undefined) ?? getPlan(planId)?.name ?? planId;

  // 6. Buat order: pending, provider='midtrans'. INSERT hanya via service role.
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
  const orderId = order.id as string;
  // order_id Midtrans: alfanumerik/dash/underscore, maks 50 char.
  const midtransOrderId = `suki_${orderId}`;

  // 7. Buat transaksi Snap. Gagal -> tandai order cancelled, 502 jujur.
  //    Nilai key TIDAK PERNAH di-log — error dari API dipotong 200 char tanpa key.
  let snap;
  try {
    snap = await createSnapTransaction({
      orderId: midtransOrderId,
      grossAmount: amount,
      customerEmail: userEmail,
      customerFirstName: userEmail ? userEmail.split('@')[0] : 'Pelanggan SUKI',
      items: [
        {
          id: planId,
          price: amount,
          quantity: 1,
          name: `SUKI Apps — Paket ${planName} (1 bulan)`,
        },
      ],
    });
  } catch (e) {
    await admin.from('billing_orders').update({ status: 'cancelled' }).eq('id', orderId);
    return bad(
      `Gagal membuat transaksi pembayaran: ${e instanceof Error ? e.message : 'unknown'}`,
      502,
    );
  }

  // 8. Simpan referensi order Midtrans (dipakai lookup saat webhook).
  await admin
    .from('billing_orders')
    .update({ provider_ref: midtransOrderId, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? '';
  return ok(
    {
      provider: 'midtrans',
      testMode: !isProductionMode() || !isProductionKey(serverKey),
      order: {
        id: orderId,
        planId: order.plan_id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
      redirectUrl: snap.redirectUrl,
      snapToken: snap.token,
      notice: 'Anda akan diarahkan ke halaman pembayaran aman Midtrans (QRIS/VA/e-wallet/kartu).',
    },
    201,
  );
}

// CSRF double-submit: checkout memicu tagihan nyata, wajib token valid.
export const POST = csrfProtected(postHandler);
