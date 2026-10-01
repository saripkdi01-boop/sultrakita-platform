'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BerandaPostData } from '@/components/beranda/FeedPost';
import { apiErrorMessage } from '@/lib/api-client';
import { relativeTime } from '@/lib/format-time';
import { ApiRequestError, setPostLike, setPostSave, toggleFollowUser } from '@/lib/feed-interactions';

export type FeedFilter = 'recommended' | 'following' | 'latest' | 'property' | 'video';
type ApiPost = { id: string; content: string; media_urls?: string[]; type: string; privacy?: 'public' | 'followers'; location?: string; mood?: string | null; tagged_user_ids?: string[]; created_at: string; user_id: string; likes_count?: number; comments_count?: number; liked?: boolean; following_author?: boolean; profiles?: { display_name?: string; username?: string; name?: string; avatar_url?: string | null; visibility_settings?: { avatar?: 'public' | 'followers' | 'private' } } | null };
type FeedResponse = { data: ApiPost[]; pageInfo: { endCursor: string | null; hasNextPage: boolean }; error?: string };

export type MutationResult = { ok: boolean; code?: string };

const mapPost = (post: ApiPost): BerandaPostData => {
  const name = post.profiles?.username || post.profiles?.display_name || post.profiles?.name || 'Pengguna';
  return {
    id: post.id,
    userId: post.user_id,
    author: name,
    authorUsername: post.profiles?.username,
    initials: name.split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase(),
    avatarUrl: post.profiles?.avatar_url,
    createdAt: post.created_at,
    time: relativeTime(post.created_at),
    location: post.location,
    mood: post.mood,
    taggedCount: post.tagged_user_ids?.length || 0,
    privacy: post.privacy,
    content: post.content,
    mediaUrl: post.media_urls?.[0],
    mediaUrls: post.media_urls || [],
    mediaType: post.type === 'reel' ? 'video' : 'image',
    likes: Number(post.likes_count || 0),
    comments: Number(post.comments_count || 0),
    liked: Boolean(post.liked),
    followingAuthor: Boolean(post.following_author),
  };
};

function mutationError(caught: unknown): MutationResult {
  return { ok: false, code: caught instanceof ApiRequestError ? caught.code : undefined };
}

export type FeedTab = 'feed' | 'saved';

