import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { resolveCategoryId } from './listings-query';

// Fase 2.6: pencocokan pencarian tersimpan -> notifikasi in-app.
// Dijalankan cron per jam (app/api/cron/saved-search-alerts). Satu notifikasi
// ringkas per pencarian per periode (bukan per listing) agar tidak spam.
// last_notified_at menjadi penanda dedupe.

type SavedSearchRow = {
  id: string;
  user_id: string;
  name: string;
  filters: Record<string, unknown>;
  alert_enabled: boolean;
  last_notified_at: string | null;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`).replace(/[(),]/g, ' ');
}

async function countNewMatches(client: SupabaseClient, search: SavedSearchRow, since: string): Promise<number> {
  const f = search.filters || {};
  const q = typeof f.q === 'string' ? f.q.trim() : '';
  const district = typeof f.district === 'string' ? f.district.trim() : '';
  const category = typeof f.category === 'string' ? f.category.trim() : '';
  const condition = typeof f.condition === 'string' ? f.condition.trim() : '';
  const minPrice = typeof f.minPrice === 'number' ? f.minPrice : undefined;
  const maxPrice = typeof f.maxPrice === 'number' ? f.maxPrice : undefined;

  let query = client.from('listings').select('id', { count: 'exact', head: true }).in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false').gt('created_at', since);
  if (q) { const term = escapeLike(q); query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`); }
  if (district && district !== 'Semua distrik') query = query.eq('district', district);
  if (condition) query = query.eq('condition', condition);
  if (category) {
    const categoryId = await resolveCategoryId(client, category);
    if (!categoryId) return 0;
    query = query.eq('category_id', categoryId);
  }
  if (minPrice !== undefined && minPrice > 0) query = query.gte('price', minPrice);
  if (maxPrice !== undefined && maxPrice > 0) query = query.lte('price', maxPrice);
  const { count, error } = await query;
  if (error) throw error;
  return count || 0;
}

export async function runSavedSearchAlerts(): Promise<{ ok: true; checked: number; notified: number } | { ok: true; skipped: true; reason: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { ok: true, skipped: true, reason: 'Supabase service key belum dikonfigurasi.' };
  const client = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: searches, error } = await client.from('saved_searches').select('id,user_id,name,filters,alert_enabled,last_notified_at').eq('alert_enabled', true);
  if (error) throw error;
  let notified = 0;
  const fallbackSince = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  for (const search of (searches || []) as SavedSearchRow[]) {
    try {
      const since = search.last_notified_at || fallbackSince;
      const count = await countNewMatches(client, search, since);
      if (count > 0) {
        const { error: notifyError } = await client.from('notifications').insert({
          user_id: search.user_id,
          title: 'Listing baru yang cocok',
          body: `${count} listing baru cocok dengan pencarian "${search.name}". Buka Marketplace untuk melihatnya.`,
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
