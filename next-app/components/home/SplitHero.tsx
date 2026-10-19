'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building2, Check, Globe, ShoppingBag, X, type LucideIcon } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import './split-hero.css';

/**
 * SplitHero — hero split-animation untuk homepage.
 * Kiri: headline raksasa + rotator kata + CTA. Kanan: panel visual
 * auto-rotate 3 detik (Marketplace / Properti / Web Studio).
 * Bahasa: Indonesia sumber kebenaran, Inggris diterjemahkan, sisanya fallback ID.
 */

type TabDatum = {
  wordKey: string;
  labelKey: string;
  notifKey: string;
  badgeKey: string;
  titleKey: string;
  descKey: string;
  tagKey: string;
  priceKey: string;
  tabKey: string;
  href: string;
  img: string;
  imgAltKey: string;
  Icon: LucideIcon;
};

const TABS: TabDatum[] = [
  {
    wordKey: 'shWord0', labelKey: 'shLabel0', notifKey: 'shNotif0', badgeKey: 'shBadge0',
    titleKey: 'shCardTitle0', descKey: 'shCardDesc0', tagKey: 'shCardTag0', priceKey: 'shCardPrice0',
    tabKey: 'shTab0', href: '/marketplace', img: '/images/komunitas-2.jpg',
    imgAltKey: 'shImgAlt0', Icon: ShoppingBag,
  },
  {
    wordKey: 'shWord1', labelKey: 'shLabel1', notifKey: 'shNotif1', badgeKey: 'shBadge1',
    titleKey: 'shCardTitle1', descKey: 'shCardDesc1', tagKey: 'shCardTag1', priceKey: 'shCardPrice1',
    tabKey: 'shTab1', href: '/properti', img: '/images/jembatan-bahteramas.jpg',
    imgAltKey: 'shImgAlt1', Icon: Building2,
  },
  {
    wordKey: 'shWord2', labelKey: 'shLabel2', notifKey: 'shNotif2', badgeKey: 'shBadge2',
    titleKey: 'shCardTitle2', descKey: 'shCardDesc2', tagKey: 'shCardTag2', priceKey: 'shCardPrice2',
    tabKey: 'shTab2', href: '/web-studio', img: '/images/komunitas-1.jpg',
    imgAltKey: 'shImgAlt2', Icon: Globe,
  },
];

// Fallback Bahasa Indonesia bila kunci belum diterjemahkan ke bahasa aktif
const FALLBACK: Record<string, string> = {
  shBadge: 'Ekosistem Digital • Kendari → Indonesia',
  shTitleThin: 'Satu tempat.',
  shTitleMid: 'Semua',
  shWord0: 'Jualan.', shWord1: 'Properti.', shWord2: 'Website.',
  shLabel0: 'Marketplace — Jualan Laris', shLabel1: 'SUKICORE — Properti Laku', shLabel2: 'Web Studio — Website Jadi',
  shAuto: 'Auto • 3 detik',
  shSub1: 'Marketplace, properti & website dalam ',
  shSubB1: 'satu pintu',
  shSub2: '. Dibangun untuk UMKM Indonesia — ',
  shSubB2: 'mulai gratis',
  shSub3: ', naik kelas bareng.',
  shCtaPrimary: 'Mulai Gratis Sekarang',
  shCtaSecondary: 'Lihat Produknya',
  shCtaNote: 'Tanpa komitmen — konsultasi dulu, putuskan belakangan.',
  shTrust1: 'Konsultasi gratis dulu', shTrust2: 'Fast respon WA', shTrust3: 'Dibuat untuk lokal',
  shTab0: 'Marketplace', shTab1: 'Properti', shTab2: 'Web Studio',
  shNotif0: 'Contoh: Pesanan baru masuk', shNotif1: 'Contoh: Leads properti baru', shNotif2: 'Contoh: Website baru live',
  shBadge0: 'Paling Dicari', shBadge1: 'Untuk Developer', shBadge2: 'Desain Premium',
  shCardTitle0: 'Jualan langsung dari HP', shCardTitle1: 'Listing rapi, closing cepat', shCardTitle2: 'Website yang menjual',
  shCardDesc0: 'Upload produk, terima order, pantau dari satu dashboard.',
  shCardDesc1: 'Semua properti, leads & tim penjualan dalam satu sistem.',
  shCardDesc2: 'Landing page & toko online — cepat, rapi, siap iklan.',
  shCardTag0: 'Mulai dari', shCardTag1: 'Untuk', shCardTag2: 'Paket',
  shCardPrice0: 'Gratis Daftar', shCardPrice1: 'Developer & Agen', shCardPrice2: 'Landing • Company • Toko',
  shImgAlt0: 'Pedagang pasar tradisional Indonesia tersenyum di lapak dagangannya',
  shImgAlt1: 'Jembatan Bahteramas, Teluk Kendari, Sulawesi Tenggara',
  shImgAlt2: 'Komunitas warga Sulawesi Tenggara yang bahagia bersama',
  shPalette: 'Kuning • Hijau • Putih • Orange',
  shStickyText: 'Mulai gratis hari ini',
  shStickySub: 'Konsultasi dulu, tanpa komitmen',
  shStickyCta: 'Gabung',
  shStickyClose: 'Tutup',
};