export function useInfiniteFeed(initialFilter: FeedFilter = 'recommended', initialTab: FeedTab = 'feed') {
  const [filter, setFilterState] = useState<FeedFilter>(initialFilter);
  // Tab 'saved' (via ?tab=saved dari navigasi): daftar simpanan via /api/saved.
  const [tab, setTabState] = useState<FeedTab>(initialTab);
  const tabRef = useRef<FeedTab>(initialTab);
  useEffect(() => { tabRef.current = tab; }, [tab]);
  const [items, setItems] = useState<BerandaPostData[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const requestRef = useRef<AbortController | null>(null);
  // Ref sinkron untuk snapshot optimistic (updater setState berjalan async,
  // jadi snapshot tidak boleh diambil di dalam updater).
  const itemsRef = useRef<BerandaPostData[]>([]);
  const savedIdsRef = useRef<Set<string>>(new Set());
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => { savedIdsRef.current = savedIds; }, [savedIds]);

  const load = useCallback(async (nextCursor: string | null, replace: boolean) => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true); setError(null);
    try {
      // Mode simpanan: satu halaman dari /api/saved (tanpa kursor).
      if (tab === 'saved') {
        const response = await fetch('/api/saved?limit=100', { signal: controller.signal, credentials: 'include', headers: { Accept: 'application/json' } });
        const payload = await response.json() as { data?: ApiPost[]; error?: string };
        if (!response.ok) throw new Error(apiErrorMessage(payload, 'Daftar simpanan tidak dapat dimuat.'));
        const mapped = (payload.data || []).map(mapPost);
        setItems(mapped);
        setSavedIds(new Set(mapped.map((item) => item.id)));
        setCursor(null); setHasNextPage(false);
        return;
      }
      const params = new URLSearchParams({ filter, limit: '10' });
      if (nextCursor) params.set('cursor', nextCursor);
      const response = await fetch(`/api/feed?${params}`, { signal: controller.signal, credentials: 'include', headers: { Accept: 'application/json' } });
      const payload = await response.json() as FeedResponse;
      if (!response.ok) throw new Error(apiErrorMessage(payload, 'Feed tidak dapat dimuat.'));
      setItems((current) => {
        const source = replace ? payload.data.map(mapPost) : [...current, ...payload.data.map(mapPost)];
        return Array.from(new Map(source.map((item) => [item.id, item])).values());
      });
      setCursor(payload.pageInfo.endCursor); setHasNextPage(payload.pageInfo.hasNextPage);
    } catch (caught) {
      if (caught instanceof DOMException && caught.name === 'AbortError') return;
      setError(caught instanceof Error ? caught.message : 'Feed tidak dapat dimuat.');
    } finally { if (!controller.signal.aborted) setLoading(false); }
  }, [filter, tab]);

  useEffect(() => { void load(null, true); return () => requestRef.current?.abort(); }, [load]);

  // Daftar id postingan tersimpan (1 query saat mount; abaikan bila anonim/tabel belum ada).
  useEffect(() => {
    let active = true;
    fetch('/api/saved?limit=100', { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(async (response) => {
        if (!response.ok || !active) return;
        const payload = await response.json() as { data?: Array<{ id: string }> };
        if (Array.isArray(payload.data)) setSavedIds(new Set(payload.data.map((row) => row.id)));
      })
      .catch(() => { /* simpanan opsional — feed tetap jalan */ });
    return () => { active = false; };
  }, []);

  const setFilter = useCallback((next: FeedFilter) => { setItems([]); setCursor(null); setHasNextPage(true); setFilterState(next); }, []);
  // Ganti tab me-reset daftar; effect [load] otomatis memuat ulang karena
  // load bergantung pada tab.
  const setTab = useCallback((next: FeedTab) => { setItems([]); setCursor(null); setHasNextPage(true); setTabState(next); }, []);
  const loadMore = useCallback(() => { if (tabRef.current !== 'saved' && !loading && hasNextPage) void load(cursor, false); }, [cursor, hasNextPage, load, loading]);

  /** Optimistic like + rollback. Kembalikan { ok, code } agar UI bisa
   *  membedakan "belum login" (UNAUTHORIZED) dari kegagalan lain. */
  const toggleLike = useCallback(async (postId: string): Promise<MutationResult> => {
    const current = itemsRef.current.find((item) => item.id === postId);
    if (!current) return { ok: false };
    const prev = { liked: !!current.liked, likes: current.likes };
    const next = !prev.liked;
    setItems((items) => items.map((item) => (item.id === postId ? { ...item, liked: next, likes: Math.max(0, item.likes + (next ? 1 : -1)) } : item)));
    try {
      await setPostLike(postId, next);
      return { ok: true };
    } catch (caught) {
      setItems((items) => items.map((item) => (item.id === postId ? { ...item, liked: prev.liked, likes: prev.likes } : item)));
      return mutationError(caught);
    }
  }, []);

  /** Optimistic save + rollback. 503 (tabel belum ada) → pesan jujur via code. */
  const toggleSave = useCallback(async (postId: string): Promise<MutationResult & { saved?: boolean }> => {
    const wasSaved = savedIdsRef.current.has(postId);
    const next = !wasSaved;
    setSavedIds((current) => {
      const updated = new Set(current);
      if (next) updated.add(postId); else updated.delete(postId);
      return updated;
    });
    try {
      await setPostSave(postId, next);
      // Di tab simpanan, postingan yang dihapus dari simpanan langsung hilang dari daftar.
      if (tabRef.current === 'saved' && !next) {
        setItems((items) => items.filter((item) => item.id !== postId));
      }
      return { ok: true, saved: next };
    } catch (caught) {
      setSavedIds((current) => {
        const reverted = new Set(current);
        if (wasSaved) reverted.add(postId); else reverted.delete(postId);
        return reverted;
      });
      return { ...mutationError(caught), saved: wasSaved };
    }
  }, []);

  /** Optimistic follow + rollback; perbarui semua kartu dari penulis yang sama. */
  const toggleFollow = useCallback(async (userId: string): Promise<MutationResult & { following?: boolean }> => {
    const known = itemsRef.current.find((item) => item.userId === userId);
    if (!known) return { ok: false };
    const wasFollowing = !!known.followingAuthor;
    const next = !wasFollowing;
    setItems((items) => items.map((item) => (item.userId === userId ? { ...item, followingAuthor: next } : item)));
    try {
      await toggleFollowUser(userId, next);
      return { ok: true, following: next };
    } catch (caught) {
      setItems((items) => items.map((item) => (item.userId === userId ? { ...item, followingAuthor: wasFollowing } : item)));
      return { ...mutationError(caught), following: wasFollowing };
    }
  }, []);

  /** Komentar baru terkirim → naikkan hitungan di kartu (optimistic ringan). */
  const bumpComments = useCallback((postId: string, delta: 1) => {
    setItems((current) => current.map((item) => (item.id === postId ? { ...item, comments: Math.max(0, item.comments + delta) } : item)));
  }, []);

  return { filter, setFilter, tab, setTab, items, loading, error, hasNextPage, loadMore, reload: () => load(null, true), savedIds, toggleLike, toggleSave, toggleFollow, bumpComments };
}
