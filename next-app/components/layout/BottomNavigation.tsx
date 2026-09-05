'use client';

import { Home, Menu, Plus, Store, Users } from 'lucide-react';

type BottomNavigationProps = { active?: 'home' | 'groups' | 'market' | 'menu'; onNavigate?: (key: 'home' | 'groups' | 'market' | 'menu') => void; onCreate?: () => void };
export function BottomNavigation({ active = 'home', onNavigate, onCreate }: BottomNavigationProps) {
  const items = [{ key: 'home' as const, label: 'Beranda', Icon: Home }, { key: 'groups' as const, label: 'Komunitas', Icon: Users }, { key: 'market' as const, label: 'Marketplace', Icon: Store }, { key: 'menu' as const, label: 'Menu', Icon: Menu }];
  return <nav className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-around border-t border-gray-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden dark:border-sultra-forest/30 dark:bg-sultra-dark" aria-label="Navigasi mobile"><button onClick={onCreate} className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-sultra-teal text-white shadow-glow-teal transition-transform active:scale-95" aria-label="Buat postingan"><Plus size={24}/></button>{items.map(({ key, label, Icon }) => <button key={key} onClick={() => onNavigate?.(key)} className={`flex h-full min-w-14 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${active === key ? 'text-sultra-teal' : 'text-gray-500 dark:text-sultra-sand/60'}`} aria-current={active === key ? 'page' : undefined}><Icon size={19}/><span>{label}</span></button>)}</nav>;
}
