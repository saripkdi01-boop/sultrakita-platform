'use server';

import { getServerSupabase } from '@/lib/supabase/server';

// Fase 0 (2026-10-01): data contoh demo-1/demo-2 dicabut dari produksi.
// ID yang tidak ada di database kini mengembalikan null -> pemanggil me-render notFound().

export async function getPublicPropertyById(id: string) {
  const supabase = await getServerSupabase();
  // Catatan: FK properties.seller_id menunjuk ke auth.users (bukan public.profiles),
  // sehingga join `seller:profiles!seller_id(...)` selalu 400 (PGRST200) dan membuat
  // SEMUA halaman /properti/[id] 404. Profil seller diambil terpisah.
  const { data, error } = await supabase
    .from('properties')
    .select('id,seller_id,category,property_type,condition,furnishing,can_kpr,is_lelang,lelang_type,takeover_status,title,description,price,price_type,land_area_sqm,building_area_sqm,bedrooms,bathrooms,furnished,ac_available,parking_slots,amenities,regency_name,subdistrict_name,district,city,province,address_detail,maps_link,latitude,longitude,nearby_places,certificate_type,shm_status,is_bank_verified,is_admin_verified,images,video_url,virtual_tour_url,status,is_featured,views_count,favorites_count,inquiries_count,created_at')
    .eq('id', id)
    .eq('status', 'available')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  let seller: { full_name?: string | null; avatar_url?: string | null; phone?: string | null } | null = null;
  if (data.seller_id) {
    // Audit 2026-10-06 (P0-SEC): kolom profiles.phone tidak lagi terbaca
    // publik langsung (GRANT kolom dicabut). Profil publik diambil seperti
    // biasa, phone seller diambil via RPC get_seller_contact yang hanya
    // mengembalikan phone bila seller punya listing aktif.
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name,avatar_url')
      .eq('id', data.seller_id)
      .maybeSingle();
    let phone: string | null = null;
    try {
      const { data: contact } = await supabase.rpc('get_seller_contact', {
        seller: data.seller_id,
      });
      const row = Array.isArray(contact) ? contact[0] : contact;
      phone = (row as { phone?: string | null } | null)?.phone ?? null;
    } catch {
      phone = null;
    }
    seller = { ...(profile ?? {}), phone };
  }
  return { ...data, seller };
}
