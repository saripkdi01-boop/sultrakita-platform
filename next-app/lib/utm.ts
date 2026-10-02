/**
 * Atribusi signup UTM (first-touch).
 *
 * Alur:
 *  1. <UtmCapture/> (dipasang di root layout) membaca utm_source/medium/campaign
 *     dari URL saat pengunjung pertama tiba, lalu menyimpannya ke cookie
 *     `sk_utm` (first-touch: tidak ditimpa bila cookie sudah ada).
 *  2. Saat signup email, AuthGate menyertakan nilai UTM ke user_metadata
 *     (supabase.auth.signUp options.data) → trigger handle_new_auth_profile()
 *     menyalinnya ke public.profiles (migrasi 20261002203100).
 *  3. Saat signup OAuth, /auth/callback membaca cookie sk_utm server-side lalu
 *     update profiles (hanya bila utm_source masih null).
 *
 * Privasi: nilai UTM bukan PII (hanya nama kanal/kampanye), disimpan di baris
 * profil milik user sendiri, dipakai agregat admin di /admin/overview.
 */

export const UTM_COOKIE = 'sk_utm';
const UTM_MAX_AGE = 90 * 24 * 3600; // 90 hari

export type UtmAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function sanitize(value: string | null | undefined): string | null {
  if (!value) return null;
  const clean = value.trim().slice(0, 64).replace(/[^a-zA-Z0-9 _.\-+:]/g, '');
  return clean || null;
}

function parseUtmCookie(raw: string | null | undefined): UtmAttribution | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<UtmAttribution>;
    if (!parsed || typeof parsed !== 'object' || !sanitize(parsed.utm_source)) return null;
    return {
      utm_source: sanitize(parsed.utm_source),
      utm_medium: sanitize(parsed.utm_medium),
      utm_campaign: sanitize(parsed.utm_campaign),
    };
  } catch {
    return null;
  }
}

/** Baca atribusi dari cookie (client-side). */
export function readUtmFromCookie(): UtmAttribution | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${UTM_COOKIE}=`));
  return parseUtmCookie(match ? decodeURIComponent(match.slice(UTM_COOKIE.length + 1)) : null);
}

/**
 * Tangkap utm_* dari URL ke cookie — first-touch only.
 * Dipanggil sekali saat aplikasi dimuat (lihat <UtmCapture/>).
 */
export function captureUtmFromUrl(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (readUtmFromCookie()) return; // first-touch: jangan timpa atribusi awal
  const params = new URLSearchParams(window.location.search);
  const utm_source = sanitize(params.get('utm_source'));
  if (!utm_source) return; // hanya simpan bila ada utm_source
  const payload: UtmAttribution = {
    utm_source,
    utm_medium: sanitize(params.get('utm_medium')),
    utm_campaign: sanitize(params.get('utm_campaign')),
  };
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${UTM_COOKIE}=${encodeURIComponent(JSON.stringify(payload))}; Path=/; Max-Age=${UTM_MAX_AGE}; SameSite=Lax${secure}`;
}

/** Hapus cookie atribusi (dipakai setelah berhasil dicatat ke profil). */
export function clearUtmCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${UTM_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/** Parse cookie mentah server-side (untuk /auth/callback). */
export function parseUtmCookieServer(cookieHeader: string | null | undefined): UtmAttribution | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.split(';').map((p) => p.trim()).find((p) => p.startsWith(`${UTM_COOKIE}=`));
  return parseUtmCookie(match ? decodeURIComponent(match.slice(UTM_COOKIE.length + 1)) : null);
}
