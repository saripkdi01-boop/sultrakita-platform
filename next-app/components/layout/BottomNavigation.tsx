'use client';

import { Clapperboard, Home, Menu, Store, Users } from 'lucide-react';

type NavKey = 'home' | 'groups' | 'market' | 'reels' | 'menu';
type BottomNavigationProps = { active?: NavKey; onNavigate?: (key: NavKey) => void };
const items: { key: NavKey; label: string; Icon: typeof Home }[] = [{ key: 'home', label: 'Beranda', Icon: Home }, { key: 'groups', label: 'Komunitas', Icon: Users }, { key: 'market', label: 'Marketplace', Icon: Store }, { key: 'reels', label: 'Reels', Icon: Clapperboard }, { key: 'menu', label: 'Menu', Icon: Menu }];
export function BottomNavigation({ active = 'home', onNavigate }: BottomNavigationProps) { return <nav className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-around border-t border-gray-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden dark:border-sultra-forest/30 dark:bg-sultra-dark" aria-label="Navigasi mobile">{items.map(({ key, label, Icon }) => <button key={key} onClick={() => onNavigate?.(key)} className={`relative flex h-full min-w-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${active === key ? 'text-sultra-teal' : 'text-gray-500 dark:text-sultra-sand/60'}`} aria-current={active === key ? 'page' : undefined}><Icon size={20}/><span>{label}</span>{active === key && <i className="absolute bottom-0 h-0.5 w-8 rounded-full bg-sultra-teal"/>}</button>)}</nav>; }
