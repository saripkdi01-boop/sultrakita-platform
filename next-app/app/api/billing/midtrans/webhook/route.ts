/**
 * POST /api/billing/midtrans/webhook — Notifikasi pembayaran Midtrans.
 *
 * Daftarkan URL ini di dashboard Midtrans:
 *   Settings -> Configuration -> Payment Notification URL
 *   https://sukiapps.web.id/api/billing/midtrans/webhook
 *
 * Keamanan (fail-CLOSED):
 *  - signature_key HARUS valid (SHA512(order_id + status_code + gross_amount + server_key)).
 *  - Notifikasi tanpa signature valid -> 401, tidak ada perubahan DB.
 *  - Idempotency via webhook_events.event_id = order_id + transaction_status.
 *  - Selalu jawab 200 untuk notifikasi valid agar Midtrans tidak retry.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getPlan } from '@/lib/billing/plans';
import { grantEntitlement } from '@/lib/billing/entitlements';
import {
  getMidtransConfig,
  verifyNotificationSignature,
  mapTransactionStatus,
  type MidtransNotification,
} from '@/lib/billing/midtrans';

export const dynamic = 'force-dynamic';

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan billing belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: NextRequest) {
  let cfg;
  try {
    cfg = getMidtransConfig();
  } catch {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let n: MidtransNotification;
  try {
    n = (await request.json()) as MidtransNotification;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  // 1. Verifikasi signature — fail closed.
  if (!verifyNotificationSignature(cfg, n)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  const outcome = mapTransactionStatus(n);
  const eventId = `midtrans:${n.order_id}:${n.transaction_status}:${n.transaction_id ?? 'na'}`;

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  // 2. Idempotency: catat event dulu; duplikat -> akui tanpa aksi.
  const { error: insertError } = await admin.from('webhook_events').insert({
    provider: 'midtrans',
    event_id: eventId,
    payload: n as unknown as Record<string, unknown>,
    status: 'received',
  });
  if (insertError && insertError.code === '23505') {
    return NextResponse.json({ ok: true, received: true, duplicate: true });
  }
  if (insertError) {
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  // 3. Ambil order.
  const { data: order } = await admin
    .from('billing_orders')
    .select('id, user_id, plan_id, amount, status, provider')
    .eq('id', n.order_id)
    .maybeSingle();
  if (!order || order.provider !== 'midtrans') {
    await admin.from('webhook_events').update({ status: 'rejected' }).eq('event_id', eventId);
    // Tetap 200 agar Midtrans tidak retry untuk order yang memang bukan milik kita.
    return NextResponse.json({ ok: true, received: true, ignored: 'order_not_found' });
  }

  // 4. Order sudah final -> tidak ada aksi.
  if (order.status === 'paid' || order.status === 'failed' || order.status === 'cancelled') {
    await admin.from('webhook_events').update({ status: 'duplicate' }).eq('event_id', eventId);
    return NextResponse.json({ ok: true, received: true, ignored: 'already_final' });
  }

  // 5. Terapkan outcome.
  if (outcome === 'paid') {
    const { error: updError } = await admin
      .from('billing_orders')
      .update({
        status: 'paid',
        provider_ref: n.transaction_id ?? null,
        paid_at: new Date().toISOString(),
      })
      .eq('id', order.id);
    if (updError) {
      return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
    }
    // Beri entitlement sesuai plan.
    const plan = getPlan(order.plan_id as 'basic' | 'pro' | 'free' | 'enterprise');
    if (plan) {
      try {
        await grantEntitlement(admin, order.user_id as string, plan.id, plan.limits);
      } catch {
        // Entitlement gagal: order tetap paid; admin dapat grant manual.
        // (Jangan 500 agar Midtrans tidak retry — catat sebagai processed.)
      }
    }
  } else if (outcome === 'failed') {
    await admin
      .from('billing_orders')
      .update({ status: 'failed', provider_ref: n.transaction_id ?? null })
      .eq('id', order.id);
  }
  // outcome 'pending' -> biarkan order tetap pending, tunggu notifikasi berikut.

  await admin
    .from('webhook_events')
    .update({ status: 'processed', processed_at: new Date().toISOString() })
    .eq('event_id', eventId);

  return NextResponse.json({ ok: true, received: true });
}
