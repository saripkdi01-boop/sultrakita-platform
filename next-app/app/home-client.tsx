'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Compass,
  Layers3,
  MapPin,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Sun,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { sukiMotion } from '@/lib/motion-tokens';

type EcosystemKey = 'marketplace' | 'properti' | 'jobs' | 'groups';

const ecosystem: Array<{
  key: EcosystemKey;
  icon: typeof ShoppingBag;
  label: string;
  title: string;
  text: string;
  href: string;
  tone: string;
}> = [
  { key: 'marketplace', icon: ShoppingBag, label: 'Marketplace', title: 'Belanja lokal', text: 'Produk dan layanan yang dibuat dekat dengan kebutuhan warga.', href: '/marketplace', tone: 'mint' },
  { key: 'properti', icon: Building2, label: 'Properti', title: 'Ruang & properti', text: 'Rumah, tanah, ruang usaha, dan peluang di sekitar Anda.', href: '/properti', tone: 'sand' },
  { key: 'jobs', icon: BriefcaseBusiness, label: 'Peluang', title: 'Kerja & karier', text: 'Lowongan dan peluang kolaborasi dengan talenta lokal.', href: '/jobs', tone: 'blue' },
  { key: 'groups', icon: Users, label: 'Komunitas', title: 'Ruang warga', text: 'Cerita, diskusi, dan hubungan yang tumbuh dari sekitar.', href: '/groups', tone: 'peach' },
];

const quickLinks = [
  { icon: ShoppingBag, label: 'Belanja lokal', href: '/marketplace' },
  { icon: Building2, label: 'Cari properti', href: '/properti' },
  { icon: BriefcaseBusiness, label: 'Cari pekerjaan', href: '/jobs' },
  { icon: Users, label: 'Gabung komunitas', href: '/groups' },
  { icon: Store, label: 'Untuk bisnis', href: '/Business' },
];

const principles = [
  { number: '01', title: 'Dekat dengan kebutuhan', text: 'Mulai dari hal yang memang dicari warga setiap hari.' },
  { number: '02', title: 'Satu ruang yang terhubung', text: 'Pindah dari menemukan ke berinteraksi tanpa kehilangan konteks.' },
  { number: '03', title: 'Dibangun untuk bertumbuh', text: 'Ruang yang sama dapat berkembang bersama warga dan pelaku usaha.' },
];

