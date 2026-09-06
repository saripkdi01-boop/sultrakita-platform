'use client';

import { ChevronDown, Check, Crown, LogOut, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { menuSections } from '@/config/navigation';
import { MenuItem } from '@/components/ui/MenuItem';
import { useUIStore } from '@/store/ui';

const collapsedByDefault = new Set(['Bantuan dan Dukungan', 'Pengaturan dan Privasi']);

export function SidebarMobileDrawer({ open }: { open: boolean }) {
  const { toggleMobile } = useUIStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return <div className={`mobile-drawer-layer ${open ? 'open' : ''}`}>
    <button className="drawer-overlay" onClick={toggleMobile} aria-label="Tutup menu" />
    <aside id="suki-sidebar-drawer" className="mobile-drawer" aria-label="Menu SultraKita">
      <div className="drawer-head"><span className="brand"><span className="brand-mark">S</span><span><strong>SultraKita</strong><small>SUKI MARKETPLACE</small></span></span><button onClick={toggleMobile} aria-label="Tutup menu"><X size={21} /></button></div>
      <div className="drawer-profile"><span className="avatar large">WS</span><div><strong>Wan Shofir</strong><small>Seller terverifikasi · Kendari</small></div><span className="profile-status"><Check size={12} /></span></div>
      <div className="drawer-tools"><button aria-label="Segarkan profil"><RefreshCw size={14} /></button><span>Profil aktif</span></div>
      {menuSections.map((section) => {
        const isExpandable = collapsedByDefault.has(section.title);
        const isOpen = expanded[section.title] ?? !isExpandable;
        return <div className="menu-section" key={section.title}>
          {isExpandable ? <button className="menu-title menu-title-button" onClick={() => setExpanded((current) => ({ ...current, [section.title]: !isOpen }))}><span>{section.title}</span><ChevronDown className={isOpen ? 'rotate-180' : ''} size={14} /></button> : <span className="menu-title">{section.title}</span>}
          {(!isExpandable || isOpen) && section.items.map((item) => <MenuItem key={item.label} item={item} onClick={toggleMobile} />)}
        </div>;
      })}
      <div className="sidebar-footer"><a className="side-upgrade" href="#premium" onClick={toggleMobile}><Crown size={16} /><span><strong>SultraKita Premium</strong><small>Bangun eksistensi publik</small></span></a><div className="side-login"><LogOut size={16} /><span>Keluar</span></div></div>
    </aside>
  </div>;
}
