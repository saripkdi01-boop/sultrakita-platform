import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, getRequestId, serviceUnavailable } from '@/lib/api-error';
import { logError } from '@/lib/log-error';
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS, sourcesForCategory, type NewsCategory } from '@/lib/news/sources';
import { getNews } from '@/lib/news/rss';

export const dynamic = 'force-dynamic';

const querySchema = z.object({
  category: z.enum(NEWS_CATEGORIES as [NewsCategory, ...NewsCategory[]]).default('semua'),
  limit: z.coerce.number().int().min(1).max(12).default(12),
});

/**
 * GET /api/news?category=teknologi&limit=12
 *
 * Agregasi headline dari feed RSS publik terverifikasi
 * (baca: lib/news/sources.ts). Kategori tanpa sumber terverifikasi
 * (mis. komunitas) mengembalikan items kosong + comingSoon:true
 * (jujur — feed-nya memang belum ada).
 *
 * Balikan sukses:
 *   { ok:true, category, categoryLabel, items:[{id,title,link,excerpt,
 *     sourceId,sourceName,publishedAt,image}], sources:[{id,name,siteUrl}],
 *     stale, fetchedAt, comingSoon? }
 * `image` = URL gambar dari field feed (enclosure/media:content/
 * media:thumbnail), null bila feed tidak menyediakannya. Gambar milik
 * penerbit dan dimuat dari CDN resmi mereka.
 */
export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  const parsed = querySchema.safeParse({
    category: request.nextUrl.searchParams.get('category') ?? undefined,
    limit: request.nextUrl.searchParams.get('limit') ?? undefined,
  });
  if (!parsed.success) return badRequest(request, 'Kategori berita tidak valid.');
  const { category, limit } = parsed.data;

  const sources = sourcesForCategory(category);
  if (sources.length === 0) {
    // Jujur: kanal ini belum punya sumber terverifikasi.
    return NextResponse.json(
      {
        ok: true,
        category,
        categoryLabel: NEWS_CATEGORY_LABELS[category],
        items: [],
        sources: [],
        stale: false,
        fetchedAt: new Date().toISOString(),
        comingSoon: true,
        message: `Kanal ${NEWS_CATEGORY_LABELS[category]} segera hadir — kami sedang menyiapkan sumber beritanya.`,
      },
      { headers: { 'Cache-Control': 'public, max-age=300' } },
    );
  }

  try {
    const result = await getNews(category);
    return NextResponse.json(
      {
        ok: true,
        category,
        categoryLabel: NEWS_CATEGORY_LABELS[category],
        items: result.items.slice(0, limit),
        sources: sources.map((s) => ({ id: s.id, name: s.name, siteUrl: s.siteUrl })),
        stale: result.stale,
        fetchedAt: result.fetchedAt,
      },
      { headers: { 'Cache-Control': 'public, max-age=600, stale-while-revalidate=600' } },
    );
  } catch (error) {
    logError({ route: '/api/news', requestId: getRequestId(request), extra: { category } }, error);
    return serviceUnavailable(request, 'Portal berita tidak dapat dijangkau saat ini. Coba lagi beberapa menit lagi.');
  }
}
