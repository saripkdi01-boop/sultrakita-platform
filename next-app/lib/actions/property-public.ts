'use server';

import { getServerSupabase } from '@/lib/supabase/server';

const demoProperties = {
  'demo-1': { id: 'demo-1', category: 'rumah_second', certificate_type: 'SHM', can_kpr: true, is_lelang: false, lelang_type: null, takeover_status: null, is_bank_verified: false, is_admin_verified: false, images: [], seller: null, is_demo: true, title: 'Rumah Modern Dekat Pusat Kendari', description: 'Contoh listing untuk pratinjau alur properti publik.', price: 45000000, price_type: 'per_tahun', subdistrict_name: 'Mokoau', regency_name: 'Kota Kendari', district: 'Kambu', city: 'Kendari', bedrooms: 3, bathrooms: 2, building_area_sqm: 120, is_featured: true, views_count: 128, favorites_count: 12 },
  'demo-2': { id: 'demo-2', category: 'kos_kosan', certificate_type: 'SHM', can_kpr: false, is_lelang: false, lelang_type: null, takeover_status: null, is_bank_verified: false, is_admin_verified: false, images: [], seller: null, is_demo: true, title: 'Kos Eksklusif Furnished Mandonga', description: 'Contoh listing untuk pratinjau alur properti publik.', price: 1800000, price_type: 'per_bulan', subdistrict_name: 'Mandonga', regency_name: 'Kota Kendari', district: 'Mandonga', city: 'Kendari', bedrooms: 1, bathrooms: 1, building_area_sqm: 24, furnished: true, views_count: 86, favorites_count: 8 },
} as const;

export async function getPublicPropertyById(id: string) {
  if (id in demoProperties) return demoProperties[id as keyof typeof demoProperties];
  const { data, error } = await (await getServerSupabase())
    .from('properties')
    .select('id,seller_id,category,property_type,condition,furnishing,can_kpr,is_lelang,lelang_type,takeover_status,title,description,price,price_type,land_area_sqm,building_area_sqm,bedrooms,bathrooms,furnished,ac_available,parking_slots,amenities,regency_name,subdistrict_name,district,city,province,address_detail,maps_link,latitude,longitude,nearby_places,certificate_type,shm_status,is_bank_verified,is_admin_verified,images,video_url,virtual_tour_url,status,is_featured,views_count,favorites_count,inquiries_count,created_at,seller:profiles!seller_id(full_name,avatar_url,phone)')
    .eq('id', id)
    .eq('status', 'available')
    .maybeSingle();

  if (error) throw error;
  return data;
}
