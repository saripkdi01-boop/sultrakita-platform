import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { apiError, badRequest } from '@/lib/api-error';
import { fetchPublicListings } from '@/lib/listings-query';

// Data contoh hanya untuk development lokal: tampil HANYA bila
// ALLOW_DEMO_DATA=true DAN bukan production, dengan label jelas.
const fallbackListings = [
  { id: 'demo-tenun', title: 'Kain Tenun Buton Premium', description: 'Tenun lokal pilihan dari Baubau.', price: 450000, district: 'Baubau', city: 'Baubau', condition: 'new', is_featured: true, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-kuliner', title: 'Paket Ikan Bakar Sambal', description: 'Rasa lokal untuk keluarga.', price: 120000, district: 'Kendari', city: 'Kendari', condition: 'new', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
  { id: 'demo-wakatobi', title: 'Paket Snorkeling Wakatobi', description: 'Jelajah laut Wakatobi bersama pemandu lokal.', price: 350000, district: 'Wakatobi', city: 'Wakatobi', condition: 'good', is_featured: false, is_demo: true, images: [], thumbnail_url: null },
];

export async function GET(request: NextRequest) {
  // Fase 1.5: batasi 60 request/menit per IP untuk API publik.
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const rawMinPrice = params.get('minPrice'); const rawMaxPrice = params.get('maxPrice');
  const minPrice = Number(rawMinPrice); const maxPrice = Number(rawMaxPrice);
  if ((rawMinPrice !== null && (!Number.isFinite(minPrice) || minPrice < 0)) || (rawMaxPrice !== null && (!Number.isFinite(maxPrice) || maxPrice < 0))) return badRequest(request, 'Filter harga minimum/maksimum tidak valid.');
  if (rawMinPrice !== null && rawMaxPrice !== null && minPrice > maxPrice) return badRequest(request, 'Harga minimum tidak boleh lebih besar dari maksimum.');
  // Query terpusat di lib/listings-query.ts (satu sumber kebenaran dengan SSR halaman).
  const result = await fetchPublicListings({
    q: params.get('q') || undefined,
    district: params.get('district') || undefined,
    category: params.get('category') || undefined,
    condition: params.get('condition') || undefined,
    minPrice: rawMinPrice !== null && Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: rawMaxPrice !== null && Number.isFinite(maxPrice) ? maxPrice : undefined,
    limit: Number(params.get('limit')) || 30,
  });
  if (!result.ok) {
    if (process.env.ALLOW_DEMO_DATA === 'true' && process.env.NODE_ENV !== 'production') return NextResponse.json({ ok: true, data: fallbackListings, source: 'demo', warning: 'Mode demo lokal aktif.' });
    // Format error konsisten Fase 1.4: { error: { code, message, requestId } }.
    return apiError('SERVICE_UNAVAILABLE', 'Listing sementara belum tersedia. Silakan coba lagi nanti.', 503, request, { source: 'unavailable' });
  }
  if ('warning' in result) return NextResponse.json({ ok: true, data: [], filters: result.filters, warning: result.warning });
  return NextResponse.json({ ok: true, data: result.items, filters: result.filters });
}
