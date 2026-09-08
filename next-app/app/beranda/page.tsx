'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, LoaderCircle, MoreHorizontal, RefreshCw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { FeedPost } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import { StoriesSection } from '@/components/beranda/StoriesSection';
import { useInfiniteFeed, type FeedFilter } from '@/hooks/useInfiniteFeed';
import { setPostLike } from '@/lib/feed-interactions';

const filters: Array<{ value: FeedFilter; label: string }> = [
  { value: 'recommended', label: 'Rekomendasi' },
  { value: 'following', label: 'Mengikuti' },
  { value: 'latest', label: 'Terbaru' },
  { value: 'property', label: 'Properti' },
  { value: 'video', label: 'Video' },
];

export default function BerandaPage() {
  const { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload } = useInfiniteFeed();
  const [notice, setNotice] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { rootMargin: '480px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return <AppLayout active="home"><main className="beranda-shell"><div className="beranda-main">
    <div className="beranda-feed-heading beranda-feed-heading-compact"><button className="beranda-filter" aria-label="Opsi beranda"><MoreHorizontal size={18}/></button></div>
    <div className="feed-toolbar" role="tablist" aria-label="Filter feed">{filters.map((item) => <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)}>{filter === item.value && <Check size={14}/>} {item.label}</button>)}</div>
    <StoriesSection/><CreatePostInput onCreate={() => setNotice('Buat postingan siap digunakan setelah Anda login.')}/>
    {notice && <div className="beranda-notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')}>Tutup</button></div>}
    {error && <div className="feed-state feed-error" role="alert"><span>{error}</span><button type="button" onClick={reload}><RefreshCw size={15}/> Coba lagi</button></div>}
    {!error && !loading && items.length === 0 && <div className="feed-state"><strong>Belum ada cerita di sini.</strong><span>Coba filter lain atau kembali lagi nanti.</span></div>}
    {items.map((post) => <FeedPost key={post.id} post={post} onLike={(id, liked) => { void setPostLike(id, liked).then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.')).catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.')); }} onComment={() => setNotice('Kolom komentar akan tersedia setelah Anda login.')}/>)}
    {loading && <div className="feed-loading" aria-live="polite"><LoaderCircle size={18} className="spin"/> Memuat cerita warga...</div>}
    <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />
    {!hasNextPage && items.length > 0 && !loading && <p className="feed-end">Anda sudah melihat semua cerita terbaru.</p>}
  </div><RightSidebar/></main></AppLayout>;
}
