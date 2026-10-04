'use server';

import { z } from 'zod';
import { requireServerUser } from '@/lib/supabase/server';
import { getServerSupabase } from '@/lib/supabase/server';

const listingInputSchema = z.object({
  title: z.string().trim().min(3, 'Judul minimal 3 karakter.').max(140),
  description: z.string().trim().max(5000).optional(),
  price: z.number().int('Harga harus bilangan bulat.').min(0, 'Harga tidak boleh negatif.').max(999_999_999_999),
  district: z.string().trim().min(2, 'Distrik wajib diisi.').max(80),
  city: z.string().trim().max(80).optional(),
  categoryId: z.string().uuid('Kategori tidak valid.').nullable().optional(),
  images: z.array(z.string().url().max(500)).max(10).optional(),
  videoUrl: z.string().url().max(500).nullable().optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair']).optional(),
  stockQuantity: z.number().int().min(1).max(10000).optional(),
  aiGenerated: z.boolean().optional(),
  aiMetadata: z.record(z.unknown()).optional(),
});
type ListingInput = z.infer<typeof listingInputSchema>;
function friendly(error: unknown) { return error instanceof Error ? error.message : 'Marketplace belum dapat diproses.'; }

export async function searchListings(filters: { query?: string; district?: string; categoryId?: string; minPrice?: number; maxPrice?: number; limit?: number } = {}) {
  try { const client = await getServerSupabase(); let query = client.from('listings').select('id,title,description,price,original_price,images,thumbnail_url,district,city,condition,stock_quantity,is_featured,is_promoted,seller_id,owner_id,category_id,created_at').in('status', ['published', 'active']).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(Math.min(filters.limit || 30, 50)); if (filters.query?.trim()) query = query.or(`title.ilike.%${filters.query.trim()}%,description.ilike.%${filters.query.trim()}%`); if (filters.district) query = query.eq('district', filters.district); if (filters.categoryId) query = query.eq('category_id', filters.categoryId); if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice); if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice); const { data, error } = await query; if (error) throw error; return { ok: true as const, data: data || [] }; } catch (error) { return { ok: false as const, error: friendly(error), data: [] }; }
}

export async function createMarketplaceListing(input: ListingInput) {
  try {
    const { supabase, user } = await requireServerUser();
    // Fase 1.3: validasi Zod via safeParse — jangan percaya input client.
    const parsed = listingInputSchema.safeParse(input);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false as const, error: first?.message || 'Data listing tidak valid. Periksa kembali isian Anda.' };
    }
    const clean = parsed.data;
    const row = { owner_id: user.id, seller_id: user.id, title: clean.title.slice(0, 140), description: clean.description?.trim() || null, price: clean.price, location: clean.district.trim(), district: clean.district.trim(), city: clean.city || 'Kendari', category_id: clean.categoryId || null, images: (clean.images || []).slice(0, 10), video_url: clean.videoUrl || null, condition: clean.condition || 'good', stock_quantity: Math.max(1, clean.stockQuantity || 1), ai_generated: Boolean(clean.aiGenerated), ai_metadata: clean.aiMetadata || {}, status: 'published', published_at: new Date().toISOString() };
    const { data, error } = await supabase.from('listings').insert(row).select('id,title,price,district,status').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function toggleWishlist(listingId: string) {
  try {
    // Fase 2.4: validasi dulu; kembalikan kode LOGIN_REQUIRED agar client bisa
    // menampilkan login sheet (bukan sekadar pesan error generik).
    const parsedId = z.string().uuid('Listing tidak valid.').safeParse(listingId);
    if (!parsedId.success) return { ok: false as const, error: 'Listing tidak valid.' };
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false as const, code: 'LOGIN_REQUIRED' as const, error: 'Masuk dulu untuk menyimpan listing.' };
    const { data: existing } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('listing_id', parsedId.data).maybeSingle();
    const result = existing ? await supabase.from('wishlists').delete().eq('id', existing.id) : await supabase.from('wishlists').insert({ user_id: user.id, listing_id: parsedId.data });
    if (result.error) throw result.error;
    return { ok: true as const, saved: !existing };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

/** Daftar id listing di wishlist user saat ini. Tidak login -> array kosong (bukan error). */
export async function getWishlistIds() {
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: true as const, ids: [] as string[] };
    const { data, error } = await supabase.from('wishlists').select('listing_id').eq('user_id', user.id);
    if (error) throw error;
    return { ok: true as const, ids: (data || []).map((row) => String(row.listing_id)) };
  } catch (error) { return { ok: false as const, error: friendly(error), ids: [] as string[] }; }
}

