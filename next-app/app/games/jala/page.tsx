'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import '../games.css';

/**
 * JALA — Simulasi Nelayan Sultra (v0.1).
 * Game HTML5 single-file di next-app/public/games/jala/index.html.
 * Tangkapan tersinkron ke server (anonim, kunci perangkat) + leaderboard live.
 * Non-gambling, 100% skill-based.
 */
export default function JalaPage() {
  return (
    <AppLayout active="home">
      <main className="skg-shell">
        <div className="skg-topbar">
          <div>
            <span className="skg-kicker">SUKI GAMES</span>
            <h1>🎣 JALA — Simulasi Nelayan Sultra</h1>
            <p>
              Cek cuaca, pilih spot, lempar jala dengan timing tepat, tarik
              ikan, lelang hasil, upgrade perahumu.
            </p>
          </div>
          <Link href="/games" className="skg-back" aria-label="Kembali ke SUKI Games">
            ← SUKI Games
          </Link>
        </div>

        <div className="skg-demo" role="status">
          <b>ONLINE</b> — tangkapan tersimpan di server & masuk papan peringkat.
          Cuaca dalam game adalah simulasi, bukan data BMKG.
        </div>

        <div className="skk-frame-wrap">
          <iframe
            src="/games/jala/index.html"
            title="JALA — Simulasi Nelayan Sultra"
            className="skk-frame"
            allowFullScreen
          />
        </div>
        <noscript>
          <p className="skg-footnote">
            Game membutuhkan JavaScript untuk berjalan.
          </p>
        </noscript>

        <p className="skg-footnote">
          v0.1 — Main bersama. Bangun bersama. Tumbuh bersama.
        </p>
      </main>
    </AppLayout>
  );
}
