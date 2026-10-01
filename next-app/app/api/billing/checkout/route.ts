/**
 * SLICE-C — POST /api/billing/checkout (SANDBOX)
 *
 * Membuat order langganan dalam mode sandbox. TIDAK ada pembayaran nyata.
 * Alur: auth -> validasi plan -> insert billing_orders (draft -> pending)
 * -> return instruksi simulasi sandbox ke client.
 *
 * NOTE rate-limit: memakai helper terpusat `@/lib/security/rate-limit`
 * (milik SLICE-A) — 10 checkout/menit per pengguna.
 */
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { createSandboxCheckout } from '@/lib/billing/sandbox';
import { getPlan, isCheckoutablePlan } from '@/lib/billing/plans';
import { csrfProtected } from '@/lib/security/csrf';

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
  try {
    const supabase = await getServerSupabase();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return bad('Sesi login diperlukan.', 401);
    userId = user.id;
  } catch {
    return bad('Sesi login diperlukan.', 401);
  }

  // 1b. Rate limit: 10x checkout per menit per pengguna.
  const rl = checkRateLimit(`billing-checkout:${userId}`, { limit: 10, windowMs: 60_000 });
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

  // 3. Ambil harga dari tabel billing_plans (sumber kebenaran), fallback ke definisi statis.
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

  // 4. Buat order: draft -> pending. INSERT hanya via service role
  //    (tidak ada policy INSERT publik — lihat migrasi 20261001140003).
  const idempotencyKey = randomUUID();
  const { data: order, error: orderError } = await admin
    .from('billing_orders')
    .insert({
      user_id: userId,
      plan_id: planId,
      amount,
      currency: process.env.SUKI_BILLING_CURRENCY || 'IDR',
      status: 'pending',
      provider: 'sandbox',
      idempotency_key: idempotencyKey,
    })
    .select('id, plan_id, amount, currency, status')
    .single();
  if (orderError || !order) {
    return bad('Gagal membuat order. Coba lagi.', 500);
  }

  // 5. Instruksi sandbox — jelas BUKAN pembayaran nyata.
  const checkout = createSandboxCheckout({
    orderId: order.id as string,
    planId: order.plan_id as string,
    amount: order.amount as number,
  });

  return ok(
    {
      sandbox: true,
      notice:
        'Mode SANDBOX: ini simulasi. Tidak ada uang nyata yang ditagih atau dibayar.',
      order: {
        id: order.id,
        planId: order.plan_id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
      simulation: {
        token: checkout.token,
        howToComplete:
          'Untuk menyelesaikan simulasi, panggil POST /api/billing/webhook dengan header x-sandbox: true (non-production) dan payload { eventId, orderId, outcome: "paid" | "failed", providerRef, sandbox: true, ts, nonce } — ts = unix epoch detik (±5 menit), nonce unik per pengiriman.',
      },
    },
    201,
  );
}

// CSRF double-submit: checkout mutasi dana (walau sandbox), wajib token valid.
export const POST = csrfProtected(postHandler);
