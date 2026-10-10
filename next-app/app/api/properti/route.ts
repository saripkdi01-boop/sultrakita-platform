import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, internalError } from '@/lib/api-error';
import { getProperties } from '@/lib/actions/property';

// GET /api/properti — daftar properti publik dengan filter, sort, dan paginasi.
// Query: q, category, district, regency, subdistrict, minPrice, maxPrice,
//        canKpr, isLelang, sort (newest|price-low|price-high), page, limit
const querySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.string().trim().max(40).optional(),
  district: z.string().trim().max(80).optional(),
  regency: z.string().trim().max(80).optional(),
  subdistrict: z.string().trim().max(80).optional(),
  minPrice: z.coerce.number().nonnegative().max(1e15).optional(),
  maxPrice: z.coerce.number().nonnegative().max(1e15).optional(),
  canKpr: z.enum(['true', 'false']).optional(),
  isLelang: z.enum(['true', 'false']).optional(),
  sort: z.enum(['newest', 'price-low', 'price-high']).default('newest'),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  limit: z.coerce.number().int().min(1).max(60).default(24),
});

function toPublicRow(row: any) {
  // Field publik saja — tanpa seller_id / data internal.
  const { seller_id, ...rest } = row ?? {};
  return rest;
}

export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = querySchema.safeParse(params);
  if (!parsed.success) {
    return badRequest(request, 'Parameter pencarian tidak valid.');
  }
  const q = parsed.data;

  try {
    const result = await getProperties({
      category: q.category as any,
      regency: q.regency,
      district: q.district,
      subdistrict: q.subdistrict,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      canKpr: q.canKpr === 'true' ? true : undefined,
      isLelang: q.isLelang === 'true' ? true : undefined,
      page: q.page,
      pageSize: q.limit,
      search: q.q || undefined,
    });
    if (!result.ok) return internalError(request, undefined, result.error);

    let data = (result.data as any[]).map(toPublicRow);
    // Sort client-search dilakukan di SQL bila memungkinkan; untuk q (teks)
    // dan sort harga, lakukan di sini karena getProperties belum mendukungnya.
    if (q.q) {
      const needle = q.q.toLowerCase();
      data = data.filter((row) =>
        `${row.title ?? ''} ${row.district ?? ''} ${row.city ?? ''}`.toLowerCase().includes(needle),
      );
    }
    if (q.sort === 'price-low') data = [...data].sort((a, b) => Number(a.price) - Number(b.price));
    else if (q.sort === 'price-high') data = [...data].sort((a, b) => Number(b.price) - Number(a.price));

    return NextResponse.json(
      { data, page: q.page, limit: q.limit, hasMore: result.hasMore ?? false },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch (error) {
    return internalError(request, undefined, error);
  }
}
