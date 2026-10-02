import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase, requireServerUser } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, notFound, serviceUnavailable, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';

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

/** True bila user adalah owner bisnis atau admin/super_admin. */
async function isOwnerOrAdmin(supabase: ServerSupabase, businessId: string, userId: string): Promise<boolean> {
  const { data: business } = await supabase.from('businesses').select('owner_id').eq('id', businessId).maybeSingle();
  const ownerId = (business as { owner_id?: unknown } | null)?.owner_id;
  if (ownerId === userId) return true;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle();
  const role = (profile as { role?: unknown } | null)?.role;
  return role === 'admin' || role === 'super_admin';
}

// ---------------------------------------------------------------------
// Validasi (zod)
// ---------------------------------------------------------------------

const inquirySchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.').max(120, 'Nama maksimal 120 karakter.'),
  contact: z.string().trim().min(5, 'Kontak minimal 5 karakter.').max(200, 'Kontak maksimal 200 karakter.'),
  message: z.string().trim().min(10, 'Pesan minimal 10 karakter.').max(2000, 'Pesan maksimal 2000 karakter.'),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * POST /api/businesses/[id]/inquiries
 * Kirim pertanyaan ke bisnis (publik, tanpa login). Bisnis harus berstatus approved —
 * bisnis non-approved diperlakukan seolah tidak ada (404, tanpa bocoran).
 */
export async function POST(request: NextRequest, context: RouteContext) {
  // TODO: spesifikasi ideal 5x/menit per IP; repo saat ini hanya menyediakan
  // preset 'api' (60x/menit). Key per-IP dipakai agar kuota tidak dibagi antar
  // pengunjung; ganti ke limiter khusus 5/menit bila preset baru tersedia.
  const limited = await checkRateLimit(request, 'api', `inquiry:${clientIp(request)}`);
  if (limited) return limited;
  // Form publik memakai CSRF double-submit seperti form auth lainnya.
  if (!verifyCsrfToken(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');

  const { id } = await context.params;
  if (!UUID_RE.test(id)) return notFound(request, 'Bisnis tidak ditemukan.');

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest(request, 'Format data tidak valid.');
  }
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Data pertanyaan tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('id')
      .eq('id', id)
      .eq('status', 'approved')
      .maybeSingle();
    if (businessError) {
      if (isSetupIncomplete(businessError)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Pertanyaan belum dapat dikirim.', businessError);
    }
    if (!business) return notFound(request, 'Bisnis tidak ditemukan.');

    const { error: insertError } = await supabase.from('business_inquiries').insert({
      business_id: id,
      name: parsed.data.name,
      contact: parsed.data.contact,
      message: parsed.data.message,
      status: 'new',
    });
    if (insertError) {
      if (isSetupIncomplete(insertError)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Pertanyaan belum dapat dikirim.', insertError);
    }
    return NextResponse.json({ ok: true }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return internalError(request, 'Pertanyaan belum dapat dikirim.', error);
  }
}

/**
 * GET /api/businesses/[id]/inquiries
 * Daftar pertanyaan masuk (hanya owner bisnis atau admin), terbaru dulu, maks 100.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  let supabase: ServerSupabase;
  let userId: string;
  try {
    ({ supabase, user: { id: userId } } = await requireServerUser());
  } catch {
    return unauthorized(request);
  }
  const limited = await checkRateLimit(request, 'api', `inquiry-list:${userId}`);
  if (limited) return limited;

  const { id } = await context.params;
  if (!UUID_RE.test(id)) return notFound(request, 'Bisnis tidak ditemukan.');

  try {
    if (!(await isOwnerOrAdmin(supabase, id, userId))) {
      return forbidden(request, 'Anda tidak memiliki akses ke bisnis ini.');
    }
    const { data, error } = await supabase
      .from('business_inquiries')
      .select('id,business_id,name,contact,message,status,created_at')
      .eq('business_id', id)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) {
      if (isSetupIncomplete(error)) return serviceUnavailable(request, 'Direktori bisnis sedang disiapkan.');
      return internalError(request, 'Daftar pertanyaan belum dapat dimuat.', error);
    }
    return NextResponse.json(
      { ok: true, data: data || [] },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
    );
  } catch (error) {
    return internalError(request, 'Daftar pertanyaan belum dapat dimuat.', error);
  }
}
