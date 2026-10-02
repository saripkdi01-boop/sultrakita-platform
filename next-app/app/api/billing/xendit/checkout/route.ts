/**
 * BILLING-LIVE SCAFFOLD — POST /api/billing/xendit/checkout
 *
 * Membuat order langganan + invoice Xendit (TEST MODE).
 *
 * Alur: auth -> validasi plan -> resolve provider (wajib 'xendit',
 *   selain itu 503 not_configured jujur) -> insert billing_orders
 *   (pending, provider='xendit') -> POST Xendit Invoice API ->
 *   simpan provider_ref = xendit invoice id -> return invoice_url
 *   untuk redirect user ke halaman pembayaran hosted Xendit.
 *
 * KEAMANAN: zod + rate limit 10/menit/pengguna + CSRF double-submit
 * (pola sama dengan /api/billing/checkout). Guard kunci LIVE:
 * kunci `xnd_production_*` ditolak kecuali SUKI_BILLING_ALLOW_LIVE='true'.
 *
 * PRASYARAT DB: migrasi 20261003000000_billing_live_scaffold.sql
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
import { createXenditInvoice, assertKeyAllowed, isLiveKey } from '@/lib/billing/xendit';

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
  // 1. Provider wajib 'xendit' dan terkonfigurasi — selain itu 503 jujur.
  const resolution = resolveBillingProvider();
  if (resolution.provider !== 'xendit' || !resolution.configured) {
    return bad(
      'Pembayaran nyata belum dikonfigurasi (not_configured). Hubungi admin SukiApps.',
      503,
    );
  }
  try {
    assertKeyAllowed();
  } catch (e) {
    return bad(e instanceof Error ? e.message : 'Konfigurasi Xendit tidak valid.', 503);
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
  const rl = checkRateLimit(`billing-xendit-checkout:${userId}`, { limit: 10, windowMs: 60_000 });
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

  // 5. Harga dari billing_plans (sumber kebenaran), fallback definisi statis.
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
    return bad('Nominal paket tidak valid untuk pembayaran nyata.', 422);
  }
  const planName = (planRow?.name as string | undefined) ?? getPlan(planId)?.name ?? planId;

  // 6. Buat order: pending, provider='xendit'. INSERT hanya via service role.
  const idempotencyKey = randomUUID();
  const { data: order, error: orderError } = await admin
    .from('billing_orders')
    .insert({
      user_id: userId,
      plan_id: planId,
      amount,
      currency: process.env.SUKI_BILLING_CURRENCY || 'IDR',
      status: 'pending',
      provider: 'xendit',
      idempotency_key: idempotencyKey,
    })
    .select('id, plan_id, amount, currency, status')
    .single();
  if (orderError || !order) {
    return bad('Gagal membuat order. Coba lagi.', 500);
  }
  const orderId = order.id as string;
  const externalId = `suki_${orderId}`;
  const origin = new URL(request.url).origin;

  // 7. Buat invoice Xendit. Gagal -> tandai order cancelled, 502 jujur.
  let invoice;
  try {
    invoice = await createXenditInvoice({
      externalId,
      amount,
      description: `SUKI Apps — Paket ${planName} (1 bulan)`,
      payerEmail: userEmail,
      successRedirectUrl: `${origin}/billing/sukses?order=${orderId}`,
      failureRedirectUrl: `${origin}/billing/gagal?order=${orderId}`,
    });
  } catch (e) {
    await admin.from('billing_orders').update({ status: 'cancelled' }).eq('id', orderId);
    return bad(
      `Gagal membuat invoice pembayaran: ${e instanceof Error ? e.message : 'unknown'}`,
      502,
    );
  }

  // 8. Simpan referensi invoice Xendit (dipakai lookup saat webhook).
  await admin
    .from('billing_orders')
    .update({ provider_ref: invoice.xenditId, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  return ok(
    {
      provider: 'xendit',
      testMode: !isLiveKey(process.env.XENDIT_API_KEY ?? ''),
      order: {
        id: orderId,
        planId: order.plan_id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
      },
      invoiceUrl: invoice.invoiceUrl,
      expiryDate: invoice.expiryDate,
      notice: 'Anda akan diarahkan ke halaman pembayaran aman Xendit (QRIS/VA/e-wallet).',
    },
    201,
  );
}

// CSRF double-submit: checkout memicu tagihan nyata, wajib token valid.
export const POST = csrfProtected(postHandler);
