'use client';

import { ChevronDown, ChevronLeft, ChevronRight, Crown, LogOut, RefreshCw, Check } from 'lucide-react';
import { useState } from 'react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { useUIStore } from '@/store/ui';
import { useSessionProfile } from '@/hooks/useSessionProfile';

const collapsedByDefault = new Set(['Bantuan dan Dukungan', 'Pengaturan dan Privasi']);

export function SidebarDesktop() {
  const { collapsed, toggleCollapsed } = useUIStore();
  const { user, profile } = useSessionProfile();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const displayName = profile?.full_name || user?.email || 'Wan Shofir';
  const headline = profile?.headline || 'Seller terverifikasi · Kendari';
  const initials = displayName.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className={`desktop-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-inner">
        <div className="profile-mini">
          {profile?.avatar_url ? <img className="avatar large" src={profile.avatar_url} alt={displayName} /> : <span className="avatar large">{initials}</span>}
          <div><strong>{displayName}</strong><small>{headline}</small></div>
          <span className="profile-status"><Check size={12} /></span>
        </div>
        {!collapsed && <div className="profile-actions"><button aria-label="Segarkan profil"><RefreshCw size={14} /></button><span>Aktif di Sultra</span></div>}
        {menuSections.map((section) => {
          const isExpandable = collapsedByDefault.has(section.title);
          const isOpen = expanded[section.title] ?? !isExpandable;
          return <div className="menu-section" key={section.title}>
            {isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span>{!collapsed && <ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} />}</button> : <span className="menu-title">{section.title}</span>}
            {(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} />)}
          </div>;
        })}
        {!collapsed && <div className="sidebar-footer"><a className="side-upgrade" href="#premium"><Crown size={16} /><span><strong>SultraKita Premium</strong><small>Bangun eksistensi publik</small></span></a><div className="side-login"><LogOut size={16} /><span>Keluar</span></div><small>© 2026 SUKI Suits</small></div>}
      </div>
      <button className="collapse-toggle" onClick={toggleCollapsed} aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}>{collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}</button>
    </aside>
  );
}
