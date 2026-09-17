 'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleCheck,
  Compass,
  HeartHandshake,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  X,
  ShieldCheck,
  MapPin,
  Store,
  Handshake,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

const products = [
  {
    icon: ShoppingBag,
    tone: 'mint',
    kicker: 'Marketplace',
    title: 'Produk lokal',
    text: 'Temukan kebutuhan sehari-hari sekaligus beri ruang lebih besar untuk usaha lokal.',
    href: '/marketplace',
  },
  {
    icon: Building2,
    tone: 'sand',
    kicker: 'Properti',
    title: 'Ruang & properti',
    text: 'Jelajahi rumah, ruang, dan peluang properti untuk kebutuhan berikutnya.',
    href: '/properti',
  },
  {
    icon: BriefcaseBusiness,
    tone: 'blue',
    kicker: 'Peluang',
    title: 'Kerja & karier',
    text: 'Temukan peluang kerja dan buka koneksi baru dengan talenta di sekitar Anda.',
    href: '/jobs',
  },
  {
    icon: Users,
    tone: 'coral',
    kicker: 'Komunitas',
    title: 'Ruang warga',
    text: 'Ikuti percakapan, berbagi cerita, dan bangun jejaring yang terasa lebih dekat.',
    href: '/groups',
  },
];

const actions = [
  { icon: ShoppingBag, label: 'Belanja lokal', href: '/marketplace' },
  { icon: Building2, label: 'Cari properti', href: '/properti' },
  { icon: BriefcaseBusiness, label: 'Cari pekerjaan', href: '/jobs' },
  { icon: Users, label: 'Gabung komunitas', href: '/groups' },
  { icon: Store, label: 'Kembangkan bisnis', href: '/Business' },
];

const steps = [
  ['01', 'Temukan', 'Cari produk, ruang, peluang, dan komunitas dari satu titik masuk.'],
  ['02', 'Terhubung', 'Lanjutkan ke ruang yang tepat untuk berinteraksi dan membangun koneksi.'],
  ['03', 'Bertumbuh', 'Hadirkan usaha, karya, peluang, atau kontribusi Anda ke ekosistem lokal.'],
];

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <div className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}

