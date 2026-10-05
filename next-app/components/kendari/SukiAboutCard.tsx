'use client';

import { useRef, useCallback } from 'react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import Image from 'next/image';
import { MapPin, Store, Building2, Gamepad2, Briefcase } from 'lucide-react';

/**
 * SukiAboutCard — kartu "Tentang" modern & hidup.
 * - Latar: mesh gradient animasi + orb melayang + partikel naik (otomatis)
 * - Orbit: 2 cincin berputar + titik satelit mengorbit + pin berdenyut (otomatis)
 * - Teks: shimmer emas pada kata kunci (otomatis)
 * - Interaktif: tilt 3D mengikuti pointer/sentuh + parallax lapisan
 * - Hormat prefers-reduced-motion: semua animasi mati total.
 */
const MODULES = [
  { icon: Store, label: 'Marketplace' },
  { icon: Building2, label: 'Properti' },
  { icon: Gamepad2, label: 'Games' },
  { icon: Briefcase, label: 'Jobs' },
];

export default function SukiAboutCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const { language } = usePreferences();
  const t: Record<string, string> = getCoreLabels(language);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const px = (clientX - r.left) / r.width - 0.5;
    const py = (clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tilt-x', `${(-py * 7).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * 9).toFixed(2)}deg`);
    el.style.setProperty('--px', px.toFixed(3));
    el.style.setProperty('--py', py.toFixed(3));
  }, []);

  const resetTilt = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
    el.style.setProperty('--px', '0');
    el.style.setProperty('--py', '0');
  }, []);

  return (
    <div
      ref={cardRef}
      className="suki-about-card-v2"
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseLeave={resetTilt}
      onTouchMove={(e) => {
        const t0 = e.touches[0];
        if (t0) handleMove(t0.clientX, t0.clientY);
      }}
      onTouchEnd={resetTilt}
    >
      {/* Lapisan latar animasi */}
      <div className="sac-bg" aria-hidden="true">
        <span className="sac-orb sac-orb-a" />
        <span className="sac-orb sac-orb-b" />
        <span className="sac-orb sac-orb-c" />
        <span className="sac-grid" />
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="sac-particle" style={{ '--d': `${(i * 1.7) % 9}s`, '--x': `${(i * 83) % 100}%` } as React.CSSProperties} />
        ))}
      </div>

      {/* Header */}
      <div className="sac-top">
        <span className="sac-logo">
          <Image src="/brand/suki-logo-mark.svg" alt="" width={28} height={28} />
        </span>
        <span className="sac-top-text">
          <small>LOCAL DIGITAL ECOSYSTEM</small>
          <b>Kendari, Sultra</b>
        </span>
        <span className="sac-live"><i />LIVE</span>
      </div>

      {/* Judul */}
      <strong className="sac-title">
        <span className="sac-line">{t.heroTitle1}</span>
        <span className="sac-line">{t.heroTitle2}</span>
        <span className="sac-line sac-gold">{t.heroTitle3}</span>
      </strong>

      {/* Chip modul ekosistem melayang */}
      <div className="sac-modules" aria-hidden="true">
        {MODULES.map((m, i) => (
          <span key={m.label} className="sac-chip" style={{ '--d': `${i * 0.9}s` } as React.CSSProperties}>
            <m.icon size={14} />
            {m.label}
          </span>
        ))}
      </div>

      {/* Orbit interaktif */}
      <div className="sac-orbit" aria-hidden="true">
        <span className="sac-ring sac-ring-1" />
        <span className="sac-ring sac-ring-2" />
        <span className="sac-sat sac-sat-1" />
        <span className="sac-sat sac-sat-2" />
        <span className="sac-sat sac-sat-3" />
        <span className="sac-pin">
          <span className="sac-ripple" />
          <span className="sac-ripple sac-ripple-2" />
          <MapPin size={20} />
        </span>
      </div>
    </div>
  );
}
