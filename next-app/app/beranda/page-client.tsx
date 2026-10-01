'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, Compass, Home, LoaderCircle, MapPin, RefreshCw, Search, ShoppingBag, Sparkles, Store, UsersRound } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CreatePostInput } from '@/components/beranda/CreatePostInput';
import { CreatePostModal } from '@/components/beranda/CreatePostModal';
import { FeedPost } from '@/components/beranda/FeedPost';
import { RightSidebar } from '@/components/beranda/RightSidebar';
import { StoriesSection } from '@/components/beranda/StoriesSection';
import { useInfiniteFeed, type FeedFilter } from '@/hooks/useInfiniteFeed';
import { setPostLike } from '@/lib/feed-interactions';
import { supabase } from '@/lib/supabase/client';

type ExploreItem = { href: string; label: string; description: string; Icon: typeof ShoppingBag; tone: string };

const exploreItems: ExploreItem[] = [
  { href: '/marketplace', label: 'Belanja lokal', description: 'Produk pilihan Sultra', Icon: ShoppingBag, tone: 'market' },
  { href: '/groups', label: 'Komunitas', description: 'Temukan warga sepemikiran', Icon: UsersRound, tone: 'community' },
  { href: '/jobs', label: 'Kerja & peluang', description: 'Kolaborasi dan karier lokal', Icon: BriefcaseBusiness, tone: 'work' },
  { href: '/properti', label: 'Ruang & properti', description: 'Hunian dan ruang usaha', Icon: Home, tone: 'property' },
];

const filters: Array<{ value: FeedFilter; label: string }> = [
  { value: 'recommended', label: 'Untuk Anda' },
  { value: 'following', label: 'Mengikuti' },
  { value: 'latest', label: 'Terbaru' },
  { value: 'property', label: 'Properti' },
  { value: 'video', label: 'Video' },
];

const categories = ['Semua', 'Kuliner', 'UMKM', 'Event', 'Wisata', 'Peluang', 'Budaya'];

import { formatEventMonth as formatEventMonthShared, type BerandaEvent, type BerandaProduct } from '@/lib/beranda-types';

// Fase 0 (2026-10-01): data contoh di bawah HANYA dipakai saat development lokal
// (NODE_ENV !== 'production') dan selalu berlabel "Contoh". Di produksi yang tampil
// hanya data nyata dari Supabase, atau empty state jujur bila kosong/gagal.
const isDevPreview = process.env.NODE_ENV !== 'production';
const devProducts: BerandaProduct[] = [
  { id: 'dev-1', title: 'Koleksi tenun pesisir', seller: 'Pengrajin Baubau', place: 'Baubau', tag: 'Contoh', tone: 'sand' },
  { id: 'dev-2', title: 'Oleh-oleh pilihan Sultra', seller: 'Dapur Kendari', place: 'Kendari', tag: 'Contoh', tone: 'peach' },
  { id: 'dev-3', title: 'Kerajinan dari pulau', seller: 'Ruang Wakatobi', place: 'Wakatobi', tag: 'Contoh', tone: 'mint' },
];
const devEvents: BerandaEvent[] = [
  { id: 'dev-1', date: '12', month: 'OKT', title: 'Pasar kreatif warga', place: 'Kendari · akhir pekan', type: 'Contoh' },
  { id: 'dev-2', date: '19', month: 'OKT', title: 'Bersih pesisir bersama', place: 'Wakatobi · komunitas', type: 'Contoh' },
  { id: 'dev-3', date: '26', month: 'OKT', title: 'Kelas mulai usaha', place: 'Baubau · workshop', type: 'Contoh' },
];
const productTones = ['sand', 'peach', 'mint'];

