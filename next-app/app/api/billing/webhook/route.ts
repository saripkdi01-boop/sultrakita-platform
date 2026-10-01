/**
 * SLICE-C — POST /api/billing/webhook (SANDBOX)
 *
 * Menerima callback hasil pembayaran sandbox. IDEMPOTENT via
 * webhook_events.event_id. Selalu menjawab 200 { received: true }
 * agar pengirim tidak retry membabi-buta.
 *
 * Verifikasi:
 *  - Bila env SUKI_BILLING_WEBHOOK_SECRET diset: wajib header
 *    `x-signature` = HMAC-SHA256 hex dari raw body. Gagal -> 401.
 *  - Bila TIDAK diset: terima mode sandbox HANYA dengan header
 *    `x-sandbox: true`, dan payload ditandai sandbox:true.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getPlan } from '@/lib/billing/plans';
import { grantEntitlement } from '@/lib/billing/entitlements';
import { processWebhookEvent, type SandboxWebhookPayload } from '@/lib/billing/webhook-logic';

export const dynamic = 'force-dynamic';

const WebhookSchema = z.object({
  eventId: z.string().min(1, 'eventId wajib diisi'),
  orderId: z.string().uuid('orderId harus UUID'),
  outcome: z.enum(['paid', 'failed']),
  providerRef: z.string().min(1, 'providerRef wajib diisi'),
  sandbox: z.boolean(),
});

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan billing belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.SUKI_BILLING_WEBHOOK_SECRET;
  if (!secret) return false; // mode tanpa secret -> ditangani jalur sandbox
  if (!signature) return false;
  const expected = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  // --- Verifikasi ---
  const secretSet = Boolean(process.env.SUKI_BILLING_WEBHOOK_SECRET);
  if (secretSet) {
    const signature = request.headers.get('x-signature');
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ ok: false, error: 'Signature tidak valid.' }, { status: 401 });
    }
  } else {
    // Mode sandbox tanpa secret: hanya terima bila header x-sandbox: true.
    if (request.headers.get('x-sandbox') !== 'true') {
      return NextResponse.json(
        { ok: false, error: 'Webhook secret belum dikonfigurasi; mode sandbox memerlukan header x-sandbox: true.' },
        { status: 401 },
      );
    }
  }

  // --- Validasi payload ---
  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ received: true, ok: false, error: 'Body JSON tidak valid.' }, { status: 200 });
  }
  const parsed = WebhookSchema.safeParse(parsedBody);
  if (!parsed.success) {
    return NextResponse.json(
      { received: true, ok: false, error: parsed.error.issues[0]?.message ?? 'Payload tidak valid.' },
      { status: 200 },
    );
  }
  const payload: SandboxWebhookPayload = parsed.data;

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ received: true, ok: false, error: 'Layanan billing belum dikonfigurasi.' }, { status: 200 });
  }

  // --- Idempotency: cek webhook_events.event_id dulu ---
  const { data: existing } = await admin
    .from('webhook_events')
    .select('id, status')
    .eq('event_id', payload.eventId)
    .maybeSingle();

  if (existing) {
    await admin
      .from('webhook_events')
      .update({ status: 'duplicate', processed_at: new Date().toISOString() })
      .eq('id', (existing as { id: string }).id);
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  // --- Ambil order ---
  const { data: order } = await admin
    .from('billing_orders')
    .select('id, user_id, plan_id, status')
    .eq('id', payload.orderId)
    .maybeSingle();

  if (!order) {
    await admin.from('webhook_events').insert({
      provider: 'sandbox',
      event_id: payload.eventId,
      payload,
      status: 'rejected',
      processed_at: new Date().toISOString(),
    });
    return NextResponse.json({ received: true, ok: false, error: 'Order tidak ditemukan.' }, { status: 200 });
  }

  const decision = processWebhookEvent(payload, {
    alreadySeen: false,
    orderStatus: (order as { status: 'draft' | 'pending' | 'sandbox_paid' | 'sandbox_failed' | 'cancelled' }).status,
    planId: (order as { plan_id: string }).plan_id,
  });

  let eventStatus: 'processed' | 'duplicate' | 'rejected' = 'processed';

  if (decision.action === 'grant_entitlements') {
    const plan = getPlan(decision.planId);
    if (!plan) {
      eventStatus = 'rejected';
    } else {
      await grantEntitlement(admin, (order as { user_id: string }).user_id, decision.planId as 'basic' | 'pro', plan.limits);
      await admin
        .from('billing_orders')
        .update({ status: decision.newStatus, provider_ref: payload.providerRef, updated_at: new Date().toISOString() })
        .eq('id', payload.orderId);
    }
  } else if (decision.action === 'mark_failed') {
    await admin
      .from('billing_orders')
      .update({ status: decision.newStatus, provider_ref: payload.providerRef, updated_at: new Date().toISOString() })
      .eq('id', payload.orderId);
  } else {
    eventStatus = 'rejected';
  }

  await admin.from('webhook_events').insert({
    provider: 'sandbox',
    event_id: payload.eventId,
    payload: { ...payload, decision: decision.action },
    status: eventStatus,
    processed_at: new Date().toISOString(),
  });

  return NextResponse.json({ received: true }, { status: 200 });
}
