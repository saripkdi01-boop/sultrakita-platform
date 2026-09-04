'use client';
import { Bell, Heart, Menu, Search, UserRound, X } from 'lucide-react';
import { useUIStore } from '@/store/ui';
import { useSessionProfile } from '@/hooks/useSessionProfile';

export function Header(){
  const { mobileOpen, toggleMobile } = useUIStore();
  const { user, profile, notificationCount } = useSessionProfile();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Tamu';
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return <header className="top-header"><div className="brand-group"><button className="mobile-menu topbar-menu" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="suki-sidebar-drawer" aria-label={mobileOpen ? 'Tutup menu utama' : 'Buka menu utama'}>{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button><a className="brand" href="/"><span className="brand-mark">S</span><span><strong>SUKI</strong><small>SUITS</small></span></a></div><div className="header-search"><Search size={17}/><input aria-label="Cari properti" placeholder="Cari properti, lokasi, atau agen"/></div><nav className="top-nav" aria-label="Navigasi utama"><a className="active" href="#explore">Eksplorasi</a><a href="#seller-dashboard">Pasang listing</a><a href="#help">Panduan</a></nav><div className="header-actions"><button className="header-icon" aria-label="Properti tersimpan"><Heart size={19}/><i>4</i></button><button className="header-icon" aria-label="Notifikasi"><Bell size={19}/>{notificationCount > 0 && <i>{notificationCount}</i>}</button><button className="profile-pill" aria-label="Akun"><span className="avatar">{initials || <UserRound size={16}/>}</span><span className="profile-name">{displayName}</span></button></div></header>
}
