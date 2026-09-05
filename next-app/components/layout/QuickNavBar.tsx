'use client';

import { Bell, Home, Menu, Store, Users, Video } from 'lucide-react';

type QuickNavKey = 'home' | 'reels' | 'groups' | 'market' | 'notifications' | 'menu';
type QuickNavBarProps = { active?: QuickNavKey; onNavigate?: (key: QuickNavKey) => void; reelsCount?: number; communityCount?: number };
const items: Array<{ key: QuickNavKey; label: string; Icon: typeof Home }> = [
  { key: 'home', label: 'Beranda', Icon: Home }, { key: 'reels', label: 'Reels', Icon: Video }, { key: 'groups', label: 'Komunitas', Icon: Users }, { key: 'market', label: 'Marketplace', Icon: Store }, { key: 'notifications', label: 'Notifikasi', Icon: Bell }, { key: 'menu', label: 'Menu', Icon: Menu },
];
export function QuickNavBar({ active = 'home', onNavigate, reelsCount = 0, communityCount = 0 }: QuickNavBarProps) {
  return <nav className="border-b border-gray-200 bg-white px-1 py-1 dark:border-sultra-forest/20 dark:bg-sultra-dark" aria-label="Navigasi cepat"><div className="mx-auto flex max-w-3xl">{items.map(({ key, label, Icon }) => { const count = key === 'reels' ? reelsCount : key === 'groups' ? communityCount : 0; return <button key={key} onClick={() => onNavigate?.(key)} className={`relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] transition-colors duration-200 sm:text-xs ${active === key ? 'text-sultra-teal' : 'text-gray-500 hover:bg-gray-100 dark:text-sultra-sand/60 dark:hover:bg-sultra-forest/20'}`} aria-current={active === key ? 'page' : undefined}><span className="relative"><Icon size={20}/>{count > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-center text-[9px] leading-4 text-white">{count}</span>}</span><span className="hidden sm:block">{label}</span>{active === key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-sultra-teal"/>}</button>; })}</div></nav>;
}
