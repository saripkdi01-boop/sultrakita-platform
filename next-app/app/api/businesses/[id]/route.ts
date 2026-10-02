import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, notFound, serviceUnavailable, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { BUSINESS_CATEGORIES } from '@/lib/businesses-query';

// ---------------------------------------------------------------------
// Helper bersama
// ---------------------------------------------------------------------

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True bila error menandakan skema direktori bisnis belum terpasang (migrasi belum jalan). */
function isSetupIncomplete(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  if (record.code === 'PGRST205' || record.code === 'PGRST202' || record.code === '42P01') return true;
  const message = typeof record.message === 'string' ? record.message.toLowerCase() : '';
  return message.includes('does not exist') && (message.includes('relation') || message.includes('business'));
}

type ServerSupabase = Awaited<ReturnType<typeof getServerSupabase>>;

const PUBLIC_BUSINESS_COLUMNS = [
  'id', 'name', 'slug', 'category', 'description', 'city', 'province', 'address',
  'phone', 'whatsapp', 'email', 'website', 'logo_url', 'cover_url', 'hours',
  'latitude', 'longitude', 'is_verified', 'is_featured', 'view_count', 'created_at',
] as const;

/** Proyeksi kolom publik — owner_id/status tidak pernah ikut ke publik. */
function toPublicBusiness(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of PUBLIC_BUSINESS_COLUMNS) out[key] = row[key] ?? null;
  return out;
}

