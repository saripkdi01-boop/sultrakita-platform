'use server';

import { getServerSupabase } from '@/lib/supabase/server';

// Fase 0 (2026-10-01): data contoh demo-1/demo-2 dicabut dari produksi.
// ID yang tidak ada di database kini mengembalikan null -> pemanggil me-render notFound().

export async function getPublicPropertyById(id: string) {
  const { data, error } = await (await getServerSupabase())
    .from('properties')
    .select('id,seller_id,category,property_type,condition,furnishing,can_kpr,is_lelang,lelang_type,takeover_status,title,description,price,price_type,land_area_sqm,building_area_sqm,bedrooms,bathrooms,furnished,ac_available,parking_slots,amenities,regency_name,subdistrict_name,district,city,province,address_detail,maps_link,latitude,longitude,nearby_places,certificate_type,shm_status,is_bank_verified,is_admin_verified,images,video_url,virtual_tour_url,status,is_featured,views_count,favorites_count,inquiries_count,created_at,seller:profiles!seller_id(full_name,avatar_url,phone)')
    .eq('id', id)
    .eq('status', 'available')
    .maybeSingle();

  if (error) throw error;
  return data;
}
