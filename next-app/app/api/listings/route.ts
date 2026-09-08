import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const fallbackListings = [
  { id: 'demo-tenun', title: 'Kain Tenun Buton Premium', description: 'Tenun lokal pilihan dari Baubau.', price: 450000, district: 'Baubau', city: 'Baubau', condition: 'new', is_featured: true, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-kuliner', title: 'Paket Ikan Bakar Sambal', description: 'Rasa lokal untuk keluarga.', price: 120000, district: 'Kendari', city: 'Kendari', condition: 'new', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-wakatobi', title: 'Paket Snorkeling Wakatobi', description: 'Jelajah laut Wakatobi bersama pemandu lokal.', price: 350000, district: 'Wakatobi', city: 'Wakatobi', condition: 'good', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const queryText = params.get('q')?.trim(); const district = params.get('district')?.trim(); const category = params.get('category')?.trim();
  const rawMinPrice = params.get('minPrice'); const rawMaxPrice = params.get('maxPrice');
  const minPrice = Number(rawMinPrice); const maxPrice = Number(rawMaxPrice); const limit = Math.min(Math.max(Number(params.get('limit')) || 30, 1), 50);
  if ((rawMinPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) || (rawMaxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))) return NextResponse.json({ ok: false, error: 'invalid_price_filter' }, { status: 400 });
  if (rawMinPrice !== null && rawMaxPrice !== null && minPrice > maxPrice) return NextResponse.json({ ok: false, error: 'invalid_price_range' }, { status: 400 });
  try {
    let query = (await getServerSupabase()).from('listings').select('id,title,description,price,images,thumbnail_url,district,city,condition,is_featured,created_at').in('status', ['published', 'active']).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(limit);
    if (queryText) query = query.or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`);
    if (district && district !== 'Semua distrik') query = query.eq('district', district);
    // Category labels are resolved by the marketplace UI; UUID category filters can be added here when supplied.
    if (Number.isFinite(minPrice) && minPrice > 0) query = query.gte('price', minPrice);
    if (Number.isFinite(maxPrice) && maxPrice > 0) query = query.lte('price', maxPrice);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ ok: true, data: data || [], filters: { q: queryText || '', district: district || '', category: category || '' } });
  } catch (error) {
    if (process.env.ALLOW_DEMO_DATA === 'true' && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: true, data: fallbackListings, source: 'demo', warning: 'Mode demo lokal aktif.' });
    return NextResponse.json({ ok: false, data: [], source: 'unavailable', warning: 'Listing sementara belum tersedia. Silakan coba lagi nanti.' }, { status: 503 });
  }
}
