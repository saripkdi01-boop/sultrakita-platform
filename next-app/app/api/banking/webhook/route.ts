/**
 * POST /api/banking/webhook — Notifikasi status dari bank (KPR / e-KYC).
 *
 * Daftarkan URL ini ke bank saat integrasi nyata:
 *   https://sukiapps.web.id/api/banking/webhook
 *
 * Keamanan (fail-CLOSED, mengikuti pola webhook Midtrans):
 *  - Header `x-banking-signature: sha256=<hex>` HARUS valid:
 *    HMAC-SHA256(raw body, BANKING_WEBHOOK_SECRET) dengan timingSafeEqual.
 *  - Tanpa secret terkonfigurasi -> 503 (tidak menerima apa pun).
 *  - Signature tidak valid -> 401, tidak ada perubahan DB.
 *  - Idempotency via webhook_events.event_id (duplikat -> akui tanpa aksi).
 *  - Selalu jawab 200 untuk notifikasi valid agar bank tidak retry.
 *
 * CATATAN: saat ini tidak ada bank nyata yang terhubung. Endpoint ini siap
 * menerima notifikasi setelah kredensial + format payload bank disepakati.
 */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyBankingSignature, type BankingWebhookPayload } from '@/lib/banking/webhook';

export const dynamic = 'force-dynamic';

function webhookSecret(): string | null {
  return process.env.BANKING_WEBHOOK_SECRET || null;
}

function serviceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Layanan banking belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: NextRequest) {
  const secret = webhookSecret();
  if (!secret) {
    // Tanpa secret: tolak semua — jangan pernah terima webhook tanpa verifikasi.
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get('x-banking-signature');

  // 1. Verifikasi signature — fail closed.
  if (!verifyBankingSignature(rawBody, signature, secret)) {
    return NextResponse.json({ ok: false, error: 'invalid_signature' }, { status: 401 });
  }

  let payload: BankingWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as BankingWebhookPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }
  if (!payload.event_id || !payload.event_type) {
    return NextResponse.json({ ok: false, error: 'bad_payload' }, { status: 400 });
  }

  let admin;
  try {
    admin = serviceClient();
  } catch {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const eventId = `banking:${payload.event_id}`;

  // 2. Idempotency: catat event dulu; duplikat -> akui tanpa aksi.
  const { error: insertError } = await admin.from('webhook_events').insert({
    provider: 'banking',
    event_id: eventId,
    payload: payload as unknown as Record<string, unknown>,
    status: 'received',
  });
  if (insertError && insertError.code === '23505') {
    return NextResponse.json({ ok: true, received: true, duplicate: true });
  }
  if (insertError) {
    return NextResponse.json({ ok: false, error: 'db_error' }, { status: 500 });
  }

  // 3. Terapkan perubahan status pengajuan KPR (bila tabel migrasi sudah ada).
  if (payload.event_type === 'kpr.status_changed' && payload.application_id && payload.status) {
    const allowed = ['submitted', 'verifying', 'approved', 'rejected', 'disbursed', 'cancelled'];
    if (allowed.includes(payload.status)) {
      // Update best-effort: tabel banking_kpr_applications baru ada setelah
      // migrasi 20261009140000 dijalankan. Gagal -> tandai, tetap jawab 200.
      const { error: updError } = await admin
        .from('banking_kpr_applications')
        .update({ status: payload.status, updated_at: new Date().toISOString() })
        .eq('id', payload.application_id);
      await admin
        .from('webhook_events')
        .update({ status: updError ? 'rejected' : 'processed', processed_at: new Date().toISOString() })
        .eq('event_id', eventId);
      return NextResponse.json({ ok: true, received: true });
    }
  }

  await admin
    .from('webhook_events')
    .update({ status: 'processed', processed_at: new Date().toISOString() })
    .eq('event_id', eventId);
  return NextResponse.json({ ok: true, received: true });
}
