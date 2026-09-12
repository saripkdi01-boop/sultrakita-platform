'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BerandaPostData } from '@/components/beranda/FeedPost';

export type FeedFilter = 'recommended' | 'following' | 'latest' | 'property' | 'video';
type ApiPost = { id: string; content: string; media_urls?: string[]; type: string; privacy?: 'public' | 'followers'; location?: string; mood?: string | null; tagged_user_ids?: string[]; created_at: string; user_id: string; likes_count?: number; comments_count?: number; liked?: boolean; profiles?: { display_name?: string; username?: string; name?: string; avatar_url?: string } | null };
type FeedResponse = { data: ApiPost[]; pageInfo: { endCursor: string | null; hasNextPage: boolean }; error?: string };

const relativeTime = (iso: string) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return minutes < 60 ? `${minutes} menit lalu` : `${Math.floor(minutes / 60)} jam lalu`;
};
const mapPost = (post: ApiPost): BerandaPostData => {
  const name = post.profiles?.username || post.profiles?.display_name || post.profiles?.name || 'Pengguna';
  return { id: post.id, author: name, authorUsername: post.profiles?.username, initials: name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(), avatarUrl: post.profiles?.avatar_url, time: relativeTime(post.created_at), location: post.location, mood: post.mood, taggedCount: post.tagged_user_ids?.length || 0, privacy: post.privacy, content: post.content, mediaUrl: post.media_urls?.[0], mediaUrls: post.media_urls || [], mediaType: post.type === 'reel' ? 'video' : 'image', likes: Number(post.likes_count || 0), comments: Number(post.comments_count || 0), liked: Boolean(post.liked) };
};

export function useInfiniteFeed(initialFilter: FeedFilter = 'recommended') {
  const [filter, setFilterState] = useState<FeedFilter>(initialFilter);
  const [items, setItems] = useState<BerandaPostData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const load = useCallback(async (nextCursor: string | null, replace: boolean) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ filter, limit: '10' });
      if (nextCursor) params.set('cursor', nextCursor);
      const response = await fetch(`/api/feed?${params}`, { signal: controller.signal, credentials: 'include', headers: { Accept: 'application/json' } });
      const payload = await response.json() as FeedResponse;
      if (!response.ok) throw new Error(payload.error || 'Feed tidak dapat dimuat.');
      setItems((current) => {
        const source = replace ? payload.data.map(mapPost) : [...current, ...payload.data.map(mapPost)];
        return Array.from(new Map(source.map((item) => [item.id, item])).values());
      });
      setCursor(payload.pageInfo.endCursor); setHasNextPage(payload.pageInfo.hasNextPage);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Feed tidak dapat dimuat.');
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [filter]);

  useEffect(() => { void load(null, true); return () => requestRef.current?.abort(); }, [load]);
  const setFilter = useCallback((next: FeedFilter) => { setItems([]); setCursor(null); setHasNextPage(true); setFilterState(next); }, []);
  const loadMore = useCallback(() => { if (!loading && hasNextPage) void load(cursor, false); }, [cursor, hasNextPage, load, loading]);
  return { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload: () => load(null, true) };
}
