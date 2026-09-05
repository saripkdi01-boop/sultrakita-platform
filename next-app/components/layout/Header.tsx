'use client';

import { Bell, Heart, Menu, Search, X } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { ProfileHub } from '@/components/profile/ProfileHub';

export function Header() {
  const { mobileOpen, toggleMobile } = useUIStore();
  return <header className="top-header bg-sultra-sand text-sultra-forest dark:bg-sultra-dark dark:text-sultra-mint"><div className="brand-group"><button className="mobile-menu topbar-menu" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="suki-sidebar-drawer" aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}>{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button><a className="brand" href="/"><span className="brand-mark">S</span><span><strong>SultraKita</strong><small>SUKI MARKETPLACE</small></span></a></div><div className="header-search"><Search size={17}/><input aria-label="Cari di SultraKita" placeholder="Cari produk, lokasi, atau warga"/></div><nav className="top-nav" aria-label="Navigasi utama"><a className="active" href="#explore">Eksplorasi</a><a href="#seller-dashboard">Pasang iklan</a><a href="#help">Panduan</a></nav><div className="header-actions"><button className="header-icon" aria-label="Properti tersimpan"><Heart size={19}/><i>4</i></button><button className="header-icon" aria-label="Notifikasi"><Bell size={19}/><i>3</i></button><ProfileHub/></div></header>;
}
