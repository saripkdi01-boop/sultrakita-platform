'use client';

import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import './games.css';

type Game = {
  slug: string;
  icon: string;
  title: string;
  tagline: string;
  desc: string;
  badge?: string;
};

const GAMES: Game[] = [
  {
    slug: 'jala',
    icon: '🎣',
    title: 'JALA — Simulasi Nelayan Sultra',
    tagline: 'Lempar jala, tarik rezeki',
    desc: 'Rasakan jadi nelayan Sulawesi Tenggara: cek cuaca laut, pilih spot (Teluk Kendari, Pulau Bokori, Wakatobi), lempar jala dengan timing tepat, tarik ikan, lelang hasil, dan upgrade perahumu. 100% skill, tanpa untung-untungan.',
    badge: 'Online + Peringkat',
  },
  {
    slug: '/kampung',
    icon: '🏝️',
    title: 'SUKI Kampung',
    tagline: 'Bangun kampung tropis virtualmu',
    desc: 'Kelola dan kembangkan kampung tropis virtual: atur sumber daya, selesaikan misi harian, dan kembangkan kampungmu dari nol. Progres tersimpan di perangkatmu.',
  },
];

/**
 * SUKI GAMES — hub game SUKI Apps.
 * Menampung game-game HTML5 yang berjalan via iframe dari /public.
 * JALA tersinkron ke server (tangkapan + leaderboard); game lain masih lokal.
 */
export default function GamesPage() {
  return (
    <AppLayout active="home">
      <main className="skg-shell">
        <div className="skg-topbar">
          <div>
            <span className="skg-kicker">SUKI GAMES</span>
            <h1>Main & Menangkan Harimu</h1>
            <p>
              Game-game buatan lokal Sulawesi Tenggara. Gratis, tanpa unduh,
              langsung main di browser.
            </p>
          </div>
          <Link href="/beranda" className="skg-back">
            ← Beranda
          </Link>
        </div>

        <div className="skg-demo" role="status">
          <b>JALA ONLINE</b> — tangkapan JALA tersimpan di server & masuk papan
          peringkat. Game lain masih tersimpan di perangkat ini.
        </div>

        <div className="skg-grid">
          {GAMES.map((g) => (
            <article key={g.slug} className="skg-card">
              <div className="skg-card-icon" aria-hidden="true">
                {g.icon}
              </div>
              <div className="skg-card-body">
                <div className="skg-card-head">
                  <h2>{g.title}</h2>
                  {g.badge && <span className="skg-badge">{g.badge}</span>}
                </div>
                <p className="skg-tagline">{g.tagline}</p>
                <p className="skg-desc">{g.desc}</p>
                <Link
                  href={g.slug.startsWith('/') ? g.slug : `/games/${g.slug}`}
                  className="skg-play"
                >
                  Mainkan →
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="skg-footnote">
          Punya ide game lokal? Sampaikan ke tim SUKI — game terbaik dari
          komunitas akan kami wujudkan.
        </p>
      </main>
    </AppLayout>
  );
}
