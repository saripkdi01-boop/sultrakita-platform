'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Crown, LogOut, RefreshCw, Languages, Moon, Sun, UserRound, BadgeCheck } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { LANGUAGES, usePreferences } from '@/lib/preferences';
import { getLabels } from '@/lib/i18n';
import { useUIStore } from '@/store/ui';
import { getProfileNickname, useSessionProfile } from '@/hooks/useSessionProfile';
import { signOutAndRedirect } from '@/lib/auth/logout';

const collapsedByDefault = new Set(['Bantuan dan Dukungan', 'Pengaturan dan Privasi', 'EKOSISTEM SUKI', 'Ekosistem Digital SultraKita']);

export function SidebarDesktop() {
  const { collapsed, toggleCollapsed } = useUIStore();
  const { user, profile, refresh } = useSessionProfile();
  const { theme, toggleTheme, language, setLanguage } = usePreferences();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [languageOpen, setLanguageOpen] = useState(false);
  const labels = getLabels(language);
  const displayName = getProfileNickname(user, profile);
  const headline = profile?.bio || 'Profil belum dilengkapi';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const roleLabel = profile?.role === 'seller' ? 'Seller' : profile?.role === 'creator' ? 'Kreator' : profile?.role === 'admin' ? 'Admin' : 'Warga';
  const translatedLabel = (label: string) => label === 'Pengaturan' ? labels.settings : label === 'Pusat Privasi' ? labels.privacy : label === 'Bahasa' ? labels.language : label === 'Mode gelap' ? (theme === 'dark' ? labels.lightMode : labels.darkMode) : label;
  const preferenceClick = (label: string) => (event: MouseEvent<HTMLAnchorElement>) => { if (label === 'Mode gelap' || label === 'Bahasa') { event.preventDefault(); if (label === 'Mode gelap') toggleTheme(); else setLanguageOpen((open) => !open); } };
  return <aside className={`desktop-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Sidebar SUKI Platforms">
    <div className="sidebar-inner">
      <div className="sidebar-brand-row"><Link className="sidebar-brand" href="/" aria-label="SUKI Apps — kembali ke beranda"><img src="/suki-logo-mark.svg" alt=""/><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></Link>{!collapsed && <span className="sidebar-v0-label">PLATFORM</span>}</div>
      <Link className="profile-mini profile-mini-link" href={profile?.username ? `/profile/${profile.username}` : '/settings/account'} aria-label={`Buka profil ${displayName}`}><span className="avatar large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={displayName} /> : initials}</span><span><strong>{displayName}</strong><small>{roleLabel}{profile?.district ? ` · ${profile.district}` : ` · ${headline}`}</small></span>{!collapsed && <ChevronRight size={15} aria-hidden="true" />}</Link>
      {!collapsed && <div className="profile-actions"><button aria-label="Segarkan profil" onClick={() => { void refresh(); }}><RefreshCw size={14} /></button><span>{labels.active} di Sultra</span>{profile?.role === 'admin' && <BadgeCheck className="verified-ready" size={15} aria-label="SUKI Verified" />}</div>}
      {menuSections.map((section) => { const isExpandable = collapsedByDefault.has(section.title); const isOpen = expanded[section.title] ?? !isExpandable; return <div className="menu-section" key={section.title}>{isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span>{!collapsed && <ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} />}</button> : <span className="menu-title">{section.title}</span>}{(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} label={translatedLabel(item.label)} onClick={preferenceClick(item.label)} />)}</div>; })}
      {!collapsed && languageOpen && <div className="sidebar-language-panel"><label><Languages size={14} /> {labels.chooseLanguage}</label><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={labels.chooseLanguage}>{LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>}
      {!collapsed && <div className="sidebar-preference-row"><button onClick={toggleTheme} aria-label={theme === 'dark' ? labels.lightMode : labels.darkMode}><span className="preference-icon">{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</span><span>{theme === 'dark' ? labels.lightMode : labels.darkMode}</span><i className={`theme-switch ${theme}`} /></button><button onClick={() => setLanguageOpen((open) => !open)} aria-label={labels.language}><Languages size={14} /><span>{labels.language}</span><b>{language.toUpperCase()}</b></button></div>}
      {!collapsed && <div className="sidebar-footer"><Link className="side-upgrade" href="/dashboard"><Crown size={16} /><span><strong>{labels.premium}</strong><small>Bangun eksistensi publik</small></span></Link>{user ? <button className="side-logout" onClick={() => void signOutAndRedirect()}><LogOut size={16} /><span>Keluar dari akun</span></button> : <Link className="side-login" href="/login"><UserRound size={16} /><span>Masuk / Daftar</span></Link>}<small>© 2026 SUKI Platforms · SultraKita</small></div>}
    </div><button className="collapse-toggle" onClick={toggleCollapsed} aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
  </aside>;
}
