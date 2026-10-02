import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, serviceUnavailable, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { BUSINESS_CATEGORIES, fetchPublicBusinesses } from '@/lib/businesses-query';

// ---------------------------------------------------------------------
// Helper bersama
// ---------------------------------------------------------------------

/** True bila error menandakan skema direktori bisnis belum terpasang (migrasi belum jalan). */
function isSetupIncomplete(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  // PGRST205: tabel/view tidak ditemukan · PGRST202: fungsi RPC tidak ditemukan
  // 42P01: relation does not exist (Postgres)
  if (record.code === 'PGRST205' || record.code === 'PGRST202' || record.code === '42P01') return true;
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : '';
  return message.includes('does not exist') && (message.includes('relation') || message.includes('business'));
}

// ---------------------------------------------------------------------
// Validasi (zod)
// ---------------------------------------------------------------------

const DAY_KEYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'] as const;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const PHONE_RE = /^[+0-9()\-\s]{6,20}$/;

const categorySchema = z
  .string()
  .trim()
  .refine(
    (value) => BUSINESS_CATEGORIES.some((entry) => entry.value === value),
    'Kategori bisnis tidak valid.',
  );

const dayHoursSchema = z.object({
  open: z.string().regex(TIME_RE, 'Jam buka harus berformat HH:MM.'),
  close: z.string().regex(TIME_RE, 'Jam tutup harus berformat HH:MM.'),
});

/** Jam operasional: objek dengan key senin..minggu; tiap nilai null atau {open, close}. */
const hoursSchema = z
  .record(z.string(), z.unknown())
  .refine(
    (value) =>
      Object.entries(value).every(([day, hours]) => {
        if (!(DAY_KEYS as readonly string[]).includes(day)) return false;
        if (hours === null) return true;
        return dayHoursSchema.safeParse(hours).success;
      }),
    { message: 'Jam operasional tidak valid. Gunakan hari senin–minggu dengan nilai null atau jam HH:MM.' },
  );

const businessFieldSchemas = {
  name: z.string().trim().min(3, 'Nama bisnis minimal 3 karakter.').max(120, 'Nama bisnis maksimal 120 karakter.'),
  category: categorySchema,
  description: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter.').optional(),
  address: z.string().trim().max(300, 'Alamat maksimal 300 karakter.').optional(),
  city: z.string().trim().max(80, 'Nama kota maksimal 80 karakter.').optional(),
  province: z.string().trim().max(80, 'Nama provinsi maksimal 80 karakter.').optional(),
  phone: z.string().trim().regex(PHONE_RE, 'Nomor telepon tidak valid.').optional(),
  whatsapp: z.string().trim().regex(PHONE_RE, 'Nomor WhatsApp tidak valid.').optional(),
  email: z.string().trim().email('Alamat email tidak valid.').max(120, 'Email maksimal 120 karakter.').optional(),
  website: z.string().trim().url('Alamat website tidak valid.').max(300, 'Website maksimal 300 karakter.').optional(),
  logo_url: z.string().trim().max(500, 'URL logo maksimal 500 karakter.').optional(),
  cover_url: z.string().trim().max(500, 'URL sampul maksimal 500 karakter.').optional(),
  hours: hoursSchema.optional(),
  latitude: z.number().min(-90, 'Latitude harus antara -90 dan 90.').max(90, 'Latitude harus antara -90 dan 90.').optional(),
  longitude: z.number().min(-180, 'Longitude harus antara -180 dan 180.').max(180, 'Longitude harus antara -180 dan 180.').optional(),
};

const businessCreateSchema = z.object({
  ...businessFieldSchemas,
  city: businessFieldSchemas.city.default('Kendari'),
  province: businessFieldSchemas.province.default('Sulawesi Tenggara'),
});

/**
 * GET /api/businesses?q=&category=&city=&page=&limit=
 * Daftar bisnis publik (hanya status approved).
 * Balikan: { ok, data, pagination: { page, limit, total, totalPages } }.
 */
export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const limit = Math.min(50, Math.max(1, Math.floor(Number(params.get('limit')) || 12)));
  try {
    const result = await fetchPublicBusinesses({
      q: params.get('q') || undefined,
      category: params.get('category') || undefined,
      city: params.get('city') || undefined,
      page,
      limit,
    });
    return NextResponse.json(
      {
        ok: true,
        data: result.items,
        pagination: { page: result.page, limit: result.limit, total: result.total, totalPages: result.totalPages },
      },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
    );
  } catch (error) {
    if (isSetupIncomplete(error)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
    return internalError(request, 'Direktori bisnis belum dapat dimuat.', error);
  }
}

/**
 * POST /api/businesses
 * Daftarkan bisnis baru (login). Status awal 'pending' — menunggu kurasi admin.
 * Balikan: 201 { ok, data: { id, slug, status } }.
 */
export async function POST(request: NextRequest) {
  let supabase;
  let userId: string;
  try {
    ({ supabase, user: { id: userId } } = await requireServerUser());
  } catch {
    return unauthorized(request);
  }
  // Rate limit ketat per user untuk pembuatan bisnis.
  const limited = await checkRateLimit(request, 'api', `business-create:${userId}`);
  if (limited) return limited;
  if (!verifyCsrfToken(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest(request, 'Format data tidak valid.');
  }
  const parsed = businessCreateSchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Data bisnis tidak valid.');

  try {
    const { data: slugData, error: slugError } = await supabase.rpc('generate_business_slug', {
      p_name: parsed.data.name,
    });
    if (slugError) {
      if (isSetupIncomplete(slugError)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Bisnis belum dapat didaftarkan.', slugError);
    }
    const slug = typeof slugData === 'string' && slugData.trim() ? slugData.trim() : null;
    if (!slug) return internalError(request, 'Bisnis belum dapat didaftarkan.');

    const { name, category, description, address, city, province, phone, whatsapp, email, website, logo_url, cover_url, hours, latitude, longitude } = parsed.data;
    const { data: created, error: insertError } = await supabase
      .from('businesses')
      .insert({
        owner_id: userId,
        name,
        category,
        description: description ?? null,
        address: address ?? null,
        city,
        province,
        phone: phone ?? null,
        whatsapp: whatsapp ?? null,
        email: email ?? null,
        website: website ?? null,
        logo_url: logo_url ?? null,
        cover_url: cover_url ?? null,
        hours: hours ?? null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        slug,
        status: 'pending',
      })
      .select('id,slug,status')
      .single();
    if (insertError) {
      if (isSetupIncomplete(insertError)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Bisnis belum dapat didaftarkan.', insertError);
    }
    return NextResponse.json(
      { ok: true, data: { id: created.id, slug: created.slug, status: created.status } },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return internalError(request, 'Bisnis belum dapat didaftarkan.', error);
  }
}