/** 'owner' bila row milik user, 'admin' bila role admin/super_admin, selain itu null. */
async function resolveAccess(
  supabase: ServerSupabase,
  row: Record<string, unknown>,
  userId: string,
): Promise<'owner' | 'admin' | null> {
  if (row.owner_id === userId) return 'owner';
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  const role = (profile as { role?: unknown } | null)?.role;
  return role === 'admin' || role === 'super_admin' ? 'admin' : null;
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

const businessUpdateSchema = z
  .object({
    name: z.string().trim().min(3, 'Nama bisnis minimal 3 karakter.').max(120, 'Nama bisnis maksimal 120 karakter.'),
    category: categorySchema,
    description: z.string().trim().max(2000, 'Deskripsi maksimal 2000 karakter.'),
    address: z.string().trim().max(300, 'Alamat maksimal 300 karakter.'),
    city: z.string().trim().max(80, 'Nama kota maksimal 80 karakter.'),
    province: z.string().trim().max(80, 'Nama provinsi maksimal 80 karakter.'),
    phone: z.string().trim().regex(PHONE_RE, 'Nomor telepon tidak valid.'),
    whatsapp: z.string().trim().regex(PHONE_RE, 'Nomor WhatsApp tidak valid.'),
    email: z.string().trim().email('Alamat email tidak valid.').max(120, 'Email maksimal 120 karakter.'),
    website: z.string().trim().url('Alamat website tidak valid.').max(300, 'Website maksimal 300 karakter.'),
    logo_url: z.string().trim().max(500, 'URL logo maksimal 500 karakter.'),
    cover_url: z.string().trim().max(500, 'URL sampul maksimal 500 karakter.'),
    hours: hoursSchema,
    latitude: z.number().min(-90, 'Latitude harus antara -90 dan 90.').max(90, 'Latitude harus antara -90 dan 90.'),
    longitude: z.number().min(-180, 'Longitude harus antara -180 dan 180.').max(180, 'Longitude harus antara -180 dan 180.'),
    // Status hanya boleh diubah admin (ditegakkan di handler).
    status: z.enum(['draft', 'pending', 'approved', 'rejected']),
  })
  .partial();

type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/businesses/[id]
 * Detail bisnis. Publik bila status='approved'; owner/admin boleh melihat semua status.
 * Bisnis non-approved tidak dibocorkan ke publik (404).
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const { id } = await context.params;
  if (!UUID_RE.test(id)) return notFound(request, 'Bisnis tidak ditemukan.');
  try {
    const supabase = await getServerSupabase();
    const { data: row, error } = await supabase.from('businesses').select('*').eq('id', id).maybeSingle();
    if (error) {
      if (isSetupIncomplete(error)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Data bisnis belum dapat dimuat.', error);
    }
    if (!row) return notFound(request, 'Bisnis tidak ditemukan.');
    const business = row as Record<string, unknown>;
    if (business.status === 'approved') {
      return NextResponse.json(
        { ok: true, data: toPublicBusiness(business) },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' } },
      );
    }
    // Status non-approved: hanya owner atau admin. Tanpa login → perlakukan sebagai publik.
    const { data: { user } } = await supabase.auth.getUser();
    let canSee = false;
    if (user) canSee = (await resolveAccess(supabase, business, user.id)) !== null;
    if (!canSee) return notFound(request, 'Bisnis tidak ditemukan.');
    return NextResponse.json(
      { ok: true, data: business },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
    );
  } catch (error) {
    return internalError(request, 'Data bisnis belum dapat dimuat.', error);
  }
}

/**
 * PATCH /api/businesses/[id]
 * Ubah data bisnis (owner atau admin). Non-admin tidak boleh mengubah `status`;
 * owner yang statusnya 'rejected' otomatis kembali ke 'pending' (pengajuan ulang).
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  let supabase: ServerSupabase;
  let userId: string;
  try {
    ({ supabase, user: { id: userId } } = await requireServerUser());
  } catch {
    return unauthorized(request);
  }
  const limited = await checkRateLimit(request, 'api', `business-update:${userId}`);
  if (limited) return limited;
  if (!verifyCsrfToken(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');

  const { id } = await context.params;
  if (!UUID_RE.test(id)) return notFound(request, 'Bisnis tidak ditemukan.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest(request, 'Format data tidak valid.');
  }
  const parsed = businessUpdateSchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Data bisnis tidak valid.');

  try {
    const { data: row, error } = await supabase.from('businesses').select('*').eq('id', id).maybeSingle();
    if (error) {
      if (isSetupIncomplete(error)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Data bisnis belum dapat diubah.', error);
    }
    if (!row) return notFound(request, 'Bisnis tidak ditemukan.');
    const business = row as Record<string, unknown>;
    const access = await resolveAccess(supabase, business, userId);
    if (!access) return forbidden(request, 'Anda tidak memiliki akses ke bisnis ini.');

    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(parsed.data)) {
      if (key === 'status') continue;
      if (value !== undefined) updates[key] = value;
    }
    if (parsed.data.status !== undefined) {
      if (access !== 'admin') return forbidden(request, 'Hanya admin yang dapat mengubah status bisnis.');
      updates.status = parsed.data.status;
    } else if (access === 'owner' && business.status === 'rejected') {
      // Pengajuan ulang otomatis oleh owner.
      updates.status = 'pending';
    }
    if (Object.keys(updates).length === 0) return badRequest(request, 'Tidak ada perubahan yang dikirim.');

    const { data: updated, error: updateError } = await supabase
      .from('businesses')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();
    if (updateError) return internalError(request, 'Data bisnis belum dapat diubah.', updateError);
    return NextResponse.json(
      { ok: true, data: updated },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    return internalError(request, 'Data bisnis belum dapat diubah.', error);
  }
}

/**
 * DELETE /api/businesses/[id]
 * Hapus bisnis permanen (owner atau admin). Inquiry ikut terhapus via cascade DB.
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  let supabase: ServerSupabase;
  let userId: string;
  try {
    ({ supabase, user: { id: userId } } = await requireServerUser());
  } catch {
    return unauthorized(request);
  }
  const limited = await checkRateLimit(request, 'api', `business-delete:${userId}`);
  if (limited) return limited;
  if (!verifyCsrfToken(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');

  const { id } = await context.params;
  if (!UUID_RE.test(id)) return notFound(request, 'Bisnis tidak ditemukan.');

  try {
    const { data: row, error } = await supabase.from('businesses').select('id,owner_id').eq('id', id).maybeSingle();
    if (error) {
      if (isSetupIncomplete(error)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Bisnis belum dapat dihapus.', error);
    }
    if (!row) return notFound(request, 'Bisnis tidak ditemukan.');
    const access = await resolveAccess(supabase, row as Record<string, unknown>, userId);
    if (!access) return forbidden(request, 'Anda tidak memiliki akses ke bisnis ini.');

    const { error: deleteError } = await supabase.from('businesses').delete().eq('id', id);
    if (deleteError) return internalError(request, 'Bisnis belum dapat dihapus.', deleteError);
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return internalError(request, 'Bisnis belum dapat dihapus.', error);
  }
}
