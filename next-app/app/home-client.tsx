'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Compass,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';

const ecosystem = [
  {
    icon: ShoppingBag,
    label: 'Marketplace',
    title: 'Belanja lokal',
    text: 'Temukan produk dan layanan dari pelaku usaha di Sulawesi Tenggara.',
    href: '/marketplace',
    tone: 'mint',
  },
  {
    icon: Building2,
    label: 'Properti',
    title: 'Ruang & properti',
    text: 'Cari rumah, tanah, ruang usaha, dan peluang properti di sekitar Anda.',
    href: '/properti',
    tone: 'sand',
  },
  {
    icon: BriefcaseBusiness,
    label: 'Peluang',
    title: 'Kerja & karier',
    text: 'Jelajahi lowongan dan peluang kolaborasi dengan talenta lokal.',
    href: '/jobs',
    tone: 'blue',
  },
  {
    icon: Users,
    label: 'Komunitas',
    title: 'Ruang warga',
    text: 'Berbagi cerita, berdiskusi, dan terhubung dengan komunitas sekitar.',
    href: '/groups',
    tone: 'peach',
  },
];

const quickLinks = [
  { icon: ShoppingBag, label: 'Belanja lokal', href: '/marketplace' },
  { icon: Building2, label: 'Cari properti', href: '/properti' },
  { icon: BriefcaseBusiness, label: 'Cari pekerjaan', href: '/jobs' },
  { icon: Users, label: 'Gabung komunitas', href: '/groups' },
  { icon: Store, label: 'Untuk bisnis', href: '/Business' },
];

const principles = [
  ['01', 'Dekat dengan kebutuhan', 'Mulai dari hal yang memang dicari warga setiap hari.'],
  ['02', 'Satu ruang yang terhubung', 'Pindah dari menemukan ke berinteraksi tanpa kehilangan konteks.'],
  ['03', 'Dibangun untuk bertumbuh', 'Ruang yang sama dapat berkembang bersama warga dan pelaku usaha.'],
];

