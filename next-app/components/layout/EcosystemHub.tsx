'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CSSProperties, ComponentType, SVGProps, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, LayoutGrid, X } from 'lucide-react';
import {
  SukiIconAjakTeman,
  SukiIconBerita,
  SukiIconBisnis,
  SukiIconDaftarBisnis,
  SukiIconIklan,
  SukiIconJobs,
  SukiIconKampung,
  SukiIconKomunitas,
  SukiIconLowongan,
  SukiIconMarketplace,
  SukiIconPesan,
  SukiIconProperti,
  SukiIconReels,
  SukiIconWebStudio,
} from './SukiIcons';

type SukiIcon = ComponentType<SVGProps<SVGSVGElement>>;

type Tile = {
  key: string;
  label: string;
  desc: string;
  href: string;
  Icon: SukiIcon;
  badge?: string;
  isActive: (pathname: string) => boolean;
};

type Section = {
  title: string;
  hint: string;
  accent: string;
  tiles: Tile[];
};

/** Seluruh destinasi ekosistem SUKI — rute nyata yang sudah live, tanpa tautan palsu. */
const SECTIONS: Section[] = [
  {
    title: 'Jelajahi',
    hint: 'Layanan utama SUKI',
    accent: '#0b7567',
    tiles: [
      { key: 'marketplace', label: 'Marketplace', desc: 'Jual beli barang & jasa lokal', href: '/marketplace', Icon: SukiIconMarketplace, isActive: (p) => p.startsWith('/marketplace') || p.startsWith('/suki-marketplace') },
      { key: 'properti', label: 'Properti', desc: 'Sewa & jual properti lewat peta', href: '/properti', Icon: SukiIconProperti, isActive: (p) => p.startsWith('/properti') },
      { key: 'jobs', label: 'SUKI Jobs', desc: 'Lowongan kerja Sulawesi Tenggara', href: '/jobs', Icon: SukiIconJobs, isActive: (p) => p.startsWith('/jobs') },
      { key: 'komunitas', label: 'Komunitas', desc: 'Grup & komunitas warga', href: '/groups', Icon: SukiIconKomunitas, isActive: (p) => p.startsWith('/groups') },
      { key: 'berita', label: 'Portal Berita', desc: 'Kabar terkini media Indonesia', href: '/beranda#portal-berita', Icon: SukiIconBerita, badge: 'Baru', isActive: () => false },
      { key: 'Business', label: 'Direktori Bisnis', desc: 'UMKM & jasa terverifikasi', href: '/Business', Icon: SukiIconBisnis, isActive: (p) => p.startsWith('/Business') },
      { key: 'kampung', label: 'SUKI Kampung', desc: 'Bangun kampung tropis virtual', href: '/kampung', Icon: SukiIconKampung, badge: 'Baru', isActive: (p) => p.startsWith('/kampung') },
      { key: 'web-studio', label: 'SUKI Web Studio', desc: 'Jasa pembuatan website', href: '/web-studio', Icon: SukiIconWebStudio, badge: 'Baru', isActive: (p) => p.startsWith('/web-studio') },
    ],
  },
  {
    title: 'Buat & Hasilkan',
    hint: 'Mulai bertransaksi hari ini',
    accent: '#b8860b',
    tiles: [
      { key: 'jual', label: 'Pasang Iklan', desc: 'Jual barang di Marketplace', href: '/marketplace/create', Icon: SukiIconIklan, isActive: (p) => p === '/marketplace/create' },
      { key: 'daftar-Business', label: 'Daftarkan Bisnis', desc: 'Tampilkan usahamu ke warga', href: '/Business/daftar', Icon: SukiIconDaftarBisnis, isActive: (p) => p.startsWith('/Business/daftar') },
      { key: 'loker', label: 'Pasang Lowongan', desc: 'Rekrut talenta lokal', href: '/jobs/create', Icon: SukiIconLowongan, isActive: (p) => p === '/jobs/create' },
    ],
  },
  {
    title: 'SUKI Saya',
    hint: 'Akun & kebersamaan',
    accent: '#6d4fc2',
    tiles: [
      { key: 'ajak', label: 'Ajak Teman', desc: 'Kumpulkan Koin SUKI tiap ajakan', href: '/ajak-teman', Icon: SukiIconAjakTeman, badge: 'Reward', isActive: (p) => p.startsWith('/ajak-teman') },
      { key: 'reels', label: 'Reels', desc: 'Video pendek warga Sultra', href: '/reels', Icon: SukiIconReels, isActive: (p) => p.startsWith('/reels') },
      { key: 'chat', label: 'Pesan', desc: 'Ngobrol dengan penjual & teman', href: '/chat', Icon: SukiIconPesan, isActive: (p) => p.startsWith('/chat') },
    ],
  },
];

