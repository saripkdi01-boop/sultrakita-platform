import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, internalError, notFound } from '@/lib/api-error';
import { getPublicPropertyById } from '@/lib/actions/property-public';

// GET /api/properti/[id] — detail properti publik (hanya status available).
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;

  const { id } = await params;
  if (!id || id.length > 64) return badRequest(request, 'ID properti tidak valid.');

  try {
    const property = await getPublicPropertyById(id).catch(() => null);
    if (!property) return notFound(request, 'Properti tidak ditemukan.');
    const { seller_id, ...rest } = property as Record<string, unknown>;
    return NextResponse.json(
      { data: rest },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
    );
  } catch (error) {
    return internalError(request, undefined, error);
  }
}
