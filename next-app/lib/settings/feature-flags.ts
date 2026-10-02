// T-ADMIN: helper feature flags server-side.
// Membaca tabel public.site_settings via REST dengan service-role key
// (SERVER-SIDE SAJA — tidak pernah di-bundle ke client), fallback ke env.
// Cache in-memory 60 detik; gagal-buka -> fallback (tidak pernah throw).
//
// Konsumen: halaman /login & /signup (server components) memanggil
// getFeatureFlags() lalu meneruskan hasilnya sebagai prop ke AuthGate.
// Admin mengubah flag dari /admin/settings tanpa deploy ulang.
//
// TODO(launch): bila nanti semua flag dikelola DB, hapus fallback env
// NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN dan andalkan site_settings sepenuhnya.

const CACHE_TTL_MS = 60_000;
let flagsCache: { value: Record<string, unknown>; at: number } | null = null;

function envFallback(): Record<string, unknown> {
  return {
    // Backward-compatible dengan branch upgrade/launch-hide-facebook-login:
    // env NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN=true menyalakan tombol FB.
    facebook_login_enabled: process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN === 'true',
  };
}

async function readFlagsFromDb(): Promise<Record<string, unknown> | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?select=key,value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ key: string; value: unknown }>;
    const out: Record<string, unknown> = {};
    for (const row of rows) out[row.key] = row.value;
    return out;
  } catch {
    return null;
  }
}

/** Semua flag sebagai map key -> value (value apa adanya dari JSONB). */
export async function getFeatureFlags(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (flagsCache && now - flagsCache.at < CACHE_TTL_MS) return flagsCache.value;
  const fromDb = await readFlagsFromDb();
  // DB menang atas env; env hanya mengisi key yang belum ada di DB.
  const merged = { ...envFallback(), ...(fromDb ?? {}) };
  flagsCache = { value: merged, at: now };
  return merged;
}

/** Flag boolean spesifik dengan default bila tidak ada. */
export async function getBooleanFlag(key: string, fallback: boolean): Promise<boolean> {
  const flags = await getFeatureFlags();
  const raw = flags[key];
  if (typeof raw === 'boolean') return raw;
  if (typeof raw === 'string') return raw.toLowerCase() === 'true';
  return fallback;
}

/** Flag login Facebook: DB (site_settings.facebook_login_enabled) -> env -> default mati. */
export async function isFacebookLoginEnabled(): Promise<boolean> {
  return getBooleanFlag(
    'facebook_login_enabled',
    process.env.NEXT_PUBLIC_ENABLE_FACEBOOK_LOGIN === 'true',
  );
}
