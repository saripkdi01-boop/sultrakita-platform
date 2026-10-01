// SLICE-B: helper feature flags berbasis tabel public.site_settings.
// KONTRAK BERSAMA: slice lain HANYA membaca flag lewat getFlag ini —
// JANGAN query tabel site_settings langsung.
// Cache in-memory 30 detik; gagal-buka -> fallback (tidak pernah throw).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, { value: unknown; expiresAt: number }>();

function getAnonClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function parseFlag(raw: unknown, fallback: unknown): unknown {
  // Nilai disimpan sebagai JSONB; kembalikan apa adanya (boolean/string/object/null).
  if (raw === undefined || raw === null) return fallback ?? raw ?? null;
  return raw;
}

export async function getFlag<T = unknown>(key: string, fallback: T): Promise<T> {
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) return hit.value as T;

  try {
    const client = getAnonClient();
    if (!client) return fallback;
    const { data, error } = await client
      .from('site_settings')
      .select('value')
      .eq('key', key)
      .maybeSingle();
    if (error) return fallback;
    const value = (parseFlag(data?.value, fallback) ?? fallback) as T;
    cache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
    return value;
  } catch {
    // Gagal-buka: jangan ganggu request; pakai fallback.
    return fallback;
  }
}

export function clearFlagCache(key?: string) {
  if (key) cache.delete(key);
  else cache.clear();
}

export const FLAG_CACHE_TTL_MS = CACHE_TTL_MS;
