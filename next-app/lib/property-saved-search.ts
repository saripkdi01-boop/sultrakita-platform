'use server';

// Alert pencarian tersimpan khusus SUKI Suits (/properti).
//
// Desain:
// - Memakai tabel `saved_searches` yang sudah ada (milik marketplace). Baris
//   properti ditandai lewat `filters.target = 'properti'` di JSONB — tanpa
//   perubahan skema, tanpa migrasi wajib.
// - Default NON-AKTIF: pencarian baru disimpan dengan `alert_enabled = false`,
//   dan matcher cron tidak berjalan kecuali env
//   `PROPERTI_SAVED_SEARCH_ENABLED=true` di-set.
// - Mengaktifkan (migrasi indeks opsional + env flag + cron) WAJIB atas
//   persetujuan eksplisit pemilik. Lihat
//   docs/PROPERTI-SAVED-SEARCH-ALERTS.md.

import { z } from 'zod';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { requireServerUser } from '@/lib/supabase/server';

function friendly(error: unknown) {
  return error instanceof Error ? error.message : 'Pencarian properti belum dapat diproses.';
}

const propertyFiltersSchema = z.object({
  target: z.literal('properti'),
  q: z.string().trim().max(120).optional(),
  category: z.string().trim().max(40).optional(),
  district: z.string().trim().max(80).optional(),
  minPrice: z.number().int().min(0).max(999_999_999_999).optional(),
  maxPrice: z.number().int().min(0).max(999_999_999_999).optional(),
  canKpr: z.boolean().optional(),
  isLelang: z.boolean().optional(),
}).refine(v => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
  message: 'Harga minimum tidak boleh lebih besar dari maksimum.',
});

const savePropertySearchSchema = z.object({
  name: z.string().trim().min(1, 'Nama pencarian wajib diisi.').max(120),
  filters: propertyFiltersSchema,
  // Default false: alert properti NON-AKTIF sampai pemilik menyetujui.
  alertEnabled: z.boolean().optional(),
});

export async function savePropertySearchAlert(input: { name: string; filters: Record<string, unknown>; alertEnabled?: boolean }) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = savePropertySearchSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message || 'Data pencarian tidak valid.' };
    const { data, error } = await supabase.from('saved_searches').insert({
      user_id: user.id,
      name: parsed.data.name,
      filters: { ...parsed.data.filters, target: 'properti' as const },
      alert_enabled: parsed.data.alertEnabled ?? false,
    }).select('id,name,alert_enabled,created_at').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function listPropertySavedSearches() {
  try {
    const { supabase, user } = await requireServerUser();
    const { data, error } = await supabase.from('saved_searches')
      .select('id,name,filters,alert_enabled,created_at')
      .eq('user_id', user.id)
      .eq('filters->>target', 'properti')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return { ok: true as const, searches: (data || []) as Array<{ id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string }> };
  } catch (error) { return { ok: false as const, error: friendly(error), searches: [] as Array<{ id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string }> }; }
}

export async function setPropertySearchAlertEnabled(input: { id: string; enabled: boolean }) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = z.object({ id: z.string().uuid(), enabled: z.boolean() }).safeParse(input);
    if (!parsed.success) return { ok: false as const, error: 'Data tidak valid.' };
    const { error } = await supabase.from('saved_searches').update({ alert_enabled: parsed.data.enabled }).eq('id', parsed.data.id).eq('user_id', user.id);
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function deletePropertySavedSearch(id: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = z.string().uuid('Pencarian tidak valid.').safeParse(id);
    if (!parsed.success) return { ok: false as const, error: 'Pencarian tidak valid.' };
    const { error } = await supabase.from('saved_searches').delete().eq('id', parsed.data).eq('user_id', user.id);
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

// ---------- Matcher cron (service role) ----------

type PropertySavedSearchRow = {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, unknown>;
  alert_enabled: boolean;
  last_notified_at: string | null;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, character => `\\${character}`).replace(/[(),]/g, ' ');
}

async function countNewPropertyMatches(client: SupabaseClient, search: PropertySavedSearchRow, since: string): Promise<number> {
  const f = search.filters || {};
  const q = typeof f.q === 'string' ? f.q.trim() : '';
  const district = typeof f.district === 'string' ? f.district.trim() : '';
  const category = typeof f.category === 'string' ? f.category.trim() : '';
  const minPrice = typeof f.minPrice === 'number' ? f.minPrice : undefined;
  const maxPrice = typeof f.maxPrice === 'number' ? f.maxPrice : undefined;
  const canKpr = f.canKpr === true;
  const isLelang = f.isLelang === true;

  let query = client.from('properties').select('id', { count: 'exact', head: true })
    .in('status', ['available', 'rented', 'sold'])
    .or('is_demo.is.null,is_demo.eq.false')
    .gt('created_at', since);
  if (q) { const term = escapeLike(q); query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`); }
  if (district) query = query.ilike('district', `%${escapeLike(district)}%`);
  if (category) query = query.eq('category', category);
  if (canKpr) query = query.eq('can_kpr', true);
  if (isLelang) query = query.eq('is_lelang', true);
  if (minPrice !== undefined && minPrice > 0) query = query.gte('price', minPrice);
  if (maxPrice !== undefined && maxPrice > 0) query = query.lte('price', maxPrice);
  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

/**
 * Jalankan alert pencarian properti. NON-AKTIF secara default — hanya berjalan
 * bila `PROPERTI_SAVED_SEARCH_ENABLED=true` di environment. Mengaktifkan
 * butuh persetujuan eksplisit pemilik (lihat docs/PROPERTI-SAVED-SEARCH-ALERTS.md).
 */
export async function runPropertySavedSearchAlerts(): Promise<{ ok: true; checked: number; notified: number } | { ok: true; skipped: true; reason: string }> {
  if (process.env.PROPERTI_SAVED_SEARCH_ENABLED !== 'true') {
    return { ok: true, skipped: true, reason: 'PROPERTI_SAVED_SEARCH_ENABLED belum diaktifkan — alert pencarian properti nonaktif (butuh persetujuan pemilik).' };
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: true, skipped: true, reason: 'Supabase service key belum dikonfigurasi.' };
  const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: searches, error } = await client.from('saved_searches')
    .select('id,user_id,name,filters,alert_enabled,last_notified_at')
    .eq('alert_enabled', true)
    .eq('filters->>target', 'properti');
  if (error) throw error;
  let notified = 0;
  const fallbackSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  for (const search of (searches || []) as PropertySavedSearchRow[]) {
    try {
      const since = search.last_notified_at || fallbackSince;
      const count = await countNewPropertyMatches(client, search, since);
      if (count > 0) {
        const { error: notifyError } = await client.from('notifications').insert({
          user_id: search.user_id,
          title: 'Properti baru yang cocok',
          body: `${count} properti baru cocok dengan pencarian "${search.name}". Buka SUKI Suits untuk melihatnya.`,
        });
        if (notifyError) throw notifyError;
        notified += 1;
      }
      await client.from('saved_searches').update({ last_notified_at: new Date().toISOString() }).eq('id', search.id);
    } catch {
      // Satu pencarian gagal tidak boleh menggagalkan pencarian lain.
    }
  }
  return { ok: true, checked: (searches || []).length, notified };
}
