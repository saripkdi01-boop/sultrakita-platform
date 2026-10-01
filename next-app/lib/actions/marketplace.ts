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

export async function toggleWishlist(listingId: string) { try { const { supabase, user } = await requireServerUser(); const { data: existing } = await supabase.from('wishlists').select('id').eq('user_id', user.id).eq('listing_id', listingId).maybeSingle(); const result = existing ? await supabase.from('wishlists').delete().eq('id', existing.id) : await supabase.from('wishlists').insert({ user_id: user.id, listing_id: listingId }); if (result.error) throw result.error; return { ok: true as const, saved: !existing }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }

export async function createEscrowOrder(input: { listingId: string; sellerId: string; quantity: number; subtotal: number; shippingCost?: number; paymentMethod: 'transfer' | 'qris' | 'ewallet' | 'cod'; shippingAddress: Record<string, unknown> }) { try { const { supabase, user } = await requireServerUser(); if (user.id === input.sellerId) return { ok: false as const, error: 'Seller tidak dapat membeli listing sendiri.' }; const shipping = input.shippingCost || 0; const { data, error } = await supabase.from('orders').insert({ buyer_id: user.id, seller_id: input.sellerId, listing_id: input.listingId, quantity: Math.max(1, input.quantity), subtotal: input.subtotal, shipping_cost: shipping, total: input.subtotal + shipping, payment_method: input.paymentMethod, shipping_address: input.shippingAddress, payment_status: 'pending', escrow_status: 'held', status: 'pending' }).select('id,order_number,total,payment_status,escrow_status,status').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }

export async function createReview(input: { orderId: string; revieweeId: string; listingId: string; rating: number; comment?: string }) { try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('reviews').insert({ order_id: input.orderId, reviewer_id: user.id, reviewee_id: input.revieweeId, listing_id: input.listingId, rating: input.rating, comment: input.comment?.trim() || null }).select('id,rating,comment,created_at').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: friendly(error) }; } }
