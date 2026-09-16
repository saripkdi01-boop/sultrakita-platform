'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BerandaPostData } from '@/components/beranda/FeedPost';
import type { FeedFilter, FeedItem, FeedPage } from '@/lib/feed-contract';

export type { FeedFilter } from '@/lib/feed-contract';

type FeedResponse = FeedPage & { error?: string };

const relativeTime = (iso: string) => {
  const minutes = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return minutes < 60 ? `${minutes} menit lalu` : `${Math.floor(minutes / 60)} jam lalu`;
};

const mapItem = (item: FeedItem): BerandaPostData => {
  const name = item.actor.displayName || 'Pengguna';
  return {
    id: item.id,
    author: name,
    authorUsername: item.actor.username,
    initials: name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
    avatarUrl: item.actor.avatarUrl,
    time: relativeTime(item.createdAt),
    location: item.location || undefined,
    mood: item.mood,
    taggedCount: item.taggedUserCount,
    privacy: item.visibility === 'followers' ? 'followers' : 'public',
    content: item.content,
    mediaUrl: item.media[0]?.url,
    mediaUrls: item.media.map((media) => media.url),
    mediaType: item.media[0]?.kind || 'image',
    likes: item.engagement.likeCount ?? 0,
    comments: item.engagement.commentCount ?? 0,
    liked: item.viewer.liked === true,
  };
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
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ filter, limit: '10' });
      if (nextCursor) params.set('cursor', nextCursor);
      const response = await fetch(`/api/feed?${params}`, { signal: controller.signal, credentials: 'include', headers: { Accept: 'application/json' } });
      const payload = await response.json() as FeedResponse;
      if (!response.ok) throw new Error(payload.error || 'Feed tidak dapat dimuat.');
      setItems((current) => {
        const source = replace ? payload.data.map(mapItem) : [...current, ...payload.data.map(mapItem)];
        return Array.from(new Map(source.map((item) => [item.id, item])).values());
      });
      setCursor(payload.pageInfo.endCursor);
      setHasNextPage(payload.pageInfo.hasNextPage);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Feed tidak dapat dimuat.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [filter]);

  useEffect(() => { void load(null, true); return () => requestRef.current?.abort(); }, [load]);
  const setFilter = useCallback((next: FeedFilter) => { setItems([]); setCursor(null); setHasNextPage(true); setFilterState(next); }, []);
  const loadMore = useCallback(() => { if (!loading && hasNextPage) void load(cursor, false); }, [cursor, hasNextPage, load, loading]);
  return { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload: () => load(null, true) };
}
