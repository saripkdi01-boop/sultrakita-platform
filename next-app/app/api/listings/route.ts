import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const queryText = params.get('q')?.trim(); const district = params.get('district')?.trim(); const category = params.get('category')?.trim();
  const minPrice = Number(params.get('minPrice')); const maxPrice = Number(params.get('maxPrice')); const limit = Math.min(Math.max(Number(params.get('limit')) || 30, 1), 50);
  try {
    let query = getServerSupabase().from('listings').select('id,title,description,price,images,thumbnail_url,district,city,condition,is_featured,created_at').in('status', ['published', 'active']).order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(limit);
    if (queryText) query = query.or(`title.ilike.%${queryText}%,description.ilike.%${queryText}%`);
    if (district && district !== 'Semua distrik') query = query.eq('district', district);
    // Category labels are resolved by the marketplace UI; UUID category filters can be added here when supplied.
    if (Number.isFinite(minPrice) && minPrice > 0) query = query.gte('price', minPrice);
    if (Number.isFinite(maxPrice) && maxPrice > 0) query = query.lte('price', maxPrice);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ ok: true, data: data || [], filters: { q: queryText || '', district: district || '', category: category || '' } });
  } catch (error) {
    return NextResponse.json({ ok: false, data: [], error: error instanceof Error ? error.message : 'Listing belum dapat dimuat.' }, { status: 503 });
  }
}
