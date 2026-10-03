'use server';

// Fase 3: query geo properti.
// Jalur utama memakai PostGIS via RPC (dibuat oleh migrasi 20261001080000).
// Bila RPC/extensi belum tersedia, otomatis fallback ke perbandingan
// latitude/longitude biasa — peta tetap berfungsi.

import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { haversineKm } from '@/lib/geo';

const PROPERTY_COLUMNS = 'id,seller_id,category,property_type,condition,furnishing,can_kpr,is_lelang,lelang_type,takeover_status,title,description,slug,price,price_type,is_negotiable,land_area_sqm,building_area_sqm,bedrooms,bathrooms,floors,furnished,ac_available,parking_slots,amenities,district,city,province,address_detail,maps_link,latitude,longitude,nearby_places,certificate_type,shm_status,is_bank_verified,is_admin_verified,images,video_url,virtual_tour_url,status,is_featured,views_count,favorites_count,inquiries_count,created_at';

const boundsSchema = z.object({
  minLat: z.coerce.number().min(-90).max(90),
  minLng: z.coerce.number().min(-180).max(180),
  maxLat: z.coerce.number().min(-90).max(90),
  maxLng: z.coerce.number().min(-180).max(180),
  category: z.string().trim().min(1).max(40).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().int().min(1).max(300).default(200),
}).refine(data => data.minLat <= data.maxLat && data.minLng <= data.maxLng, 'Batas peta tidak valid.');

export type GeoSource = 'postgis' | 'fallback' | 'none';

// Cari properti di dalam bounding box viewport peta (+ filter opsional).
export async function searchPropertiesInBounds(input: unknown): Promise<{ ok: boolean; data: any[]; source: GeoSource; error?: string }> {
  const parsed = boundsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, data: [], source: 'none', error: 'Batas peta tidak valid.' };
  const f = parsed.data;
  const supabase = await getServerSupabase();

  try {
    const { data, error } = await supabase.rpc('properties_in_bbox', {
      p_min_lng: f.minLng, p_min_lat: f.minLat, p_max_lng: f.maxLng, p_max_lat: f.maxLat,
      p_category: f.category ?? null, p_min_price: f.minPrice ?? null, p_max_price: f.maxPrice ?? null, p_limit: f.limit,
    });
    if (error) throw error;
    return { ok: true, data: data || [], source: 'postgis' };
  } catch {
    try {
      let query = supabase.from('properties').select(PROPERTY_COLUMNS)
        .in('status', ['available', 'rented', 'sold'])
        .gte('latitude', f.minLat).lte('latitude', f.maxLat)
        .gte('longitude', f.minLng).lte('longitude', f.maxLng);
      if (f.category) query = query.eq('category', f.category);
      if (f.minPrice !== undefined) query = query.gte('price', f.minPrice);
      if (f.maxPrice !== undefined) query = query.lte('price', f.maxPrice);
      const { data, error } = await query
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(f.limit);
      if (error) throw error;
      return { ok: true, data: data || [], source: 'fallback' };
    } catch {
      return { ok: false, data: [], source: 'none', error: 'Pencarian area peta belum tersedia. Coba lagi nanti.' };
    }
  }
}

// Pencarian dalam radius (lingkaran) dari sebuah titik — murni di level kode,
// tanpa migrasi: bbox pendekatan dari radius, lalu filter haversine eksak di JS.
// Dipakai kontrol "radius" pada peta /properti.
const radiusSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(0.5).max(100),
  category: z.string().trim().min(1).max(40).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  limit: z.coerce.number().int().min(1).max(300).default(200),
});

export async function searchPropertiesInRadius(input: unknown): Promise<{ ok: boolean; data: any[]; source: GeoSource; error?: string }> {
  const parsed = radiusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, data: [], source: 'none', error: 'Radius pencarian tidak valid.' };
  const { lat, lng, radiusKm, category, minPrice, maxPrice, limit } = parsed.data;
  // Kotak pendekatan: 1° lintang ≈ 111 km; bujur disesuaikan cosinus lintang.
  const dLat = radiusKm / 111;
  const dLng = radiusKm / (111 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
  const boundsResult = await searchPropertiesInBounds({
    minLat: lat - dLat,
    maxLat: lat + dLat,
    minLng: lng - dLng,
    maxLng: lng + dLng,
    category,
    minPrice,
    maxPrice,
    limit: Math.min(300, limit * 2),
  });
  if (!boundsResult.ok) return boundsResult;
  // Filter lingkaran eksak + urutkan dari terdekat. Hanya koordinat nyata
  // (tanpa centroid tebakan) agar "dalam radius X km" benar-benar jujur.
  const rows = (boundsResult.data as any[])
    .filter(row => row.latitude != null && row.longitude != null)
    .map(row => ({ ...row, _distanceKm: haversineKm(lat, lng, Number(row.latitude), Number(row.longitude)) }))
    .filter(row => row._distanceKm <= radiusKm + 1e-6)
    .sort((a, b) => a._distanceKm - b._distanceKm)
    .slice(0, limit);
  return { ok: true, data: rows, source: boundsResult.source };
}

const nearbySchema = z.object({
  id: z.string().trim().min(1).max(64),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radiusKm: z.coerce.number().min(0.5).max(100).default(10),
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

// "Serupa di dekat sini" untuk halaman detail properti.
export async function getNearbyProperties(input: unknown): Promise<{ ok: boolean; data: any[]; source: GeoSource; error?: string }> {
  const parsed = nearbySchema.safeParse(input);
  if (!parsed.success) return { ok: false, data: [], source: 'none', error: 'Lokasi tidak valid.' };
  const { id, lat, lng, radiusKm, limit } = parsed.data;
  const supabase = await getServerSupabase();

  try {
    const { data, error } = await supabase.rpc('properties_nearby', {
      p_lat: lat, p_lng: lng, p_radius_km: radiusKm, p_exclude_id: id, p_limit: limit,
    });
    if (error) throw error;
    return { ok: true, data: data || [], source: 'postgis' };
  } catch {
    try {
      // Fallback tanpa PostGIS: ambil kandidat dalam kotak kasar, urutkan via haversine di JS.
      const dLat = radiusKm / 111;
      const dLng = radiusKm / (111 * Math.max(0.2, Math.cos((lat * Math.PI) / 180)));
      const { data, error } = await supabase.from('properties').select(PROPERTY_COLUMNS)
        .in('status', ['available', 'rented', 'sold'])
        .neq('id', id)
        .gte('latitude', lat - dLat).lte('latitude', lat + dLat)
        .gte('longitude', lng - dLng).lte('longitude', lng + dLng)
        .limit(60);
      if (error) throw error;
      const ranked = (data || [])
        .filter(row => row.latitude != null && row.longitude != null)
        .map(row => ({ ...row, _distanceKm: haversineKm(lat, lng, Number(row.latitude), Number(row.longitude)) }))
        .filter(row => row._distanceKm <= radiusKm)
        .sort((a, b) => a._distanceKm - b._distanceKm)
        .slice(0, limit);
      return { ok: true, data: ranked, source: 'fallback' };
    } catch {
      return { ok: false, data: [], source: 'none', error: 'Properti di sekitar belum tersedia.' };
    }
  }
}
