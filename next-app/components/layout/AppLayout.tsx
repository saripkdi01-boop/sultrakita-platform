'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { QuickNavKey } from './QuickNavBar';
import { useProfileStore } from '@/store/profile';
import { SkTopBar } from './SkTopBar';
import { SkLeftRail, type SkNavKey } from './SkLeftRail';
import { SkBottomNav } from './SkBottomNav';
import './sk-nav.css';

export type { SkNavKey };

type AppLayoutProps = {
  children: ReactNode;
  onCreate?: (type?: 'post' | 'reel') => void;
  active?: QuickNavKey | SkNavKey;
  /** Slot rail konteks kanan (mis. widget beranda). Hanya dirender bila diisi. */
  rightRail?: ReactNode;
};

/**
 * Shell navigasi social workspace SUKI: top bar kompak + left rail (desktop)
 * + konten utama + slot rail kanan + bottom nav (mobile).
 *
 * API dipertahankan: { active, onCreate, children }.
 * Halaman membungkus kontennya dengan <main> sendiri, sehingga wrapper di sini
 * memakai <div> agar tidak ada <main> bersarang.
 */
export function AppLayout({ children, onCreate, active = 'home', rightRail }: AppLayoutProps) {
  const pathname = usePathname();
  const username = useProfileStore((state) => state.profile.username);
  const profileHref = username ? `/profile/${username}` : '/settings/account';
  const navActive = resolveActive(pathname, active);

  // Contract test (test/next-route-contract.test.js) mengunci string di bawah:
  // navigasi cepat Komunitas selalu lewat satu jalur ini.
  const navigate = (key: SkNavKey | QuickNavKey) => { if (key === 'groups') { window.location.href = '/groups'; return; } window.location.hash = key; };

  return (
    <div className="sk-shell">
      <a href="#sk-main-content" className="sk-skip-link">
        Lewati ke konten utama
      </a>
      <SkTopBar onCreate={onCreate} profileHref={profileHref} />
      <div className="sk-body">
        <SkLeftRail active={navActive} profileHref={profileHref} onNavigate={navigate} />
        <div id="sk-main-content" className="sk-main" tabIndex={-1}>
          {children}
        </div>
        {rightRail ? (
          <aside className="sk-right-rail" aria-label="Konteks">
            {rightRail}
          </aside>
        ) : null}
      </div>
      <SkBottomNav active={navActive} onCreate={onCreate} profileHref={profileHref} />
    </div>
  );
}

/**
 * Petakan pathname + prop `active` lama ke kunci nav baru.
 * Halaman tanpa padanan (admin, jobs, properti, …) → null (tanpa indikator aktif,
 * lebih jujur daripada menandai item yang salah).
 */
function resolveActive(pathname: string, active?: QuickNavKey | SkNavKey): SkNavKey | null {
  if (pathname.startsWith('/beranda')) return 'home';
  if (pathname.startsWith('/groups')) return 'groups';
  if (pathname.startsWith('/marketplace')) return 'explore';
  if (pathname.startsWith('/chat')) return 'messages';
  if (pathname.startsWith('/profile/')) return 'profile';
  switch (active) {
    case 'home':
      return 'home';
    case 'explore':
      return 'explore';
    case 'notifications':
      return 'notifications';
    case 'messages':
      return 'messages';
    case 'groups':
      return 'groups';
    case 'saved':
      return 'saved';
    case 'profile':
      return 'profile';
    case 'marketplace':
      return 'explore';
    default:
      return null;
  }
}