const ROTATE_MS = 3000;

export default function SplitHero() {
  const { language } = usePreferences();
  const t: Record<string, string> = getCoreLabels(language);
  const tx = (k: string) => t[k] ?? FALLBACK[k] ?? k;

  const [idx, setIdx] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const timer = useRef<number | null>(null);
  const dismissed = useRef(false);

  const reduceMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const startAuto = () => {
    if (reduceMotion()) return;
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => setIdx((i) => (i + 1) % TABS.length), ROTATE_MS);
  };

  useEffect(() => {
    startAuto();
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!dismissed.current) setStickyVisible(!entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTab = (i: number) => {
    setIdx(i);
    startAuto();
  };

  const scrollDown = () => {
    window.scrollTo({ top: window.innerHeight * 0.95, behavior: reduceMotion() ? 'auto' : 'smooth' });
  };

  const tab = TABS[idx];
  const TabIcon = tab.Icon;

  return (
    <>
      <section ref={heroRef} className="sh-hero" aria-labelledby="sh-title">
        <div className="sh-split">
          {/* PANEL KIRI — teks */}
          <div className="sh-left">
            <div>
              <span className="sh-live">
                <span className="sh-dot" aria-hidden="true" />
                {tx('shBadge')}
              </span>
              <h1 id="sh-title" className="sh-h1">
                <span className="sh-thin">{tx('shTitleThin')}</span>
                <span className="sh-row">
                  {tx('shTitleMid')}{' '}
                  <span className="sh-arrow-badge" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </span>
                <span className="sh-rot-wrap" aria-live="polite">
                  <span key={idx} className="sh-rotator">
                    {tx(tab.wordKey)}
                  </span>
                </span>
              </h1>
              <p className="sh-sub">
                {tx('shSub1')}
                <b>{tx('shSubB1')}</b>
                {tx('shSub2')}
                <b>{tx('shSubB2')}</b>
                {tx('shSub3')}
              </p>
              <div className="sh-ctas">
                <Link href="/marketplace" className="sh-btn-primary">
                  {tx('shCtaPrimary')} <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <button type="button" className="sh-btn-ghost" onClick={scrollDown}>
                  {tx('shCtaSecondary')} ↓
                </button>
              </div>
              <p className="sh-cta-note">{tx('shCtaNote')}</p>
              <div className="sh-trust">
                {[tx('shTrust1'), tx('shTrust2')].map((s) => (
                  <span key={s}>
                    <Check size={13} aria-hidden="true" /> {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="sh-progress">
              <div className="sh-bar">
                <i key={idx} className="sh-bar-fill" />
              </div>
            </div>
          </div>

          {/* PANEL KANAN — visual */}
          <div className="sh-right">
            <div className="sh-tabs" role="tablist" aria-label={tx('shBadge')}>
              {TABS.map((d, i) => (
                <button
                  key={d.tabKey}
                  type="button"
                  role="tab"
                  aria-selected={i === idx}
                  className={`sh-tab${i === idx ? ' is-active' : ''} sh-tab-${i}`}
                  onClick={() => goTab(i)}
                >
                  <em aria-hidden="true" />
                  {tx(d.tabKey)}
                </button>
              ))}
            </div>

            <div className="sh-stage">
              {TABS.map((d, i) => (
                <Image
                  key={d.img}
                  src={d.img}
                  alt={tx(d.imgAltKey)}
                  fill
                  sizes="(max-width: 860px) 100vw, 50vw"
                  priority={i === 0}
                  className={`sh-stage-img${i === idx ? ' is-active' : ''}`}
                />
              ))}
              <div className="sh-stage-shade" aria-hidden="true" />
            </div>

            <div className="sh-notif" aria-hidden="true">
              <span className="sh-notif-dot">●</span> {tx(tab.notifKey)}
            </div>
            <div className="sh-badge-vertical" aria-hidden="true">
              {tx(tab.badgeKey)}
            </div>

            <Link href={tab.href} className="sh-float-card" aria-label={tx(tab.titleKey)}>
              <div className="sh-fc-icon" aria-hidden="true">
                <TabIcon size={23} />
              </div>
              <div className="sh-fc-text">
                <h3>{tx(tab.titleKey)}</h3>
                <p>{tx(tab.descKey)}</p>
              </div>
              <div className="sh-fc-price">
                <span>{tx(tab.tagKey)}</span>
                <b>{tx(tab.priceKey)}</b>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* STICKY CTA — HP saja, muncul setelah hero terlewati */}
      <div className={`sh-sticky-cta${stickyVisible ? ' is-show' : ''}`} role="complementary">
        <p>
          {tx('shStickyText')}
          <span>{tx('shStickySub')}</span>
        </p>
        <Link href="/marketplace">{tx('shStickyCta')} →</Link>
        <button
          type="button"
          className="sh-sticky-close"
          aria-label={tx('shStickyClose')}
          onClick={() => {
            dismissed.current = true;
            setStickyVisible(false);
          }}
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