function EcosystemMap({ active, onSelect }: { active: EcosystemKey; onSelect: (key: EcosystemKey) => void }) {
  const reduceMotion = useReducedMotion();
  const activeItem = ecosystem.find((item) => item.key === active) ?? ecosystem[0];
  const ActiveIcon = activeItem.icon;
  return (
    <div className="suki-map" role="group" aria-label="Peta interaktif ekosistem SUKI">
      <div className="suki-map-ring ring-large" aria-hidden="true" />
      <div className="suki-map-ring ring-small" aria-hidden="true" />
      <div className="suki-map-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      <motion.div
        className="suki-map-core"
        layout={!reduceMotion}
        transition={sukiMotion.spring.gentle}
      >
        <span><Image src="/brand/suki-logo-mark.svg" alt="" width={23} height={23} /></span>
        <strong>SUKI</strong>
        <small>ruang lokal</small>
      </motion.div>
      {ecosystem.map((item) => {
        const Icon = item.icon;
        const selected = item.key === active;
        return (
          <motion.button
            key={item.key}
            type="button"
            className={`suki-map-node node-${item.key} ${selected ? 'is-active' : ''}`}
            onClick={() => onSelect(item.key)}
            onMouseEnter={() => onSelect(item.key)}
            onFocus={() => onSelect(item.key)}
            aria-pressed={selected}
            aria-label={`${item.title}: ${item.text}`}
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={sukiMotion.spring.press}
          >
            <span className="suki-map-node-icon"><Icon size={18} aria-hidden="true" /></span>
            <span><b>{item.label}</b><small>{selected ? 'dipilih' : 'jelajahi'}</small></span>
          </motion.button>
        );
      })}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeItem.key}
          className="suki-map-detail-wrap"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={{ duration: sukiMotion.duration.standard, ease: sukiMotion.ease.out }}
        >
          <Link href={activeItem.href} className="suki-map-detail" aria-label={`Jelajahi ${activeItem.title}`}>
            <span className={`suki-map-detail-icon tone-${activeItem.tone}`}><ActiveIcon size={16} aria-hidden="true" /></span>
            <span><small>{activeItem.label}</small><strong>{activeItem.title}</strong></span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HomeClient() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeNode, setActiveNode] = useState<EcosystemKey>('marketplace');
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'dark' || current === 'light') setTheme(current);
  }, []);

  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveStep(Number(entry.target.getAttribute('data-step')));
      }),
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  // Keyboard: ⌘K / Ctrl+K membuka–menutup (toggle) pencarian, Escape menutup menu & pencarian.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey;
      if (mod && event.key.toLowerCase() === 'k') {
        // Guard: jangan rebut ⌘K/Ctrl+K saat fokus sedang di dalam kolom pencarian.
        const inSearchInput = searchShellRef.current?.contains(document.activeElement) ?? false;
        if (searchOpen && inSearchInput) return;
        event.preventDefault();
        setSearchOpen((value) => !value);
        return;
      }
      if (event.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
        } else if (menuOpen) {
          setMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, menuOpen]);

  // Saat pencarian dibuka, gulir shell ke area pandang (form ada di bawah fold)
  // lalu fokuskan input. Hormati preferensi reduce-motion.
  useEffect(() => {
    if (!searchOpen) return;
    searchShellRef.current?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
    searchInputRef.current?.focus({ preventScroll: true });
  }, [searchOpen, reduceMotion]);

  // Kunci scroll body saat menu mobile terbuka agar halaman belakang tidak ikut bergeser.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [menuOpen]);

  const revealProps = useMemo(
    () => (reduceMotion
      ? { initial: false as const, whileInView: { opacity: 1 }, viewport: { once: true } }
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.18 },
          transition: { duration: sukiMotion.duration.emphasized, ease: sukiMotion.ease.out },
        }),
    [reduceMotion],
  );

  const heroItem = useMemo(
    () => (reduceMotion
      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
      : {
          hidden: { opacity: 0, y: 26 },
          show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: sukiMotion.ease.out } },
        }),
    [reduceMotion],
  );

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem('sultrakita-theme', next);
    setTheme(next);
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    // Marketplace adalah satu-satunya ruang yang benar-benar memproses query pencarian (param `q`).
    window.location.href = value ? `/marketplace?q=${encodeURIComponent(value)}` : '/marketplace';
  }

  function closeMenu() { setMenuOpen(false); }

  return (
    <main className="suki-overhaul-home">
      <a className="skip-link" href="#main-content">Lewati ke konten utama</a>

      <div className="suki-overhaul-topbar">
        <div className="suki-overhaul-container">
          <span><Sparkles size={13} aria-hidden="true" /> Ekosistem digital Sulawesi Tenggara</span>
          <Link href="/help-center">Pusat bantuan <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>

      <header className={`suki-overhaul-header ${menuOpen ? 'is-open' : ''}`}>
        <div className="suki-overhaul-container suki-overhaul-header-inner">
          <Link href="/" className="suki-overhaul-brand" aria-label="SUKI Apps — beranda" onClick={closeMenu}>
            <span className="suki-overhaul-brand-mark"><Image src="/brand/suki-logo-mark.svg" alt="" width={23} height={23} /></span>
            <span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
          </Link>
          <nav id="suki-primary-navigation" aria-label="Navigasi utama">
            <a href="#ekosistem" onClick={closeMenu}>Ekosistem</a>
            <a href="#cara-kerja" onClick={closeMenu}>Cara kerja</a>
            <a href="#tentang" onClick={closeMenu}>Tentang</a>
            <Link href="/Business" onClick={closeMenu}>Untuk bisnis</Link>
            <span className="suki-overhaul-menu-extra">
              <Link href="/login" onClick={closeMenu}>Masuk</Link>
              <Link href="/beranda" className="suki-overhaul-primary" onClick={closeMenu}>Buka SUKI <ArrowRight size={15} aria-hidden="true" /></Link>
            </span>
          </nav>
          <div className="suki-overhaul-header-actions">
            <button
              className="suki-overhaul-theme"
              type="button"
              onClick={toggleTheme}
              aria-label={`Aktifkan mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <span className="suki-moon" aria-hidden="true" />}
              <span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span>
            </button>
            <Link href="/login" className="suki-overhaul-login">Masuk</Link>
            <Link href="/beranda" className="suki-overhaul-header-cta">Buka SUKI <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <button
            ref={menuButtonRef}
            className="suki-overhaul-menu"
            type="button"
            aria-controls="suki-primary-navigation"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <section id="main-content" className="suki-overhaul-hero" aria-labelledby="hero-title">
        <div className="suki-overhaul-container suki-overhaul-hero-grid">
          <motion.div
            className="suki-overhaul-hero-copy"
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.05 } } }}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={heroItem}>
              <span className="suki-overhaul-pill"><i aria-hidden="true" /> Dibuat untuk Sulawesi Tenggara</span>
            </motion.div>
            <motion.h1 id="hero-title" variants={heroItem}>Temukan yang dekat.<br /><em>Bangun yang berarti.</em></motion.h1>
            <motion.p variants={heroItem}>SUKI Apps menghubungkan produk lokal, properti, peluang kerja, komunitas, dan bisnis dalam satu pengalaman digital yang sederhana.</motion.p>
            <motion.div className="suki-overhaul-hero-actions" variants={heroItem}>
              <Link href="/beranda" className="suki-overhaul-primary">Mulai menjelajah <ArrowRight size={17} aria-hidden="true" /></Link>
              <Link href="/Business" className="suki-overhaul-secondary">Saya punya bisnis <BriefcaseBusiness size={16} aria-hidden="true" /></Link>
            </motion.div>
            <motion.div className="suki-overhaul-proof" variants={heroItem} aria-label="Nilai yang dipegang SUKI Apps">
              <span><Check size={14} aria-hidden="true" /> Lokal-first</span>
              <span><Check size={14} aria-hidden="true" /> Mudah digunakan</span>
              <span><Check size={14} aria-hidden="true" /> Terus berkembang</span>
            </motion.div>
          </motion.div>
          <motion.div
            className="suki-overhaul-hero-map"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: sukiMotion.ease.out, delay: reduceMotion ? 0 : 0.15 }}
          >
            <EcosystemMap active={activeNode} onSelect={setActiveNode} />
          </motion.div>
        </div>
      </section>

      <section className="suki-overhaul-search-band" aria-label="Pencarian SUKI Apps">
        <div className="suki-overhaul-container">
          <div ref={searchShellRef} className={`suki-overhaul-search-shell ${searchOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              className="suki-overhaul-search-trigger"
              onClick={() => setSearchOpen((value) => !value)}
              aria-controls="suki-search-form"
              aria-expanded={searchOpen}
            >
              <Search size={18} aria-hidden="true" />
              <span>{searchOpen ? 'Cari di marketplace SUKI' : 'Apa yang sedang Anda cari?'}</span>
              <kbd aria-hidden="true">⌘ K</kbd>
            </button>
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  id="suki-search-form"
                  className="suki-overhaul-search-expanded"
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={sukiMotion.spring.panel}
                  onSubmit={submitSearch}
                  role="search"
                >
                  <div className="suki-overhaul-search-field">
                    <Search size={17} aria-hidden="true" />
                    <input
                      ref={searchInputRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Cari produk, jasa, atau kebutuhan di Sultra…"
                      aria-label="Cari di marketplace SUKI"
                      type="search"
                    />
                  </div>
                  <button type="submit">Cari <ArrowRight size={15} aria-hidden="true" /></button>
                  <button type="button" className="suki-search-close" onClick={() => setSearchOpen(false)} aria-label="Tutup pencarian">
                    <X size={16} aria-hidden="true" />
                  </button>
                  <div className="suki-overhaul-search-suggestions">
                    <span id="suki-search-suggestions-label">Atau jelajahi ruang:</span>
                    <div role="group" aria-labelledby="suki-search-suggestions-label">
                      {ecosystem.map((item) => (
                        <Link key={item.key} href={item.href}>{item.label}</Link>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <nav className="suki-overhaul-quick-links" aria-label="Tautan cepat">
            <span>Mulai dari sini</span>
            {quickLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}>
                  <Icon size={15} aria-hidden="true" />{item.label}<ChevronRight size={13} aria-hidden="true" />
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <motion.section className="suki-overhaul-section" id="ekosistem" aria-labelledby="ecosystem-title" {...revealProps}>
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-section-heading">
            <div>
              <span className="suki-overhaul-kicker">Ekosistem SUKI</span>
              <h2 id="ecosystem-title">Empat ruang.<br /><em>Satu koneksi.</em></h2>
            </div>
            <p>SUKI membantu kebutuhan, peluang, dan hubungan lokal bergerak dalam satu alur yang terasa dekat.</p>
          </div>
          <div className="suki-overhaul-ecosystem-layout">
            <div className="suki-overhaul-ecosystem-list">
              {ecosystem.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`suki-overhaul-ecosystem-item tone-${item.tone} ${activeNode === item.key ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveNode(item.key)}
                    onFocus={() => setActiveNode(item.key)}
                    aria-label={`${item.label} — ${item.title}: ${item.text}`}
                  >
                    <span className="suki-overhaul-item-icon"><Icon size={20} aria-hidden="true" /></span>
                    <span><small>{item.label}</small><strong>{item.title}</strong><span className="suki-overhaul-item-text">{item.text}</span></span>
                    <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
            <div className="suki-overhaul-ecosystem-note">
              <Layers3 size={19} aria-hidden="true" />
              <span><b>Terhubung sejak awal.</b><small>Temukan satu hal, lalu biarkan kebutuhan berikutnya tetap punya konteks.</small></span>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="suki-overhaul-process" id="cara-kerja" aria-labelledby="process-title">
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-section-heading">
            <div>
              <span className="suki-overhaul-kicker">Cara kerja</span>
              <h2 id="process-title">Sederhana dari awal<br />sampai <em>selesai.</em></h2>
            </div>
            <p>Jangan membuat pengguna berpikir terlalu keras. SUKI membantu bergerak dari kebutuhan ke aksi dengan jalur yang jelas.</p>
          </div>
          <div className="suki-overhaul-process-layout">
            <div className="suki-overhaul-process-rail" aria-hidden="true">
              <span className="rail-track" /><span className="rail-progress" style={{ height: `${((activeStep + 1) / principles.length) * 100}%` }} />
            </div>
            <div className="suki-overhaul-process-steps" ref={stepsRef}>
              {principles.map((step, index) => (
                <article key={step.number} data-step={index} className={activeStep === index ? 'is-active' : ''}>
                  <span className="suki-overhaul-step-number">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  <motion.span
                    className="suki-overhaul-step-arrow"
                    animate={{ x: activeStep === index && !reduceMotion ? 5 : 0 }}
                    aria-hidden="true"
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <motion.section className="suki-overhaul-about" id="tentang" aria-labelledby="about-title" {...revealProps}>
        <div className="suki-overhaul-container suki-overhaul-about-grid">
          <div>
            <span className="suki-overhaul-kicker">Dari Sultra, untuk Sultra</span>
            <h2 id="about-title">Teknologi yang tetap terasa <em>manusiawi.</em></h2>
            <p>SUKI dibuat untuk membantu hal-hal yang dekat menjadi lebih mudah ditemukan, dipahami, dan dikembangkan. Bukan hanya tempat melihat listing, tetapi ruang yang menghubungkan orang, kebutuhan, dan peluang.</p>
            <div className="suki-overhaul-points">
              <span><Check size={14} aria-hidden="true" /> Konteks lokal</span>
              <span><Check size={14} aria-hidden="true" /> Pengalaman yang jelas</span>
              <span><Check size={14} aria-hidden="true" /> Ruang untuk bertumbuh</span>
            </div>
            <Link href="/help-center" className="suki-overhaul-text-link">Kenali SUKI lebih lanjut <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <div className="suki-overhaul-about-card">
            <div className="suki-about-card-top">
              <span className="suki-about-logo"><Image src="/brand/suki-logo-mark.svg" alt="" width={26} height={26} /></span>
              <span><small>LOCAL DIGITAL ECOSYSTEM</small><b>Kendari, Sultra</b></span>
            </div>
            <strong>Temukan.<br />Terhubung.<br /><em>Bertumbuh.</em></strong>
            <div className="suki-about-route" aria-hidden="true"><i /><i /><i /><span><MapPin size={18} /></span></div>
          </div>
        </div>
      </motion.section>

      <section className="suki-overhaul-business" aria-labelledby="business-title">
        <div className="suki-overhaul-container suki-overhaul-business-inner">
          <div>
            <span className="suki-overhaul-kicker">Untuk seller &amp; mitra</span>
            <h2 id="business-title">Bisnis lokal punya cerita.<br /><em>Beri ruang untuk tumbuh.</em></h2>
            <p>Bangun eksistensi, hadirkan penawaran, dan temukan koneksi baru melalui ekosistem yang memahami konteks Sulawesi Tenggara.</p>
          </div>
          <Link href="/Business" className="suki-overhaul-light-button">Masuk ke SUKI Business <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="suki-overhaul-final" aria-labelledby="final-title">
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-final-card">
            <div>
              <span className="suki-overhaul-kicker">Langkah berikutnya</span>
              <h2 id="final-title">Temukan ruang Anda di SUKI Apps.</h2>
              <p>Mulai dari kebutuhan yang paling dekat dengan Anda hari ini.</p>
            </div>
            <Link href="/beranda" className="suki-overhaul-primary">Buka SUKI Apps <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <footer className="suki-overhaul-footer">
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-footer-main">
            <div>
              <div className="suki-overhaul-brand">
                <span className="suki-overhaul-brand-mark"><Image src="/brand/suki-logo-mark.svg" alt="" width={23} height={23} /></span>
                <span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
              </div>
              <p>Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.</p>
            </div>
            <nav className="suki-overhaul-footer-links" aria-label="Tautan footer">
              <div><b>Jelajahi</b><Link href="/beranda">Beranda</Link><Link href="/marketplace">Marketplace</Link><Link href="/properti">Properti</Link><Link href="/jobs">Jobs</Link></div>
              <div><b>Terhubung</b><Link href="/groups">Komunitas</Link><Link href="/Business">Untuk bisnis</Link><Link href="/help-center">Panduan</Link></div>
              <div><b>Legal</b><Link href="/legal/privacy">Privasi</Link><Link href="/legal/terms">Syarat &amp; Ketentuan</Link></div>
            </nav>
          </div>
          <div className="suki-overhaul-footer-bottom">
            <span>© 2026 SUKI Apps · Sulawesi Tenggara</span>
            <span><Compass size={12} aria-hidden="true" /> Dibangun untuk tumbuh bersama ekosistem lokal.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
