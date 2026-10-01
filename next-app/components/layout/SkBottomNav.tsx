'use client';

import Link from 'next/link';
import { Bell, Compass, Home, Plus, UserRound } from 'lucide-react';
import type { SkNavKey } from './SkLeftRail';
import { requestOpenNotifications } from './skNavBus';

type SkBottomNavProps = {
  active: SkNavKey | null;
  onCreate?: (type?: 'post' | 'reel') => void;
  profileHref: string;
};

function itemClass(isActive: boolean, extra = ''): string {
  return `sk-bottomnav-item${isActive ? ' is-active' : ''}${extra ? ` ${extra}` : ''}`;
}

export function SkBottomNav({ active, onCreate, profileHref }: SkBottomNavProps) {
  const create = () => {
    if (onCreate) onCreate('post');
    else window.location.href = '/beranda?compose=post';
  };

  return (
    <nav className="sk-bottomnav" aria-label="Navigasi bawah">
      <Link href="/beranda" className={itemClass(active === 'home')} aria-label="Beranda" aria-current={active === 'home' ? 'page' : undefined}>
        <Home size={22} aria-hidden="true" />
        <span>Beranda</span>
      </Link>
      <Link href="/marketplace" className={itemClass(active === 'explore')} aria-label="Jelajahi" aria-current={active === 'explore' ? 'page' : undefined}>
        <Compass size={22} aria-hidden="true" />
        <span>Jelajahi</span>
      </Link>
      <button type="button" className="sk-bottomnav-fab" onClick={create} aria-label="Buat postingan baru">
        <Plus size={26} aria-hidden="true" />
      </button>
      <button
        type="button"
        className={itemClass(active === 'notifications')}
        onClick={requestOpenNotifications}
        aria-label="Notifikasi"
      >
        <Bell size={22} aria-hidden="true" />
        <span>Notifikasi</span>
      </button>
      <Link href={profileHref} className={itemClass(active === 'profile')} aria-label="Profil saya" aria-current={active === 'profile' ? 'page' : undefined}>
        <UserRound size={22} aria-hidden="true" />
        <span>Profil</span>
      </Link>
    </nav>
  );
}
