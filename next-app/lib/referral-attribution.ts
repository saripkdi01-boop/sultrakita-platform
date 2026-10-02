/**
 * Atribusi referral first-touch (`?ref=KODE`).
 *
 * Alur:
 *  1. <ReferralCapture/> (dipasang di root layout) membaca `ref` dari URL saat
 *     pengunjung pertama tiba, lalu menyimpannya ke cookie `sk_ref`
 *     (first-touch: tidak ditimpa bila cookie sudah ada; 90 hari).
 *  2. Saat signup email / login password, AuthGate memanggil
 *     `tryClaimReferral()` (best-effort) → POST /api/referral {action:'claim'}.
 *  3. Saat signup OAuth, /auth/callback membaca cookie server-side lalu
 *     memanggil RPC `claim_referral` langsung (best-effort).
 *  4. Cookie dihapus setelah klaim mencapai status terminal (sukses/duplikat/
 *     kode tidak valid/self-referral). Kegagalan jaringan/5xx membiarkan cookie
 *     tetap ada agar klaim dicoba lagi di kunjungan berikutnya.
 *
 * Privasi: cookie hanya berisi kode referral publik milik pengundang
 * (format SULTRA-XXXXXXXX) + kanal — bukan PII. Atribusi mengikat ke akun
 * milik user sendiri melalui RPC yang sudah punya anti-fraud (self-referral,
 * velocity, fingerprint).
 */

export const REF_COOKIE = 'sk_ref';
export const REF_CODE_RE = /^SULTRA-[A-F0-9]{8}$/;
const REF_MAX_AGE = 90 * 24 * 3600; // 90 hari, selaras dengan cookie UTM

export type ReferralAttribution = {
  code: string;
  channel: string;
  captured_at: number;
};

const CHANNEL_RE = /^[a-z0-9_-]{1,30}$/;

function sanitizeChannel(value: string | null | undefined): string {
  const clean = (value || '').trim().toLowerCase();
  return CHANNEL_RE.test(clean) ? clean : 'direct';
}

/** Validasi format kode referral publik. */
export function isValidReferralCode(value: string | null | undefined): value is string {
  if (!value) return false;
  return REF_CODE_RE.test(value.trim().toUpperCase());
}

/** Normalisasi kode ke bentuk kanonis (uppercase, trim) atau null. */
export function normalizeReferralCode(value: string | null | undefined): string | null {
  if (!isValidReferralCode(value)) return null;
  return (value as string).trim().toUpperCase();
}

function parsePayload(raw: string | null | undefined): ReferralAttribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ReferralAttribution>;
    const code = normalizeReferralCode(parsed?.code);
    if (!code) return null;
    return {
      code,
      channel: sanitizeChannel(parsed?.channel),
      captured_at: typeof parsed?.captured_at === 'number' ? parsed.captured_at : Date.now(),
    };
  } catch {
    return null;
  }
}

function readCookieHeader(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REF_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(REF_COOKIE.length + 1)) : null;
}

/** Baca atribusi referral dari cookie (client-side). */
export function readReferralFromCookie(): ReferralAttribution | null {
  return parsePayload(readCookieHeader());
}

/**
 * Tangkap `?ref=KODE` dari URL ke cookie — first-touch only.
 * Dipanggil sekali saat aplikasi dimuat (lihat <ReferralCapture/>).
 */
export function captureReferralFromUrl(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (readReferralFromCookie()) return; // first-touch: jangan timpa atribusi awal
  const params = new URLSearchParams(window.location.search);
  const code = normalizeReferralCode(params.get('ref'));
  if (!code) return;
  const payload: ReferralAttribution = {
    code,
    channel: sanitizeChannel(params.get('src')),
    captured_at: Date.now(),
  };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${REF_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; Path=/; Max-Age=${REF_MAX_AGE}; SameSite=Lax${secure}`;
}

/** Hapus cookie atribusi (dipakai setelah klaim mencapai status terminal). */
export function clearReferralCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${REF_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Parse cookie mentah server-side (untuk /auth/callback). */
export function parseReferralCookieServer(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REF_COOKIE}=`));
  const payload = parsePayload(match ? decodeURIComponent(match.slice(REF_COOKIE.length + 1)) : null);
  return payload?.code || null;
}
