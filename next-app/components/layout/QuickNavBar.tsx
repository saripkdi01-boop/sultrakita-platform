'use client';

import { BriefcaseBusiness, Building2, Home, MessageCircle, Store, Users } from 'lucide-react';

export type QuickNavKey = 'home' | 'chat' | 'groups' | 'market' | 'suits' | 'marketplace';
type QuickNavBarProps = { active?: QuickNavKey; onNavigate?: (key: QuickNavKey) => void; communityCount?: number };
const items: Array<{ key: QuickNavKey; label: string; Icon: typeof Home; badge?: string }> = [
  { key: 'home', label: 'Beranda', Icon: Home }, { key: 'chat', label: 'SUKI Chat', Icon: MessageCircle, badge: '2' }, { key: 'groups', label: 'Komunitas', Icon: Users }, { key: 'market', label: 'SUKI Jobs', Icon: BriefcaseBusiness, badge: 'NEW' }, { key: 'suits', label: 'SUKI Properti', Icon: Building2, badge: 'NEW' }, { key: 'marketplace', label: 'SUKI Marketplace', Icon: Store },
];
export function QuickNavBar({ active = 'home', onNavigate, communityCount = 0 }: QuickNavBarProps) {
  return <nav className="quick-nav border-b border-gray-200 bg-white px-1 py-1 dark:border-sultra-forest/20 dark:bg-sultra-dark" aria-label="Navigasi cepat"><div className="mx-auto flex max-w-3xl">{items.map(({ key, label, Icon, badge }) => { const count = key === 'chat' ? 2 : key === 'groups' ? communityCount : 0; const isActive = active === key; return <button key={key} onClick={() => onNavigate?.(key)} className={`relative flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1.5 text-[10px] transition-colors duration-200 sm:text-xs ${isActive ? 'text-sultra-teal' : 'text-gray-500 hover:bg-gray-100 dark:text-sultra-sand/60 dark:hover:bg-sultra-forest/20'}`} aria-current={isActive ? 'page' : undefined} aria-pressed={isActive}><span className="relative"><Icon size={20}/>{badge && key !== 'chat' && <span className="absolute -right-7 -top-2 rounded-full bg-sultra-gold px-1.5 text-[8px] font-bold leading-4 text-sultra-forest">{badge}</span>}{count > 0 && <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-center text-[9px] leading-4 text-white">{count}</span>}</span><span className="hidden sm:block">{label}</span>{isActive && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-sultra-teal"/>}</button>; })}</div></nav>;
}
