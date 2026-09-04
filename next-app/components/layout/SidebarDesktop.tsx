'use client';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { useUIStore } from '@/store/ui';
import { useSessionProfile } from '@/hooks/useSessionProfile';

export function SidebarDesktop(){
  const { collapsed, toggleCollapsed } = useUIStore();
  const { user, profile } = useSessionProfile();
  const currentRole = profile?.role ?? null;
  const visibleSections = menuSections.map(section => ({ ...section, items: section.items.filter(item => !item.requiredRole || item.requiredRole === currentRole) })).filter(section => section.items.length > 0);
  const displayName = profile?.full_name || user?.email || 'Akun SultraKita';
  const headline = profile?.headline || (user ? 'Pencari ruang baru' : 'Masuk untuk personalisasi');
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return <aside className={'desktop-sidebar ' + (collapsed ? 'collapsed' : '')}><div className="sidebar-inner"><div className="profile-mini">{profile?.avatar_url ? <img className="avatar large" src={profile.avatar_url} alt={displayName}/> : <span className="avatar large">{initials}</span>}<div><strong>{displayName}</strong><small>{headline}</small></div></div>{visibleSections.map(section=><div className="menu-section" key={section.title}><span className="menu-title">{section.title}</span>{section.items.map(item=><MenuItem key={item.label} item={item}/>)}</div>)}<div className="sidebar-footer"><div className="side-login"><LogIn size={16}/><span>{user ? 'Kelola akun' : 'Masuk ke SultraKita'}</span></div><small>© 2026 SUKI Suits</small></div></div><button className="collapse-toggle" onClick={toggleCollapsed} aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}>{collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}</button></aside>
}
