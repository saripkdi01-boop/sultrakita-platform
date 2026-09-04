'use client';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { useUIStore } from '@/store/ui';

export function SidebarDesktop(){
  const { collapsed, toggleCollapsed } = useUIStore();
  // TODO: Replace with Supabase Auth Session role once auth context is wired.
  const currentRole: 'seller' | 'admin' | null = null;
  const visibleSections = menuSections.map(section => ({ ...section, items: section.items.filter(item => !item.requiredRole || item.requiredRole === currentRole) })).filter(section => section.items.length > 0);
  return <aside className={'desktop-sidebar ' + (collapsed ? 'collapsed' : '')}><div className="sidebar-inner"><div className="profile-mini"><span className="avatar large">AR</span><div><strong>Aulia Rahma</strong><small>Pencari ruang baru</small></div></div>{visibleSections.map(section=><div className="menu-section" key={section.title}><span className="menu-title">{section.title}</span>{section.items.map(item=><MenuItem key={item.label} item={item}/>)}</div>)}<div className="sidebar-footer"><div className="side-login"><LogIn size={16}/><span>Masuk sebagai agen</span></div><small>© 2026 SUKI Suits</small></div></div><button className="collapse-toggle" onClick={toggleCollapsed} aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}>{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button></aside>
}
