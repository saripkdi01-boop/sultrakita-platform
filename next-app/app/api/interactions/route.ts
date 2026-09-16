import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;
const POST_ID = /^[a-zA-Z0-9_-]{1,120}$/;

function limited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) { buckets.set(key, { count: 1, resetAt: now + WINDOW_MS }); return false; }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function csrfValid(request: NextRequest) {
  const header = request.headers.get('x-csrf-token');
  const cookie = request.cookies.get('suki_csrf')?.value;
  return Boolean(header && cookie && header === cookie);
}

async function session() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(`interaction:${ip}`)) return NextResponse.json({ error: 'rate_limited' }, { status: 429, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } });
  if (!csrfValid(request)) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  let body: { action?: string; postId?: string; idempotencyKey?: string; channel?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  if (!body.postId || !POST_ID.test(body.postId) || !['like', 'save', 'share'].includes(body.action || '')) return NextResponse.json({ error: 'invalid_interaction' }, { status: 400 });
  const { supabase, user } = await session();
  if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
  const postId = body.postId;
  const action = body.action as 'like' | 'save' | 'share';
  const idempotencyKey = body.idempotencyKey?.trim().slice(0, 120) || `${user.id}:${postId}:${action}`;
  try {
    if (action === 'like') {
      const { data: existing, error: lookupError } = await supabase.from('likes').select('post_id').eq('post_id', postId).eq('user_id', user.id).maybeSingle();
      if (lookupError && lookupError.code !== 'PGRST116') throw lookupError;
      if (!existing) { const { error } = await supabase.from('likes').insert({ post_id: postId, user_id: user.id }); if (error && error.code !== '23505') throw error; }
      return NextResponse.json({ ok: true, action, liked: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
    }
    if (action === 'save') {
      const { error } = await supabase.from('saved_posts').upsert({ post_id: postId, user_id: user.id }, { onConflict: 'post_id,user_id', ignoreDuplicates: true });
      if (error) throw error;
      return NextResponse.json({ ok: true, action, saved: true, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
    }
    const channel = ['native', 'clipboard', 'whatsapp'].includes(body.channel || '') ? body.channel : 'native';
    const { error } = await supabase.from('post_shares').upsert({ post_id: postId, user_id: user.id, channel, idempotency_key: idempotencyKey }, { onConflict: 'post_id,user_id,idempotency_key', ignoreDuplicates: true });
    if (error) throw error;
    return NextResponse.json({ ok: true, action, shared: true, channel, idempotencyKey }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    return NextResponse.json({ error: code === '42P01' ? 'interaction_schema_unavailable' : 'interaction_failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!csrfValid(request)) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  const postId = request.nextUrl.searchParams.get('postId');
  const action = request.nextUrl.searchParams.get('action') || 'like';
  if (!postId || !POST_ID.test(postId) || !['like', 'save'].includes(action)) return NextResponse.json({ error: 'invalid_interaction' }, { status: 400 });
  try {
    const { supabase, user } = await session();
    if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
    const table = action === 'save' ? 'saved_posts' : 'likes';
    const { error } = await supabase.from(table).delete().eq('post_id', postId).eq('user_id', user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, action, ...(action === 'save' ? { saved: false } : { liked: false }) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    return NextResponse.json({ error: code === '42P01' ? 'interaction_schema_unavailable' : 'interaction_failed' }, { status: 500 });
  }
}
