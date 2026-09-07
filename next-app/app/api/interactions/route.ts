import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

function limited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(`interaction:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
  const csrfHeader = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('suki_csrf')?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  let body: { action?: string; postId?: string; idempotencyKey?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  if (body.action !== 'like' || !body.postId || !/^[a-zA-Z0-9_-]{1,120}$/.test(body.postId)) return NextResponse.json({ error: 'invalid_interaction' }, { status: 400 });
  const { supabase, user } = await (async () => { try { return await getServerSupabase().then(async (client) => { const { data: { user: current } } = await client.auth.getUser(); return current ? { supabase: client, user: current } : { supabase: null, user: null }; }); } catch { return { supabase: null, user: null }; } })();
  if (!supabase || !user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
  const idempotencyKey = body.idempotencyKey?.slice(0, 120) || `${user.id}:${body.postId}:like`;
  const { data: existing, error: lookupError } = await supabase.from('likes').select('post_id').eq('post_id', body.postId).eq('user_id', user.id).maybeSingle();
  if (lookupError && lookupError.code !== 'PGRST116') return NextResponse.json({ error: 'interaction_unavailable' }, { status: 500 });
  if (existing) return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
  const { error } = await supabase.from('likes').insert({ post_id: body.postId, user_id: user.id });
  if (error && error.code !== '23505') return NextResponse.json({ error: 'interaction_failed' }, { status: 500 });
  return NextResponse.json({ ok: true, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  const csrfHeader = request.headers.get('x-csrf-token');
  const csrfCookie = request.cookies.get('suki_csrf')?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  const postId = request.nextUrl.searchParams.get('postId');
  if (!postId || !/^[a-zA-Z0-9_-]{1,120}$/.test(postId)) return NextResponse.json({ error: 'invalid_interaction' }, { status: 400 });
  try {
    const { supabase, user } = await (async () => { const client = await getServerSupabase(); const { data: { user: current } } = await client.auth.getUser(); return { supabase: client, user: current }; })();
    if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
    const { error } = await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
    if (error) return NextResponse.json({ error: 'interaction_failed' }, { status: 500 });
    return NextResponse.json({ ok: true, liked: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'interaction_unavailable' }, { status: 500 }); }
}
