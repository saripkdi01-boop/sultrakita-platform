/**
 * CONTOH REFERENSI — pola baku route mutasi SukiApps (dokumentasi, bukan API produksi).
 *
 * Pola yang ditegakkan di bawah ini (urutan penting):
 * 1. CSRF — via `csrfProtected(handler)`: cookie `suki_csrf` vs header
 *    `x-csrf-token` (atau field badan `_csrf`). Token diambil klien dari
 *    `GET /api/csrf` (respons JSON `{ csrfToken }`).
 * 2. Rate limit — `checkRateLimit` per IP + header `Retry-After` saat 429.
 * 3. Validasi zod — `parseOr400(schema, body)` → 400 berbahasa Indonesia.
 *
 * Contoh pemanggilan dari klien:
 *   const { csrfToken } = await (await fetch('/api/csrf')).json();
 *   await fetch('/api/security/example', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'x-csrf-token': csrfToken },
 *     body: JSON.stringify({ nama: 'Budi', pesan: 'Halo SukiApps!' }),
 *   });
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { csrfProtected } from '@/lib/security/csrf';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_PRESETS,
  rateLimitHeaders,
  retryAfterSeconds,
} from '@/lib/security/rate-limit';
import { parseOr400 } from '@/lib/security/validation';

const ContohSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(100, 'Nama maksimal 100 karakter'),
  pesan: z.string().min(10, 'Pesan minimal 10 karakter').max(1000, 'Pesan maksimal 1000 karakter'),
});

async function handler(request: NextRequest): Promise<NextResponse> {
  // 1. Rate limit (preset contact/report: 10/menit per IP).
  const rl = checkRateLimit(`security-example:${getClientIp(request)}`, RATE_LIMIT_PRESETS.contact);
  const rlHeaders = rateLimitHeaders(rl, RATE_LIMIT_PRESETS.contact);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.' },
      { status: 429, headers: { ...rlHeaders, 'Retry-After': retryAfterSeconds(rl) } },
    );
  }

  // 2. Validasi input (400 + pesan Indonesia bila gagal).
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  const parsed = parseOr400(ContohSchema, body);
  if (!parsed.ok) return parsed.response;

  // 3. ... logika bisnis di sini ...
  return NextResponse.json(
    { ok: true, message: 'ok', data: { nama: parsed.data.nama } },
    { headers: rlHeaders },
  );
}

/** Dokumentasi pola via GET (bukan untuk pemakaian produksi). */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    pola: [
      '1. CSRF: csrfProtected(handler) — cookie suki_csrf vs header x-csrf-token',
      '2. Rate limit: checkRateLimit(key, preset) + header Retry-After saat 429',
      '3. Validasi: parseOr400(zodSchema, body) — 400 berbahasa Indonesia',
    ],
    csrfTokenUrl: '/api/csrf',
  });
}

// 4. CSRF ditegakkan di sini (403 bila token hilang/tidak cocok).
export const POST = csrfProtected(handler);
