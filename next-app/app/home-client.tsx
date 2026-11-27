'use client';

import './homepage.css';
import { useEffect, useRef, useState } from 'react';
import type { HomeStats } from '@/lib/homepage/stats';
import { trackFromElement } from '@/lib/homepage/track';
import { HomeHeader } from '@/components/homepage/HomeHeader';
import { HomeHero } from '@/components/homepage/HomeHero';
import { DoorsSection } from '@/components/homepage/DoorsSection';
import { PricingStory } from '@/components/homepage/PricingStory';
import { ProofSection } from '@/components/homepage/ProofSection';
import { ClosingSection, HomeFooter, ProductsSection, StickyCta } from '@/components/homepage/ClosingSections';

/**
 * Homepage Suki Apps — corong 4 tahap (master prompt homepage v2, 26 Nov 2026):
 *   1. PERHATIAN  → Hero (Salsa + headline manfaat + 3 angka + Mulai Gratis)
 *   2. MINAT      → Enam Pintu
 *   3. KEINGINAN  → Cerita Harga (satu harga, dua mata uang) + Bukti Nyata + Produk
 *   4. AKSI       → Penutup + sticky CTA mobile
 * Tanpa pop-up, tanpa interstitial, tanpa form di homepage.
 */
export default function HomeClient({ stats }: { stats: HomeStats }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  // Hero terlihat? → atur gaya CTA header & sticky CTA mobile.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Reveal saat scroll (500ms, stagger 80ms via --i). Konten tetap terlihat tanpa JS
  // atau bila prefers-reduced-motion aktif.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return;
    root.dataset.motion = 'on';
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    root.querySelectorAll('.hm-reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Delegasi klik untuk semua elemen ber-`data-track`.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-track]');
      if (target && root.contains(target)) trackFromElement(target);
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, []);

  return (
    <div ref={rootRef} className="hm">
      <a className="hm-skip" href="#konten">Langsung ke konten utama</a>
      <HomeHeader heroVisible={heroVisible} />
      <main id="konten" tabIndex={-1}>
        <HomeHero ref={heroRef} stats={stats} />
        <DoorsSection stats={stats} />
        <PricingStory />
        <ProofSection />
        <ProductsSection />
        <ClosingSection />
      </main>
      <HomeFooter />
      <StickyCta visible={!heroVisible} />
      <noscript>
        <style>{'.hm-count[data-state="pending"]{color:inherit!important;background:none!important}'}</style>
      </noscript>
    </div>
  );
}
