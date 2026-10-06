/**
 * POST /api/billing/midtrans/qris — Buat QRIS charge untuk bot Telegram.
 *
 * Auth: header `x-bot-secret` harus sama dengan SUKI_BOT_API_SECRET (server-to-server).
 * Alur: validasi secret -> validasi input -> insert billing_orders (pending,
 * provider='midtrans', payment_method='qris') -> charge Core API QRIS
 * -> return { orderId, qrUrl, qrString, expiryTime }.
 *
 * Notifikasi pembayaran masuk via webhook /api/billing/midtrans/webhook
 * yang sudah ada (fail-closed signature, idempotent).
 *
 * ENV: MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION,
 *      SUKI_BOT_API_SECRET, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { checkRateLimit } from '@/lib/security/rate-limit';
import { getMidtransConfig, createQrisCharge } from '@/lib/billing/midtrans';

export const dynamic = 'force-dynamic';

const QrisSchema = z.object({
  amount: z.number().int().min(1000, 'Minimal Rp1.000').max(10_000_000, 'Maksimal Rp10.000.000'),
  productName: z.string().min(1).max(50),
  telegramUserId: z.string().min(1).max(32),
  telegramUsername: z.string().max(64).optional(),
  idempotencyKey: z.string().max(64).optional(),
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

export async function POST(request: NextRequest) {
  // 1. Auth bot-to-server.
  const secret = process.env.SUKI_BOT_API_SECRET;
  if (!secret) return bad('Layanan pembayaran bot belum dikonfigurasi.', 503);
  const provided = request.headers.get('x-bot-secret');
  if (!provided || provided !== secret) {
    return bad('Akses ditolak.', 401);
  }

  // 2. Rate limit per Telegram user (diambil setelah parse, fallback global).
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return bad('Body JSON tidak valid.');
  }
  const parsed = QrisSchema.safeParse(body);
  if (!parsed.success) return bad(parsed.error.issues[0]?.message ?? 'Input tidak valid.', 422);
  const { amount, productName, telegramUserId, telegramUsername, idempotencyKey } = parsed.data;

  const rl = checkRateLimit(`billing-qris:${telegramUserId}`, { limit: 5, windowMs: 60_000 });
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Terlalu banyak percobaan. Coba lagi sebentar.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.resetMs / 1000)) } },
    );
  }

  // 3. Idempotency: jika key sudah ada, kembalikan order yang sama.
  let admin;
  try {
    admin = serviceClient();
  } catch {
    return bad('Layanan billing belum dikonfigurasi.', 503);
  }
  const key = idempotencyKey || randomUUID();
  if (idempotencyKey) {
    const { data: existing } = await admin
      .from('billing_orders')
      .select('id, amount, status, provider_ref')
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();
    if (existing) {
      return ok({
        orderId: existing.id,
        amount: existing.amount,
        status: existing.status,
        reused: true,
      });
    }
  }

  // 4. Konfigurasi Midtrans.
  let cfg;
  try {
    cfg = getMidtransConfig();
  } catch {
    return bad('Layanan pembayaran belum dikonfigurasi.', 503);
  }

  // 5. Buat order pending. (plan_id null: produk Telegram tidak terikat billing_plans;
  // nama produk disimpan di item Midtrans & dapat ditambah kolom product_name nanti.)
  const { data: order, error: orderError } = await admin
    .from('billing_orders')
    .insert({
      amount: Math.round(amount),
      currency: process.env.SUKI_BILLING_CURRENCY || 'IDR',
      status: 'pending',
      provider: 'midtrans',
      payment_method: 'qris',
      idempotency_key: key,
      customer_ref: telegramUsername ? `tg:${telegramUsername}` : `tg:${telegramUserId}`,
    })
    .select('id, amount, currency, status')
    .single();
  if (orderError || !order) {
    return bad('Gagal membuat order. Coba lagi.', 500);
  }

  // 6. Charge QRIS ke Midtrans.
  try {
    const qris = await createQrisCharge(cfg, {
      orderId: order.id as string,
      amount: order.amount as number,
      productName,
    });
    // Simpan referensi transaksi Midtrans.
    await admin
      .from('billing_orders')
      .update({ provider_ref: qris.transactionId })
      .eq('id', order.id);
    return ok(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        qrUrl: qris.qrUrl,
        qrString: qris.qrString,
        expiryTime: qris.expiryTime,
      },
      201,
    );
  } catch (e) {
    await admin.from('billing_orders').update({ status: 'failed' }).eq('id', order.id);
    return bad(e instanceof Error ? e.message : 'Gagal membuat QRIS.', 502);
  }
}
