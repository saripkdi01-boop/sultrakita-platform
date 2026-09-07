'use client';
import { Bell, Menu, Search, Store, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { ProfileHub } from '@/components/profile/ProfileHub';
import { BrandLogo } from './BrandLogo';
export function Header({ onCreate }: { onCreate?: () => void }) {
  const { mobileOpen, toggleMobile } = useUIStore(); const pathname = usePathname();
  return <header className="top-header"><div className="brand-group"><button className="mobile-menu topbar-menu" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="suki-sidebar-drawer" aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}>{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button><BrandLogo/></div><div className="header-search"><Search size={17}/><input aria-label="Cari di SUKI Platforms" placeholder="Cari produk, lokasi, atau warga"/></div><nav className="top-nav" aria-label="Navigasi utama"><a className={pathname === '/' || pathname === '/beranda' ? 'active' : ''} href="/beranda">Beranda</a><a href="#seller-dashboard">Pasang iklan</a><a href="#help">Panduan</a></nav><div className="header-actions"><a className="header-icon" href="/marketplace" aria-label="Buka Listing Marketplace"><Store size={19}/><span className="sr-only">Listing</span></a><button className="header-icon" aria-label="Notifikasi"><Bell size={19}/><i>3</i></button><ProfileHub/></div></header>;
}
