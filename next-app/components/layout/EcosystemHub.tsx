'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CSSProperties, ComponentType, SVGProps, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, LayoutGrid, X } from 'lucide-react';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getNavLabels } from '@/lib/i18n/navigation';
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
const buildSections = (t: Record<string, string>): Section[] => [
  {
    title: t.exploreTitle,
    hint: t.sukiMainServices,
    accent: '#0b7567',
    tiles: [
      { key: 'marketplace', label: t.marketplace, desc: t.marketplaceDesc, href: '/marketplace', Icon: SukiIconMarketplace, isActive: (p) => p.startsWith('/marketplace') || p.startsWith('/suki-marketplace') },
      { key: 'properti', label: t.property, desc: t.propertyDesc, href: '/properti', Icon: SukiIconProperti, isActive: (p) => p.startsWith('/properti') },
      { key: 'jobs', label: t.sukiJobs, desc: t.jobsDesc, href: '/jobs', Icon: SukiIconJobs, isActive: (p) => p.startsWith('/jobs') },
      { key: 'komunitas', label: t.groups, desc: t.groupsDesc, href: '/groups', Icon: SukiIconKomunitas, isActive: (p) => p.startsWith('/groups') },
      { key: 'berita', label: t.newsPortal, desc: t.newsPortalDesc, href: '/beranda#portal-berita', Icon: SukiIconBerita, badge: t.badgeNew, isActive: () => false },
      { key: 'Business', label: t.businessDirectory, desc: t.businessDirectoryDesc, href: '/Business', Icon: SukiIconBisnis, isActive: (p) => p.startsWith('/Business') },
      { key: 'kampung', label: t.sukiKampung, desc: t.sukiKampungDesc, href: '/kampung', Icon: SukiIconKampung, badge: t.badgeNew, isActive: (p) => p.startsWith('/kampung') },
      { key: 'web-studio', label: 'SUKI Web Studio', desc: 'Jasa pembuatan website', href: '/web-studio', Icon: SukiIconWebStudio, badge: t.badgeNew, isActive: (p) => p.startsWith('/web-studio') },
    ],
  },
  {
    title: t.createAndEarn,
    hint: t.startTransacting,
    accent: '#b8860b',
    tiles: [
      { key: 'jual', label: t.postAd, desc: t.postAdDesc, href: '/marketplace/create', Icon: SukiIconIklan, isActive: (p) => p === '/marketplace/create' },
      { key: 'daftar-Business', label: t.registerBusiness, desc: t.registerBusinessDesc, href: '/Business/daftar', Icon: SukiIconDaftarBisnis, isActive: (p) => p.startsWith('/Business/daftar') },
      { key: 'loker', label: t.postJob, desc: t.postJobDesc, href: '/jobs/create', Icon: SukiIconLowongan, isActive: (p) => p === '/jobs/create' },
    ],
  },
  {
    title: t.mySuki,
    hint: t.accountTogetherness,
    accent: '#6d4fc2',
    tiles: [
      { key: 'ajak', label: t.inviteFriends, desc: t.inviteFriendsDesc, href: '/ajak-teman', Icon: SukiIconAjakTeman, badge: t.badgeReward, isActive: (p) => p.startsWith('/ajak-teman') },
      { key: 'reels', label: t.reels, desc: t.reelsDesc, href: '/reels', Icon: SukiIconReels, isActive: (p) => p.startsWith('/reels') },
      { key: 'chat', label: t.chat, desc: t.chatDesc, href: '/chat', Icon: SukiIconPesan, isActive: (p) => p.startsWith('/chat') },
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
  const { language } = usePreferences();
  const t: Record<string, string> = { ...getCoreLabels(language), ...getNavLabels(language) };
  const SECTIONS = buildSections(t);
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
        aria-label={t.ecosystemAllServices}
        title={t.sukiEcosystem}
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
            aria-label={t.ecosystemAllServices}
            className="sknav-hub-panel"
          >
            <div className="sknav-hub-head">
              <div>
                <p className="sknav-hub-eyebrow">SUKI Apps</p>
                <h2 className="sknav-hub-title">{t.sukiEcosystem}</h2>
                <p className="sknav-hub-sub">{t.allServicesOneHand}</p>
              </div>
              <button type="button" className="sknav-hub-close" onClick={close} aria-label={t.closeEcosystemMenu}>
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
                <strong>{t.inviteBannerTitle}</strong>
                <span>{t.inviteBannerDesc}</span>
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
