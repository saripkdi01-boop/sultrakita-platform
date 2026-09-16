import { createHmac, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { FEED_FILTERS, type FeedCursor, type FeedFilter, type FeedItem, type FeedMedia } from '@/lib/feed-contract';

function secret() {
  return process.env.FEED_CURSOR_SECRET || process.env.SUPABASE_JWT_SECRET || 'development-only-feed-cursor-secret';
}

function encodeCursor(cursor: FeedCursor) {
  const payload = Buffer.from(JSON.stringify(cursor)).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function decodeCursor(value: string | null, filter: FeedFilter): FeedCursor | null {
  if (!value) return null;
  const [payload, signature] = value.split('.');
  if (!payload || !signature) throw new Error('invalid_cursor');
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('invalid_cursor');
  let parsed: Partial<FeedCursor>;
  try {
    parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<FeedCursor>;
  } catch {
    throw new Error('invalid_cursor');
  }
  if (parsed.v !== 1 || parsed.filter !== filter || typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') throw new Error('cursor_filter_mismatch');
  return parsed as FeedCursor;
}

type RawProfile = {
  id?: string;
  display_name?: string;
  username?: string;
  name?: string;
  avatar_url?: string | null;
  visibility_settings?: { avatar?: 'public' | 'followers' | 'private' };
};

type RawPost = {
  id: string;
  content?: string | null;
  media_urls?: string[] | null;
  type?: string | null;
  privacy?: 'public' | 'followers' | null;
  location?: string | null;
  mood?: string | null;
  tagged_user_ids?: string[] | null;
  created_at: string;
  user_id: string;
  profiles?: RawProfile | RawProfile[] | null;
  likes_count?: number | null;
  comments_count?: number | null;
  shares_count?: number | null;
  saves_count?: number | null;
  liked?: boolean | null;
  saved?: boolean | null;
};

function oneProfile(profile: RawPost['profiles']): RawProfile | null {
  return Array.isArray(profile) ? profile[0] || null : profile || null;
}

function normalizeItem(row: RawPost, context: { followingIds: Set<string> } = { followingIds: new Set() }): FeedItem {
  const profile = oneProfile(row.profiles);
  const displayName = profile?.username || profile?.display_name || profile?.name || 'Pengguna';
  let avatarUrl = profile?.avatar_url || null;
  if (profile && profile.visibility_settings?.avatar !== 'public') avatarUrl = null;
  const type = row.type === 'reel' ? 'reel' : row.type === 'property' ? 'property' : 'post';
  const media: FeedMedia[] = (row.media_urls || []).filter(Boolean).map((url) => ({ url, kind: type === 'reel' ? 'video' : 'image' }));
  const totalEngagement = (row.likes_count || 0) + (row.comments_count || 0) + (row.shares_count || 0);
  const ageHours = Math.max(0, (Date.now() - new Date(row.created_at).getTime()) / 3_600_000);
  const recommendation = context.followingIds.has(row.user_id)
    ? { reason: 'following' as const }
    : totalEngagement >= 10
      ? { reason: 'popular' as const }
      : ageHours <= 24
        ? { reason: 'fresh' as const }
        : null;
  return {
    id: row.id,
    type,
    actor: { id: row.user_id, displayName, username: profile?.username, avatarUrl },
    content: row.content || '',
    media,
    createdAt: row.created_at,
    location: row.location || null,
    mood: row.mood || null,
    taggedUserCount: row.tagged_user_ids?.length || 0,
    visibility: row.privacy === 'followers' ? 'followers' : 'public',
    engagement: {
      likeCount: typeof row.likes_count === 'number' ? row.likes_count : null,
      commentCount: typeof row.comments_count === 'number' ? row.comments_count : null,
      shareCount: typeof row.shares_count === 'number' ? row.shares_count : null,
      saveCount: typeof row.saves_count === 'number' ? row.saves_count : null,
    },
    viewer: {
      liked: typeof row.liked === 'boolean' ? row.liked : null,
      saved: typeof row.saved === 'boolean' ? row.saved : null,
      followingActor: context.followingIds.has(row.user_id),
    },
    recommendation,
  };
}

async function hydrateEngagement(supabase: Awaited<ReturnType<typeof getServerSupabase>>, rows: RawPost[], viewerId: string | null) {
  const postIds = rows.map((row) => row.id);
  if (!postIds.length) return rows;
  const [likes, comments, shares, saves] = await Promise.all([
    supabase.from('likes').select('post_id,user_id').in('post_id', postIds),
    supabase.from('post_comments').select('post_id,status').in('post_id', postIds),
    supabase.from('post_shares').select('post_id').in('post_id', postIds),
    viewerId ? supabase.from('saved_posts').select('post_id').eq('user_id', viewerId).in('post_id', postIds) : Promise.resolve({ data: [], error: null }),
  ]);
  const failure = [likes, comments, shares, saves].find((result) => result.error);
  if (failure?.error) throw failure.error;
  const count = (items: Array<{ post_id: string }> | null | undefined) => {
    const counts = new Map<string, number>();
    for (const item of items || []) counts.set(item.post_id, (counts.get(item.post_id) || 0) + 1);
    return counts;
  };
  const likeCounts = count(likes.data);
  const commentCounts = count((comments.data || []).filter((comment) => comment.status === 'visible'));
  const shareCounts = count(shares.data);
  const savedIds = new Set((saves.data || []).map((item) => item.post_id));
  const likedIds = new Set((likes.data || []).filter((item) => item.user_id === viewerId).map((item) => item.post_id));
  return rows.map((row) => ({ ...row, likes_count: likeCounts.get(row.id) || 0, comments_count: commentCounts.get(row.id) || 0, shares_count: shareCounts.get(row.id) || 0, saves_count: null, liked: viewerId ? likedIds.has(row.id) : null, saved: viewerId ? savedIds.has(row.id) : null }));
}

export async function GET(request: NextRequest) {
  const filterValue = request.nextUrl.searchParams.get('filter') || 'recommended';
  if (!FEED_FILTERS.includes(filterValue as FeedFilter)) return NextResponse.json({ error: 'invalid_filter' }, { status: 400 });
  const filter = filterValue as FeedFilter;
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 10) || 10, 1), 30);
  let cursor: FeedCursor | null;
  try {
    cursor = decodeCursor(request.nextUrl.searchParams.get('cursor'), filter);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'invalid_cursor' }, { status: 400 });
  }

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    let followingIds = new Set<string>();
    if (user) {
      const { data: follows, error: followError } = await supabase.from('follows').select('following_id').eq('follower_id', user.id);
      if (followError && followError.code !== 'PGRST116') return NextResponse.json({ error: 'feed_query_failed' }, { status: 500 });
      followingIds = new Set((follows || []).map((row) => row.following_id).filter(Boolean));
    }
    let query = supabase.from('posts').select('id,content,media_urls,type,privacy,location,mood,tagged_user_ids,created_at,user_id,profiles(display_name,username,avatar_url,visibility_settings)').eq('status', 'published').order('created_at', { ascending: false }).order('id', { ascending: false }).limit(limit + 1);
    if (filter === 'property') query = query.eq('type', 'property');
    if (filter === 'video') query = query.eq('type', 'reel');
    if (filter === 'following') {
      if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
      const ids = Array.from(followingIds);
      if (!ids.length) return NextResponse.json({ data: [], pageInfo: { endCursor: null, hasNextPage: false }, rankingVersion: 'deterministic-v1', filter, contractVersion: 'suki-feed-v1' });
      query = query.in('user_id', ids);
    }
    if (cursor) query = query.or(`created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`);
    const { data, error } = await query;
    if (error) return NextResponse.json({ error: 'feed_query_failed' }, { status: 500 });
    const rows = (data || []) as RawPost[];
    const hasNextPage = rows.length > limit;
    if (hasNextPage) rows.pop();
    const hydratedRows = await hydrateEngagement(supabase, rows, user?.id || null);
    const last = hydratedRows.at(-1);
    const endCursor = hasNextPage && last ? encodeCursor({ v: 1, filter, createdAt: last.created_at, id: last.id }) : null;
    return NextResponse.json({ data: hydratedRows.map((row) => normalizeItem(row, { followingIds })), pageInfo: { endCursor, hasNextPage }, rankingVersion: 'deterministic-v1', filter, contractVersion: 'suki-feed-v1' }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'feed_unavailable' }, { status: 500 });
  }
}
