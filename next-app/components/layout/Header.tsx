'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import {
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
import { EcosystemHub } from './EcosystemHub';
import { NotificationCenter } from './NotificationCenter';
import { ProfileHub } from '@/components/profile/ProfileHub';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import './sknav.css';

type NavLinkDef = {
  key: string;
  label: string;
  href: string;
  Icon: typeof Home;
  isActive: (pathname: string) => boolean;
};

/** Navigasi tengah navbar modern — ikon + label teks (bukan ikon saja). */
const NAV_LINKS: NavLinkDef[] = [
  { key: 'home', label: 'Beranda', href: '/beranda', Icon: Home, isActive: (p) => p === '/' || p === '/beranda' },
  { key: 'reels', label: 'Jelajah', href: '/reels', Icon: Clapperboard, isActive: (p) => p.startsWith('/reels') },
  { key: 'marketplace', label: 'Marketplace', href: '/marketplace', Icon: Store, isActive: (p) => p.startsWith('/marketplace') || p.startsWith('/suki-marketplace') },
  { key: 'komunitas', label: 'Komunitas', href: '/groups', Icon: Users, isActive: (p) => p.startsWith('/groups') },
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
      <Search size={18} aria-hidden="true" />
      <input
        autoFocus={autoFocus}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Escape') onDone?.(); }}
        placeholder="Cari di SUKI…"
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
  const profileHref = sessionProfile?.username ? `/profile/${sessionProfile.username}` : '/settings/account';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'SK';
  const profileActive = pathname.startsWith('/profile');

  return (
    <header className="sknav-header">
      {/* Bar utama desktop/tablet: 64px — logo + search | nav berlabel | aksi */}
      <div className="sknav-bar">
        <div className="sknav-left">
          <BrandLogo />
          <SearchForm className="sknav-search" />
          <button
            type="button"
            className="sknav-icon-btn sknav-search-toggle"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label={searchOpen ? 'Tutup pencarian' : 'Cari'}
            aria-expanded={searchOpen}
            title="Cari"
          >
            <Search aria-hidden="true" />
          </button>
          {searchOpen && (
            <div className="sknav-search-expand">
              <SearchForm className="sknav-search-expand-form" autoFocus onDone={() => setSearchOpen(false)} />
              <button
                type="button"
                className="sknav-search-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Tutup pencarian"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* Navigasi tengah: ikon + label teks. "Notifikasi" adalah pemicu
            dropdown NotificationCenter (satu-satunya pintu notifikasi —
            tidak ada bell duplikat di kanan). */}
        <nav className="sknav-nav" aria-label="Navigasi utama">
          {NAV_LINKS.map((link) => {
            const active = link.isActive(pathname);
            return (
              <Link
                key={link.key}
                href={link.href}
                className="sknav-link"
                aria-current={active ? 'page' : undefined}
                title={link.label}
              >
                <link.Icon aria-hidden="true" />
                <span className="sknav-link-label">{link.label}</span>
              </Link>
            );
          })}
          <NotificationCenter />
        </nav>

        {/* Aksi kanan */}
        <div className="sknav-actions">
          {user ? (
            <>
              <EcosystemHub variant="action" />
              <CreateMenu onCreateStory={onCreate} />
              <ProfileHub />
            </>
          ) : (
            <div className="sknav-guest">
              <EcosystemHub variant="action" />
              <Link href="/login" className="sknav-btn sknav-btn-ghost">Masuk</Link>
              <Link href="/signup" className="sknav-btn sknav-btn-primary">Daftar</Link>
            </div>
          )}
        </div>
      </div>

      {/* Baris 1 mobile (tidak diubah): hamburger + logo | Buat, Cari, Pesan */}
      <div className="sknav-mbar">
        <div className="sknav-mbar-left">
          <button
            type="button"
            className="sknav-hamburger"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="suki-sidebar-drawer"
            aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}
          >
            {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <BrandLogo />
        </div>
        <div className="sknav-mbar-actions">
          <CreateMenu onCreateStory={onCreate} />
          <button
            type="button"
            className="sknav-icon-btn sknav-search-toggle"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label={searchOpen ? 'Tutup pencarian' : 'Cari'}
            aria-expanded={searchOpen}
            title="Cari"
          >
            <Search aria-hidden="true" />
          </button>
          <Link href="/chat" className="sknav-icon-btn" aria-label="Pesan" title="Pesan">
            <MessageCircle aria-hidden="true" />
          </Link>
        </div>
        {searchOpen && (
          <div className="sknav-search-expand">
            <SearchForm className="sknav-search-expand-form" autoFocus onDone={() => setSearchOpen(false)} />
            <button
              type="button"
              className="sknav-search-close"
              onClick={() => setSearchOpen(false)}
              aria-label="Tutup pencarian"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Baris 2 mobile (tidak diubah): tab ikon */}
      <nav className="sknav-mtabs" aria-label="Navigasi utama">
        {NAV_LINKS.slice(0, 3).map((link) => {
          const active = link.isActive(pathname);
          return (
            <Link
              key={link.key}
              href={link.href}
              className="sknav-mtab"
              aria-current={active ? 'page' : undefined}
              aria-label={link.label}
            >
              <link.Icon aria-hidden="true" />
            </Link>
          );
        })}
        <EcosystemHub variant="mtab" />
        <div className="sknav-mtab" role="presentation">
          <NotificationCenter />
        </div>
        <Link
          href={profileHref}
          className="sknav-mtab"
          aria-current={profileActive ? 'page' : undefined}
          aria-label="Profil saya"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="sknav-mtab-avatar" />
          ) : (
            <span className="sknav-mtab-avatar-fallback" aria-hidden="true">{initials}</span>
          )}
        </Link>
      </nav>
    </header>
  );
}
