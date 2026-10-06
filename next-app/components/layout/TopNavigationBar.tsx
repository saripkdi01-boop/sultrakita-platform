'use client';

import { Bell, Menu, MessageCircle, Plus, Search, Settings, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUIStore } from '@/store/ui';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { getNavLabels } from '@/lib/i18n/navigation';

type TopNavigationBarProps = {
  userName?: string;
  avatarUrl?: string | null;
  notificationCount?: number;
  messageCount?: number;
  onCreate?: () => void;
  onSearch?: (query: string) => void;
  onChat?: () => void;
  onNotifications?: () => void;
};

export function TopNavigationBar({ userName: userNameProp, avatarUrl, notificationCount = 0, messageCount = 0, onCreate, onSearch, onChat, onNotifications }: TopNavigationBarProps) {
  const { mobileOpen, toggleMobile } = useUIStore();
  const { language } = usePreferences();
  const t: Record<string, string> = { ...getCoreLabels(language), ...getNavLabels(language) };
  const userName = userNameProp ?? t.defaultUserName;
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const initials = userName.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
  function submitSearch(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (query.trim()) onSearch?.(query.trim()); }
  return <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-sultra-forest/30 dark:bg-sultra-dark">
    <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2">
        <button className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sultra-forest transition-colors hover:bg-sultra-mint/40 dark:text-sultra-mint" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="suki-sidebar-drawer" aria-label={mobileOpen ? t.closeMainMenu : t.openMainMenu}>{mobileOpen ? <X size={21}/> : <Menu size={21}/>}</button>
        <a href="/" className="font-bold tracking-tight text-sultra-teal sm:text-xl" aria-label={t.sultraKitaHome}>SultraKita</a>
        <form onSubmit={submitSearch} className="ml-1 hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-2 text-gray-500 sm:flex dark:bg-sultra-forest/20 dark:text-sultra-mint"><Search size={16}/><input value={query} onChange={event => setQuery(event.target.value)} className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-400 lg:w-48" placeholder={t.searchInSultraKita} aria-label={t.searchInSultraKita}/></form>
      </div>
      <div className="flex items-center gap-1 text-sultra-forest dark:text-sultra-mint">
        <button className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sultra-mint/40" onClick={onCreate} aria-label={t.createContent}><Plus size={21}/></button>
        <button className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sultra-mint/40 sm:hidden" onClick={() => setSearchOpen(value => !value)} aria-label={t.openSearch}><Search size={19}/></button>
        <button className={`grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sultra-mint/40 ${pathname.startsWith('/groups') ? 'bg-sultra-mint/40' : ''}`} onClick={() => router.push('/groups')} aria-label={t.openCommunity}><UsersRound size={20}/></button><button className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sultra-mint/40" onClick={onChat} aria-label={t.openMessages}><MessageCircle size={20}/>{messageCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-center text-[10px] leading-none text-white">{messageCount}</span>}</button>
        <button className="relative grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-sultra-mint/40" onClick={() => { if (onNotifications) onNotifications(); else router.push(pathname.startsWith('/properti') ? '/properti' : '/beranda'); }} aria-label={t.openNotifications}><Bell size={20}/>{notificationCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-red-500 px-1 py-0.5 text-center text-[10px] leading-none text-white">{notificationCount}</span>}</button>
        <div className="relative ml-1"><button onClick={() => setMenuOpen(value => !value)} className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-sultra-teal text-xs font-semibold text-white ring-2 ring-white dark:ring-sultra-dark" aria-expanded={menuOpen} aria-label={`${t.profileMenu} ${userName}`}>{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover"/> : initials}</button>{menuOpen && <div className="absolute right-0 top-11 w-52 rounded-xl border border-gray-200 bg-white p-2 text-sm shadow-dropdown dark:border-sultra-forest/30 dark:bg-sultra-dark"><div className="border-b border-gray-100 px-3 py-2 dark:border-sultra-forest/30"><strong className="block text-gray-900 dark:text-sultra-sand">{userName}</strong><span className="text-xs text-gray-500">{t.sultraKitaAccount}</span></div><a className="mt-1 flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 hover:bg-sultra-mint/30" href="/marketplace/profile">{t.profile}</a><a className="flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 hover:bg-sultra-mint/30" href="/dashboard"><Settings size={15}/> {t.settings}</a><button className="min-h-11 w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50" onClick={() => setMenuOpen(false)}>{t.logout}</button></div>}</div>
      </div>
    </div>
    {searchOpen && <form onSubmit={submitSearch} className="border-t border-gray-100 p-3 sm:hidden dark:border-sultra-forest/30"><div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-2 dark:bg-sultra-forest/20"><Search size={16}/><input autoFocus value={query} onChange={event => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder={t.searchPlaceholder} aria-label={t.search}/></div></form>}
  </header>;
}
