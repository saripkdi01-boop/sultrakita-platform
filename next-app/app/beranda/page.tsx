'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, Compass, Home, LoaderCircle, MapPin, RefreshCw, Search, ShoppingBag, Sparkles, UsersRound } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';
import { useInfiniteFeed } from '@/hooks/useInfiniteFeed';
import { setPostLike } from '@/lib/feed-interactions';
import { SultraKitaUiUpgrade } from '@/components/beranda/SultraKitaUiUpgrade';

export default function BerandaPage() {
  const { items, loading, error, hasNextPage, loadMore, reload } = useInfiniteFeed();
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
        <section className="beranda-discovery-hero" aria-labelledby="beranda-welcome-title">
          <div className="beranda-hero-glow" aria-hidden="true" />
          <div className="beranda-hero-copy">
            <span className="beranda-eyebrow"><MapPin size={13}/> Sulawesi Tenggara, hari ini</span>
            <h1 id="beranda-welcome-title">Temukan cerita, peluang, dan orang-orang di sekitar Anda.</h1>
            <p>Satu ruang untuk berbagi kabar lokal, menemukan produk terbaik, dan membuka peluang baru bersama SUKI.</p>
            <form className="beranda-discovery-search" onSubmit={(event) => { event.preventDefault(); const query = new FormData(event.currentTarget).get('q'); if (typeof query === 'string' && query.trim()) window.location.href = `/marketplace?search=${encodeURIComponent(query.trim())}`; }}>
              <Search size={18} aria-hidden="true"/><input name="q" placeholder="Cari produk, komunitas, atau peluang…" aria-label="Cari di SUKI"/><button type="submit">Cari</button>
            </form>
          </div>
          <div className="beranda-hero-orbit" aria-hidden="true"><span>Komunitas</span><span>Marketplace</span><span>Peluang</span><strong>SUKI</strong></div>
        </section>
        <section className="beranda-intent-grid" aria-label="Jelajahi SUKI">
          <a href="/marketplace"><span className="intent-icon intent-market"><ShoppingBag size={18}/></span><span><strong>Belanja lokal</strong><small>Produk pilihan Sultra</small></span><ArrowRight size={16}/></a>
          <a href="/groups"><span className="intent-icon intent-community"><UsersRound size={18}/></span><span><strong>Gabung komunitas</strong><small>Temukan warga sepemikiran</small></span><ArrowRight size={16}/></a>
          <a href="/jobs"><span className="intent-icon intent-work"><BriefcaseBusiness size={18}/></span><span><strong>Cari peluang</strong><small>Kerja, bisnis, dan kolaborasi</small></span><ArrowRight size={16}/></a>
          <a href="/properti"><span className="intent-icon intent-property"><Home size={18}/></span><span><strong>Jelajahi properti</strong><small>Hunian di Sulawesi Tenggara</small></span><ArrowRight size={16}/></a>
        </section>
        <CreatePostInput onCreate={openComposer}/>
        {notice && <div className="beranda-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Tutup</button></div>}
        {error && <div className="feed-state feed-error" role="alert"><span>{error}</span><button type="button" onClick={reload}><RefreshCw size={15}/> Coba lagi</button></div>}
        {!error && !loading && items.length === 0 && <div className="feed-state"><strong>Belum ada cerita di sini.</strong><span>Coba filter lain atau bagikan cerita pertama Anda.</span></div>}
        <div className="beranda-post-list">{items.map((post) => <FeedPost key={post.id} post={post} onNotice={setNotice} onLike={(id, liked) => { void setPostLike(id, liked).then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.')).catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.')); }} onComment={() => setNotice('Komentar akan hadir pada pembaruan berikutnya. Gunakan Bagikan untuk mengundang percakapan warga.')}/>)}</div>
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
