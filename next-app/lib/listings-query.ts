import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

// Fase 1.1: query listing publik terpusat — dipakai oleh /api/listings
// dan oleh Server Component halaman /marketplace (SSR data awal).
// Satu sumber kebenaran agar filter server & API selalu konsisten.
// Fase 2: tambah sort (terbaru/termurah/termahal), filter seller_id untuk
// etalase toko, dan merge galeri multi-foto dari tabel listing_media.

export type ListingFilters = {
  q?: string;
  district?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  sort?: string;
  sellerId?: string;
};

export type PublicSeller = {
  id?: string | number | null;
  name: string;
  verification_status: string;
  rating_average: number;
  rating_count: number;
  avatar_url: string | null;
};

export type PublicListing = {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  district?: string | null;
  city?: string | null;
  condition?: string | null;
  is_featured?: boolean | null;
  images: string[];
  thumbnail_url?: string | null;
  seller_id?: string | number | null;
  seller?: PublicSeller | null;
  [key: string]: unknown;
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (character) => `\\${character}`).replace(/[(),]/g, ' ');
}

function getListingsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cache label/slug -> UUID kategori agar tidak query tabel categories di setiap request.
let categoryCache: Array<{ id: string; slug: string; name: string }> | null = null;
export async function resolveCategoryId(client: NonNullable<ReturnType<typeof getListingsClient>>, raw: string): Promise<string | null> {
  const value = raw.trim();
  if (!value) return null;
  if (uuidPattern.test(value)) return value;
  const normalized = value.toLowerCase();
  try {
    if (!categoryCache) {
      const { data, error } = await client.from('categories').select('id,slug,name').eq('is_active', true);
      if (error) throw error;
      categoryCache = (data || []).map((row) => ({ id: String(row.id), slug: String(row.slug || '').toLowerCase(), name: String(row.name || '').toLowerCase() }));
    }
    const match = categoryCache.find((entry) => entry.slug === normalized || entry.name === normalized);
    return match ? match.id : null;
  } catch {
    return null;
  }
}

export type ListingsQueryResult =
  | { ok: true; items: PublicListing[]; filters: { q: string; district: string; category: string; condition: string } }
  | { ok: true; items: []; filters: { q: string; district: string; category: string; condition: string }; warning: string }
  | { ok: false; error: string };

function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const url of urls) {
    const clean = String(url || '').trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    out.push(clean);
  }
  return out;
}

/** Ambil galeri multi-foto dari listing_media (kolom listing_uuid, Fase 2). */
async function fetchMediaMap(client: NonNullable<ReturnType<typeof getListingsClient>>, ids: string[]): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  const base = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
  if (!ids.length || !base) return map;
  try {
    const { data, error } = await client
      .from('listing_media')
      .select('listing_uuid,object_key,created_at')
      .in('listing_uuid', ids)
      .in('processing_status', ['UPLOADED', 'READY'])
      .order('created_at', { ascending: true });
    if (error) throw error;
    for (const row of data || []) {
      const key = String((row as { listing_uuid: string }).listing_uuid || '');
      const objectKey = String((row as { object_key: string }).object_key || '').replace(/^\//, '');
      if (!key || !objectKey) continue;
      const list = map.get(key) || [];
      list.push(`${base}/${objectKey}`);
      map.set(key, list);
    }
  } catch {
    // Galeri media bersifat pelengkap — kegagalan tidak boleh menggagalkan listing.
  }
  return map;
}

