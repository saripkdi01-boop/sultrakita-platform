/**
 * BILLING MIDTRANS — POST /api/billing/midtrans/webhook
 *
 * Menerima HTTP(S) POST Notification dari Midtrans. IDEMPOTENT via
 * webhook_events.event_id = `midtrans:<order_id>:<transaction_status>`.
 *
 * =====================================================================
 * VERIFIKASI (fail-CLOSED):
 *  1. signature_key WAJIB cocok: SHA512(order_id + status_code +
 *     gross_amount + serverKey), perbandingan timing-safe.
 *     Server key kosong -> TOLAK SEMUA (401). Tidak ada jalur sandbox
 *     di sini — notifikasi tanpa signature valid selalu ditolak.
 *  2. Status yang mengarah ke grant (capture/settlement) WAJIB
 *     dikonfirmasi ulang ke Status API Midtrans
 *     (GET /v2/{order_id}/status) + gross_amount >= order.amount
 *     sebelum entitlement diberikan. Ini anti-spoofing lapis kedua.
 *  3. Order pada status final diabaikan (tidak ada double-grant).
 * Setelah verifikasi lolos, selalu jawab 200 { received: true } agar
 * Midtrans tidak retry membabi-buta.
 * =====================================================================
 *
 * Daftarkan URL ini di dashboard Midtrans (Settings -> Configuration ->
 * Payment Notification URL):
 *   https://sukiapps.web.id/api/billing/midtrans/webhook
 *
 * PRASYARAT DB: migrasi 20261003000001_billing_midtrans_status.sql
 * (status 'paid'/'failed'/'expired') — FILE SAJA, belum di-apply.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getPlan } from '@/lib/billing/plans';
import { grantEntitlement } from '@/lib/billing/entitlements';
import {
  verifyNotificationSignature,
  getTransactionStatus,
  assertKeyAllowed,
} from '@/lib/billing/midtrans';

export const dynamic = 'force-dynamic';

// Payload notifikasi Midtrans (field relevan saja). gross_amount &
// status_code DIPERTAHANKAN sebagai string persis seperti diterima
// karena dipakai dalam perhitungan signature_key.
const MidtransNotificationSchema = z.object({
  order_id: z.string().min(1, 'order_id wajib diisi'),
  status_code: z.string().min(1, 'status_code wajib diisi'),
  gross_amount: z.string().min(1, 'gross_amount wajib diisi'),
  signature_key: z.string().min(1, 'signature_key wajib diisi'),
  transaction_status: z.string().min(1, 'transaction_status wajib diisi'),
  transaction_id: z.string().min(1).optional(),
  payment_type: z.string().min(1).optional(),
  fraud_status: z.string().min(1).optional(),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan billing belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

/** Status order yang sudah final — tidak boleh berubah lagi. */
const TERMINAL_ORDER_STATUSES = new Set([
  'paid',
  'failed',
  'cancelled',
  'expired',
  'sandbox_paid',
  'sandbox_failed',
]);

/** transaction_status Midtrans yang berarti pembayaran BERHASIL. */
function isSuccessfulStatus(status: string, fraudStatus?: string): boolean {
  if (status === 'settlement') return true;
  // Kartu kredit: capture hanya sah bila fraud_status = accept.
  if (status === 'capture') return fraudStatus === 'accept';
  return false;
}

/** transaction_status Midtrans yang berarti pembayaran GAGAL final. */
function isFailedStatus(status: string): boolean {
  return status === 'deny' || status === 'cancel' || status === 'expire' || status === 'failure';
}

