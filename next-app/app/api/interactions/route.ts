import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { apiError, badRequest, forbidden, internalError, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';
import { parseOr400 } from '@/lib/security/validation';

// Fase 1.5: rate limit 60x/menit per user (atau IP bila anonim) via modul bersama.

const POST_ID_RE = /^[a-zA-Z0-9_-]{1,120}$/;

const LikeSchema = z.object({
  action: z.literal('like', { message: 'Interaksi tidak valid.' }),
  postId: z.string().regex(POST_ID_RE, 'Interaksi tidak valid.'),
  idempotencyKey: z.string().max(120, 'Kunci idempotency terlalu panjang.').nullish(),
});

const UnlikeSchema = z.object({
  postId: z.string().regex(POST_ID_RE, 'Interaksi tidak valid.'),
});

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
  let body: unknown;
  try { body = await request.json(); } catch { return badRequest(request, 'Format data tidak valid.'); }
  const parsed = parseOr400(LikeSchema, body);
  if (!parsed.ok) return parsed.response;
  const { postId } = parsed.data;
  const { supabase, user } = await currentUser();
  if (!supabase || !user) return unauthorized(request);
  const limitedUser = await checkRateLimit(request, 'api', user.id);
  if (limitedUser) return limitedUser;
  const idempotencyKey = parsed.data.idempotencyKey?.slice(0, 120) || `${user.id}:${postId}:like`;
  const { data: existing, error: lookupError } = await supabase.from('likes').select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
  if (lookupError && lookupError.code !== 'PGRST116') return internalError(request, 'Interaksi belum dapat diproses.');
  if (existing) return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
  const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
  if (error && error.code !== '23505') return internalError(request, 'Interaksi belum dapat diproses.');
  return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  const parsed = parseOr400(UnlikeSchema, { postId: request.nextUrl.searchParams.get('postId') });
  if (!parsed.ok) return parsed.response;
  const { postId } = parsed.data;
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