export async function fetchPublicListings(filters: ListingFilters): Promise<ListingsQueryResult> {
  const queryText = filters.q?.trim();
  const district = filters.district?.trim();
  const category = filters.category?.trim();
  const condition = filters.condition?.trim();
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const sort = filters.sort === 'termurah' || filters.sort === 'termahal' ? filters.sort : 'terbaru';
  const sellerId = filters.sellerId?.trim();
  const limit = Math.min(Math.max(filters.limit || 30, 1), 50);
  const filterSummary = { q: queryText || '', district: district || '', category: category || '', condition: condition || '' };
  try {
    const client = getListingsClient() || await getServerSupabase();
    let query = client.from('listings').select('id,title,description,price,image_url,images,district,city,condition,is_featured,is_demo,provenance,created_at,seller_id,owner_id').in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false');
    // Fase 2.1: sort server-side agar konsisten antara SSR & API.
    if (sort === 'termurah') query = query.order('price', { ascending: true }).order('created_at', { ascending: false });
    else if (sort === 'termahal') query = query.order('price', { ascending: false }).order('created_at', { ascending: false });
    else query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    query = query.limit(limit);
    if (queryText) { const term = escapeLike(queryText); query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,district.ilike.%${term}%,city.ilike.%${term}%`); }
    if (district && district !== 'Semua distrik') query = query.eq('district', district);
    if (condition) query = query.eq('condition', condition);
    // Filter kategori: UUID dipakai langsung; label/slug di-resolve ke UUID tabel categories.
    // Bila tidak dikenal, kembalikan hasil kosong yang jujur.
    if (category) {
      const categoryId = await resolveCategoryId(client, category);
      if (!categoryId) return { ok: true, items: [], filters: filterSummary, warning: 'Kategori tidak ditemukan.' };
      query = query.eq('category_id', categoryId);
    }
    if (sellerId) {
      // seller_id numerik (bigint) atau owner_id uuid — dukung keduanya.
      if (/^\d+$/.test(sellerId)) query = query.eq('seller_id', Number(sellerId));
      else if (uuidPattern.test(sellerId)) query = query.eq('owner_id', sellerId);
      else return { ok: true, items: [], filters: filterSummary, warning: 'Penjual tidak ditemukan.' };
    }
    if (minPrice !== undefined && Number.isFinite(minPrice) && minPrice > 0) query = query.gte('price', minPrice);
    if (maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice > 0) query = query.lte('price', maxPrice);
    const { data, error } = await query;
    if (error) throw error;
    const visibleItems = (data || []).filter((item) => item.is_demo !== true && item.provenance !== 'curated_demo' && !String(item.title || '').startsWith('DEMO-SEED-'));
    const sellerIds = Array.from(new Set(visibleItems.map((item) => item.seller_id).filter((id): id is number => Number.isFinite(Number(id))).map(Number)));
    const sellerMap = new Map<number, PublicSeller>();
    if (sellerIds.length) {
      const { data: sellers, error: sellerError } = await client.from('users').select('id,name,verification_status,rating_average,rating_count,avatar_url').in('id', sellerIds);
      if (sellerError) throw sellerError;
      for (const seller of sellers || []) sellerMap.set(Number(seller.id), { id: seller.id, name: String(seller.name || 'Penjual lokal'), verification_status: String(seller.verification_status || 'unverified'), rating_average: Number(seller.rating_average || 0), rating_count: Number(seller.rating_count || 0), avatar_url: seller.avatar_url || null });
    }
    // Fase 2.3: gabungkan galeri listing_media (diutamakan) + images[] + image_url.
    const mediaMap = await fetchMediaMap(client, visibleItems.map((item) => String(item.id)));
    const items: PublicListing[] = visibleItems.map((item) => {
      const rowImages = Array.isArray(item.images) ? (item.images as unknown[]).map(String) : [];
      const images = dedupeUrls([...(mediaMap.get(String(item.id)) || []), ...rowImages, typeof item.image_url === 'string' ? item.image_url : null]);
      return { ...item, images, thumbnail_url: images[0] || (typeof item.image_url === 'string' ? item.image_url : null), seller: item.seller_id ? sellerMap.get(Number(item.seller_id)) || null : null };
    });
    return { ok: true, items, filters: filterSummary };
  } catch {
    return { ok: false, error: 'Listing sementara belum tersedia.' };
  }
}

/** Profil publik penjual untuk halaman etalase toko (Fase 2.5). */
export async function fetchSellerProfile(sellerId: string): Promise<{ ok: true; seller: PublicSeller } | { ok: false; error: string }> {
  try {
    const client = getListingsClient() || await getServerSupabase();
    let seller: PublicSeller | null = null;
    if (/^\d+$/.test(sellerId)) {
      const { data, error } = await client.from('users').select('id,name,verification_status,rating_average,rating_count,avatar_url').eq('id', Number(sellerId)).maybeSingle();
      if (error) throw error;
      if (data) seller = { id: data.id, name: String(data.name || 'Penjual lokal'), verification_status: String(data.verification_status || 'unverified'), rating_average: Number(data.rating_average || 0), rating_count: Number(data.rating_count || 0), avatar_url: data.avatar_url || null };
    } else if (uuidPattern.test(sellerId)) {
      const { data, error } = await client.from('profiles').select('id,full_name,display_name,avatar_url').eq('id', sellerId).maybeSingle();
      if (error) throw error;
      if (data) {
        const name = String(data.display_name || data.full_name || 'Penjual lokal');
        // Reputasi diambil dari tabel users bila ada baris yang cocok via owner listings.
        seller = { id: data.id, name, verification_status: 'unverified', rating_average: 0, rating_count: 0, avatar_url: data.avatar_url || null };
      }
    }
    if (!seller) return { ok: false, error: 'Toko tidak ditemukan.' };
    return { ok: true, seller };
  } catch {
    return { ok: false, error: 'Profil toko sementara tidak tersedia.' };
  }
}
