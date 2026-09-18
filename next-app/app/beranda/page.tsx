'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Compass,
  Home,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  ShoppingBag,
  Sparkles,
  UsersRound,
  Video,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost } from '@/components/beranda/FeedPost';
import EcosystemSlider from '@/components/marketing/EcosystemSlider';
import { useInfiniteFeed, type FeedFilter } from '@/hooks/useInfiniteFeed';
import { setPostLike } from '@/lib/feed-interactions';

const filters: Array<{ id: FeedFilter; label: string; description: string }> = [
  { id: 'recommended', label: 'Untuk Anda', description: 'Cerita yang paling relevan' },
  { id: 'following', label: 'Mengikuti', description: 'Orang dan komunitas yang Anda ikuti' },
  { id: 'latest', label: 'Terbaru', description: 'Percakapan terbaru di Sultra' },
  { id: 'property', label: 'Properti', description: 'Temukan kabar dan listing properti' },
  { id: 'video', label: 'Video', description: 'Reels dan cerita berbentuk video' },
];

const discoveryItems = [
  { href: '/marketplace', icon: ShoppingBag, title: 'Marketplace', text: 'Temukan produk dan jasa lokal.' },
  { href: '/groups', icon: UsersRound, title: 'Komunitas', text: 'Masuk ke ruang warga yang relevan.' },
  { href: '/jobs', icon: BriefcaseBusiness, title: 'Peluang', text: 'Cari kerja, proyek, dan kolaborasi.' },
  { href: '/properti', icon: Building2, title: 'Properti', text: 'Jelajahi hunian dan aset di Sultra.' },
];

