'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
  BriefcaseBusiness,
  Clapperboard,
  Home,
  Menu,
  MessageCircle,
  Search,
  Store,
  Users,
  X,
} from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { BrandLogo } from './BrandLogo';
import { CreateMenu } from './CreateMenu';
import { NotificationCenter } from './NotificationCenter';
import { ProfileHub } from '@/components/profile/ProfileHub';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import './fbnav.css';

type TabDef = {
  key: string;
  label: string;
  href: string;
  Icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

/** Tab tengah ala facebook.com — 5 destinasi utama SUKI. */
const CENTER_TABS: TabDef[] = [
  { key: 'home', label: 'Beranda', href: '/beranda', Icon: Home, isActive: (p) => p === '/' || p === '/beranda' },
  { key: 'reels', label: 'Jelajah', href: '/reels', Icon: Clapperboard, isActive: (p) => p.startsWith('/reels') },
  { key: 'marketplace', label: 'Marketplace', href: '/marketplace', Icon: Store, isActive: (p) => p.startsWith('/marketplace') || p.startsWith('/suki-marketplace') },
  { key: 'groups', label: 'Komunitas', href: '/groups', Icon: Users, isActive: (p) => p.startsWith('/groups') },
  { key: 'jobs', label: 'SUKI Jobs', href: '/jobs', Icon: BriefcaseBusiness, isActive: (p) => p.startsWith('/jobs') },
];

function SearchForm({ autoFocus, onDone, className }: { autoFocus?: boolean; onDone?: () => void; className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  function submit(event: FormEvent) {
    event.preventDefault();
    const q = query.trim();
    onDone?.();
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : '/marketplace');
  }
  return (
    <form role="search" onSubmit={submit} className={className}>
      <Search size={16} aria-hidden="true" />
      <input
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Escape') onDone?.(); }}
        placeholder="Cari di SUKI..."
        aria-label="Cari di SUKI"
        enterKeyHint="search"
      />
    </form>
  );
}

export function Header({ onCreate }: { onCreate?: (type?: 'post' | 'reel') => void }) {
  const { mobileOpen, toggleMobile } = useUIStore();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, profile: sessionProfile } = useSessionProfile();
  const displayName = getProfileNickname(user, sessionProfile);
  const avatarUrl = sessionProfile?.avatar_url || '';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SK';
  const profileActive = pathname.startsWith('/profile');

  return (
    <header className="skfb-header">
      {/* Baris 1: bar utama 56px */}
      <div className="skfb-bar">
        <div className="skfb-left">
          <button
            type="button"
            className="skfb-hamburger"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="suki-sidebar-drawer"
            aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <BrandLogo />
          <SearchForm className="skfb-search" />
          <button
            type="button"
            className="skfb-icon-btn skfb-search-toggle"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label={searchOpen ? 'Tutup pencarian' : 'Cari'}
            aria-expanded={searchOpen}
            title="Cari"
          >
            <Search aria-hidden="true" />
          </button>
          {searchOpen && (
            <div className="skfb-search-expand">
              <SearchForm className="skfb-search-expand-form" autoFocus onDone={() => setSearchOpen(false)} />
              <button
                type="button"
                className="skfb-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Tutup pencarian"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Tab tengah (desktop + tablet) */}
        <nav className="skfb-tabs" aria-label="Navigasi utama">
          {CENTER_TABS.map((tab) => {
            const active = tab.isActive(pathname);
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className="skfb-tab"
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
                title={tab.label}
              >
                <tab.Icon aria-hidden="true" />
              </Link>
            );
          })}
        </nav>

        {/* Aksi kanan */}
        <div className="skfb-actions">
          <CreateMenu onCreateStory={onCreate} />
          {/* Fase 0: chat dinonaktifkan — /chat menampilkan halaman "segera hadir" yang jujur.
              Badge hanya dirender bila ada jumlah nyata; tidak ada angka palsu. */}
          <Link href="/chat" className="skfb-icon-btn" aria-label="Pesan" title="Pesan">
            <MessageCircle aria-hidden="true" />
          </Link>
          <NotificationCenter />
          <ProfileHub />
        </div>
      </div>

      {/* Baris 2 (mobile): tab bar icon-only ala aplikasi Facebook */}
      <nav className="skfb-mtabs" aria-label="Navigasi utama">
        {CENTER_TABS.slice(0, 4).map((tab) => {
          const active = tab.isActive(pathname);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="skfb-mtab"
              aria-current={active ? 'page' : undefined}
              aria-label={tab.label}
            >
              <tab.Icon aria-hidden="true" />
            </Link>
          );
        })}
        <div className="skfb-mtab" role="presentation">
          <NotificationCenter />
        </div>
        <Link
          href="/profile"
          className="skfb-mtab"
          aria-current={profileActive ? 'page' : undefined}
          aria-label="Profil saya"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="skfb-mtab-avatar" />
          ) : (
            <span className="skfb-mtab-avatar-fallback" aria-hidden="true">{initials}</span>
          )}
        </Link>
      </nav>
    </header>
  );
}
