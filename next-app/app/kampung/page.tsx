'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
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
  return (
    <AppLayout active="home">
      <main className="skk-shell">
        <div className="skk-topbar">
          <div>
            <span className="skk-kicker">SUKI KAMPUNG · FASE 1</span>
            <h1>Main bersama. Bangun bersama. Tumbuh bersama.</h1>
            <p>
              Bangun kampung tropis virtual khas Sulawesi Tenggara: tempatkan bangunan,
              panen Koin SUKI, selesaikan misi harian, dan uji pengetahuanmu lewat Kuis Sultra.
            </p>
          </div>
          <Link href="/beranda" className="skk-back" aria-label="Kembali ke Beranda SUKI">
            ← Kembali ke SUKI
          </Link>
        </div>

        <div className="skk-demo" role="status">
          <b>Mode Demo</b> — progres kampung tersimpan <b>di perangkat ini</b>, bukan di akun SUKI.
          Backend (autentikasi, teman, referral server-side) belum diimplementasikan.
        </div>

        <div className="skk-frame-wrap">
          <iframe
            src="/kampung/index.html"
            title="Game SUKI Kampung — prototipe playable Fase 1"
            className="skk-frame"
            allowFullScreen
          />
        </div>
        <noscript>
          <p className="skk-footnote">SUKI Kampung membutuhkan JavaScript untuk dimainkan.</p>
        </noscript>

        <p className="skk-footnote">
          Koin SUKI di game ini adalah aset virtual, bukan uang sungguhan dan tidak dapat ditarik.
          Lihat status backend di <code>/api/kampung/status</code>.
        </p>
      </main>
    </AppLayout>
  );
}