export default function HomeClient() {
  const [announcement, setAnnouncement] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeAction, setActiveAction] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px' }
    );
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}`);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <main className="marketing-shell">
      {announcement && (
        <div className="announcement" role="status">
          <div><Sparkles size={14} aria-hidden="true" /><span><strong>SUKI Apps</strong> — satu ruang digital untuk peluang dan kebutuhan lokal Sultra.</span></div>
          <button onClick={() => setAnnouncement(false)} aria-label="Tutup pengumuman"><X size={16} /></button>
        </div>
      )}

      <header className={`marketing-nav ${mobileOpen ? 'nav-open' : ''}`}>
        <Link href="/" className="marketing-brand" aria-label="SUKI Apps beranda" onClick={closeMenu}>
          <span className="marketing-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span>
          <span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
        </Link>

        <nav className="marketing-links" aria-label="Navigasi utama">
          <a href="#ekosistem" onClick={closeMenu}>Ekosistem</a>
          <a href="#cara-kerja" onClick={closeMenu}>Cara kerja</a>
          <a href="#lokal" onClick={closeMenu}>Tentang SUKI</a>
          <Link href="/Business" onClick={closeMenu}>Untuk bisnis</Link>
        </nav>

        <div className="marketing-nav-actions">
          <Link href="/login" className="marketing-login">Masuk</Link>
          <Link href="/beranda" className="marketing-nav-cta">Jelajahi SUKI <ArrowRight size={15} /></Link>
        </div>

        <button className="mobile-nav-toggle" aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen(value => !value)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="marketing-hero" aria-labelledby="hero-title" ref={heroRef}>
        <div className="hero-glow hero-glow-one" aria-hidden="true" />
        <div className="hero-glow hero-glow-two" aria-hidden="true" />
        <div className="marketing-hero-copy">
          <Reveal>
            <p className="marketing-eyebrow"><span className="eyebrow-dot" /> Ekosistem digital Sulawesi Tenggara</p>
          </Reveal>
          <Reveal delay={70}>
            <h1 id="hero-title">Yang dekat, jadi lebih <em>mudah ditemukan.</em></h1>
          </Reveal>
          <Reveal delay={130}>
            <p className="marketing-hero-lede">SUKI Apps menyatukan produk lokal, properti, peluang kerja, komunitas, dan layanan bisnis dalam satu ruang digital yang terasa dekat dengan Sultra.</p>
          </Reveal>
          <Reveal delay={190}>
            <div className="marketing-hero-actions">
              <Link href="/beranda" className="marketing-button marketing-button-primary">Mulai menjelajah <ArrowRight size={17} /></Link>
              <Link href="/Business" className="marketing-button marketing-button-secondary">Saya punya bisnis <BriefcaseBusiness size={16} /></Link>
            </div>
          </Reveal>
          <Reveal delay={250}>
            <div className="marketing-proof-line"><CircleCheck size={16} /> Dirancang untuk warga, pelaku usaha, dan mitra lokal</div>
          </Reveal>
        </div>

        <Reveal className="marketing-hero-visual" delay={150}>
          <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-b" aria-hidden="true" />
          <div className="hero-node node-one"><ShoppingBag size={15} /><span>Marketplace</span></div>
          <div className="hero-node node-two"><Users size={15} /><span>Komunitas</span></div>
          <div className="hero-node node-three"><BriefcaseBusiness size={15} /><span>Peluang</span></div>
          <div className="hero-visual-label"><Sparkles size={14} /> Satu ekosistem, banyak langkah</div>
          <div className="hero-card hero-card-main">
            <div className="hero-card-top"><span className="hero-card-icon"><Compass size={18} /></span><span>Ruang lokal</span><span className="hero-card-live"><i /> Aktif</span></div>
            <strong>Temukan yang dekat denganmu.</strong>
            <p>Produk, properti, peluang, dan cerita warga dalam satu ruang.</p>
            <label className="hero-search"><Search size={15} /><input aria-label="Cari di pratinjau SUKI" value={search} onChange={event => setSearch(event.target.value)} placeholder="Cari produk, lokasi, atau peluang" /></label>
            {search && <span className="search-hint">Pratinjau pencarian: <b>{search}</b></span>}
          </div>
          <div className="hero-card hero-card-float hero-card-community"><span className="mini-avatar">SU</span><div><b>Komunitas</b><small>Ruang untuk terhubung</small></div><MessageCircle size={16} /></div>
          <div className="hero-card hero-card-float hero-card-business"><HeartHandshake size={16} /><div><b>Untuk bisnis</b><small>Bangun eksistensi lokal</small></div></div>
        </Reveal>
      </section>

      <section className="quick-access" aria-label="Akses cepat">
        <div className="quick-access-label"><span>Akses cepat</span><small>Mulai dari kebutuhan Anda</small></div>
        <div className="quick-access-list">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return <Link href={action.href} className={`quick-action ${activeAction === index ? 'active' : ''}`} key={action.label} onMouseEnter={() => setActiveAction(index)} onFocus={() => setActiveAction(index)}>
              <span><Icon size={17} /></span>{action.label}<ChevronRight size={14} />
            </Link>;
          })}
        </div>
      </section>

      <section className="marketing-section marketing-promise" id="cara-kerja">
        <div className="section-intro-grid">
          <Reveal>
            <p className="marketing-eyebrow">Lebih dari sekadar marketplace</p>
            <h2>Hal-hal lokal yang penting, dibuat lebih mudah ditemukan.</h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="marketing-section-intro">Dari kebutuhan sehari-hari sampai peluang baru, SUKI menyatukan beberapa ruang digital agar perjalanan Anda tidak perlu dimulai dari tempat yang berbeda-beda.</p>
          </Reveal>
        </div>
        <div className="promise-grid">
          {steps.map(([number, title, text], index) => <Reveal delay={index * 70} key={number}><article className="promise-card"><span className="promise-number">{number}</span><div><h3>{title}</h3><p>{text}</p></div><ArrowRight size={17} /></article></Reveal>)}
        </div>
      </section>

      <section className="marketing-section ecosystem-section" id="ekosistem">
        <Reveal>
          <div className="marketing-section-heading split-heading">
            <div><p className="marketing-eyebrow">Ekosistem SUKI</p><h2>Satu tempat untuk banyak kemungkinan.</h2></div>
            <Link href="/beranda" className="marketing-text-link">Buka aplikasi <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="product-grid">
          {products.map((product, index) => {
            const Icon = product.icon;
            return <Reveal delay={index * 65} key={product.title}><Link href={product.href} className={`product-card product-${product.tone}`}>
              <div className="product-card-top"><span className="product-icon"><Icon size={20} /></span><span className="product-kicker">{product.kicker}</span></div>
              <h3>{product.title}</h3><p>{product.text}</p>
              <span className="product-link">Jelajahi <ChevronRight size={15} /></span>
            </Link></Reveal>;
          })}
        </div>
      </section>

      <section className="discovery-panel" id="lokal">
        <Reveal className="discovery-copy">
          <p className="marketing-eyebrow">Dari Sultra, untuk Sultra</p>
          <h2>Teknologi yang tetap terasa manusiawi.</h2>
          <p>SUKI dibangun untuk membuat hal-hal yang dekat menjadi lebih mudah diakses—tanpa menghilangkan konteks, percakapan, dan hubungan yang membuat ekosistem lokal hidup.</p>
          <div className="discovery-points">
            <span><MapPin size={15} /> Konteks lokal</span>
            <span><ShieldCheck size={15} /> Pengalaman yang lebih terpercaya</span>
            <span><Handshake size={15} /> Ruang untuk kolaborasi</span>
          </div>
          <Link href="/help-center" className="marketing-text-link">Kenali SUKI lebih lanjut <ArrowRight size={15} /></Link>
        </Reveal>
        <Reveal className="discovery-visual" delay={120}>
          <div className="discovery-map" aria-hidden="true">
            <span className="map-ring ring-one" /><span className="map-ring ring-two" /><span className="map-ring ring-three" />
            <span className="map-pin pin-one"><i /></span><span className="map-pin pin-two"><i /></span><span className="map-pin pin-three"><i /></span>
            <div className="map-core"><img src="/brand/suki-logo-mark.svg" alt="" /><b>SULTRA</b><small>local ecosystem</small></div>
          </div>
          <div className="discovery-chip chip-a"><ShoppingBag size={14} /> Produk</div>
          <div className="discovery-chip chip-b"><Building2 size={14} /> Ruang</div>
          <div className="discovery-chip chip-c"><Users size={14} /> Warga</div>
        </Reveal>
      </section>

      <section className="business-banner">
        <Reveal className="business-banner-copy">
          <p className="marketing-eyebrow">Untuk seller, partner, dan organisasi</p>
          <h2>Bisnis lokal punya cerita. Mari beri ruang untuk tumbuh.</h2>
          <p>Bangun eksistensi, hadirkan penawaran, atau mulai kolaborasi di ekosistem yang memahami konteks Sulawesi Tenggara.</p>
        </Reveal>
        <Reveal delay={100}><Link href="/Business" className="marketing-button marketing-button-light">Masuk ke SUKI Business <ArrowRight size={17} /></Link></Reveal>
      </section>

      <section className="trust-section">
        <Reveal>
          <div className="trust-heading"><p className="marketing-eyebrow">Kepercayaan dibangun dari detail</p><h2>Jelas sebelum Anda melangkah.</h2><p>Pengalaman SUKI diarahkan agar informasi, tujuan, dan aksi terasa mudah dipahami sejak awal.</p></div>
        </Reveal>
        <div className="trust-grid">
          {[
            ['01', 'Jalur yang jelas', 'CTA mengarah ke ruang produk yang nyata, bukan sekadar ajakan.'],
            ['02', 'Bahasa yang dekat', 'Copy dibuat ringkas agar konteks tetap terasa tanpa jargon berlebihan.'],
            ['03', 'Siap berkembang', 'Struktur homepage dibuat modular agar data real dapat dihubungkan bertahap.'],
          ].map(([n, title, text], index) => <Reveal delay={index * 70} key={n}><article><span>{n}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}
        </div>
      </section>

      <section className="marketing-final-cta">
        <Reveal>
          <p className="marketing-eyebrow">Langkah berikutnya dimulai di sini</p>
          <h2>Temukan ruang Anda di SUKI Apps.</h2>
          <p>Jelajahi ekosistem digital yang dekat dengan kebutuhan dan peluang di sekitar Anda.</p>
          <Link href="/beranda" className="marketing-button marketing-button-primary">Jelajahi SUKI Apps <ArrowRight size={17} /></Link>
        </Reveal>
      </section>

      <footer className="marketing-footer">
        <div className="footer-main">
          <div className="marketing-brand footer-brand"><span className="marketing-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></div>
          <p>Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.</p>
        </div>
        <div className="footer-links">
          <div><b>Jelajahi</b><Link href="/beranda">Beranda aplikasi</Link><Link href="/marketplace">Marketplace</Link><Link href="/properti">Properti</Link><Link href="/jobs">Jobs</Link></div>
          <div><b>Terhubung</b><Link href="/groups">Komunitas</Link><Link href="/Business">Untuk bisnis</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div>
        </div>
        <div className="footer-bottom"><span>© 2026 SUKI Apps · Sulawesi Tenggara</span><span>Dirancang untuk tumbuh bersama ekosistem lokal.</span></div>
      </footer>
    </main>
  );
}
