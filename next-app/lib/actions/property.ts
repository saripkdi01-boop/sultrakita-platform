'use server';

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';
import { geocodeAddressNominatim } from '@/lib/geocode';
import { revalidatePath } from 'next/cache';
import { canEditListing, getUserRoles } from '@/lib/dal';

const propertySchema = z.object({ category: z.enum(['rumah_second','rumah_mewah','rumah_subsidi','kos_kosan','kontrakan','tanah_kavling','tanah_kosong','ruko','gudang','kantor','ruang_usaha','properti_lelang','takeover_kpr','properti_developer','apartemen','villa_resort']), title: z.string().trim().min(5).max(140), description: z.string().trim().max(4000).optional(), price: z.coerce.number().min(0), priceType: z.enum(['per_bulan','per_tahun','total','mulai_dari','nego']), isNegotiable: z.boolean().default(true), landAreaSqm: z.coerce.number().nonnegative().optional(), buildingAreaSqm: z.coerce.number().nonnegative().optional(), bedrooms: z.coerce.number().int().nonnegative().default(0), bathrooms: z.coerce.number().int().nonnegative().default(0), floors: z.coerce.number().int().positive().default(1), furnished: z.boolean().default(false), acAvailable: z.boolean().default(false), parkingSlots: z.coerce.number().int().nonnegative().default(0), amenities: z.array(z.string()).max(20).default([]), district: z.string().trim().min(2).max(80), city: z.string().trim().default('Kendari'), province: z.string().trim().default('Sulawesi Tenggara'), addressDetail: z.string().trim().max(400).optional(), postalCode: z.string().trim().max(12).optional(), mapsLink: z.string().url().optional().or(z.literal('')), latitude: z.coerce.number().min(-90).max(90).optional(), longitude: z.coerce.number().min(-180).max(180).optional(), nearbyPlaces: z.array(z.record(z.unknown())).max(20).default([]), certificateType: z.enum(['SHM','SHGB','Girik','Letter C','Adat']).optional(), condition: z.enum(['new','second','need_renovation']).default('second'), furnishing: z.enum(['unfurnished','semi_furnished','furnished']).optional(), canKpr: z.boolean().default(false), isLelang: z.boolean().default(false), lelangType: z.enum(['bank_lelang','lelang_ecommerce','lelang_kpkn']).optional(), takeoverStatus: z.enum(['available','in_progress','sold']).optional(), shmStatus: z.string().trim().max(40).optional(), isBankVerified: z.boolean().default(false), verificationDocuments: z.array(z.string().trim().min(1).max(1024)).max(10).default([]), images: z.array(z.string().url()).max(12).default([]), videoUrl: z.string().url().optional().or(z.literal('')), virtualTourUrl: z.string().url().optional().or(z.literal('')), subsidyProgram: z.string().trim().max(80).optional(), incomeRequirement: z.coerce.number().nonnegative().optional(), auctionStartDate: z.string().optional(), auctionEndDate: z.string().optional(), startingBid: z.coerce.number().nonnegative().optional(), status: z.enum(['draft','pending_review','available','rented','sold','archived','rejected']).optional() });
type PropertyInput = z.infer<typeof propertySchema>;
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Properti belum dapat diproses.';
const slugify = (value: string) => `${value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${crypto.randomUUID().slice(0, 8)}`;

