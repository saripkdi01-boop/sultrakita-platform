'use client';

import { Menu, Search, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useUIStore } from '@/store/ui';
import { ProfileHub } from '@/components/profile/ProfileHub';
import { CreateMenu } from './CreateMenu';
import { BrandLogo } from './BrandLogo';
import { NotificationCenter } from './NotificationCenter';

export function Header({ onCreate }: { onCreate?: () => void }) {
  const { mobileOpen, toggleMobile } = useUIStore();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return <header className="top-header">
    <div className="brand-group">
      <button className="mobile-menu topbar-menu" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="suki-sidebar-drawer" aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}>{mobileOpen ? <X size={21} /> : <Menu size={21} />}</button>
      <BrandLogo />
    </div>

    <div className="header-main">
      <div className={`header-search ${searchOpen ? 'header-search-open' : ''}`}>
        <Search size={17} aria-hidden="true" />
        <input autoFocus={searchOpen} aria-label="Cari di SUKI Platforms" placeholder="Cari produk, lokasi, atau warga" />
      </div>
      <button className="header-search-toggle" type="button" onClick={() => setSearchOpen((value) => !value)} aria-label={searchOpen ? 'Tutup pencarian' : 'Buka pencarian'} aria-expanded={searchOpen}><Search size={19} aria-hidden="true" /></button>
      <nav className="top-nav" aria-label="Navigasi utama"><a className={pathname === '/' || pathname === '/beranda' ? 'active' : ''} href="/beranda">Beranda</a><a href="#seller-dashboard">Pasang iklan</a><a href="#help">Panduan</a></nav>
    </div>

    <div className="header-actions">
      <CreateMenu />
      <NotificationCenter />
      <ProfileHub />
    </div>
  </header>;
}
