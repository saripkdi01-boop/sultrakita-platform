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
  // Slice 1 (program 4-jam): kolom promo — dibaca dari DB hanya bila kolomnya
  // tersedia (lihat hasPromoColumns di bawah). NULL/absen = tidak ada promo.
  original_price?: number | null;
  stock_quantity?: number | null;
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

// Slice 1 (program 4-jam): kolom original_price & stock_quantity dideklarasikan
// di migrasi lama tetapi BELUM ada di production (terverifikasi via REST
// 2026-10-02). Probe sekali per instance server; bila kolom belum ada,
// select utama tidak menyertakannya agar query tidak 400. Setelah migrasi
// 20261002141000_listings_promo_columns.sql diterapkan, badge promo & stok
// jujur aktif otomatis tanpa perubahan kode.
let promoColumnsAvailable: boolean | null = null;
type PromoProbeClient = { from(table: string): { select(columns: string): { limit(n: number): PromiseLike<{ error: unknown }> } } };
async function hasPromoColumns(client: PromoProbeClient): Promise<boolean> {
  if (promoColumnsAvailable !== null) return promoColumnsAvailable;
  try {
    const { error } = await client.from('listings').select('original_price,stock_quantity').limit(1);
    promoColumnsAvailable = !error;
  } catch {
    promoColumnsAvailable = false;
  }
  return promoColumnsAvailable;
}

// Kolom images & owner_id (migrasi 20261003090000_marketplace_create_columns).
// Di production yang belum menjalankan migrasi, kolom belum ada — di-probe
// sekali per instance agar select utama tidak 400/503.
let createColumnsAvailable: boolean | null = null;
async function hasCreateColumns(client: PromoProbeClient): Promise<boolean> {
  if (createColumnsAvailable !== null) return createColumnsAvailable;
  try {
    const { error } = await client.from('listings').select('images,owner_id').limit(1);
    createColumnsAvailable = !error;
  } catch {
    createColumnsAvailable = false;
  }
  return createColumnsAvailable;
}

// Kolom moderation_status (migrasi 018_listing_moderation_status.sql).
// Dipakai agar listing yang DITARIK admin (moderation_status='rejected')
// tidak tampil di publik. Di-probe seperti kolom lain agar aman bila
// migrasi belum dijalankan di environment tertentu.
let moderationColumnAvailable: boolean | null = null;
async function hasModerationColumn(client: PromoProbeClient): Promise<boolean> {
  if (moderationColumnAvailable !== null) return moderationColumnAvailable;
  try {
    const { error } = await client.from('listings').select('moderation_status').limit(1);
    moderationColumnAvailable = !error;
  } catch {
    moderationColumnAvailable = false;
  }
  return moderationColumnAvailable;
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
    const promoColumns = await hasPromoColumns(client as unknown as PromoProbeClient);
    // Kolom images & owner_id ditambahkan migrasi 20261003090000. Sebelum
    // migrasi dijalankan di production, kolom belum ada -> keluarkan dari
    // select agar GET tidak 503 (pola yang sama dengan hasPromoColumns).
    const createColumns = await hasCreateColumns(client as unknown as PromoProbeClient);
    const baseSelect = 'id,title,description,price,image_url,district,city,condition,is_featured,is_demo,provenance,created_at,seller_id';
    const fullSelect = `${baseSelect},images,owner_id` as const;
    // Cast ke literal penuh agar inferensi tipe baris tetap utuh; pada runtime
    // varian tanpa images/owner_id dipakai bila kolom belum ada di DB.
    const selectColumns = (createColumns ? fullSelect : baseSelect) as typeof fullSelect;
    let query = client.from('listings').select(selectColumns).in('status', ['published', 'active']).or('is_demo.is.null,is_demo.eq.false');
    // Listing yang ditarik admin (moderation_status='rejected') disembunyikan
    // dari publik meski status legacy-nya masih 'active'.
    if (await hasModerationColumn(client as unknown as PromoProbeClient)) {
      query = query.neq('moderation_status', 'rejected');
    }
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
      // Filter owner_id hanya bila kolomnya ada (migrasi 20261003090000).
      if (/^\d+$/.test(sellerId)) query = query.eq('seller_id', Number(sellerId));
      else if (uuidPattern.test(sellerId) && createColumns) query = query.eq('owner_id', sellerId);
      else if (uuidPattern.test(sellerId)) return { ok: true, items: [], filters: filterSummary, warning: 'Penjual tidak ditemukan.' };
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
    // Slice 1: gabungkan kolom promo (original_price, stock_quantity) bila
    // tersedia di DB — query terpisah agar select utama tetap stabil secara tipe.
    if (promoColumns && items.length > 0) {
      try {
        const { data: promoRows } = await client.from('listings').select('id,original_price,stock_quantity').in('id', items.map((item) => item.id));
        const promoMap = new Map<string, { original_price: unknown; stock_quantity: unknown }>();
        for (const row of (promoRows || []) as Array<{ id: unknown; original_price: unknown; stock_quantity: unknown }>) {
          promoMap.set(String(row.id), row);
        }
        for (const item of items) {
          const promo = promoMap.get(String(item.id));
          if (!promo) continue;
          const original = Number(promo.original_price);
          if (Number.isFinite(original) && original > 0) item.original_price = original;
          const stock = Number(promo.stock_quantity);
          if (Number.isFinite(stock) && stock >= 0) item.stock_quantity = Math.trunc(stock);
        }
      } catch {
        // Kolom promo belum bisa dibaca — badge promo & stok jujur nonaktif aman.
      }
    }
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
