'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Compass, LoaderCircle, MoreHorizontal, RefreshCw, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import { StoriesSection } from '@/components/beranda/StoriesSection';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';
import { useInfiniteFeed, type FeedFilter } from '@/hooks/useInfiniteFeed';
import { setPostLike } from '@/lib/feed-interactions';

const filters: Array<{ value: FeedFilter; label: string }> = [
  { value: 'recommended', label: 'Rekomendasi' }, { value: 'following', label: 'Mengikuti' }, { value: 'latest', label: 'Terbaru' }, { value: 'property', label: 'Properti' }, { value: 'video', label: 'Video' },
];
const filterDescriptions: Record<FeedFilter, string> = { recommended: 'Pilihan paling relevan untukmu', following: 'Cerita dari warga yang kamu ikuti', latest: 'Kabar terbaru dari komunitas', property: 'Peluang properti dan tempat tinggal', video: 'Reels dan cerita dalam video' };

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
    <main className="beranda-shell" aria-labelledby="beranda-title">
      <div className="beranda-main">
        <div className="beranda-feed-heading beranda-feed-heading-compact"><div><p className="beranda-eyebrow">Ruang warga Sulawesi Tenggara</p><h1 id="beranda-title">Beranda</h1></div><button type="button" className="beranda-filter" aria-label="Opsi beranda"><MoreHorizontal size={18}/></button></div>
        <div className="feed-toolbar" role="tablist" aria-label="Filter feed">{filters.map((item) => <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)}>{filter === item.value && <Check size={14} aria-hidden="true"/>}{item.label}</button>)}</div>
        <div className="beranda-feed-tools"><div><span><Sparkles size={13}/> {filterDescriptions[filter]}</span><small>{items.length ? `${items.length} cerita dimuat` : 'Jelajahi cerita warga'}</small></div><button type="button" onClick={reload} disabled={loading} aria-label="Muat ulang feed"><RefreshCw size={15} className={loading ? 'spin' : ''}/> Segarkan</button></div>
        <StoriesSection/><EcosystemSlider appSlug="marketplace"/><CreatePostInput onCreate={openComposer}/>
        <div className="beranda-quick-actions" aria-label="Akses cepat Beranda"><a href="/groups"><Compass size={16}/><span>Temukan komunitas</span></a><a href="/properti"><span className="quick-action-icon">SK</span><span>Jelajahi properti</span></a><button type="button" onClick={() => openComposer('post')}><Sparkles size={16}/><span>Bagikan kabar</span></button></div>
        {notice && <div className="beranda-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Tutup</button></div>}
        {error && <div className="feed-state feed-error" role="alert"><span>{error}</span><button type="button" onClick={reload}><RefreshCw size={15}/> Coba lagi</button></div>}
        {!error && !loading && items.length === 0 && <div className="feed-state"><strong>Belum ada cerita di sini.</strong><span>Coba filter lain atau bagikan cerita pertama Anda.</span></div>}
        <div className="beranda-post-list">{items.map((post) => <FeedPost key={post.id} post={post} onNotice={setNotice} onLike={(id, liked) => { void setPostLike(id, liked).then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.')).catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.')); }} onComment={() => setNotice('Komentar akan hadir pada pembaruan berikutnya. Gunakan Bagikan untuk mengundang percakapan warga.')}/>)}</div>
        {loading && <div className="feed-loading" aria-live="polite"><LoaderCircle size={18} className="spin"/> Memuat cerita warga...</div>}
        <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />{!hasNextPage && items.length > 0 && !loading && <p className="feed-end">Anda sudah melihat semua cerita terbaru.</p>}
      </div>
      <RightSidebar/>
    </main>
    <CreatePostModal open={composerOpen} initialType={composerType} onClose={() => setComposerOpen(false)} onCreated={(message) => { setNotice(message); reload(); }}/>
  </AppLayout>;
}
