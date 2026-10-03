'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';
import './kampung.css';

/**
 * SUKI KAMPUNG — Fase 1 scaffold.
 *
 * Rute ini mewadahi prototipe game yang sudah terverifikasi
 * (next-app/public/kampung/index.html, byte-identical dengan
 * ~/workspace/your_files/suki-kampung/game/index.html).
 *
 * Fase 1 = mode demo: progres tersimpan di localStorage perangkat,
 * belum terhubung akun SUKI / backend. Lihat README.md di folder ini
 * dan docs/04-SPESIFIKASI-API.md untuk jalur backend Fase 2.
 */
export default function KampungPage() {
  const { language } = usePreferences();
  const k = getGroupsLabels(language);
  return (
    <AppLayout active="home">
      <main className="skk-shell">
        <div className="skk-topbar">
          <div>
            <span className="skk-kicker">{k.kKicker}</span>
            <h1>{k.kTitle}</h1>
            <p>
              {k.kDesc}
            </p>
          </div>
          <Link href="/beranda" className="skk-back" aria-label={k.kBackAria}>
            {k.kBack}
          </Link>
        </div>

        <div className="skk-demo" role="status">
          <b>{k.kDemoT.split(' — ')[0]}</b> — {k.kDemoT.split(' — ').slice(1).join(' — ')}
        </div>

        <div className="skk-frame-wrap">
          <iframe
            src="/kampung/index.html"
            title={k.kFrameTitle}
            className="skk-frame"
            allowFullScreen
          />
        </div>
        <noscript>
          <p className="skk-footnote">{k.kNoJs}</p>
        </noscript>

        <p className="skk-footnote">
          {k.kFootnote}
        </p>
      </main>
    </AppLayout>
  );
}
