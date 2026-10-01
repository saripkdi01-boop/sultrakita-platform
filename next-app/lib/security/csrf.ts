/**
 * Verifikasi CSRF pola double-submit untuk route mutasi (POST/PUT/PATCH/DELETE).
 *
 * Alur:
 * 1. Klien memanggil `GET /api/csrf` → server menerbitkan token acak,
 *    menyimpannya di cookie httpOnly `suki_csrf`, dan mengembalikan token
 *    yang sama di badan JSON (`{ csrfToken }`).
 * 2. Klien menyimpan token dari JSON (cookie httpOnly tidak bisa dibaca JS)
 *    dan mengirimkannya kembali lewat header `x-csrf-token`
 *    (atau field badan `_csrf` untuk form biasa).
 * 3. Server membandingkan nilai cookie vs nilai yang dikirim — cocok berarti
 *    request benar berasal dari halaman kita, bukan situs lain.
 *
 * Pengecualian: webhook memakai verifikasi signature (HMAC), BUKAN CSRF —
 * lihat `isCsrfExemptPath`.
 */

import { NextResponse, type NextRequest } from 'next/server';

export const CSRF_COOKIE_NAME = 'suki_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';
export const CSRF_BODY_FIELD = '_csrf';

/**
 * Path yang dikecualikan dari verifikasi CSRF karena memakai mekanisme
 * autentikasi sendiri (signature webhook). Jangan menambah path ke sini
 * tanpa pengganti yang setara.
 */
const CSRF_EXEMPT_PREFIXES = ['/api/billing/webhook', '/api/webhooks'];

export function isCsrfExemptPath(pathname: string): boolean {
  return CSRF_EXEMPT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/** Perbandingan string waktu-konstan (anti timing attack). */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length || a.length === 0) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/**
 * Verifikasi sinkron: bandingkan cookie `suki_csrf` dengan header
 * `x-csrf-token`. Tidak membaca badan request (aman dipakai kapan pun).
 */
export function verifyCsrfToken(request: NextRequest): boolean {
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken) return false;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  return typeof headerToken === 'string' && constantTimeEqual(cookieToken, headerToken);
}

/**
 * Verifikasi lengkap: header dulu, lalu field badan `_csrf` (JSON atau
 * form-data). Membaca badan lewat `request.clone()` sehingga handler
 * tetap bisa membaca badan aslinya.
 */
export async function verifyCsrfTokenAsync(request: NextRequest): Promise<boolean> {
  if (verifyCsrfToken(request)) return true;
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  if (!cookieToken) return false;
  try {
    const clone = request.clone();
    const contentType = clone.headers.get('content-type') ?? '';
    let submitted: unknown = null;
    if (contentType.includes('application/json')) {
      const body = (await clone.json()) as Record<string, unknown> | null;
      submitted = body?.[CSRF_BODY_FIELD] ?? null;
    } else if (
      contentType.includes('multipart/form-data') ||
      contentType.includes('application/x-www-form-urlencoded')
    ) {
      submitted = (await clone.formData()).get(CSRF_BODY_FIELD);
    } else {
      return false;
    }
    return (
      typeof submitted === 'string' && submitted.length > 0 && constantTimeEqual(cookieToken, submitted)
    );
  } catch {
    return false;
  }
}

type RouteHandler<Context> = (
  request: NextRequest,
  context: Context,
) => Promise<NextResponse> | NextResponse;

/**
 * Bungkus route handler mutasi agar menolak request tanpa token CSRF valid
 * (403 + pesan Indonesia). Webhook yang terdaftar di `isCsrfExemptPath`
 * dilewati otomatis.
 *
 * Contoh: `export const POST = csrfProtected(handler);`
 */
export function csrfProtected<Context>(handler: RouteHandler<Context>) {
  return async (request: NextRequest, context: Context): Promise<NextResponse> => {
    if (!isCsrfExemptPath(request.nextUrl.pathname)) {
      const valid = await verifyCsrfTokenAsync(request);
      if (!valid) {
        return NextResponse.json(
          {
            error:
              'Token keamanan (CSRF) tidak valid atau kedaluwarsa. Muat ulang halaman lalu coba lagi.',
          },
          { status: 403 },
        );
      }
    }
    return handler(request, context);
  };
}