export async function getProperties(filters: { category?: PropertyInput['category']; regency?: string; district?: string; subdistrict?: string; minPrice?: number; maxPrice?: number; certificateTypes?: string[]; canKpr?: boolean; isLelang?: boolean; takeover?: boolean; featured?: boolean; search?: string; page?: number; pageSize?: number } = {}) { try { const supabase = await getServerSupabase(); const pageSize = Math.min(Math.max(filters.pageSize ?? 60, 1), 60); const page = Math.max(filters.page ?? 1, 1); const from = (page - 1) * pageSize; const to = from + pageSize - 1; let query = supabase.from('properties').select('id,seller_id,category,property_type,condition,furnishing,can_kpr,is_lelang,lelang_type,takeover_status,title,description,slug,price,price_type,is_negotiable,land_area_sqm,building_area_sqm,bedrooms,bathrooms,floors,furnished,ac_available,parking_slots,amenities,district,city,province,address_detail,maps_link,latitude,longitude,nearby_places,certificate_type,shm_status,is_bank_verified,is_admin_verified,images,video_url,virtual_tour_url,status,is_featured,views_count,favorites_count,inquiries_count,created_at', { count: 'exact' }).in('status', ['available','rented','sold']).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).range(from, to); if (filters.category) query = query.eq('category', filters.category); if (filters.regency) query = query.eq('regency_name', filters.regency); if (filters.district) query = query.eq('district', filters.district); if (filters.subdistrict) query = query.eq('subdistrict_name', filters.subdistrict); if (filters.certificateTypes?.length) query = query.in('certificate_type', filters.certificateTypes); if (filters.canKpr) query = query.eq('can_kpr', true); if (filters.isLelang) query = query.eq('is_lelang', true); if (filters.takeover) query = query.eq('category', 'takeover_kpr'); if (filters.district) query = query.ilike('district', `%${filters.district}%`); if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice); if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice); if (filters.featured) query = query.eq('is_featured', true); if (filters.search) { const needle = filters.search.replace(/[%_,]/g, '').slice(0, 100); if (needle) query = query.or(`title.ilike.%${needle}%,district.ilike.%${needle}%,city.ilike.%${needle}%`); } const { data, error, count } = await query; if (error) throw error; const rows = data || []; return { ok: true as const, data: rows, hasMore: count == null ? rows.length === pageSize : from + rows.length < count, total: count ?? undefined }; } catch (error) { return { ok: false as const, error: errorMessage(error), data: [], hasMore: false }; } }
export async function getPropertyById(id: string) { try { const { data, error } = await (await getServerSupabase()).from('properties').select('*').eq('id', id).maybeSingle(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
// Properti serupa: filter di SQL (kategori sama + harga ±35%, limit 50),
// skor atribut hanya untuk kandidat — bukan fetch seluruh tabel lalu skor di JS.
export async function getSimilarProperties(input: { id: string; category?: string; price?: number; district?: string; regencyName?: string }) { try { const supabase = await getServerSupabase(); const price = Number(input.price) || 0; let query = supabase.from('properties').select('id,category,title,price,price_type,district,regency_name,city,images,building_area_sqm,bedrooms,bathrooms,certificate_type,can_kpr,is_bank_verified,is_admin_verified,is_featured,views_count,favorites_count').in('status', ['available','rented','sold']).neq('id', input.id).limit(50); if (input.category) query = query.eq('category', input.category); if (price > 0) query = query.gte('price', Math.floor(price * 0.65)).lte('price', Math.ceil(price * 1.35)); const { data, error } = await query; if (error) throw error; const scored = (data || []).map((item: any) => { let score = 0; if (item.district && input.district && item.district === input.district) score += 2; if (item.regency_name && input.regencyName && item.regency_name === input.regencyName) score += 1; if (Array.isArray(item.images) && item.images.length > 0) score += 0.5; return { item, score }; }).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map(entry => entry.item); return { ok: true as const, data: scored }; } catch (error) { return { ok: false as const, error: errorMessage(error), data: [] }; } }
// Saran pencarian: kecamatan + judul dari data nyata (untuk autocomplete omnibox).
export async function getPropertySearchSuggestions(q: string) { try { const needle = q.trim().replace(/[%_,]/g, '').slice(0, 60); if (needle.length < 2) return { ok: true as const, data: [] as { type: 'district' | 'title'; label: string; sub?: string }[] }; const supabase = await getServerSupabase(); const { data, error } = await supabase.from('properties').select('id,title,district,city,category').in('status', ['available','rented','sold']).or(`title.ilike.%${needle}%,district.ilike.%${needle}%`).limit(20); if (error) throw error; const districts = new Map<string, string>(); const titles: { type: 'district' | 'title'; label: string; sub?: string }[] = []; for (const row of data || []) { if (row.district && !districts.has(row.district)) districts.set(row.district, row.city || ''); titles.push({ type: 'title', label: row.title, sub: [row.district, row.city].filter(Boolean).join(', ') }); if (titles.length >= 6) break; } const suggestions = Array.from(districts.entries()).slice(0, 4).map(([label, sub]) => ({ type: 'district' as const, label, sub: sub || undefined })); return { ok: true as const, data: [...suggestions, ...titles].slice(0, 8) }; } catch (error) { return { ok: false as const, error: errorMessage(error), data: [] }; } }
export async function createProperty(input: unknown) { try { const parsed = propertySchema.parse(input); const { supabase, user } = await requireServerUser();
    // Fase 3.3: geocode saat simpan bila koordinat belum diisi. Kegagalan geocode TIDAK menggagalkan insert.
    let geoLat: number | null = parsed.latitude ?? null;
    let geoLng: number | null = parsed.longitude ?? null;
    if (geoLat == null || geoLng == null) {
      const geo = await geocodeAddressNominatim({ addressDetail: parsed.addressDetail, district: parsed.district, city: parsed.city, province: parsed.province }).catch(() => null);
      if (geo) { geoLat = geo.lat; geoLng = geo.lng; }
    }
    const { data, error } = await supabase.from('properties').insert({ seller_id: user.id, category: parsed.category, title: parsed.title, slug: slugify(parsed.title), description: parsed.description || null, price: parsed.price, price_type: parsed.priceType, is_negotiable: parsed.isNegotiable, land_area_sqm: parsed.landAreaSqm ?? null, building_area_sqm: parsed.buildingAreaSqm ?? null, bedrooms: parsed.bedrooms, bathrooms: parsed.bathrooms, floors: parsed.floors, furnished: parsed.furnishing ? parsed.furnishing !== 'unfurnished' : parsed.furnished, ac_available: parsed.acAvailable, parking_slots: parsed.parkingSlots, amenities: parsed.amenities, district: parsed.district, city: parsed.city, province: parsed.province, address_detail: parsed.addressDetail || null, postal_code: parsed.postalCode || null, maps_link: parsed.mapsLink || null, latitude: geoLat, longitude: geoLng, nearby_places: parsed.nearbyPlaces, certificate_type: parsed.certificateType || null, property_type: parsed.category, condition: parsed.condition, furnishing: parsed.furnishing || null, can_kpr: parsed.canKpr, is_lelang: parsed.isLelang || parsed.category === 'properti_lelang', lelang_type: parsed.lelangType || null, takeover_status: parsed.takeoverStatus || null, shm_status: parsed.shmStatus || null, is_bank_verified: parsed.isBankVerified, verification_documents: parsed.verificationDocuments, images: parsed.images, video_url: parsed.videoUrl || null, virtual_tour_url: parsed.virtualTourUrl || null, subsidy_program: parsed.subsidyProgram || null, income_requirement: parsed.incomeRequirement ?? null, auction_start_date: parsed.auctionStartDate || null, auction_end_date: parsed.auctionEndDate || null, starting_bid: parsed.startingBid ?? null, status: 'pending_review', published_at: null }).select('id,title,slug,category,status').single(); if (error) throw error; revalidatePath('/properti'); return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
export async function updateProperty(id: string, input: Partial<PropertyInput>) { try { const { supabase, user } = await requireServerUser(); const roles = await getUserRoles(user.id); const { data: existing, error: ownerError } = await supabase.from('properties').select('seller_id,price').eq('id', id).maybeSingle(); if (ownerError) throw ownerError; if (!canEditListing(user.id, existing ? { seller_id: existing.seller_id } : null, roles)) return { ok: false as const, error: 'Akses ditolak: hanya pemilik atau admin yang dapat mengubah properti ini.' }; const parsedResult = propertySchema.partial().safeParse(input); if (!parsedResult.success) return { ok: false as const, error: 'Data properti tidak valid. Periksa kembali isian Anda.' }; const parsed = parsedResult.data; const row: Record<string, unknown> = {}; for (const [key, value] of Object.entries(parsed)) { const map: Record<string,string> = { priceType:'price_type',isNegotiable:'is_negotiable',landAreaSqm:'land_area_sqm',buildingAreaSqm:'building_area_sqm',acAvailable:'ac_available',parkingSlots:'parking_slots',nearbyPlaces:'nearby_places',certificateType:'certificate_type',isBankVerified:'is_bank_verified',verificationDocuments:'verification_documents',videoUrl:'video_url',virtualTourUrl:'virtual_tour_url',subsidyProgram:'subsidy_program',incomeRequirement:'income_requirement',auctionStartDate:'auction_start_date',auctionEndDate:'auction_end_date',startingBid:'starting_bid',propertyType:'property_type',condition:'condition',furnishing:'furnishing',canKpr:'can_kpr',isLelang:'is_lelang',lelangType:'lelang_type',takeoverStatus:'takeover_status' }; row[map[key] || key] = value; } const { data, error } = await supabase.from('properties').update(row).eq('id', id).select('id,title,status,updated_at').single(); if (error) throw error; revalidatePath('/properti'); revalidatePath(`/properti/${id}`); // Riwayat harga: catat bila harga berubah (best-effort; diam bila tabel migrasi belum ada).
  if (parsed.price !== undefined && existing && Number(existing.price) !== Number(parsed.price)) { try { await supabase.from('property_price_history').insert({ property_id: id, old_price: Number(existing.price), new_price: Number(parsed.price), changed_by: user.id }); } catch { /* tabel belum dimigrasi — abaikan */ } } return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
export async function deleteProperty(id: string) { try { const { supabase, user } = await requireServerUser(); const roles = await getUserRoles(user.id); const { data: existing, error: ownerError } = await supabase.from('properties').select('seller_id').eq('id', id).maybeSingle(); if (ownerError) throw ownerError; if (!canEditListing(user.id, existing ? { seller_id: existing.seller_id } : null, roles)) return { ok: false as const, error: 'Akses ditolak: hanya pemilik atau admin yang dapat menghapus properti ini.' }; const { error } = await supabase.from('properties').delete().eq('id', id); if (error) throw error; revalidatePath('/properti'); revalidatePath(`/properti/${id}`); return { ok: true as const }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
export async function updatePropertyStatus(id: string, status: 'draft'|'pending_review'|'available'|'rented'|'sold'|'archived'|'rejected') { if (status === 'available' || status === 'rejected') return { ok: false as const, error: 'Status available/rejected hanya dapat diubah oleh admin.' }; return updateProperty(id, { status } as Partial<PropertyInput>); }
export async function togglePropertyFavorite(propertyId: string) { try { const { supabase, user } = await requireServerUser(); const { data: existing } = await supabase.from('property_favorites').select('id').eq('user_id', user.id).eq('property_id', propertyId).maybeSingle(); const result = existing ? await supabase.from('property_favorites').delete().eq('id', existing.id) : await supabase.from('property_favorites').insert({ user_id: user.id, property_id: propertyId }); if (result.error) throw result.error; return { ok: true as const, isFavorite: !existing }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
export async function getUserFavoriteProperties() { try { const { supabase, user } = await requireServerUser(); const { data, error } = await supabase.from('property_favorites').select('property_id').eq('user_id', user.id); if (error) throw error; return { ok: true as const, data: (data || []).map(row => row.property_id) }; } catch (error) { return { ok: false as const, error: errorMessage(error), data: [] }; } }
export async function createPropertyInquiry(propertyId: string, message: string, contactMethod: 'chat'|'whatsapp'|'email'|'phone' = 'chat') { try { const { supabase, user } = await requireServerUser(); const parsed = z.string().trim().min(2).max(2000).parse(message); // Anti-spam: cooldown 60 detik per user per properti (tanpa Redis).
    const { data: recent } = await supabase.from('property_inquiries').select('created_at').eq('property_id', propertyId).eq('inquirer_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(); if (recent?.created_at && Date.now() - new Date(recent.created_at).getTime() < 60_000) return { ok: false as const, error: 'Terlalu cepat. Tunggu sebentar sebelum mengirim pesan lagi.' }; const { data, error } = await supabase.from('property_inquiries').insert({ property_id: propertyId, inquirer_id: user.id, message: parsed, contact_method: contactMethod }).select('id,status,created_at').single(); if (error) throw error; if (data?.id) await notifySellerOfInquiry(propertyId, data.id, parsed); return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }
export async function getPropertyInquiries(propertyId: string) { try { const { supabase, user } = await requireServerUser(); const roles = await getUserRoles(user.id); const { data: prop, error: propError } = await supabase.from('properties').select('seller_id').eq('id', propertyId).maybeSingle(); if (propError) throw propError; if (!canEditListing(user.id, prop ? { seller_id: prop.seller_id } : null, roles)) return { ok: false as const, error: 'Akses ditolak: hanya pemilik properti atau admin yang dapat melihat inquiry.', data: [] }; const { data, error } = await supabase.from('property_inquiries').select('id,property_id,inquirer_id,message,contact_method,status,scheduled_viewing_at,created_at').eq('property_id', propertyId); if (error) throw error; return { ok: true as const, data: data || [] }; } catch (error) { return { ok: false as const, error: errorMessage(error), data: [] }; } }
export async function placePropertyBid(propertyId: string, bidAmount: number) { try { const { supabase, user } = await requireServerUser(); const parsed = z.number().positive().parse(bidAmount); const { data, error } = await supabase.from('property_bids').insert({ property_id: propertyId, bidder_id: user.id, bid_amount: parsed }).select('id,bid_amount,created_at').single(); if (error) throw error; return { ok: true as const, data }; } catch (error) { return { ok: false as const, error: errorMessage(error) }; } }


export async function getMyProperties() {
  try {
    const { supabase, user } = await requireServerUser();
    const { data, error } = await supabase.from('properties').select('id,title,category,price,price_type,status,is_admin_verified,verification_documents,images,created_at,updated_at').eq('seller_id', user.id).order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    return { ok: true as const, data: data || [] };
  } catch (error) {
    return { ok: false as const, error: errorMessage(error), data: [] };
  }
}

export async function getMyProperty(id: string) {
  try {
    const { supabase, user } = await requireServerUser();
    const { data, error } = await supabase.from('properties').select('id,title,description,category,price,price_type,is_negotiable,status,is_admin_verified,verification_documents,images,bedrooms,bathrooms,floors,land_area_sqm,building_area_sqm,certificate_type,condition,furnishing,can_kpr,parking_slots,ac_available,furnished,amenities,created_at,updated_at').eq('id', id).eq('seller_id', user.id).maybeSingle();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) {
    return { ok: false as const, error: errorMessage(error), data: null };
  }
}


export async function getMyPropertyInquiries() {
  try {
    const { supabase, user } = await requireServerUser();
    const { data: properties, error: propertyError } = await supabase.from('properties').select('id,title').eq('seller_id', user.id).limit(100);
    if (propertyError) throw propertyError;
    const propertyRows = properties || [];
    const propertyIds = propertyRows.map(row => row.id);
    if (!propertyIds.length) return { ok: true as const, data: [] };
    const { data: inquiries, error } = await supabase.from('property_inquiries').select('id,property_id,inquirer_id,message,contact_method,status,scheduled_viewing_at,created_at').in('property_id', propertyIds).order('created_at', { ascending: false }).limit(100);
    if (error) throw error;
    const titles = new Map(propertyRows.map(row => [row.id, row.title]));
    return { ok: true as const, data: (inquiries || []).map(row => ({ ...row, property_title: titles.get(row.property_id) || 'Properti' })) };
  } catch (error) {
    return { ok: false as const, error: errorMessage(error), data: [] };
  }
}

export async function updateMyPropertyInquiryStatus(id: string, status: 'new' | 'contacted' | 'scheduled' | 'closed') {
  try {
    const { supabase, user } = await requireServerUser();
    const { data: owned } = await supabase.from('properties').select('id').eq('seller_id', user.id).limit(100);
    const propertyIds = (owned || []).map(row => row.id);
    const { data, error } = await supabase.from('property_inquiries').update({ status }).eq('id', id).in('property_id', propertyIds).select('id,status').single();
    if (error) throw error;
    return { ok: true as const, data };
  } catch (error) {
    return { ok: false as const, error: errorMessage(error) };
  }
}


async function notifySellerOfInquiry(propertyId: string, inquiryId: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || process.env.EMAIL_FROM;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!apiKey || !from || !supabaseUrl || !serviceRoleKey) return;
  try {
    const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data: property } = await admin.from('properties').select('seller_id,title').eq('id', propertyId).maybeSingle();
    if (!property?.seller_id) return;
    const { data: contact } = await admin.from('profile_contacts').select('email').eq('profile_id', property.seller_id).maybeSingle();
    if (!contact?.email) return;
    const replyTo = process.env.EMAIL_REPLY_TO;
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [contact.email], ...(replyTo ? { reply_to: replyTo } : {}), subject: `Inquiry baru untuk ${property.title}`, text: `Ada inquiry baru untuk property ${property.title}.\n\nPesan:\n${message}\n\nBuka dashboard seller untuk menindaklanjuti: /dashboard/inquiries\nID inquiry: ${inquiryId}` }),
    });
    if (!response.ok) console.error('Resend inquiry notification failed', response.status);
  } catch (error) {
    console.error('Resend inquiry notification unavailable', error);
  }
}