// Fase 1.1: initialProducts/initialEvents di-render di server (SEO + LCP). Client melewati
// fetch pertama bila server sudah menyediakan data (initialReady), feed tetap client-side.
export default function BerandaPage({ initialProducts = [], initialEvents = [], initialReady = false }: { initialProducts?: BerandaProduct[]; initialEvents?: BerandaEvent[]; initialReady?: boolean }) {
  const skipInitialData = useRef(initialReady);
  const { filter, setFilter, items, loading, error, hasNextPage, loadMore, reload } = useInfiniteFeed();
  const [notice, setNotice] = useState('');
  const [composerOpen, setComposerOpen] = useState(false);
  const [composerType, setComposerType] = useState<'post' | 'reel'>('post');
  const [category, setCategory] = useState('Semua');
  const [products, setProducts] = useState<BerandaProduct[]>(initialReady ? (initialProducts.length > 0 || !isDevPreview ? initialProducts : devProducts) : []);
  const [productsLoading, setProductsLoading] = useState(!initialReady);
  const [events, setEvents] = useState<BerandaEvent[]>(initialReady ? (initialEvents.length > 0 || !isDevPreview ? initialEvents : devEvents) : []);
  const [eventsLoading, setEventsLoading] = useState(!initialReady);
  const sentinelRef = useRef<HTMLDivElement>(null);

  function openComposer(type: 'post' | 'reel' = 'post') { setComposerType(type); setComposerOpen(true); }
  useEffect(() => { const compose = new URLSearchParams(window.location.search).get('compose'); if (compose === 'post' || compose === 'reel') openComposer(compose); }, []);
  useEffect(() => { const node = sentinelRef.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); }, { rootMargin: '480px' }); observer.observe(node); return () => observer.disconnect(); }, [loadMore]);

  // Produk nyata dari tabel listings (via /api/listings yang sudah menyaring demo).
  useEffect(() => {
    if (skipInitialData.current) return;
    let active = true;
    fetch('/api/listings?limit=3', { cache: 'no-store' })
      .then(response => response.json())
      .then((result: { ok?: boolean; data?: Array<{ id: string | number; title?: string; district?: string; city?: string; seller?: { name?: string } | null }> }) => {
        if (!active) return;
        const rows = result.ok && Array.isArray(result.data) ? result.data : [];
        const mapped: BerandaProduct[] = rows.slice(0, 3).map((item, index) => ({
          id: String(item.id),
          title: item.title || 'Produk lokal',
          seller: item.seller?.name || 'Penjual lokal',
          place: item.city || item.district || 'Sultra',
          tag: isDevPreview ? 'Nyata' : 'Produk lokal',
          tone: productTones[index % productTones.length],
        }));
        setProducts(mapped.length > 0 || !isDevPreview ? mapped : devProducts);
      })
      .catch(() => { if (active) setProducts(isDevPreview ? devProducts : []); })
      .finally(() => { if (active) setProductsLoading(false); });
    return () => { active = false; };
  }, []);

  // Event komunitas mendatang dari tabel group_events (RLS: grup publik terbaca).
  useEffect(() => {
    if (skipInitialData.current) return;
    let active = true;
    (async () => {
      try {
        if (!supabase) throw new Error('supabase_unavailable');
        const { data, error } = await supabase
          .from('group_events')
          .select('id,title,starts_at,location,groups(name)')
          .gte('starts_at', new Date().toISOString())
          .order('starts_at', { ascending: true })
          .limit(3);
        if (error) throw error;
        const mapped: BerandaEvent[] = (data || []).map((event: { id: string; title?: string; starts_at?: string; location?: string; groups?: { name?: string } | Array<{ name?: string }> | null }) => {
          const startsAt = event.starts_at || '';
          const date = new Date(startsAt);
          const groupName = Array.isArray(event.groups) ? event.groups[0]?.name : event.groups?.name;
          return {
            id: String(event.id),
            date: Number.isNaN(date.getTime()) ? '–' : String(date.getDate()).padStart(2, '0'),
            month: formatEventMonthShared(startsAt),
            title: event.title || 'Kegiatan komunitas',
            place: [groupName, event.location].filter(Boolean).join(' · ') || 'Sulawesi Tenggara',
            type: 'Komunitas',
          };
        });
        if (active) setEvents(mapped.length > 0 || !isDevPreview ? mapped : devEvents);
      } catch {
        if (active) setEvents(isDevPreview ? devEvents : []);
      } finally {
        if (active) setEventsLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q');
    if (typeof query === 'string' && query.trim()) window.location.href = `/marketplace?search=${encodeURIComponent(query.trim())}`;
  }

  return <AppLayout active="home" onCreate={openComposer}>
    <main className="beranda-v4-page">
      <div className="beranda-v4-container">
        <section className="beranda-v4-hero" aria-labelledby="beranda-v4-title">
          <div className="beranda-v4-hero-copy">
            <span className="beranda-v4-kicker"><MapPin size={14}/> Sulawesi Tenggara, hari ini</span>
            <h1 id="beranda-v4-title">Yang dekat,<br /><em>jadi berarti.</em></h1>
            <p>Temukan cerita, orang, peluang, dan produk lokal yang sedang tumbuh di sekitar Anda.</p>
            <form className="beranda-v4-search" onSubmit={search} role="search">
              <Search size={18} aria-hidden="true" /><input name="q" placeholder="Cari cerita, tempat, produk, atau komunitas..." aria-label="Cari di SUKI" /><button type="submit">Cari</button>
            </form>
            <div className="beranda-v4-location"><span className="beranda-v4-live-dot" /> Menampilkan kabar dari <strong>Kendari</strong><button type="button" onClick={() => setNotice('Pemilihan kabupaten/kota akan tersedia segera.')}>Ganti lokasi</button></div>
          </div>
          <div className="beranda-v4-hero-art" aria-label="Ekosistem SUKI" role="img"><div className="beranda-v4-art-orbit" /><div className="beranda-v4-art-center"><img src="/brand/suki-logo-mark.svg" alt="" /><strong>SUKI</strong><small>ruang lokal</small></div><span className="beranda-v4-art-chip chip-top">Cerita warga</span><span className="beranda-v4-art-chip chip-right">Usaha lokal</span><span className="beranda-v4-art-chip chip-bottom">Peluang tumbuh</span></div>
        </section>

        <section className="beranda-v4-pulse" aria-label="Aktivitas lokal"><div><span className="beranda-v4-pulse-mark"><Sparkles size={15}/></span><strong>Hari ini di SUKI</strong><small>Ruang lokal yang sedang bergerak</small></div><div className="beranda-v4-pulse-items"><span><b>Warga</b><small>berbagi cerita</small></span><span><b>Usaha</b><small>menemukan pelanggan</small></span><span><b>Komunitas</b><small>membuat kegiatan</small></span></div></section>

        <section className="beranda-v4-explore" aria-labelledby="explore-title"><div className="beranda-v4-section-head"><div><span className="beranda-v4-eyebrow">Mulai dari sini</span><h2 id="explore-title">Jelajahi ruang yang paling dekat.</h2></div><a href="/help-center">Bagaimana cara kerja SUKI <ArrowRight size={15}/></a></div><div className="beranda-v4-explore-grid">{exploreItems.map(({ href, label, description, Icon, tone }) => <a key={href} href={href} className="beranda-v4-explore-card"><span className={`beranda-v4-explore-icon ${tone}`}><Icon size={19}/></span><span><strong>{label}</strong><small>{description}</small></span><ArrowRight size={16}/></a>)}</div></section>

        <div className="beranda-v4-layout">
          <div className="beranda-v4-main">
            <StoriesSection onCreate={() => openComposer('post')} />
            <CreatePostInput onCreate={openComposer}/>
            {notice && <div className="beranda-notice" role="status"><span>{notice}</span><button type="button" onClick={() => setNotice('')}>Tutup</button></div>}
            <section className="beranda-v4-feed-head" aria-labelledby="feed-title"><div><span className="beranda-v4-eyebrow">Ruang warga</span><h2 id="feed-title">Cerita yang sedang menggerakkan Sultra</h2><p>Temukan kabar dan percakapan dari orang-orang di sekitar Anda.</p></div><a href="/groups">Lihat semua <ArrowRight size={15}/></a></section>
            <div className="beranda-v4-filter-row" aria-label="Filter cerita"><div className="beranda-v4-filters">{filters.map(item => <button key={item.value} type="button" className={filter === item.value ? 'is-active' : ''} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div><div className="beranda-v4-category-row">{categories.map(item => <button key={item} type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
            {error && <div className="feed-state feed-error" role="alert"><span>{error}</span><button type="button" onClick={reload}><RefreshCw size={15}/> Coba lagi</button></div>}
            {!error && !loading && items.length === 0 && <div className="feed-state"><strong>Belum ada cerita di sini.</strong><span>Coba filter lain atau bagikan cerita pertama Anda.</span></div>}
            <div className="beranda-post-list">{items.map(post => <FeedPost key={post.id} post={post} onNotice={setNotice} onLike={(id, liked) => { void setPostLike(id, liked).then(() => setNotice(liked ? 'Suka dicatat.' : 'Suka dibatalkan.')).catch((caught: unknown) => setNotice(caught instanceof Error && caught.message === 'authentication_required' ? 'Silakan login untuk menyukai postingan.' : 'Interaksi belum dapat disimpan.')); }} onComment={() => setNotice('Komentar akan hadir pada pembaruan berikutnya. Gunakan Bagikan untuk mengundang percakapan warga.')} />)}</div>
            {loading && <div className="beranda-v4-loading" aria-live="polite"><LoaderCircle size={18} className="spin"/> Memuat cerita warga...</div>}
            <div ref={sentinelRef} className="feed-sentinel" aria-hidden="true" />{!hasNextPage && items.length > 0 && !loading && <p className="feed-end">Anda sudah melihat semua cerita terbaru.</p>}

            <section className="beranda-v4-section" aria-labelledby="market-title"><div className="beranda-v4-section-head"><div><span className="beranda-v4-eyebrow">Belanja dari yang dekat</span><h2 id="market-title">Produk dengan cerita.</h2></div><a href="/marketplace">Lihat marketplace <ArrowRight size={15}/></a></div><div className="beranda-v4-product-grid">{productsLoading ? [1, 2, 3].map(item => <div key={item} className="beranda-v4-product"><div className="beranda-v4-product-art sand animate-pulse" /><div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" /><div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" /></div>) : products.length > 0 ? products.map(product => <a href={`/marketplace?listing=${encodeURIComponent(product.id)}`} className="beranda-v4-product" key={product.id}><div className={`beranda-v4-product-art ${product.tone}`}><ShoppingBag size={27}/><span>{product.tag}</span></div><strong>{product.title}</strong><small>{product.seller} · {product.place}</small><b>Lihat produk <ArrowRight size={13}/></b></a>) : <div className="feed-state"><strong>Belum ada produk yang ditampilkan.</strong><span>Jadilah yang pertama memasang produk di marketplace.</span></div>}</div></section>

            <section className="beranda-v4-section" aria-labelledby="events-title"><div className="beranda-v4-section-head"><div><span className="beranda-v4-eyebrow">Temukan kegiatan di sekitarmu</span><h2 id="events-title">Ada yang bisa diikuti.</h2></div><a href="/groups">Jelajahi komunitas <ArrowRight size={15}/></a></div><div className="beranda-v4-event-grid">{eventsLoading ? [1, 2, 3].map(item => <div key={item} className="beranda-v4-event"><div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" /><div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" /></div>) : events.length > 0 ? events.map(event => <a className="beranda-v4-event" href="/groups" key={event.id}><span className="beranda-v4-date"><b>{event.date}</b><small>{event.month}</small></span><span><strong>{event.title}</strong><small>{event.place}</small><em>{event.type}</em></span><ArrowRight size={16}/></a>) : <div className="feed-state"><strong>Belum ada kegiatan terjadwal.</strong><span>Buat kegiatan di komunitasmu dan undang warga.</span></div>}</div></section>
          </div>
          <aside className="beranda-v4-rail"><section className="beranda-v4-opportunity"><span className="beranda-v4-opportunity-icon"><Compass size={20}/></span><span className="beranda-v4-eyebrow">Peluang hari ini</span><h2>Mulai dari hal yang bisa kamu lakukan.</h2><p>Temukan kerja, kolaborasi, volunteer, dan ruang untuk mengembangkan ide lokal.</p><a href="/jobs">Lihat peluang <ArrowRight size={15}/></a></section><section className="beranda-v4-trust"><span className="beranda-v4-eyebrow">Dibangun untuk warga</span><h2>Local-first. Tetap terpercaya.</h2><p>SUKI menjaga agar cerita, usaha, dan koneksi lokal tetap dekat, relevan, dan manusiawi.</p><ul><li><Check size={15}/> Profil dan usaha dapat diverifikasi</li><li><Check size={15}/> Konten dapat dilaporkan</li><li><Check size={15}/> Aksi warga tetap transparan</li></ul></section><RightSidebar /></aside>
        </div>
      </div>
    </main>
    <CreatePostModal open={composerOpen} initialType={composerType} onClose={() => setComposerOpen(false)} onCreated={(message) => { setNotice(message); reload(); }}/>
  </AppLayout>;
}