export default function BerandaPage() {
  const { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload } = useInfiniteFeed();
  const [notice, setNotice] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'post' | 'reel'>('post');
  const sentinelRef = useRef<HTMLDivElement>(null);

  function openComposer(type: 'post' | 'reel' = 'post') {
    setComposerType(type);
    setComposerOpen(true);
  }

  useEffect(() => {
    const compose = new URLSearchParams(window.location.search).get('compose');
    if (compose === 'post' || compose === 'reel') openComposer(compose);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasNextPage) loadMore();
      },
      { rootMargin: '560px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, loadMore, loading]);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q');
    if (typeof query === 'string' && query.trim()) {
      window.location.href = `/marketplace?search=${encodeURIComponent(query.trim())}`;
    }
  }

  return (
    <AppLayout active="home" onCreate={openComposer}>
      <main className="beranda-page" id="beranda">
        <div className="beranda-container">
          <section className="beranda-hero" aria-labelledby="beranda-title">
            <div className="beranda-hero-content">
              <span className="beranda-eyebrow"><MapPin size={14} aria-hidden="true" /> Sulawesi Tenggara · ruang digital lokal</span>
              <h1 id="beranda-title">Satu beranda untuk <em>cerita, peluang, dan kebutuhan lokal.</em></h1>
              <p>Temukan percakapan warga, komunitas, produk, pekerjaan, dan properti dalam satu pengalaman SUKI yang lebih terarah.</p>
              <form className="beranda-search-panel" onSubmit={handleSearch} role="search">
                <Search size={19} aria-hidden="true" />
                <input name="q" placeholder="Cari produk, komunitas, pekerjaan, atau properti…" aria-label="Cari di SUKI" autoComplete="off" />
                <button type="submit">Cari</button>
              </form>
              <div className="beranda-hero-links" aria-label="Akses cepat">
                <a href="/reels"><Video size={15} /> Lihat Reels</a>
                <a href="/campaigns"><Sparkles size={15} /> Campaign Hub</a>
                <a href="/ajak-teman"><UsersRound size={15} /> Ajak Teman</a>
              </div>
            </div>
            <div className="beranda-hero-visual" aria-hidden="true">
              <div className="beranda-orbit orbit-a" />
              <div className="beranda-orbit orbit-b" />
              <div className="beranda-hero-card hero-card-main">
                <span className="beranda-card-icon"><Compass size={19} /></span>
                <div><small>Local discovery</small><strong>Temukan yang dekat dengan Anda</strong></div>
              </div>
              <div className="beranda-hero-card hero-card-mini"><span>04</span><small>ruang utama</small></div>
            </div>
          </section>

          <section className="beranda-discovery" aria-labelledby="discovery-title">
            <div className="beranda-section-heading">
              <div><span className="beranda-kicker">Mulai dari sini</span><h2 id="discovery-title">Apa yang sedang Anda cari?</h2></div>
              <span className="beranda-heading-note">Pilih tujuan, lalu lanjutkan ke ruang yang sesuai.</span>
            </div>
            <div className="beranda-discovery-grid">
              {discoveryItems.map(({ href, icon: Icon, title, text }) => (
                <a href={href} key={href} className="beranda-discovery-card">
                  <span className="beranda-discovery-icon"><Icon size={19} aria-hidden="true" /></span>
                  <span className="beranda-discovery-copy"><strong>{title}</strong><small>{text}</small></span>
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>

          <div className="beranda-content-grid">
            <div className="beranda-feed-column">
              <section className="beranda-feed-intro" aria-labelledby="feed-title">
                <div>
                  <span className="beranda-kicker">Community pulse</span>
                  <h2 id="feed-title">Cerita warga</h2>
                  <p>Ikuti apa yang sedang terjadi di sekitar Anda tanpa kehilangan akses ke kebutuhan lokal lainnya.</p>
                </div>
                <a href="/reels" className="beranda-text-link">Eksplor video <ArrowRight size={15} /></a>
              </section>

              <div className="beranda-filter-wrap" role="tablist" aria-label="Filter cerita warga">
                {filters.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === item.id}
                    title={item.description}
                    className={filter === item.id ? 'is-active' : ''}
                    onClick={() => setFilter(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <CreatePostInput onCreate={openComposer} />

              {notice && (
                <div className="beranda-notice" role="status" aria-live="polite">
                  <span>{notice}</span>
                  <button type="button" onClick={() => setNotice('')}>Tutup</button>
                </div>
              )}

              {error && (
                <div className="beranda-state beranda-state-error" role="alert">
                  <div><strong>Feed belum dapat dimuat.</strong><span>{error}</span></div>
                  <button type="button" onClick={reload}><RefreshCw size={15} /> Coba lagi</button>
                </div>
              )}

              {!error && loading && items.length === 0 && (
                <div className="beranda-skeleton-stack" aria-label="Memuat cerita" aria-live="polite">
                  {[1, 2, 3].map((item) => <div className="beranda-skeleton" key={item}><span /><div><i /><i /><i /></div></div>)}
                </div>
              )}

              {!error && !loading && items.length === 0 && (
                <div className="beranda-state">
                  <Compass size={22} aria-hidden="true" />
                  <strong>Belum ada cerita untuk filter ini.</strong>
                  <span>Coba pilihan lain atau bagikan cerita pertama Anda.</span>
                  <button type="button" onClick={() => openComposer('post')}>Bagikan cerita</button>
                </div>
              )}

              <div className="beranda-post-list" id="cerita-warga">
                {items.map((post) => (
                  <FeedPost
                    key={post.id}
                    post={post}
                    onNotice={setNotice}
                    onLike={(id, liked) => {
                      void setPostLike(id, liked)
                        .then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.'))
                        .catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.'));
                    }}
                    onComment={() => setNotice('Komentar akan hadir pada pembaruan berikutnya. Gunakan Bagikan untuk mengundang percakapan warga.')}
                  />
                ))}
              </div>

              <EcosystemSlider appSlug="marketplace" />

              <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />
              {loading && items.length > 0 && <div className="feed-loading" aria-live="polite"><LoaderCircle size={18} className="spin" /> Memuat cerita berikutnya…</div>}
              {!hasNextPage && items.length > 0 && !loading && <p className="feed-end">Anda sudah melihat semua cerita terbaru.</p>}
            </div>

            <aside className="beranda-utility-column" aria-label="Akses SUKI">
              <section className="beranda-utility-card beranda-utility-primary">
                <span className="beranda-kicker">SUKI ecosystem</span>
                <h2>Satu identitas, banyak ruang untuk bergerak.</h2>
                <p>Gunakan navigasi SUKI untuk berpindah dari percakapan warga ke marketplace, pekerjaan, komunitas, dan properti tanpa kehilangan konteks.</p>
                <a href="/groups">Jelajahi komunitas <ArrowRight size={15} /></a>
              </section>
              <section className="beranda-utility-card">
                <div className="beranda-utility-heading"><h2>Aksi cepat</h2><Sparkles size={17} aria-hidden="true" /></div>
                <a href="/marketplace"><ShoppingBag size={17} /><span><strong>Belanja lokal</strong><small>Produk dan jasa</small></span><ArrowRight size={15} /></a>
                <a href="/jobs"><BriefcaseBusiness size={17} /><span><strong>Cari peluang</strong><small>Kerja dan kolaborasi</small></span><ArrowRight size={15} /></a>
                <a href="/properti"><Home size={17} /><span><strong>Jelajah properti</strong><small>Hunian dan aset</small></span><ArrowRight size={15} /></a>
              </section>
              <section className="beranda-utility-card beranda-utility-note">
                <MapPin size={17} aria-hidden="true" />
                <div><strong>Dibangun untuk Sultra.</strong><span>Bahasa, kebutuhan, dan perjalanan pengguna tetap berangkat dari konteks lokal.</span></div>
              </section>
            </aside>
          </div>
        </div>
      </main>

      <CreatePostModal open={composerOpen} initialType={composerType} onClose={() => setComposerOpen(false)} onCreated={(message) => { setNotice(message); reload(); }} />
    </AppLayout>
  );
}