// ---- Galeri multi-foto: upload langsung ke Supabase Storage ----
//
// Menggantikan R2 (bucket expired 2026-10-04) dengan Supabase Storage bucket
// `listing-photos` (public read). Alur: server memvalidasi + menyiapkan object
// key (folder pertama = UID user, sesuai policy storage), browser mengunggah
// bytes-nya langsung via supabase-js (tanpa melewatkan file lewat server).

export const LISTING_PHOTOS_BUCKET = 'listing-photos';

const mediaUploadSchema = z.object({
  fileName: z.string().trim().min(1).max(160),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/, 'Format gambar harus JPG, PNG, WebP, atau GIF.'),
  size: z.number().int().min(1).max(20 * 1024 * 1024, 'Ukuran file maksimal 20 MB.'),
});

export type ListingMediaUploadOk = {
  ok: true;
  key: string;
  publicUrl: string;
  contentType: string;
};

/**
 * Siapkan upload foto: validasi di server, kembalikan object key + URL publik.
 * Browser kemudian mengunggah file-nya sendiri ke Supabase Storage.
 */
export async function createListingMediaUpload(input: { fileName: string; contentType: string; size: number }): Promise<ListingMediaUploadOk | { ok: false; error: string }> {
  try {
    const { user } = await requireServerUser();
    const parsed = mediaUploadSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message || 'File tidak valid.' };
    const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
    if (!base) return { ok: false as const, error: 'Konfigurasi Supabase belum lengkap.' };
    const { randomUUID } = await import('crypto');
    const safeName = parsed.data.fileName.toLowerCase().replace(/[^a-z0-9._-]/g, '-').slice(-120);
    // Folder pertama HARUS uid user — diwajibkan policy storage "owner insert".
    const key = `${user.id}/marketplace/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;
    const publicUrl = `${base}/storage/v1/object/public/${LISTING_PHOTOS_BUCKET}/${key}`;
    return { ok: true as const, key, publicUrl, contentType: parsed.data.contentType };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

const confirmMediaSchema = z.object({
  listingId: z.string().uuid('Listing tidak valid.'),
  objectKey: z.string().trim().min(1).max(500).regex(/^marketplace\//, 'Object key tidak valid.'),
  contentType: z.string().regex(/^image\/(jpeg|png|webp|gif)$/),
  byteSize: z.number().int().min(1).max(20 * 1024 * 1024),
});

/** Daftarkan file yang sudah ter-upload ke R2 sebagai media listing ( Fase 2.3 ). */
export async function confirmListingMedia(input: { listingId: string; objectKey: string; contentType: string; byteSize: number }) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = confirmMediaSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message || 'Data media tidak valid.' };
    const { data: listing, error: listingError } = await supabase.from('listings').select('id,seller_id,owner_id').eq('id', parsed.data.listingId).maybeSingle();
    if (listingError) throw listingError;
    if (!listing) return { ok: false as const, error: 'Listing tidak ditemukan.' };
    const { getUserRoles, canEditListing } = await import('@/lib/dal');
    const roles = await getUserRoles(user.id);
    if (!canEditListing(user.id, listing as { seller_id?: string | number | null; owner_id?: string | number | null }, roles)) {
      return { ok: false as const, error: 'Hanya pemilik listing yang dapat menambah foto.' };
    }
    const { data, error } = await supabase.from('listing_media').insert({
      listing_uuid: parsed.data.listingId,
      owner_user_id: user.id,
      object_key: parsed.data.objectKey,
      content_type: parsed.data.contentType,
      byte_size: parsed.data.byteSize,
      processing_status: 'UPLOADED',
    }).select('id').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

// ---- Fase 2.6: simpan pencarian & alert listing baru ----

const savedSearchFiltersSchema = z.object({
  q: z.string().trim().max(120).optional(),
  district: z.string().trim().max(80).optional(),
  category: z.string().trim().max(120).optional(),
  condition: z.enum(['new', 'like_new', 'good', 'fair']).optional(),
  minPrice: z.number().int().min(0).max(999_999_999_999).optional(),
  maxPrice: z.number().int().min(0).max(999_999_999_999).optional(),
}).refine((v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, { message: 'Harga minimum tidak boleh lebih besar dari maksimum.' });

const saveSearchSchema = z.object({
  name: z.string().trim().min(1, 'Nama pencarian wajib diisi.').max(120),
  filters: savedSearchFiltersSchema,
  alertEnabled: z.boolean().optional(),
});

export async function saveSearchAlert(input: { name: string; filters: Record<string, unknown>; alertEnabled?: boolean }) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = saveSearchSchema.safeParse(input);
    if (!parsed.success) return { ok: false as const, error: parsed.error.issues[0]?.message || 'Data pencarian tidak valid.' };
    const { data, error } = await supabase.from('saved_searches').insert({
      user_id: user.id,
      name: parsed.data.name,
      filters: parsed.data.filters,
      alert_enabled: parsed.data.alertEnabled ?? true,
    }).select('id,name,alert_enabled,created_at').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function listSavedSearches() {
  try {
    const { supabase, user } = await requireServerUser();
    const { data, error } = await supabase.from('saved_searches').select('id,name,filters,alert_enabled,created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
    if (error) throw error;
    return { ok: true as const, searches: (data || []) as Array<{ id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string }> };
  } catch (error) { return { ok: false as const, error: friendly(error), searches: [] as Array<{ id: string; name: string; filters: Record<string, unknown>; alert_enabled: boolean; created_at: string }> }; }
}

export async function deleteSavedSearch(id: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = z.string().uuid('Pencarian tidak valid.').safeParse(id);
    if (!parsed.success) return { ok: false as const, error: 'Pencarian tidak valid.' };
    const { error } = await supabase.from('saved_searches').delete().eq('id', parsed.data).eq('user_id', user.id);
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function setSearchAlertEnabled(input: { id: string; enabled: boolean }) {
  try {
    const { supabase, user } = await requireServerUser();
    const parsed = z.object({ id: z.string().uuid(), enabled: z.boolean() }).safeParse(input);
    if (!parsed.success) return { ok: false as const, error: 'Data tidak valid.' };
    const { error } = await supabase.from('saved_searches').update({ alert_enabled: parsed.data.enabled }).eq('id', parsed.data.id).eq('user_id', user.id);
    if (error) throw error;
    return { ok: true as const };
  } catch (error) { return { ok: false as const, error: friendly(error) }; }
}

export async function createEscrowOrder(input: { listingId: string; sellerId: string; quantity: number; subtotal: number; shippingCost?: number; paymentMethod: 'transfer' | 'qris' | 'ewallet' | 'cod'; shippingAddress: Record<string, unknown> }) { try { const { supabase, user } = await requireServerUser(); if (user.id === input.sellerId) return { ok: false as const, error: 'Seller tidak dapat membeli listing sendiri.' }; const shipping = input.shippingCost || 0; const { data, error } = await supabase.from('orders').insert({ buyer_id: user.id, seller_id: input.sellerId, listing_id: input.listingId, quantity: Math.max(1, input.quantity), subtotal: input.subtotal, shipping_cost: shipping, total: input.subtotal + shipping, payment_method: input.paymentMethod, shipping_address: input.shippingAddress, payment_status: 'pending', escrow_status: 'held', status: 'pending' }).select('id,order_number,total,payment_status,escrow_status,status').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }

export async function createReview(input: { orderId: string; revieweeId: string; listingId: string; rating: number; comment?: string }) { try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('reviews').insert({ order_id: input.orderId, reviewer_id: user.id, reviewee_id: input.revieweeId, listing_id: input.listingId, rating: input.rating, comment: input.comment?.trim() || null }).select('id,rating,comment,created_at').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }
