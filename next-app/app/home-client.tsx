'use client';

import './home-wc.css';
import './kendari-home.css';
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
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher';
import KendariHero from '@/components/kendari/KendariHero';
import SukiAboutCard from '@/components/kendari/SukiAboutCard';
import '@/components/kendari/suki-about-card.css';
import {
  KendariBahteramas,
  KendariEcosystem,
  KendariKomunitas,
  KendariValue,
} from '@/components/kendari/KendariSections';

export default function HomeClient() {
  const reduceMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { language } = usePreferences();
  const t: Record<string, string> = getCoreLabels(language);

  const ecosystemLinks = [
    { label: t.marketplace, href: '/marketplace' },
    { label: t.property, href: '/properti' },
    { label: t.ecoLinkOpportunity, href: '/jobs' },
    { label: t.groups, href: '/groups' },
  ];

  const quickLinks = [
    { icon: ShoppingBag, label: t.quickShopLocal, href: '/marketplace' },
    { icon: Building2, label: t.quickFindProperty, href: '/properti' },
    { icon: BriefcaseBusiness, label: t.quickFindJob, href: '/jobs' },
    { icon: Users, label: t.quickJoinCommunity, href: '/groups' },
    { icon: Store, label: t.navForBusiness, href: '/Business' },
  ];
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchShellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'dark' || current === 'light') {
      setTheme(current);
      // Sinkronkan class .dark saat load
      document.documentElement.classList.toggle('dark', current === 'dark');
    } else {
      // Cek localStorage jika data-theme belum diset
      const stored = window.localStorage.getItem('sultrakita-theme');
      if (stored === 'dark') {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.classList.add('dark');
        setTheme('dark');
      }
    }
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

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    // Sinkronkan class .dark untuk CSS global (globals.css pakai html.dark)
    document.documentElement.classList.toggle('dark', next === 'dark');
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
    <main className="suki-overhaul-home dn-home">
      <a className="skip-link" href="#main-content">{t.skipToContent}</a>

      <div className="suki-overhaul-topbar">
        <div className="suki-overhaul-container">
          <span><Sparkles size={13} aria-hidden="true" /> {t.heroBadge}</span>
          <Link href="/help-center">{t.helpCenter} <ArrowRight size={13} aria-hidden="true" /></Link>
        </div>
      </div>

      <header className={`suki-overhaul-header ${menuOpen ? 'is-open' : ''}`}>
        <div className="suki-overhaul-container suki-overhaul-header-inner">
          <Link href="/" className="suki-overhaul-brand" aria-label={t.brandHome} onClick={closeMenu}>
            <span className="suki-overhaul-brand-mark"><Image src="/brand/suki-logo-mark.svg" alt="" width={23} height={23} /></span>
            <span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
          </Link>
          <nav id="suki-primary-navigation" aria-label={t.navMain}>
            <a href="#ekosistem" onClick={closeMenu}>{t.ecosystem}</a>
            <a href="#menghubungkan" onClick={closeMenu}>{t.navConnecting}</a>
            <a href="#komunitas" onClick={closeMenu}>{t.groups}</a>
            <a href="#tentang" onClick={closeMenu}>{t.navAbout}</a>
            <Link href="/Business" onClick={closeMenu}>{t.navForBusiness}</Link>
            <span className="suki-overhaul-menu-extra">
              <Link href="/login" onClick={closeMenu}>{t.login}</Link>
              <Link href="/beranda" className="suki-overhaul-primary" onClick={closeMenu}>{t.openSuki} <ArrowRight size={15} aria-hidden="true" /></Link>
            </span>
          </nav>
          <div className="suki-overhaul-header-actions">
            <LanguageSwitcher variant="dropdown" showLabel={false} />
            <button
              className="suki-overhaul-theme"
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.enableLightMode : t.enableDarkMode}
              aria-pressed={theme === 'dark'}
            >
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <span className="suki-moon" aria-hidden="true" />}
              <span>{theme === 'dark' ? t.lightMode : t.darkMode}</span>
            </button>
            <Link href="/login" className="suki-overhaul-login">{t.login}</Link>
            <Link href="/beranda" className="suki-overhaul-header-cta">{t.openSuki} <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <button
            className="suki-overhaul-theme-icon"
            type="button"
            onClick={toggleTheme}
            aria-label={`Aktifkan mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
          >
            {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <span className="suki-moon" aria-hidden="true" />}
          </button>
          <button
            ref={menuButtonRef}
            className="suki-overhaul-menu"
            type="button"
            aria-controls="suki-primary-navigation"
            aria-label={menuOpen ? t.closeMenu : t.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div id="main-content">
        <KendariHero />
      </div>

      <div className="wc-tenun-strip" aria-hidden="true" />

      <KendariValue />

      <section className="suki-overhaul-search-band" aria-label={t.searchSection}>
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
              <span>{searchOpen ? t.searchMarketplaceCta : t.searchPrompt}</span>
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
                      placeholder={t.searchPlaceholderHome}
                      aria-label={t.searchMarketplaceCta}
                      type="search"
                    />
                  </div>
                  <button type="submit">{t.search} <ArrowRight size={15} aria-hidden="true" /></button>
                  <button type="button" className="suki-search-close" onClick={() => setSearchOpen(false)} aria-label={t.closeSearch}>
                    <X size={16} aria-hidden="true" />
                  </button>
                  <div className="suki-overhaul-search-suggestions">
                    <span id="suki-search-suggestions-label">{t.exploreSpaces}</span>
                    <div role="group" aria-labelledby="suki-search-suggestions-label">
                      {ecosystemLinks.map((item) => (
                        <Link key={item.label} href={item.href}>{item.label}</Link>
                      ))}
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          <nav className="suki-overhaul-quick-links" aria-label={t.startHere}>
            <span>{t.startHere}</span>
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

      <KendariEcosystem />

      <KendariBahteramas />

      <KendariKomunitas />

      <motion.section className="suki-overhaul-about" id="tentang" aria-labelledby="about-title" {...revealProps}>
        <div className="suki-overhaul-container suki-overhaul-about-grid">
          <div>
            <span className="suki-overhaul-kicker">{t.aboutKicker}</span>
            <h2 id="about-title">{t.aboutTitleA} <em>{t.aboutTitleB}</em></h2>
            <p>{t.aboutDesc}</p>
            <div className="suki-overhaul-points">
              <span><Check size={14} aria-hidden="true" /> {t.aboutPoint1}</span>
              <span><Check size={14} aria-hidden="true" /> {t.aboutPoint2}</span>
              <span><Check size={14} aria-hidden="true" /> {t.aboutPoint3}</span>
            </div>
            <Link href="/help-center" className="suki-overhaul-text-link">{t.aboutLink} <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <SukiAboutCard />
        </div>
      </motion.section>

      <section className="suki-overhaul-business" aria-labelledby="business-title">
        <div className="suki-overhaul-container suki-overhaul-business-inner">
          <div>
            <span className="suki-overhaul-kicker">{t.bizKicker}</span>
            <h2 id="business-title">{t.bizTitleA}<br /><em>{t.bizTitleB}</em></h2>
            <p>{t.bizDesc}</p>
          </div>
          <Link href="/Business" className="suki-overhaul-light-button">{t.heroCtaBusiness} <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="suki-overhaul-final" aria-labelledby="final-title">
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-final-card">
            <div>
              <span className="suki-overhaul-kicker">{t.finalKicker}</span>
              <h2 id="final-title">{t.finalTitle}</h2>
              <p>{t.finalDesc}</p>
            </div>
            <Link href="/beranda" className="suki-overhaul-primary">{t.openSukiApps} <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <div className="wc-tenun-strip" aria-hidden="true" />

      <footer className="suki-overhaul-footer">
        <div className="suki-overhaul-container">
          <div className="suki-overhaul-footer-main">
            <div>
              <div className="suki-overhaul-brand">
                <span className="suki-overhaul-brand-mark"><Image src="/brand/suki-logo-mark.svg" alt="" width={23} height={23} /></span>
                <span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span>
              </div>
              <p>{t.heroSubtitle}</p>
            </div>
            <nav className="suki-overhaul-footer-links" aria-label={t.footerExplore}>
              <div><b>{t.footerExplore}</b><Link href="/beranda">{t.home}</Link><Link href="/marketplace">{t.marketplace}</Link><Link href="/properti">{t.property}</Link><Link href="/jobs">{t.footerJobs}</Link></div>
              <div><b>{t.footerConnect}</b><Link href="/groups">{t.groups}</Link><Link href="/Business">{t.navForBusiness}</Link><Link href="/help-center">{t.footerGuide}</Link></div>
              <div><b>{t.footerHelp}</b><Link href="/bantuan/faq">{t.footerFaq}</Link><Link href="/kontak">{t.contact}</Link><Link href="/support">{t.footerReport}</Link></div>
              <div><b>{t.footerLegal}</b><Link href="/legal/kebijakan-privasi">{t.footerPrivacy}</Link><Link href="/legal/syarat-ketentuan">{t.terms}</Link><Link href="/security-center">{t.footerSecurity}</Link></div>
            </nav>
          </div>
          <div className="suki-overhaul-footer-bottom">
            <span>{t.footerCopy}</span>
            <span><Compass size={12} aria-hidden="true" /> {t.footerTagline}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
