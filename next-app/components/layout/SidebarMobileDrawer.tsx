'use client';

import { ChevronDown, ChevronRight, Crown, LogOut, RefreshCw, X, Languages, Moon, Sun, UserRound, BadgeCheck } from 'lucide-react';
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

export function SidebarMobileDrawer({ open }: { open: boolean }) {
  const { toggleMobile } = useUIStore();
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
  const preferenceClick = (label: string) => (event: MouseEvent<HTMLAnchorElement>) => { if (label === 'Mode gelap' || label === 'Bahasa') { event.preventDefault(); if (label === 'Mode gelap') toggleTheme(); else setLanguageOpen((value) => !value); } };
  return <div className={`mobile-drawer-layer ${open ? 'open' : ''}`}><button className="drawer-overlay" onClick={toggleMobile} aria-label="Tutup menu" /><aside id="suki-sidebar-drawer" className="mobile-drawer" aria-label="Menu SUKI Platforms"><div className="drawer-head"><Link className="drawer-brand" href="/" onClick={toggleMobile} aria-label="SUKI Apps — kembali ke beranda"><img src="/suki-logo-mark.svg" alt=""/><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></Link><button onClick={toggleMobile} aria-label="Tutup menu"><X size={21} /></button></div><Link className="drawer-profile" href={profile?.username ? `/profile/${profile.username}` : '/settings/account'} onClick={toggleMobile} aria-label={`Buka profil ${displayName}`}><span className="avatar large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={displayName} /> : initials}</span><span><strong>{displayName}</strong><small>{roleLabel}{profile?.district ? ` · ${profile.district}` : ` · ${headline}`}</small></span>{profile?.role === 'admin' && <BadgeCheck className="verified-ready" size={16} aria-label="SUKI Verified" />}<ChevronRight size={16} aria-hidden="true" /></Link><div className="drawer-tools"><button aria-label="Segarkan profil" onClick={() => { void refresh(); }}><RefreshCw size={14} /></button><span>{labels.active} di Sultra</span></div>{menuSections.map((section) => { const isExpandable = collapsedByDefault.has(section.title); const isOpen = expanded[section.title] ?? !isExpandable; return <div className="menu-section" key={section.title}>{isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span><ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} /></button> : <span className="menu-title">{section.title}</span>}{(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} label={translatedLabel(item.label)} onClick={(event) => { preferenceClick(item.label)(event); if (item.label !== 'Mode gelap' && item.label !== 'Bahasa') toggleMobile(); }} />)}</div>; })}<div className="drawer-preference-card"><button onClick={toggleTheme}><span className="preference-icon">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span><span>{theme === 'dark' ? labels.lightMode : labels.darkMode}</span><i className={`theme-switch ${theme}`} /></button><button onClick={() => setLanguageOpen((value) => !value)}><Languages size={16} /><span>{labels.language}</span><b>{language.toUpperCase()}</b></button>{languageOpen && <div className="drawer-language-panel"><span>{labels.chooseLanguage}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={labels.chooseLanguage}>{LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>}</div><div className="sidebar-footer"><Link className="side-upgrade" href="/dashboard" onClick={toggleMobile}><Crown size={16} /><span><strong>{labels.premium}</strong><small>Bangun eksistensi publik</small></span></Link>{user ? <button className="side-logout" onClick={() => { toggleMobile(); void signOutAndRedirect(); }}><LogOut size={16} /><span>Keluar dari akun</span></button> : <Link className="side-login" href="/login" onClick={toggleMobile}><UserRound size={16} /><span>Masuk / Daftar</span></Link>}</div></aside></div>;
}
