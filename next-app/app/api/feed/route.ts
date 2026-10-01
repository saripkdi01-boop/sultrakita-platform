import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { badRequest, internalError, unauthorized } from '@/lib/api-error';
import { attachInteractionMeta } from '@/lib/feed-counts';

const FILTERS = ['recommended', 'following', 'latest', 'property', 'video'] as const;
type FeedFilter = (typeof FILTERS)[number];
type Cursor = { v: 1; filter: FeedFilter; createdAt: string; id: string };

function secret() {
  return process.env.FEED_CURSOR_SECRET || process.env.SUPABASE_JWT_SECRET || 'development-only-feed-cursor-secret';
}
function encodeCursor(cursor: Cursor) {
  const payload = Buffer.from(JSON.stringify(cursor)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}
function decodeCursor(value: string | null, filter: FeedFilter): Cursor | null {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) throw new Error('invalid_cursor');
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('invalid_cursor');
  const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<Cursor>;
  if (parsed.v !== 1 || parsed.filter !== filter || typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') throw new Error('cursor_filter_mismatch');
  return parsed as Cursor;
}

export async function GET(request: NextRequest) {
  // Fase 1.5: batasi 60 request/menit per IP untuk API publik.
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const filterValue = request.nextUrl.searchParams.get('filter') || 'recommended';
  if (!FILTERS.includes(filterValue as FeedFilter)) return badRequest(request, 'Filter feed tidak valid.');
  const filter = filterValue as FeedFilter;
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 10) || 10, 1), 30);
  let cursor: Cursor | null;
  try { cursor = decodeCursor(request.nextUrl.searchParams.get('cursor'), filter); } catch {
    return badRequest(request, 'Kursor feed tidak valid. Muat ulang feed.');
  }

  try {
    const supabase = await getServerSupabase();
    // Satu panggilan sesi untuk filter 'following' SEKALIGUS status liked/follow —
    // dipakai ulang di bawah agar tidak ada roundtrip auth ganda.
    const { data: { user } } = await supabase.auth.getUser();
    let query = supabase.from('posts').select('id,content,media_urls,type,privacy,location,mood,tagged_user_ids,created_at,user_id,profiles(display_name,username,avatar_url,visibility_settings)').eq('status', 'published').order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limit + 1);
    if (filter === 'property') query = query.eq('type', 'property');
    if (filter === 'video') query = query.eq('type', 'reel');
    if (filter === 'following') {
      if (!user) return unauthorized(request, 'Masuk untuk melihat feed mengikuti.');
      const { data: follows, error: followError } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
      if (followError) return internalError(request, 'Feed belum dapat dimuat.');
      const ids = (follows || []).map((row) => row.following_id).filter(Boolean);
      if (!ids.length) return NextResponse.json({ data: [], pageInfo: { endCursor: null, hasNextPage: false }, rankingVersion: 'baseline-v1', filter });
      query = query.in('user_id', ids);
    }
    if (cursor) query = query.lt('created_at', cursor.createdAt);
    const { data, error } = await query;
    if (error) return internalError(request, 'Feed belum dapat dimuat.');
    const rows = (data || []) as Array<Record<string, unknown>>;
    const hasNextPage = rows.length > limit;
    if (hasNextPage) rows.pop();
    const last = rows.at(-1);
    const endCursor = hasNextPage && last ? encodeCursor({ v: 1, filter, createdAt: String(last.created_at), id: String(last.id) }) : null;
    const safeRows = rows.map((row) => {
      const profile = row.profiles as { visibility_settings?: { avatar?: string } } | null;
      if (profile && profile.visibility_settings?.avatar !== 'public') {
        row.profiles = { ...(row.profiles as Record<string, unknown>), avatar_url: null };
      }
      return row;
    });
    // P0-F1: tempelkan likes_count, comments_count, liked, following_author
    // secara BATCH (3 query agregat untuk seluruh halaman — tanpa N+1).
    await attachInteractionMeta(supabase, safeRows as Array<Record<string, unknown> & { id: string }>, user ? user.id : null);
    return NextResponse.json({ data: safeRows, pageInfo: { endCursor, hasNextPage }, rankingVersion: 'baseline-v1', filter }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
  } catch {
    return internalError(request, 'Feed belum dapat dimuat.');
  }
}
