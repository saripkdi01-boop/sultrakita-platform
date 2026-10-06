'use client';

import { ChevronDown, ChevronRight, Crown, LogOut, RefreshCw, X, Languages, Moon, Sun, UserRound, BadgeCheck } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import Link from 'next/link';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { LANGUAGES, usePreferences } from '@/lib/preferences';
import { getLabels } from '@/lib/i18n';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getNavLabels } from '@/lib/i18n/navigation';
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
  const triggerRef = useRef<HTMLElement | null>(null);

  // Ingat elemen pemicu saat drawer dibuka, untuk focus return saat ditutup via Escape.
  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    }
  }, [open ]);

  // Escape menutup drawer + mengembalikan fokus ke pemicu
  // (konsisten dengan perilaku menu mobile di homepage).
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        toggleMobile();
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, toggleMobile]);
  const labels = getLabels(language);
  const t: Record<string, string> = { ...getCoreLabels(language), ...getNavLabels(language) };
  const displayName = getProfileNickname(user, profile);
  const headline = profile?.bio || t.profileIncomplete;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const roleLabel = profile?.role === 'seller' ? t.roleSeller : profile?.role === 'creator' ? t.roleCreator : profile?.role === 'admin' ? t.roleAdmin : t.roleCitizen;
  const translateMenuLabel = (label: string): string => {
    const map: Record<string, string> = {
      'Beranda': t.home, 'SUKI Marketplace': t.sukiMarketplace, 'SUKI Properti': t.sukiProperty,
      'SUKI Chat': t.sukiChat, 'Grup': t.grup, 'Tersimpan': t.saved, 'Ajak Teman': t.inviteFriends,
      'Properti Saya': t.myProperty, 'Pesan Properti': t.propertyMessages,
      'Pusat Perlindungan Penipuan': t.fraudProtectionCenter, 'Dukungan': t.support,
      'Laporkan masalah': t.reportIssue, 'Ketentuan dan Kebijakan': t.termsAndPolicy,
      'Pengaturan': t.settings, 'Pusat Privasi': t.privacy, 'Manajemen waktu': t.timeManagement,
      'Permintaan perangkat': t.deviceRequests, 'Aktivitas iklan terkini': t.recentAdActivity,
      'Pesanan dan pembayaran': t.ordersAndPayments, 'Riwayat tautan': t.linkHistory,
      'Mode gelap': theme === 'dark' ? t.lightMode : t.darkMode, 'Bahasa': t.language,
      'SUKI Jobs': t.sukiJobs, 'SUKI Kampung': t.sukiKampung, 'SUKI Games': t.sukiGames, 'SUKI Campaign Hub': t.sukiCampaignHub,
      'Direktori Bisnis': t.businessDirectory, 'SUKI Partner': t.sukiPartner,
    };
    return map[label] ?? label;
  };
  const translateSectionTitle = (title: string): string => {
    const map: Record<string, string> = {
      'Pintasan Anda': t.menuSectionShortcuts, 'Menu Utama': t.menuSectionMain,
      'Bantuan dan Dukungan': t.menuSectionHelp, 'Pengaturan dan Privasi': t.menuSectionSettings,
      'EKOSISTEM SUKI': t.menuSectionEcosystem, 'Ekosistem Digital SultraKita': t.menuSectionDigital,
    };
    return map[title] ?? title;
  };
  const preferenceClick = (label: string) => (event: MouseEvent<HTMLAnchorElement>) => { if (label === 'Mode gelap' || label === 'Bahasa') { event.preventDefault(); if (label === 'Mode gelap') toggleTheme(); else setLanguageOpen((value) => !value); } };
  return <div className={`mobile-drawer-layer ${open ? 'open' : ''}`}><button className="drawer-overlay" onClick={toggleMobile} aria-label={t.closeMenu} /><aside id="suki-sidebar-drawer" className="mobile-drawer" aria-label={t.sukiPlatformsMenu}><div className="drawer-head"><Link className="drawer-brand" href="/" onClick={toggleMobile} aria-label={t.backToHome}><img src="/suki-logo-mark.svg" alt=""/><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></Link><button onClick={toggleMobile} aria-label={t.closeMenu}><X size={21} /></button></div><Link className="drawer-profile" href={profile?.username ? `/profile/${profile.username}` : '/settings/account'} onClick={toggleMobile} aria-label={`${t.openProfile} ${displayName}`}><span className="avatar large">{profile?.avatar_url ? <img src={profile.avatar_url} alt={displayName} /> : initials}</span><span><strong>{displayName}</strong><small>{roleLabel}{profile?.district ? ` · ${profile.district}` : ` · ${headline}`}</small></span>{profile?.role === 'admin' && <BadgeCheck className="verified-ready" size={16} aria-label={t.sukiVerified} />}<ChevronRight size={16} aria-hidden="true" /></Link><div className="drawer-tools"><button aria-label={t.refreshProfile} onClick={() => { void refresh(); }}><RefreshCw size={14} /></button><span>{labels.active} {t.inSultra}</span></div>{menuSections.map((section) => { const isExpandable = collapsedByDefault.has(section.title); const isOpen = expanded[section.title] ?? !isExpandable; return <div className="menu-section" key={section.title}>{isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{translateSectionTitle(section.title)}</span><ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} /></button> : <span className="menu-title">{translateSectionTitle(section.title)}</span>}{(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} label={translateMenuLabel(item.label)} onClick={(event) => { preferenceClick(item.label)(event); if (item.label !== 'Mode gelap' && item.label !== 'Bahasa') toggleMobile(); }} />)}</div>; })}<div className="drawer-preference-card"><button onClick={toggleTheme}><span className="preference-icon">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</span><span>{theme === 'dark' ? labels.lightMode : labels.darkMode}</span><i className={`theme-switch ${theme}`} /></button><button onClick={() => setLanguageOpen((value) => !value)}><Languages size={16} /><span>{labels.language}</span><b>{language.toUpperCase()}</b></button>{languageOpen && <div className="drawer-language-panel"><span>{labels.chooseLanguage}</span><select value={language} onChange={(event) => setLanguage(event.target.value as typeof language)} aria-label={labels.chooseLanguage}>{LANGUAGES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}</select></div>}</div><div className="sidebar-footer"><Link className="side-upgrade" href="/dashboard" onClick={toggleMobile}><Crown size={16} /><span><strong>{labels.premium}</strong><small>{t.buildPublicPresence}</small></span></Link>{user ? <button className="side-logout" onClick={() => { toggleMobile(); void signOutAndRedirect(); }}><LogOut size={16} /><span>{t.signOut}</span></button> : <Link className="side-login" href="/login" onClick={toggleMobile}><UserRound size={16} /><span>{t.loginOrRegister}</span></Link>}</div></aside></div>;
}
