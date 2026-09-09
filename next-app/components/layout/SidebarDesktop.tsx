'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Crown, LogOut, RefreshCw, Check, Languages, Moon, Sun } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { LANGUAGES, usePreferences } from '@/lib/preferences';
import { getLabels } from '@/lib/i18n';
import { useUIStore } from '@/store/ui';
import { useSessionProfile } from '@/hooks/useSessionProfile';

const collapsedByDefault = new Set(['Bantuan dan Dukungan', 'Pengaturan dan Privasi']);

export function SidebarDesktop() {
  const { collapsed, toggleCollapsed } = useUIStore();
  const { user, profile, refresh } = useSessionProfile();
  const { theme, toggleTheme, language, setLanguage } = usePreferences();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [languageOpen, setLanguageOpen] = useState(false);
  const labels = getLabels(language);
  const displayName = profile?.full_name || user?.email || 'Pengguna SultraKita';
  const headline = profile?.headline || 'Warga SultraKita · Sulawesi Tenggara';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const translatedLabel = (label: string) => label === 'Pengaturan' ? labels.settings : label === 'Pusat Privasi' ? labels.privacy : label === 'Bahasa' ? labels.language : label === 'Mode gelap' ? (theme === 'dark' ? labels.lightMode : labels.darkMode) : label;
  const preferenceClick = (label: string) => (event: MouseEvent<HTMLAnchorElement>) => { if (label === 'Mode gelap' || label === 'Bahasa') { event.preventDefault(); if (label === 'Mode gelap') toggleTheme(); else setLanguageOpen((open) => !open); } };
  return <aside className={`desktop-sidebar ${collapsed ? 'collapsed' : ''}`}>
    <div className="sidebar-inner">
      <div className="profile-mini">{profile?.avatar_url ? <img className="avatar large" src={profile.avatar_url} alt={displayName} /> : <span className="avatar large">{initials}</span>}<div><strong>{displayName}</strong><small>{headline}</small></div><span className="profile-status"><Check size={12} /></span></div>
      {!collapsed && <div className="profile-actions"><button aria-label="Segarkan profil" onClick={() => { void refresh(); }}><RefreshCw size={14} /></button><span>{labels.active} di Sultra</span></div>}
      {menuSections.map((section) => { const isExpandable = collapsedByDefault.has(section.title); const isOpen = expanded[section.title] ?? !isExpandable; return <div className="menu-section" key={section.title}>{isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span>{!collapsed && <ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} />}</button> : <span className="menu-title">{section.title}</span>}{(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} label={translatedLabel(item.label)} onClick={preferenceClick(item.label)} />)}</div>; })}
      {!collapsed && languageOpen && <div className="sidebar-language-panel"><label><Languages size={14} /> {labels.chooseLanguage}</label><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={labels.chooseLanguage}>{LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>}
      {!collapsed && <div className="sidebar-preference-row"><button onClick={toggleTheme} aria-label={theme === 'dark' ? labels.lightMode : labels.darkMode}><span className="preference-icon">{theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}</span><span>{theme === 'dark' ? labels.lightMode : labels.darkMode}</span><i className={`theme-switch ${theme}`} /></button><button onClick={() => setLanguageOpen((open) => !open)} aria-label={labels.language}><Languages size={14} /><span>{labels.language}</span><b>{language.toUpperCase()}</b></button></div>}
      {!collapsed && <div className="sidebar-footer"><a className="side-upgrade" href="/dashboard"><Crown size={16} /><span><strong>{labels.premium}</strong><small>Bangun eksistensi publik</small></span></a><a className="side-login" href="/login"><LogOut size={16} /><span>{labels.logout}</span></a><small>© 2026 SUKI Platforms · SultraKita</small></div>}
    </div><button className="collapse-toggle" onClick={toggleCollapsed} aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
  </aside>;
}
