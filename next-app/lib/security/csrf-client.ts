/**
 * Helper CSRF sisi klien untuk fetch ke route mutasi yang dilindungi
 * `csrfProtected` / `verifyCsrfToken` (server).
 *
 * Pola: ambil token sekali dari `GET /api/csrf` (sekaligus men-set cookie
 * httpOnly `suki_csrf`), lalu kirim kembali via header `x-csrf-token`.
 * Token di-cache di memori; bila server menjawab 403, cache dibuang agar
 * pengambilan berikutnya meminta token baru.
 *
 * Dipakai oleh: upload avatar, referral (visit/redeem/payout_transition),
 * dan route mutasi lain yang memakai proteksi CSRF server-side.
 */

'use client';

let cachedToken: string | null = null;
let inflight: Promise<string> | null = null;

async function fetchToken(): Promise<string> {
  const response = await fetch('/api/csrf', { credentials: 'include', cache: 'no-store' });
  if (!response.ok) throw new Error('Token keamanan belum tersedia.');
  const payload = (await response.json().catch(() => null)) as { csrfToken?: string } | null;
  const token = payload?.csrfToken;
  if (!token) throw new Error('Token keamanan tidak valid.');
  return token;
}

/** Ambil (dan cache) token CSRF untuk request berikutnya. */
export async function getCsrfToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  if (!inflight) {
    inflight = fetchToken().then((token) => {
      cachedToken = token;
      inflight = null;
      return token;
    }).catch((err) => {
      inflight = null;
      throw err;
    });
  }
  return inflight;
}

/** Buang token yang di-cache (mis. setelah 403) agar diambil ulang. */
export function clearCsrfToken(): void {
  cachedToken = null;
}

/**
 * fetch() dengan header `x-csrf-token` otomatis. Bila server menjawab 403
 * (token basi/kedaluwarsa), token di-refresh sekali lalu request diulang.
 */
export async function csrfFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const token = await getCsrfToken();
  const headers = new Headers(init.headers);
  headers.set('x-csrf-token', token);
  const response = await fetch(input, { credentials: 'include', ...init, headers });
  if (response.status === 403) {
    clearCsrfToken();
    const retryToken = await getCsrfToken();
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set('x-csrf-token', retryToken);
    return fetch(input, { credentials: 'include', ...init, headers: retryHeaders });
  }
  return response;
}