export async function POST(request: NextRequest) {
  // --- 1. Verifikasi signature (fail-closed) ---
  let rawBody: unknown;
  try {
    rawBody = JSON.parse(await request.text());
  } catch {
    // Body bukan JSON valid -> tidak mungkin notifikasi Midtrans asli.
    return NextResponse.json({ ok: false, error: 'Body JSON tidak valid.' }, { status: 401 });
  }
  const parsed = MidtransNotificationSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Payload tidak valid.' },
      { status: 401 },
    );
  }
  const payload = parsed.data;

  // Nilai key TIDAK PERNAH di-log. Verifikasi di bawah me-return false
  // bila server key kosong -> 401 untuk SEMUA notifikasi (fail-closed).
  const signatureOk = verifyNotificationSignature({
    orderId: payload.order_id,
    statusCode: payload.status_code,
    grossAmount: payload.gross_amount,
    signatureKey: payload.signature_key,
  });
  if (!signatureOk) {
    return NextResponse.json({ ok: false, error: 'Signature tidak valid.' }, { status: 401 });
  }

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ received: true, ok: false, error: 'Layanan billing belum dikonfigurasi.' }, { status: 200 });
  }

  // --- 2. Idempotency: event_id unik per (order_id, transaction_status) ---
  const eventId = `midtrans:${payload.order_id}:${payload.transaction_status}`;
  const { data: existing } = await admin
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  const logEvent = async (status: 'processed' | 'rejected' | 'duplicate', decision?: string) =>
    admin.from('webhook_events').insert({
      provider: 'midtrans',
      event_id: eventId,
      payload: { ...payload, ...(decision ? { decision } : {}) },
      status,
      processed_at: new Date().toISOString(),
    });

  // --- 3. Cari order via provider_ref (order_id Midtrans) ---
  const { data: order } = await admin
    .from('billing_orders')
    .select('id, user_id, plan_id, amount, status, provider')
    .eq('provider', 'midtrans')
    .eq('provider_ref', payload.order_id)
    .maybeSingle();

  if (!order) {
    await logEvent('rejected', 'order_not_found');
    return NextResponse.json({ received: true, ok: false, error: 'Order tidak ditemukan.' }, { status: 200 });
  }

  const orderStatus = (order as { status: string }).status;
  const userId = (order as { user_id: string }).user_id;
  const planId = (order as { plan_id: string }).plan_id;
  const orderAmount = Number((order as { amount: number }).amount);

  // --- 4. Order terminal -> abaikan (anti double-grant) ---
  if (TERMINAL_ORDER_STATUSES.has(orderStatus)) {
    await logEvent('duplicate', 'order_already_terminal');
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  const notifiedSuccessful = isSuccessfulStatus(payload.transaction_status, payload.fraud_status);

  // --- 5. Konfirmasi ulang ke Status API sebelum grant (anti-spoofing lapis 2) ---
  if (notifiedSuccessful) {
    let confirmed;
    try {
      assertKeyAllowed();
      confirmed = await getTransactionStatus(payload.order_id);
    } catch (e) {
      await logEvent('rejected', 'status_api_failed');
      return NextResponse.json(
        { received: true, ok: false, error: 'Konfirmasi status ke Midtrans gagal; dicatat untuk tinjau manual.' },
        { status: 200 },
      );
    }
    const confirmedSuccessful = isSuccessfulStatus(confirmed.transactionStatus, confirmed.fraudStatus ?? undefined);
    const paidAmount = Number.parseFloat(confirmed.grossAmount);
    if (!confirmedSuccessful) {
      await logEvent('rejected', 'status_not_successful_on_recheck');
      return NextResponse.json({ received: true, ok: false, error: 'Status tidak sukses saat dikonfirmasi.' }, { status: 200 });
    }
    if (!Number.isFinite(paidAmount) || paidAmount < orderAmount) {
      await logEvent('rejected', 'amount_mismatch');
      return NextResponse.json({ received: true, ok: false, error: 'Nominal tidak sesuai order.' }, { status: 200 });
    }

    // --- 6. GRANT: hanya di titik ini entitlement diberikan ---
    const plan = getPlan(planId);
    if (!plan) {
      await logEvent('rejected', 'plan_not_found');
      return NextResponse.json({ received: true, ok: false, error: 'Paket tidak ditemukan.' }, { status: 200 });
    }
    await grantEntitlement(admin, userId, planId as 'basic' | 'pro', plan.limits);
    await admin
      .from('billing_orders')
      .update({
        status: 'paid',
        provider_ref: payload.order_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (order as { id: string }).id);
    await logEvent('processed', `granted:${confirmed.paymentType ?? 'unknown'}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // --- 7. Status gagal final Midtrans -> tandai order failed ---
  if (isFailedStatus(payload.transaction_status)) {
    await admin
      .from('billing_orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', (order as { id: string }).id);
    await logEvent('processed', `marked_failed:${payload.transaction_status}`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // --- 8. Status lain (pending, challenge, refund, ...) -> catat, tanpa aksi ---
  await logEvent('processed', `ignored:${payload.transaction_status}`);
  return NextResponse.json({ received: true }, { status: 200 });
}
