import { getServerSupabase } from '@/lib/supabase/server';
import { fetchPublicListings } from '@/lib/listings-query';
import { formatEventMonth, type BerandaEvent, type BerandaProduct } from '@/lib/beranda-types';

// Fase 1.1: data awal /beranda diambil di server (SSR) agar hero marketplace & event
// komunitas terindeks crawler dan tampil sebelum hydrate. Feed infinite tetap client-side.

export type BerandaData = { ok: boolean; products: BerandaProduct[]; events: BerandaEvent[] };

const productTones = ['sand', 'peach', 'mint'];
const isDevPreview = process.env.NODE_ENV !== 'production';

export async function getBerandaData(): Promise<BerandaData> {
  try {
    const supabase = await getServerSupabase();
    const [listingsResult, eventsResult] = await Promise.all([
      fetchPublicListings({ limit: 3 }),
      supabase.from('group_events').select('id,title,starts_at,location,groups(name)').gte('starts_at', new Date().toISOString()).order('starts_at', { ascending: true }).limit(3),
    ]);
    const rows = listingsResult.ok && 'items' in listingsResult ? listingsResult.items : [];
    const products: BerandaProduct[] = rows.slice(0, 3).map((item, index) => ({
      id: String(item.id),
      title: String(item.title || 'Produk lokal'),
      seller: String((item.seller as { name?: string } | null)?.name || 'Penjual lokal'),
      place: String(item.city || item.district || 'Sultra'),
      tag: isDevPreview ? 'Nyata' : 'Produk lokal',
      tone: productTones[index % productTones.length],
    }));
    if (eventsResult.error) throw eventsResult.error;
    const events: BerandaEvent[] = ((eventsResult.data || []) as Array<{ id: string; title?: string; starts_at?: string; location?: string; groups?: { name?: string } | Array<{ name?: string }> | null }>).map((event) => {
      const startsAt = event.starts_at || '';
      const date = new Date(startsAt);
      const groupName = Array.isArray(event.groups) ? event.groups[0]?.name : event.groups?.name;
      return {
        id: String(event.id),
        date: Number.isNaN(date.getTime()) ? '–' : String(date.getDate()).padStart(2, '0'),
        month: formatEventMonth(startsAt),
        title: event.title || 'Kegiatan komunitas',
        place: [groupName, event.location].filter(Boolean).join(' · ') || 'Sulawesi Tenggara',
        type: 'Komunitas',
      };
    });
    return { ok: true, products, events };
  } catch {
    return { ok: false, products: [], events: [] };
  }
}
