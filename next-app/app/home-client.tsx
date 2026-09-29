'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Compass,
  Layers3,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
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

const ecosystem: Array<{ key: EcosystemKey; icon: typeof ShoppingBag; label: string; title: string; text: string; href: string; tone: string; orbit: string }> = [
  { key: 'marketplace', icon: ShoppingBag, label: 'Marketplace', title: 'Belanja lokal', text: 'Produk dan layanan yang dibuat dekat dengan kebutuhan warga.', href: '/marketplace', tone: 'mint', orbit: 'node-one' },
  { key: 'properti', icon: Building2, label: 'Properti', title: 'Ruang & properti', text: 'Rumah, tanah, ruang usaha, dan peluang di sekitar Anda.', href: '/properti', tone: 'sand', orbit: 'node-two' },
  { key: 'jobs', icon: BriefcaseBusiness, label: 'Peluang', title: 'Kerja & karier', text: 'Lowongan dan peluang kolaborasi dengan talenta lokal.', href: '/jobs', tone: 'blue', orbit: 'node-three' },
  { key: 'groups', icon: Users, label: 'Komunitas', title: 'Ruang warga', text: 'Cerita, diskusi, dan hubungan yang tumbuh dari sekitar.', href: '/groups', tone: 'peach', orbit: 'node-four' },
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
  const activeItem = ecosystem.find(item => item.key === active) ?? ecosystem[0];
  return (
    <div className="suki-map" aria-label="Peta interaktif ekosistem SUKI">
      <div className="suki-map-ring ring-large" /><div className="suki-map-ring ring-small" />
      <div className="suki-map-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      <motion.div className="suki-map-core" layout transition={sukiMotion.spring.gentle}><span><img src="/brand/suki-logo-mark.svg" alt="" /></span><strong>SUKI</strong><small>ruang lokal</small></motion.div>
      {ecosystem.map(item => {
        const Icon = item.icon;
        const selected = item.key === active;
        return <motion.button key={item.key} type="button" className={`suki-map-node ${item.orbit} ${selected ? 'is-active' : ''}`} onClick={() => onSelect(item.key)} onMouseEnter={() => onSelect(item.key)} aria-pressed={selected} aria-label={`${item.title}: ${item.text}`} whileHover={{ scale: 1.04 }} whileTap={{ scale: .97 }} transition={sukiMotion.spring.press}><span className="suki-map-node-icon"><Icon size={17} /></span><span><b>{item.label}</b><small>{selected ? 'dipilih' : 'jelajahi'}</small></span></motion.button>;
      })}
      <AnimatePresence mode="wait"><motion.div key={activeItem.key} className="suki-map-detail" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: sukiMotion.duration.standard, ease: sukiMotion.ease.out }}><span className={`suki-map-detail-icon tone-${activeItem.tone}`}><activeItem.icon size={15} /></span><div><small>{activeItem.label}</small><strong>{activeItem.title}</strong></div><ArrowRight size={15} /></motion.div></AnimatePresence>
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

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'dark' || current === 'light') setTheme(current);
  }, []);

  useEffect(() => {
    const root = stepsRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('[data-step]'));
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) setActiveStep(Number(entry.target.getAttribute('data-step'))); }), { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
    items.forEach(item => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const motionProps = useMemo(() => reduceMotion ? { initial: false, whileInView: { opacity: 1 }, viewport: { once: true } } : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .18 }, transition: { duration: sukiMotion.duration.emphasized, ease: sukiMotion.ease.out } }, [reduceMotion]);

  function toggleTheme() { const next = theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; document.documentElement.style.colorScheme = next; window.localStorage.setItem('sultrakita-theme', next); setTheme(next); }
  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const value = query.trim(); window.location.href = value ? `/beranda?search=${encodeURIComponent(value)}` : '/beranda'; }
  function closeMenu() { setMenuOpen(false); }

  return <main className="suki-overhaul-home">
    <a className="skip-link" href="#main-content">Lewati ke konten utama</a>
    <div className="suki-overhaul-topbar"><div className="suki-overhaul-container"><span><Sparkles size={13} /> Ekosistem digital Sulawesi Tenggara</span><Link href="/help-center">Pusat bantuan <ArrowRight size={13} /></Link></div></div>
    <header className={`suki-overhaul-header ${menuOpen ? 'is-open' : ''}`}><div className="suki-overhaul-container suki-overhaul-header-inner">
      <Link href="/" className="suki-overhaul-brand" aria-label="SUKI Apps beranda" onClick={closeMenu}><span className="suki-overhaul-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></Link>
      <nav aria-label="Navigasi utama"><a href="#ekosistem" onClick={closeMenu}>Ekosistem</a><a href="#cara-kerja" onClick={closeMenu}>Cara kerja</a><a href="#tentang" onClick={closeMenu}>Tentang</a><Link href="/Business" onClick={closeMenu}>Untuk bisnis</Link></nav>
      <div className="suki-overhaul-header-actions"><button className="suki-overhaul-theme" type="button" onClick={toggleTheme} aria-label={`Aktifkan mode ${theme === 'dark' ? 'terang' : 'gelap'}`} aria-pressed={theme === 'dark'}>{theme === 'dark' ? <Sun size={16} /> : <span className="suki-moon" />}<span>{theme === 'dark' ? 'Terang' : 'Gelap'}</span></button><Link href="/login" className="suki-overhaul-login">Masuk</Link><Link href="/beranda" className="suki-overhaul-header-cta">Buka SUKI <ArrowRight size={15} /></Link></div>
      <button className="suki-overhaul-menu" type="button" aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
    </div></header>

    <section id="main-content" className="suki-overhaul-hero"><div className="suki-overhaul-container suki-overhaul-hero-grid"><motion.div className="suki-overhaul-hero-copy" {...motionProps}>
      <div className="suki-overhaul-pill"><span /> Dibuat untuk Sulawesi Tenggara</div><h1>Temukan yang dekat.<br /><em>Bangun yang berarti.</em></h1><p>SUKI Apps menghubungkan produk lokal, properti, peluang kerja, komunitas, dan bisnis dalam satu pengalaman digital yang sederhana.</p><div className="suki-overhaul-hero-actions"><Link href="/beranda" className="suki-overhaul-primary">Mulai menjelajah <ArrowRight size={17} /></Link><Link href="/Business" className="suki-overhaul-secondary">Saya punya bisnis <BriefcaseBusiness size={16} /></Link></div><div className="suki-overhaul-proof"><span><Check size={14} /> Lokal-first</span><span><Check size={14} /> Mudah digunakan</span><span><Check size={14} /> Terus berkembang</span></div>
    </motion.div><motion.div className="suki-overhaul-hero-map" {...motionProps} transition={{ ...(motionProps.transition ?? {}), delay: reduceMotion ? 0 : .1 }}><EcosystemMap active={activeNode} onSelect={setActiveNode} /></motion.div></div></section>

    <section className="suki-overhaul-search-band"><div className="suki-overhaul-container"><div className={`suki-overhaul-search-shell ${searchOpen ? 'is-open' : ''}`}><button type="button" className="suki-overhaul-search-trigger" onClick={() => setSearchOpen(value => !value)} aria-expanded={searchOpen}><Search size={18} /><span>{searchOpen ? 'Cari di seluruh ruang SUKI' : 'Apa yang sedang Anda cari?'}</span><kbd>⌘ K</kbd></button><AnimatePresence>{searchOpen && <motion.form className="suki-overhaul-search-expanded" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={sukiMotion.spring.panel} onSubmit={submitSearch} role="search"><div><Search size={17} /><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Produk, properti, pekerjaan, komunitas..." aria-label="Cari di SUKI Apps" /></div><button type="submit">Cari <ArrowRight size={15} /></button><button type="button" className="suki-search-close" onClick={() => setSearchOpen(false)} aria-label="Tutup pencarian"><X size={16} /></button><div className="suki-overhaul-search-suggestions"><span>Jelajahi ruang:</span>{ecosystem.map(item => <button type="button" key={item.key} onClick={() => { setQuery(item.title); setActiveNode(item.key); }}>{item.label}</button>)}</div></motion.form>}</AnimatePresence></div><div className="suki-overhaul-quick-links"><span>Mulai dari sini</span>{quickLinks.map(item => { const Icon = item.icon; return <Link key={item.label} href={item.href}><Icon size={15} />{item.label}<ChevronRight size={13} /></Link>; })}</div></div></section>

    <motion.section className="suki-overhaul-section" id="ekosistem" {...motionProps}><div className="suki-overhaul-container"><div className="suki-overhaul-section-heading"><div><span className="suki-overhaul-kicker">Ekosistem SUKI</span><h2>Empat ruang.<br /><em>Satu koneksi.</em></h2></div><p>SUKI membantu kebutuhan, peluang, dan hubungan lokal bergerak dalam satu alur yang terasa dekat.</p></div><div className="suki-overhaul-ecosystem-layout"><div className="suki-overhaul-ecosystem-list">{ecosystem.map(item => { const Icon = item.icon; return <Link key={item.key} href={item.href} className={`suki-overhaul-ecosystem-item tone-${item.tone} ${activeNode === item.key ? 'is-active' : ''}`} onMouseEnter={() => setActiveNode(item.key)} onFocus={() => setActiveNode(item.key)}><span className="suki-overhaul-item-icon"><Icon size={20} /></span><span><small>{item.label}</small><strong>{item.title}</strong><p>{item.text}</p></span><ArrowRight size={17} /></Link>; })}</div><div className="suki-overhaul-ecosystem-note"><Layers3 size={19} /><span><b>Terhubung sejak awal.</b><small>Temukan satu hal, lalu biarkan kebutuhan berikutnya tetap punya konteks.</small></span></div></div></div></motion.section>

    <section className="suki-overhaul-process" id="cara-kerja"><div className="suki-overhaul-container"><div className="suki-overhaul-section-heading"><div><span className="suki-overhaul-kicker">Cara kerja</span><h2>Sederhana dari awal<br />sampai <em>selesai.</em></h2></div><p>Jangan membuat pengguna berpikir terlalu keras. SUKI membantu bergerak dari kebutuhan ke aksi dengan jalur yang jelas.</p></div><div className="suki-overhaul-process-layout"><div className="suki-overhaul-process-rail" aria-hidden="true"><span className="rail-track" /><span className="rail-progress" style={{ height: `${((activeStep + 1) / principles.length) * 100}%` }} /></div><div className="suki-overhaul-process-steps" ref={stepsRef}>{principles.map((step, index) => <article key={step.number} data-step={index} className={activeStep === index ? 'is-active' : ''}><span className="suki-overhaul-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.text}</p></div><motion.span className="suki-overhaul-step-arrow" animate={{ x: activeStep === index && !reduceMotion ? 5 : 0 }}><ArrowRight size={18} /></motion.span></article>)}</div></div></div></section>

    <motion.section className="suki-overhaul-about" id="tentang" {...motionProps}><div className="suki-overhaul-container suki-overhaul-about-grid"><div><span className="suki-overhaul-kicker">Dari Sultra, untuk Sultra</span><h2>Teknologi yang tetap terasa <em>manusiawi.</em></h2><p>SUKI dibuat untuk membantu hal-hal yang dekat menjadi lebih mudah ditemukan, dipahami, dan dikembangkan. Bukan hanya tempat melihat listing, tetapi ruang yang menghubungkan orang, kebutuhan, dan peluang.</p><div className="suki-overhaul-points"><span><Check size={14} /> Konteks lokal</span><span><Check size={14} /> Pengalaman yang jelas</span><span><Check size={14} /> Ruang untuk bertumbuh</span></div><Link href="/help-center" className="suki-overhaul-text-link">Kenali SUKI lebih lanjut <ArrowRight size={15} /></Link></div><div className="suki-overhaul-about-card"><div className="suki-about-card-top"><span className="suki-about-logo"><img src="/brand/suki-logo-mark.svg" alt="" /></span><span><small>LOCAL DIGITAL ECOSYSTEM</small><b>Kendari, Sultra</b></span></div><strong>Temukan.<br />Terhubung.<br /><em>Bertumbuh.</em></strong><div className="suki-about-route"><i /><i /><i /><span><MapPin size={18} /></span></div></div></div></motion.section>

    <section className="suki-overhaul-business"><div className="suki-overhaul-container suki-overhaul-business-inner"><div><span className="suki-overhaul-kicker">Untuk seller & mitra</span><h2>Bisnis lokal punya cerita.<br /><em>Beri ruang untuk tumbuh.</em></h2><p>Bangun eksistensi, hadirkan penawaran, dan temukan koneksi baru melalui ekosistem yang memahami konteks Sulawesi Tenggara.</p></div><Link href="/Business" className="suki-overhaul-light-button">Masuk ke SUKI Business <ArrowRight size={17} /></Link></div></section>

    <section className="suki-overhaul-final"><div className="suki-overhaul-container"><div className="suki-overhaul-final-card"><div><span className="suki-overhaul-kicker">Langkah berikutnya</span><h2>Temukan ruang Anda di SUKI Apps.</h2><p>Mulai dari kebutuhan yang paling dekat dengan Anda hari ini.</p></div><Link href="/beranda" className="suki-overhaul-primary">Buka SUKI Apps <ArrowRight size={17} /></Link></div></div></section>

    <footer className="suki-overhaul-footer"><div className="suki-overhaul-container"><div className="suki-overhaul-footer-main"><div className="suki-overhaul-brand"><span className="suki-overhaul-brand-mark"><img src="/brand/suki-logo-mark.svg" alt="" /></span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></div><p>Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.</p><div className="suki-overhaul-footer-links"><div><b>Jelajahi</b><Link href="/beranda">Beranda</Link><Link href="/marketplace">Marketplace</Link><Link href="/properti">Properti</Link><Link href="/jobs">Jobs</Link></div><div><b>Terhubung</b><Link href="/groups">Komunitas</Link><Link href="/Business">Untuk bisnis</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div></div></div><div className="suki-overhaul-footer-bottom"><span>© 2026 SUKI Apps · Sulawesi Tenggara</span><span>Dibangun untuk tumbuh bersama ekosistem lokal.</span></div></div></footer>
  </main>;
}