/** Rute yang "dimiliki" hub — indikator aktif launcher menyala di halaman-halaman ini. */
function isHubActive(pathname: string): boolean {
  return (
    pathname.startsWith('/groups') ||
    pathname.startsWith('/properti') ||
    pathname.startsWith('/Business') ||
    pathname.startsWith('/ajak-teman') ||
    pathname.startsWith('/kampung') ||
    pathname.startsWith('/web-studio')
  );
}

export function EcosystemHub({ variant }: { variant: 'action' | 'mtab' }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Portal hanya aman setelah mount di klien (SSR: document belum ada).
  const [mounted, setMounted] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const active = isHubActive(pathname);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      const el = event.target as HTMLElement | null;
      if (panelRef.current && el && !panelRef.current.contains(el) && !triggerRef.current?.contains(el)) {
        setOpen(false);
      }
    };
    // Kunci scroll body selama panel terbuka (terutama bottom sheet di mobile).
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      document.body.style.overflow = prevOverflow;
    };
  }, [open ]);

  // Tutup panel saat berpindah halaman; kembalikan fokus ke pemicu saat ditutup.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={variant === 'action' ? 'sknav-icon-btn sknav-hub-trigger' : 'sknav-mtab sknav-hub-trigger'}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={panelId}
        aria-current={active ? 'page' : undefined}
        aria-label="Ekosistem SUKI — semua layanan"
        title="Ekosistem SUKI"
        onClick={() => setOpen((value) => !value)}
      >
        <LayoutGrid aria-hidden="true" />
      </button>

      {open && mounted && createPortal(
        <>
          <div className="sknav-hub-backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label="Ekosistem SUKI — semua layanan"
            className="sknav-hub-panel"
          >
            <div className="sknav-hub-head">
              <div>
                <p className="sknav-hub-eyebrow">SUKI Apps</p>
                <h2 className="sknav-hub-title">Ekosistem SUKI</h2>
                <p className="sknav-hub-sub">Semua layanan dalam satu genggaman</p>
              </div>
              <button type="button" className="sknav-hub-close" onClick={close} aria-label="Tutup menu ekosistem">
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            {SECTIONS.map((section) => (
              <section
                key={section.title}
                aria-label={section.title}
                className="sknav-hub-section"
                style={{ '--hub-accent': section.accent } as CSSProperties}
              >
                <div className="sknav-hub-section-head">
                  <h3 className="sknav-hub-section-title">{section.title}</h3>
                  <span className="sknav-hub-section-hint">{section.hint}</span>
                </div>
                <div className="sknav-hub-grid">
                  {section.tiles.map((tile) => {
                    const tileActive = tile.isActive(pathname);
                    return (
                      <Link
                        key={tile.key}
                        href={tile.href}
                        className="sknav-hub-tile"
                        aria-current={tileActive ? 'page' : undefined}
                        onClick={() => setOpen(false)}
                      >
                        <span className="sknav-hub-tile-icon" aria-hidden="true">
                          <tile.Icon />
                        </span>
                        <span className="sknav-hub-tile-text">
                          <span className="sknav-hub-tile-label">
                            {tile.label}
                            {tile.badge && <em className="sknav-hub-badge">{tile.badge}</em>}
                          </span>
                          <span className="sknav-hub-tile-desc">{tile.desc}</span>
                        </span>
                        <ArrowUpRight size={16} aria-hidden="true" className="sknav-hub-tile-go" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}

            <Link href="/ajak-teman" className="sknav-hub-foot" onClick={() => setOpen(false)}>
              <span className="sknav-hub-foot-icon" aria-hidden="true">
                <SukiIconAjakTeman />
              </span>
              <span className="sknav-hub-foot-text">
                <strong>Ajak teman ke SUKI, kumpulkan Koin SUKI</strong>
                <span>Tukarkan Koin SUKI jadi saldo & benefit ekosistem</span>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </>,
        document.body,
      )}
    </>
  );
}