export default function HomeClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  function closeMenu() {
    setMenuOpen(false);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    window.location.href = value ? `/beranda?search=${encodeURIComponent(value)}` : '/beranda';
  }

  return (
    <main className="reference-home">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>

      <div className="reference-topbar">
        <div className="reference-container reference-topbar-inner">
          <span><Sparkles size={13} aria-hidden="true" /> Ekosistem digital Sulawesi Tenggara</span>
          <Link href="/help-center">Pusat bantuan <ArrowRight size={13} /></Link>
        </div>
      </div>

      <header className={`reference-header ${menuOpen ? 'is-open' : ''}`}>
        <div className="reference-container reference-header-inner">
          <Link href="/" className="reference-brand" aria-label="SUKI Apps beranda" onClick={closeMenu}>
            <span className="reference-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span>
            <span className="reference-brand-copy"><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
          </Link>

          <nav className="reference-nav" aria-label="Navigasi utama">
            <a href="#ekosistem" onClick={closeMenu}>Ekosistem</a>
            <a href="#cara-kerja" onClick={closeMenu}>Cara kerja</a>
            <a href="#tentang" onClick={closeMenu}>Tentang</a>
            <Link href="/Business" onClick={closeMenu}>Untuk bisnis</Link>
          </nav>

          <div className="reference-header-actions">
            <Link href="/login" className="reference-login">Masuk</Link>
            <Link href="/beranda" className="reference-header-cta">Buka SUKI <ArrowRight size={15} /></Link>
          </div>

          <button className="reference-menu-button" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <section id="main-content" className="reference-hero">
        <div className="reference-container reference-hero-grid">
          <div className="reference-hero-copy">
            <div className="reference-pill"><span className="reference-status-dot" /> Dibuat untuk Sulawesi Tenggara</div>
            <h1>Temukan yang dekat. <span>Bangun yang berarti.</span></h1>
            <p>SUKI Apps menghubungkan produk lokal, properti, peluang kerja, komunitas, dan bisnis dalam satu pengalaman digital yang sederhana.</p>

            <div className="reference-hero-actions">
              <Link href="/beranda" className="reference-primary-button">Mulai menjelajah <ArrowRight size={17} /></Link>
              <Link href="/Business" className="reference-secondary-button">Saya punya bisnis <BriefcaseBusiness size={16} /></Link>
            </div>

            <div className="reference-trust-row">
              <span><Check size={14} /> Lokal-first</span>
              <span><Check size={14} /> Mudah digunakan</span>
              <span><Check size={14} /> Terus berkembang</span>
            </div>
          </div>

          <div className="reference-hero-product" aria-label="Pratinjau pengalaman SUKI Apps">
            <div className="reference-product-window">
              <div className="reference-window-top">
                <div className="reference-window-brand"><span className="reference-mini-mark">S</span><strong>SUKI</strong></div>
                <div className="reference-window-location"><MapPin size={12} /> Kendari, Sultra <ChevronRight size={12} /></div>
                <div className="reference-window-dots"><i /><i /><i /></div>
              </div>

              <div className="reference-window-body">
                <div className="reference-window-heading">
                  <div><small>RUANG LOKAL</small><strong>Temukan yang dekat.</strong></div>
                  <span className="reference-live"><i /> Aktif</span>
                </div>

                <form className="reference-search" onSubmit={submitSearch} role="search">
                  <Search size={17} aria-hidden="true" />
                  <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari produk, properti, pekerjaan..." aria-label="Cari di SUKI Apps" />
                  <button type="submit">Cari</button>
                </form>

                <div className="reference-window-categories">
                  <span><ShoppingBag size={14} /> Produk</span>
                  <span><Building2 size={14} /> Properti</span>
                  <span><BriefcaseBusiness size={14} /> Kerja</span>
                  <span><Users size={14} /> Komunitas</span>
                </div>

                <div className="reference-window-bento">
                  <div className="reference-mini-card reference-mini-card-main">
                    <div><small>Pilihan lokal</small><strong>Jelajahi kebutuhanmu</strong></div>
                    <span><Compass size={17} /></span>
                  </div>
                  <div className="reference-mini-card reference-mini-card-small"><small>Bisnis lokal</small><strong>Siap ditemukan</strong><Store size={16} /></div>
                  <div className="reference-mini-card reference-mini-card-small"><small>Komunitas</small><strong>Terhubung</strong><Users size={16} /></div>
                </div>
              </div>
            </div>
            <div className="reference-floating-card reference-floating-one"><span><ShieldCheck size={16} /></span><div><strong>Lebih terpercaya</strong><small>Informasi dibuat jelas</small></div></div>
            <div className="reference-floating-card reference-floating-two"><span><MapPin size={16} /></span><div><strong>Fokus lokal</strong><small>Mulai dari Sultra</small></div></div>
          </div>
        </div>
      </section>

      <section className="reference-quick-access" aria-label="Akses cepat">
        <div className="reference-container reference-quick-inner">
          <div className="reference-quick-heading"><strong>Mulai dari sini</strong><span>Apa yang sedang Anda cari?</span></div>
          <div className="reference-quick-list">
            {quickLinks.map(item => {
              const Icon = item.icon;
              return <Link key={item.label} href={item.href} className="reference-quick-item"><span><Icon size={16} /></span>{item.label}<ChevronRight size={14} /></Link>;
            })}
          </div>
        </div>
      </section>

      <section className="reference-section" id="ekosistem">
        <div className="reference-container">
          <div className="reference-section-heading">
            <div><div className="reference-kicker">EKOSISTEM SUKI</div><h2>Satu tempat untuk banyak kemungkinan.</h2></div>
            <Link href="/beranda" className="reference-text-link">Lihat semua <ArrowRight size={15} /></Link>
          </div>
          <div className="reference-ecosystem-grid">
            {ecosystem.map(item => {
              const Icon = item.icon;
              return <Link key={item.title} href={item.href} className={`reference-ecosystem-card tone-${item.tone}`}>
                <div className="reference-card-icon"><Icon size={20} /></div>
                <div className="reference-card-kicker">{item.label}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <span>Jelajahi <ArrowRight size={14} /></span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      <section className="reference-section reference-process" id="cara-kerja">
        <div className="reference-container">
          <div className="reference-section-heading">
            <div><div className="reference-kicker">CARA KERJA</div><h2>Sederhana dari awal sampai selesai.</h2></div>
            <p>Jangan membuat pengguna berpikir terlalu keras. SUKI membantu mereka bergerak dari kebutuhan ke aksi dengan jalur yang jelas.</p>
          </div>
          <div className="reference-principles">
            {principles.map(([number, title, text]) => <article key={number}>
              <span className="reference-principle-number">{number}</span>
              <div><h3>{title}</h3><p>{text}</p></div>
              <ArrowRight size={17} />
            </article>)}
          </div>
        </div>
      </section>

      <section className="reference-about" id="tentang">
        <div className="reference-container reference-about-grid">
          <div>
            <div className="reference-kicker">DARI SULTRA, UNTUK SULTRA</div>
            <h2>Teknologi yang tetap terasa manusiawi.</h2>
            <p>SUKI dibuat untuk membantu hal-hal yang dekat menjadi lebih mudah ditemukan, dipahami, dan dikembangkan. Bukan hanya tempat melihat listing, tetapi ruang yang menghubungkan orang, kebutuhan, dan peluang.</p>
            <div className="reference-about-points"><span><Check size={14} /> Konteks lokal</span><span><Check size={14} /> Pengalaman yang jelas</span><span><Check size={14} /> Ruang untuk bertumbuh</span></div>
            <Link href="/help-center" className="reference-text-link">Kenali SUKI lebih lanjut <ArrowRight size={15} /></Link>
          </div>
          <div className="reference-about-card">
            <div className="reference-about-logo"><img src="/brand/suki-logo-mark.svg" alt="" /></div>
            <small>LOCAL DIGITAL ECOSYSTEM</small>
            <strong>Temukan.<br />Terhubung.<br /><em>Bertumbuh.</em></strong>
            <div className="reference-about-map"><i /><i /><i /><span><MapPin size={18} /></span></div>
          </div>
        </div>
      </section>

      <section className="reference-business">
        <div className="reference-container reference-business-inner">
          <div><div className="reference-kicker">UNTUK SELLER & MITRA</div><h2>Bisnis lokal punya cerita. Beri ruang untuk tumbuh.</h2><p>Bangun eksistensi, hadirkan penawaran, dan temukan koneksi baru melalui ekosistem yang memahami konteks Sulawesi Tenggara.</p></div>
          <Link href="/Business" className="reference-light-button">Masuk ke SUKI Business <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="reference-final-cta">
        <div className="reference-container">
          <div className="reference-final-card">
            <div><div className="reference-kicker">LANGKAH BERIKUTNYA</div><h2>Temukan ruang Anda di SUKI Apps.</h2><p>Mulai dari kebutuhan yang paling dekat dengan Anda hari ini.</p></div>
            <Link href="/beranda" className="reference-primary-button">Buka SUKI Apps <ArrowRight size={17} /></Link>
          </div>
        </div>
      </section>

      <footer className="reference-footer">
        <div className="reference-container">
          <div className="reference-footer-main">
            <div className="reference-brand"><span className="reference-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span><span className="reference-brand-copy"><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></div>
            <p>Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.</p>
          </div>
          <div className="reference-footer-links">
            <div><b>Jelajahi</b><Link href="/beranda">Beranda</Link><Link href="/marketplace">Marketplace</Link><Link href="/properti">Properti</Link><Link href="/jobs">Jobs</Link></div>
            <div><b>Terhubung</b><Link href="/groups">Komunitas</Link><Link href="/Business">Untuk bisnis</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div>
          </div>
          <div className="reference-footer-bottom"><span>© 2026 SUKI Apps · Sulawesi Tenggara</span><span>Dibangun untuk tumbuh bersama ekosistem lokal.</span></div>
        </div>
      </footer>
    </main>
  );
}
