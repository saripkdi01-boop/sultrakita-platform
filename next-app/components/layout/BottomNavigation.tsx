'use client';

import { Building, Home, Menu, ShoppingBag, Video } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type NavKey = 'home' | 'property' | 'market' | 'reels' | 'menu';
type BottomNavigationProps = { active?: NavKey; onNavigate?: (key: NavKey) => void };
const items: { key: NavKey; label: string; href: string; Icon: typeof Home }[] = [
  { key: 'home', label: 'Beranda', href: '/', Icon: Home },
  { key: 'property', label: 'Properti', href: '/properti', Icon: Building },
  { key: 'market', label: 'Marketplace', href: '/marketplace', Icon: ShoppingBag },
  { key: 'reels', label: 'Reels', href: '/reels', Icon: Video },
  { key: 'menu', label: 'Menu', href: '#menu', Icon: Menu },
];
export function BottomNavigation({ active, onNavigate }: BottomNavigationProps) {
  const pathname = usePathname(); const router = useRouter();
  const current: NavKey = active || (pathname === '/' ? 'home' : pathname.startsWith('/properti') ? 'property' : pathname.startsWith('/marketplace') ? 'market' : pathname.startsWith('/reels') ? 'reels' : 'menu');
  return <nav className="fixed inset-x-0 bottom-0 z-50 flex h-14 items-center justify-around border-t border-gray-200 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-lg md:hidden dark:border-sultra-forest/30 dark:bg-sultra-dark" aria-label="Navigasi mobile">{items.map(({ key, label, href, Icon }) => <button key={key} onClick={() => { onNavigate?.(key); if (key !== 'menu') router.push(href); }} className={`relative flex h-full min-w-14 flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors ${current === key ? 'text-sultra-teal' : 'text-gray-500 dark:text-sultra-sand/60'}`} aria-current={current === key ? 'page' : undefined}><Icon size={20}/><span>{label}</span>{current === key && <i className="absolute bottom-0 h-0.5 w-8 rounded-full bg-sultra-teal"/>}</button>)}</nav>;
}
