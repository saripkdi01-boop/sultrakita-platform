'use client';

import { ChevronDown, Check, Crown, LogOut, RefreshCw, X, Languages, Moon, Sun } from 'lucide-react';
import { useState, type MouseEvent } from 'react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { LANGUAGES, usePreferences } from '@/lib/preferences';
import { getLabels } from '@/lib/i18n';
import { useUIStore } from '@/store/ui';

const collapsedByDefault = new Set(['Bantuan dan Dukungan', 'Pengaturan dan Privasi']);

export function SidebarMobileDrawer({ open }: { open: boolean }) {
  const { toggleMobile } = useUIStore();
  const { theme, toggleTheme, language, setLanguage } = usePreferences();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [languageOpen, setLanguageOpen] = useState(false);
  const labels = getLabels(language);
  const translatedLabel = (label: string) => label === 'Pengaturan' ? labels.settings : label === 'Pusat Privasi' ? labels.privacy : label === 'Bahasa' ? labels.language : label === 'Mode gelap' ? (theme === 'dark' ? labels.lightMode : labels.darkMode) : label;
  const preferenceClick = (label: string) => (event: MouseEvent<HTMLAnchorElement>) => { if (label === 'Mode gelap' || label === 'Bahasa') { event.preventDefault(); if (label === 'Mode gelap') toggleTheme(); else setLanguageOpen((value) => !value); } };
  return <div className={`mobile-drawer-layer ${open ? 'open' : ''}`}><button className="drawer-overlay" onClick={toggleMobile} aria-label="Tutup menu" /><aside id="suki-sidebar-drawer" className="mobile-drawer" aria-label="Menu SUKI Platforms"><div className="drawer-head"><span className="brand"><span className="brand-mark">S</span><span><strong>SUKI</strong><small>by SultraKita</small></span></span><button onClick={toggleMobile} aria-label="Tutup menu"><X size={21} /></button></div><div className="drawer-profile"><span className="avatar large">WS</span><div><strong>Wan Shofir</strong><small>Seller terverifikasi · Kendari</small></div><span className="profile-status"><Check size={12} /></span></div><div className="drawer-tools"><button aria-label="Segarkan profil"><RefreshCw size={14} /></button><span>{labels.active} di Sultra</span></div>{menuSections.map((section) => { const isExpandable = collapsedByDefault.has(section.title); const isOpen = expanded[section.title] ?? !isExpandable; return <div className="menu-section" key={section.title}>{isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span><ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} /></button> : <span className="menu-title">{section.title}</span>}{(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} label={translatedLabel(item.label)} onClick={(event) => { preferenceClick(item.label)(event); if (item.label !== 'Mode gelap' && item.label !== 'Bahasa') toggleMobile(); }} />)}</div>; })}<div className="drawer-preference-card"><button onClick={toggleTheme}><span className="preference-icon">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span><span>{theme === 'dark' ? labels.lightMode : labels.darkMode}</span><i className={`theme-switch ${theme}`} /></button><button onClick={() => setLanguageOpen((value) => !value)}><Languages size={16} /><span>{labels.language}</span><b>{language.toUpperCase()}</b></button>{languageOpen && <div className="drawer-language-panel"><span>{labels.chooseLanguage}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={labels.chooseLanguage}>{LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>}</div><div className="sidebar-footer"><a className="side-upgrade" href="#premium" onClick={toggleMobile}><Crown size={16} /><span><strong>{labels.premium}</strong><small>Bangun eksistensi publik</small></span></a><div className="side-login"><LogOut size={16} /><span>{labels.logout}</span></div></div></aside></div>;
}
