/**
 * BILLING-LIVE SCAFFOLD — POST /api/billing/xendit/webhook
 *
 * Menerima callback invoice Xendit. IDEMPOTENT via
 * webhook_events.event_id = `xendit:<invoice_id>:<STATUS>`.
 *
 * =====================================================================
 * VERIFIKASI (fail-CLOSED — pelajaran gap kritis #1):
 *  1. Header `x-callback-token` WAJIB cocok timingSafeEqual dengan
 *     XENDIT_CALLBACK_TOKEN. Token env kosong -> TOLAK SEMUA (401).
 *  2. Status PAID/SETTLED WAJIB dikonfirmasi ulang ke API Xendit
 *     (GET /v2/invoices/{id}) + paid_amount >= order.amount sebelum
 *     entitlement diberikan. Ini anti-spoofing lapis kedua.
 *  3. Order pada status final diabaikan (tidak ada double-grant).
 * Setelah verifikasi lolos, selalu jawab 200 { received: true } agar
 * Xendit tidak retry membabi-buta.
 * =====================================================================
 *
 * Daftarkan URL ini di dashboard Xendit (Settings -> Webhooks):
 *   https://sukiapps.web.id/api/billing/xendit/webhook
 *
 * PRASYARAT DB: migrasi 20261003000000_billing_live_scaffold.sql
 * (status 'paid'/'failed'/'expired') — FILE SAJA, belum di-apply.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getPlan } from '@/lib/billing/plans';
import { grantEntitlement } from '@/lib/billing/entitlements';
import { getXenditInvoice, assertKeyAllowed } from '@/lib/billing/xendit';
import {
  verifyXenditCallbackToken,
  decideXenditStatus,
  isTerminalOrderStatus,
  xenditEventId,
} from '@/lib/billing/xendit-webhook';

export const dynamic = 'force-dynamic';

// Payload callback invoice Xendit (field relevan saja).
const XenditCallbackSchema = z.object({
  id: z.string().min(1, 'id invoice wajib diisi'),
  external_id: z.string().min(1, 'external_id wajib diisi'),
  status: z.string().min(1, 'status wajib diisi'),
  paid_amount: z.number().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  paid_at: z.string().nullable().optional(),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan billing belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: NextRequest) {
  // --- 1. Verifikasi callback token (fail-closed) ---
  const token = request.headers.get('x-callback-token');
  if (!verifyXenditCallbackToken(token)) {
    return NextResponse.json({ ok: false, error: 'Callback token tidak valid.' }, { status: 401 });
  }

  // --- 2. Validasi payload ---
  let rawBody: unknown;
  try {
    rawBody = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ received: true, ok: false, error: 'Body JSON tidak valid.' }, { status: 200 });
  }
  const parsed = XenditCallbackSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { received: true, ok: false, error: parsed.error.issues[0]?.message ?? 'Payload tidak valid.' },
      { status: 200 },
    );
  }
  const payload = parsed.data;

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ received: true, ok: false, error: 'Layanan billing belum dikonfigurasi.' }, { status: 200 });
  }

  // --- 3. Idempotency: event_id unik per (invoice, status) ---
  const eventId = xenditEventId(payload.id, payload.status);
  const { data: existing } = await admin
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventId)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  // --- 4. Cari order via provider_ref (xendit invoice id) ---
  const { data: order } = await admin
    .from('billing_orders')
    .select('id, user_id, plan_id, amount, status, provider')
    .eq('provider', 'xendit')
    .eq('provider_ref', payload.id)
    .maybeSingle();

  const logEvent = async (status: 'processed' | 'rejected' | 'duplicate', decision?: string) =>
    admin.from('webhook_events').insert({
      provider: 'xendit',
      event_id: eventId,
      payload: { ...payload, ...(decision ? { decision } : {}) },
      status,
      processed_at: new Date().toISOString(),
    });

  if (!order) {
    await logEvent('rejected', 'order_not_found');
    return NextResponse.json({ received: true, ok: false, error: 'Order tidak ditemukan.' }, { status: 200 });
  }

  const orderStatus = (order as { status: string }).status;
  if (isTerminalOrderStatus(orderStatus)) {
    await logEvent('duplicate', 'order_terminal');
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  // --- 5. Keputusan berdasarkan status ---
  const decision = decideXenditStatus(payload.status);
  if (decision.action === 'ignore') {
    await logEvent('duplicate', 'ignored_status');
    return NextResponse.json({ received: true }, { status: 200 });
  }

  if (decision.action === 'grant') {
    // --- 6. Konfirmasi ulang ke API Xendit SEBELUM grant (anti-spoofing) ---
    let confirmed: { status: string; paid_amount: number | null; amount: number };
    try {
      assertKeyAllowed();
      confirmed = await getXenditInvoice(payload.id);
    } catch (e) {
      await logEvent('rejected', 'reconfirm_failed');
      return NextResponse.json(
        { received: true, ok: false, error: `Konfirmasi status ke Xendit gagal: ${e instanceof Error ? e.message : 'unknown'}` },
        { status: 200 },
      );
    }
    const confirmedPaid = ['PAID', 'SETTLED'].includes(confirmed.status.trim().toUpperCase());
    const amountOk =
      typeof confirmed.paid_amount === 'number' &&
      confirmed.paid_amount >= ((order as { amount: number }).amount ?? 0);
    if (!confirmedPaid || !amountOk) {
      await logEvent('rejected', 'reconfirm_mismatch');
      return NextResponse.json(
        { received: true, ok: false, error: 'Status/nominal tidak cocok dengan data Xendit.' },
        { status: 200 },
      );
    }
    const plan = getPlan((order as { plan_id: string }).plan_id);
    if (!plan) {
      await logEvent('rejected', 'plan_not_found');
      return NextResponse.json({ received: true, ok: false, error: 'Paket tidak ditemukan.' }, { status: 200 });
    }
    await grantEntitlement(
      admin,
      (order as { user_id: string }).user_id,
      (order as { plan_id: 'basic' | 'pro' }).plan_id,
      plan.limits,
    );
    await admin
      .from('billing_orders')
      .update({
        status: decision.newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', (order as { id: string }).id);
    await logEvent('processed', 'grant_entitlements');
    return NextResponse.json({ received: true }, { status: 200 });
  }

  // mark_failed / mark_expired
  await admin
    .from('billing_orders')
    .update({ status: decision.newStatus, updated_at: new Date().toISOString() })
    .eq('id', (order as { id: string }).id);
  await logEvent('processed', decision.action);
  return NextResponse.json({ received: true }, { status: 200 });
}
