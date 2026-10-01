import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { apiError, badRequest, forbidden, internalError, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';

// Fase 1.5: rate limit 60x/menit per user (atau IP bila anonim) via modul bersama.

async function currentUser() {
  try {
    const client = await getServerSupabase();
    const { data: { user } } = await client.auth.getUser();
    return user ? { supabase: client, user } : { supabase: null, user: null };
  } catch {
    return { supabase: null, user: null };
  }
}

// Delegasi ke verifyCsrfToken waktu-konstan di lib/security/csrf.ts.
function checkCsrf(request: NextRequest) {
  return verifyCsrfToken(request);
}

export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  let body: { action?: string; postId?: string; idempotencyKey?: string };
  try { body = await request.json(); } catch { return badRequest(request, 'Format data tidak valid.'); }
  if (body.action !== 'like' || !body.postId || !/^[a-zA-Z0-9_-]{1,120}$/.test(body.postId)) return badRequest(request, 'Interaksi tidak valid.');
  const { supabase, user } = await currentUser();
  if (!supabase || !user) return unauthorized(request);
  const limitedUser = await checkRateLimit(request, 'api', user.id);
  if (limitedUser) return limitedUser;
  const idempotencyKey = body.idempotencyKey?.slice(0, 120) || `${user.id}:${body.postId}:like`;
  const { data: existing, error: lookupError } = await supabase.from('likes').select('post_id').eq('post_id', body.postId).eq('user_id', user.id).maybeSingle();
  if (lookupError && lookupError.code !== 'PGRST116') return internalError(request, 'Interaksi belum dapat diproses.');
  if (existing) return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
  const { error } = await supabase.from('likes').insert({ post_id: body.postId, user_id: user.id });
  if (error && error.code !== '23505') return internalError(request, 'Interaksi belum dapat diproses.');
  return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  const postId = request.nextUrl.searchParams.get('postId');
  if (!postId || !/^[a-zA-Z0-9_-]{1,120}$/.test(postId)) return badRequest(request, 'Interaksi tidak valid.');
  try {
    const { supabase, user } = await currentUser();
    if (!supabase || !user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;
    const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    if (error) return internalError(request, 'Interaksi belum dapat diproses.');
    return NextResponse.json({ ok: true, liked: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return apiError('SERVICE_UNAVAILABLE', 'Interaksi sementara belum tersedia.', 503, request);
  }
}
