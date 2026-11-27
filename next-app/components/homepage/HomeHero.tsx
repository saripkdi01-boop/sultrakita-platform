'use client';

import Image from 'next/image';
import Link from 'next/link';
import { forwardRef } from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { DOORS, SIGNUP_HREF, WA_MESSAGES } from '@/lib/homepage/content';
import { HOME_ASSETS } from '@/lib/homepage/assets';
import type { HomeStats } from '@/lib/homepage/stats';
import { sukiWaLink } from '@/lib/whatsapp';
import { CountUp } from './CountUp';
import { HomeImage } from './HomeImage';

const HERO_STATS = [
  { id: 'marketplace', label: 'listing aktif di Marketplace' },
  { id: 'properti', label: 'properti tersedia' },
  { id: 'bisnis', label: 'usaha terdaftar di direktori' },
] as const;

const SALSA_CHIPS = [
  { door: 'marketplace', text: 'Mau jualan' },
  { door: 'properti', text: 'Cari rumah' },
  { door: 'lowongan', text: 'Cari kerja' },
] as const;

/** Tahap 1 corong — PERHATIAN: paham dalam 3 detik, lalu scroll. */
export const HomeHero = forwardRef<HTMLElement, { stats: HomeStats }>(function HomeHero({ stats }, ref) {
  const wa = sukiWaLink(WA_MESSAGES.general);
  const salsa = HOME_ASSETS.salsa;
  const anySample = HERO_STATS.some((s) => stats[s.id].source === 'contoh');

  return (
    <section ref={ref} className="hm-hero" aria-labelledby="hm-hero-title">
      <div className="hm-hero-glow" aria-hidden="true" />
      <div className="hm-wrap hm-hero-grid">
        <div className="hm-hero-copy">
          <p className="hm-eyebrow hm-enter" style={{ '--d': 0 } as React.CSSProperties}>
            Kendari · Sulawesi Tenggara
          </p>
          <h1 id="hm-hero-title" className="hm-display hm-enter" style={{ '--d': 1 } as React.CSSProperties}>
            Satu pintu untuk semua urusan digital <span className="hm-ink-terra">Kendari</span>.
          </h1>
          <p className="hm-lead hm-enter" style={{ '--d': 2 } as React.CSSProperties}>
            Jualan, cari rumah, cari kerja, gabung komunitas, sampai bikin website usaha — semuanya dengan satu akun gratis.
          </p>
          <div className="hm-cta-row hm-enter" style={{ '--d': 3 } as React.CSSProperties}>
            <Link
              href={SIGNUP_HREF}
              className="hm-btn hm-btn--primary hm-btn--lg"
              data-track="cta_mulai_gratis"
              data-track-placement="hero"
            >
              Mulai Gratis <ArrowRight size={20} aria-hidden="true" />
            </Link>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="hm-btn hm-btn--ghost hm-btn--lg"
                data-track="cta_whatsapp"
                data-track-placement="hero"
              >
                <MessageCircle size={20} aria-hidden="true" /> Tanya via WhatsApp
              </a>
            )}
          </div>

          <dl className="hm-hero-stats hm-enter" style={{ '--d': 4 } as React.CSSProperties}>
            {HERO_STATS.map((item) => {
              const stat = stats[item.id];
              return (
                <div key={item.id} className="hm-hero-stat">
                  <dt>{item.label}</dt>
                  <dd>
                    {stat.value > 0 ? <CountUp value={stat.value} /> : <span className="hm-count-new">Baru dibuka</span>}
                    {stat.source === 'contoh' && <span className="hm-sample">contoh</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
          <p className="hm-stat-note hm-enter" style={{ '--d': 5 } as React.CSSProperties}>
            {anySample
              ? 'Angka berlabel "contoh" adalah ilustrasi sementara — data langsung belum terbaca.'
              : 'Angka langsung dari database Suki Apps, diperbarui tiap 5 menit.'}
          </p>
        </div>

        <div className="hm-hero-visual">
          <div className="hm-hero-photo">
            <HomeImage asset={HOME_ASSETS.heroUmkm} sizes="(max-width: 900px) 92vw, 540px" priority className="hm-cover" />
            <span className="hm-photo-tag">UMKM Kendari</span>
          </div>

          {/* Salsa — pemandu Suki yang menyambut seperti resepsionis. [ASET SALSA] */}
          <aside className="hm-salsa" aria-label="Sapaan dari Salsa, pemandu Suki Apps">
            <div className="hm-salsa-avatar">
              {salsa.uploaded ? (
                <Image src={salsa.src} alt={salsa.alt} width={88} height={88} />
              ) : (
                <span className="hm-salsa-monogram" aria-hidden="true">S</span>
              )}
            </div>
            <div className="hm-salsa-body">
              <p className="hm-salsa-name">Salsa <span>· Pemandu Suki</span></p>
              <p className="hm-salsa-bubble">Halo, selamat datang! Hari ini mau mulai dari mana?</p>
              <div className="hm-salsa-chips">
                {SALSA_CHIPS.map((chip) => {
                  const door = DOORS.find((d) => d.id === chip.door)!;
                  return (
                    <Link
                      key={chip.door}
                      href={door.href}
                      data-track="door_click"
                      data-track-door={door.id}
                      data-track-placement="salsa"
                    >
                      {chip.text}
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
});
