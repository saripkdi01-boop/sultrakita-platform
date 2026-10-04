'use client';

import { useEffect, useRef } from 'react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import WcReveal from '@/components/ui/WcReveal';
import ImageSlot from './ImageSlot';

/**
 * KendariHero — hero fullscreen identitas Kendari.
 * Background: slot foto Masjid Al-Alam (fallback CSS bila slot kosong),
 * dengan parallax scroll halus + Ken Burns. Nonaktif total saat
 * prefers-reduced-motion. CTA jujur ke rute nyata.
 */
export default function KendariHero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const { language } = usePreferences();
  const t: Record<string, string> = getCoreLabels(language);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = bgRef.current;
        if (!el) return;
        const y = window.scrollY;
        // Hanya saat hero masih terlihat; murni transform (tanpa layout shift).
        if (y < window.innerHeight * 1.25) {
          el.style.transform = `translate3d(0, ${(y * 0.22).toFixed(1)}px, 0)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="kh-hero" aria-labelledby="kh-hero-title">
      <div className="kh-hero-bg" ref={bgRef} aria-hidden="true">
        <div className="kh-hero-kb">
          <ImageSlot
            src="/images/masjid-al-alam.jpg"
            alt=""
            imgAltHidden
            fallbackClass="kh-fb-masjid"
            eager
          />
        </div>
      </div>
      <div className="kh-hero-veil" aria-hidden="true" />

      <div className="kh-hero-inner">
        <WcReveal>
          <span className="kh-badge">
            <i aria-hidden="true" />
            {t.heroBadgeKendari}
          </span>
        </WcReveal>
        <WcReveal delay={1}>
          <h1 className="kh-title" id="kh-hero-title">
            {t.heroTitleA}
            <br />
            <span className="kh-gold">{t.heroTitleB}</span>
          </h1>
        </WcReveal>
        <WcReveal delay={2}>
          <p className="kh-sub">
            {t.heroSubKendari}
          </p>
        </WcReveal>
        <WcReveal delay={3}>
          <div className="kh-ctas">
            <Link href="/beranda" className="kh-btn kh-btn-gold">
              {t.heroCtaExplore} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/marketplace" className="kh-btn kh-btn-ghost">
              {t.heroCtaMarketplace}
            </Link>
          </div>
          <div className="kh-proof" aria-label={t.heroProofLabel}>
            <span><Check size={14} aria-hidden="true" /> {t.proofLocalFirst}</span>
            <span><Check size={14} aria-hidden="true" /> {t.proofEasy}</span>
            <span><Check size={14} aria-hidden="true" /> {t.proofGrowing}</span>
          </div>
        </WcReveal>
      </div>

      <div className="kh-scroll" aria-hidden="true">
        <i />
        <span>{t.scrollDown}</span>
      </div>

      <div className="kh-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path
            d="M0,60 C360,100 720,20 1080,60 C1260,80 1380,50 1440,40 L1440,100 L0,100Z"
            fill="#04110f"
          />
          <path
            d="M0,70 C360,90 720,40 1080,70 C1260,85 1380,60 1440,55 L1440,100 L0,100Z"
            fill="#04110f"
            opacity="0.5"
          />
        </svg>
      </div>
    </section>
  );
}
