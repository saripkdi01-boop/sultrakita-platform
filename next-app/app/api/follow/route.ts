import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, notFound, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';

const UUID_RE = /^[a-zA-Z0-9_-]{1,120}$/;

// Delegasi ke verifyCsrfToken waktu-konstan di lib/security/csrf.ts.
function checkCsrf(request: NextRequest) {
  return verifyCsrfToken(request);
}

const followSchema = z.object({
  followingId: z.string().regex(UUID_RE, 'Pengguna tidak valid.'),
  idempotencyKey: z.string().max(120).nullish(),
});

/**
 * POST /api/follow { followingId }
 * Mengikuti pengguna. Idempoten: mengikuti dua kali tetap sukses.
 * Balikan: { ok, following: true }.
 */
export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  let body: unknown;
  try { body = await request.json(); } catch { return badRequest(request, 'Format data tidak valid.'); }
  const parsed = followSchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Permintaan tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;

    const { followingId } = parsed.data;
    if (followingId === user.id) return badRequest(request, 'Tidak dapat mengikuti akun sendiri.');
    const { data: target, error: targetError } = await supabase.from('profiles').select('id').eq('id', followingId).maybeSingle();
    if (targetError) return internalError(request, 'Ikuti belum dapat diproses.');
    if (!target) return notFound(request, 'Pengguna tidak ditemukan.');

    const { error } = await supabase
      .from('follows')
      .upsert({ follower_id: user.id, following_id: followingId }, { onConflict: 'follower_id,following_id', ignoreDuplicates: true });
    if (error && error.code !== '23505') return internalError(request, 'Ikuti belum dapat diproses.');
    return NextResponse.json({ ok: true, following: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return internalError(request, 'Ikuti belum dapat diproses.');
  }
}

/**
 * DELETE /api/follow?followingId=
 * Berhenti mengikuti. Idempoten: tidak mengikuti pun tetap sukses.
 * Balikan: { ok, following: false }.
 */
export async function DELETE(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  const followingId = request.nextUrl.searchParams.get('followingId');
  if (!followingId || !UUID_RE.test(followingId)) return badRequest(request, 'Pengguna tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;

    const { error } = await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', followingId);
    if (error) return internalError(request, 'Berhenti mengikuti belum dapat diproses.');
    return NextResponse.json({ ok: true, following: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return internalError(request, 'Berhenti mengikuti belum dapat diproses.');
  }
}
