'use client';

import { useEffect, useRef, useState } from 'react';
import { Compass, LoaderCircle, RefreshCw, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';
import { useInfiniteFeed } from '@/hooks/useInfiniteFeed';
import type { FeedFilter } from '@/lib/feed-contract';
import { setPostLike } from '@/lib/feed-interactions';
import { SultraKitaUiUpgrade } from '@/components/beranda/SultraKitaUiUpgrade';

export default function BerandaPage() {
  const { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload } = useInfiniteFeed();
  const [notice, setNotice] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'post' | 'reel'>('post');
  const sentinelRef = useRef<HTMLDivElement>(null);
  function openComposer(type: 'post' | 'reel' = 'post') { setComposerType(type); setComposerOpen(true); }
  useEffect(() => { const compose = new URLSearchParams(window.location.search).get('compose'); if (compose === 'post' || compose === 'reel') openComposer(compose); }, []);
  useEffect(() => { const node = sentinelRef.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { rootMargin: '480px' }); observer.observe(node); return () => observer.disconnect(); }, [loadMore]);
  return <AppLayout active="home" onCreate={openComposer}>
    <main className="beranda-shell">
      <div className="beranda-main">
        <CreatePostInput onCreate={openComposer}/>
        <nav className="feed-tabs" aria-label="Jenis beranda" role="tablist">
          {([['recommended', 'Rekomendasi'], ['following', 'Mengikuti'], ['latest', 'Terbaru'], ['property', 'Properti'], ['video', 'Video']] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={filter === value} className={filter === value ? 'feed-tab is-active focus-ring' : 'feed-tab focus-ring'} onClick={() => setFilter(value as FeedFilter)}>{label}</button>)}
        </nav>
        {notice && <div className="beranda-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Tutup</button></div>}
        {error && <div className="feed-state feed-error" role="alert"><span>{error}</span><button type="button" onClick={reload}><RefreshCw size={15}/> Coba lagi</button></div>}
        {!error && !loading && items.length === 0 && <div className="feed-state"><strong>Belum ada cerita di sini.</strong><span>Coba filter lain atau bagikan cerita pertama Anda.</span></div>}
        <div className="beranda-post-list">{items.map((post) => <FeedPost key={post.id} post={post} onNotice={setNotice} onLike={(id, liked) => { void setPostLike(id, liked).then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.')).catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.')); }} onComment={() => undefined}/>)}</div>
        <SultraKitaUiUpgrade />
        <EcosystemSlider appSlug="marketplace"/>
        <div className="beranda-quick-actions" aria-label="Akses cepat Beranda"><a href="/groups"><Compass size={16}/><span>Komunitas</span></a><a href="/properti"><span className="quick-action-icon">SK</span><span>Properti</span></a><a href="/jobs"><span className="quick-action-icon">JOB</span><span>Peluang kerja</span></a><button type="button" onClick={() => openComposer('post')}><Sparkles size={16}/><span>Bagikan kabar</span></button></div>
        {loading && <div className="feed-loading" aria-live="polite"><LoaderCircle size={18} className="spin"/> Memuat cerita warga...</div>}
        <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />{!hasNextPage && items.length > 0 && !loading && <p className="feed-end">Anda sudah melihat semua cerita terbaru.</p>}
      </div>
      <RightSidebar/>
    </main>
    <CreatePostModal open={composerOpen} initialType={composerType} onClose={() => setComposerOpen(false)} onCreated={(message) => { setNotice(message); reload(); }}/>
  </AppLayout>;
}
