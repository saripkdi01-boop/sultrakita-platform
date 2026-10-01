import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

// Fase 1.1: query listing publik terpusat — dipakai oleh /api/listings
// dan oleh Server Component halaman /marketplace (SSR data awal).
// Satu sumber kebenaran agar filter server & API selalu konsisten.

export type ListingFilters = {
  q?: string;
  district?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
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
  seller?: { name: string; verification_status: string; rating_average: number; rating_count: number; avatar_url: string | null } | null;
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
async function resolveCategoryId(client: NonNullable<ReturnType<typeof getListingsClient>>, raw: string): Promise<string | null> {
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

export async function fetchPublicListings(filters: ListingFilters): Promise<ListingsQueryResult> {
  const queryText = filters.q?.trim();
  const district = filters.district?.trim();
  const category = filters.category?.trim();
  const condition = filters.condition?.trim();
  const minPrice = filters.minPrice;
  const maxPrice = filters.maxPrice;
  const limit = Math.min(Math.max(filters.limit || 30, 1), 50);
  const filterSummary = { q: queryText || '', district: district || '', category: category || '', condition: condition || '' };
  try {
    const client = getListingsClient() || await getServerSupabase();
    let query = client.from('listings').select('id,title,description,price,image_url,district,city,condition,is_featured,is_demo,provenance,created_at,seller_id').in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false').order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(limit);
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
    if (minPrice !== undefined && Number.isFinite(minPrice) && minPrice > 0) query = query.gte('price', minPrice);
    if (maxPrice !== undefined && Number.isFinite(maxPrice) && maxPrice > 0) query = query.lte('price', maxPrice);
    const { data, error } = await query;
    if (error) throw error;
    const visibleItems = (data || []).filter((item) => item.is_demo !== true && item.provenance !== 'curated_demo' && !String(item.title || '').startsWith('DEMO-SEED-'));
    const sellerIds = Array.from(new Set(visibleItems.map((item) => item.seller_id).filter((id): id is number => Number.isFinite(Number(id))).map(Number)));
    const sellerMap = new Map<number, { name: string; verification_status: string; rating_average: number; rating_count: number; avatar_url: string | null }>();
    if (sellerIds.length) {
      const { data: sellers, error: sellerError } = await client.from('users').select('id,name,verification_status,rating_average,rating_count,avatar_url').in('id', sellerIds);
      if (sellerError) throw sellerError;
      for (const seller of sellers || []) sellerMap.set(Number(seller.id), { name: String(seller.name || 'Penjual lokal'), verification_status: String(seller.verification_status || 'unverified'), rating_average: Number(seller.rating_average || 0), rating_count: Number(seller.rating_count || 0), avatar_url: seller.avatar_url || null });
    }
    const items: PublicListing[] = visibleItems.map((item) => ({ ...item, images: item.image_url ? [item.image_url] : [], thumbnail_url: item.image_url || null, seller: item.seller_id ? sellerMap.get(Number(item.seller_id)) || null : null }));
    return { ok: true, items, filters: filterSummary };
  } catch {
    return { ok: false, error: 'Listing sementara belum tersedia.' };
  }
}
