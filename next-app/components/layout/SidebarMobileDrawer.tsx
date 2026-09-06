'use client';
import { X } from 'lucide-react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { useUIStore } from '@/store/ui';

export function SidebarMobileDrawer({open}:{open:boolean}){
  const {toggleMobile}=useUIStore();
  // TODO: Replace with Supabase Auth Session role once auth context is wired.
  const currentRole: 'seller' | 'admin' | null = null;
  const visibleSections = menuSections.map(section => ({ ...section, items: section.items.filter(item => !item.requiredRole || item.requiredRole === currentRole) })).filter(section => section.items.length > 0);
  return <div className={'mobile-drawer-layer ' + (open ? 'open' : '')}><button className="drawer-overlay" onClick={toggleMobile} aria-label="Tutup menu"/><aside id="suki-sidebar-drawer" className="mobile-drawer"><div className="drawer-head"><span className="brand"><span className="brand-mark">S</span><span><strong>SUKI</strong><small>SUITS</small></span></span><button onClick={toggleMobile} aria-label="Tutup menu"><X size={21}/></button></div>{visibleSections.map(section=><div className="menu-section" key={section.title}><span className="menu-title">{section.title}</span>{section.items.map(item=><MenuItem key={item.label} item={item} onClick={toggleMobile}/>)}</div>)}</aside></div>
}
