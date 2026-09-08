'use client';

import { Bell, Home, Menu, PlaySquare, Store, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSessionProfile } from '@/hooks/useSessionProfile';

const items = [
  { label: 'Beranda', href: '/beranda', Icon: Home },
  { label: 'Reels', href: '/reels', Icon: PlaySquare },
  { label: 'Komunitas', href: '/groups', Icon: Users },
  { label: 'Marketplace', href: '/marketplace', Icon: Store },
  { label: 'Notifikasi', href: '/beranda#notifications', Icon: Bell },
];

export function MarketplaceTopNav({ onMenu }: { onMenu?: () => void }) {
  const pathname = usePathname();
  const { user, profile } = useSessionProfile();
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Warga SultraKita';
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <nav className="marketplace-topnav" aria-label="Navigasi marketplace">
      <div className="marketplace-topnav-inner">
        <button className="marketplace-mobile-menu" onClick={onMenu} aria-label="Buka menu marketplace"><Menu size={20} /></button>
        <Link href="/marketplace" className="marketplace-wordmark"><span className="marketplace-wordmark-mark">S</span><span><b>SUKI</b><small>MARKETPLACE</small></span></Link>
        <div className="marketplace-topnav-links">
          {items.map(({ label, href, Icon }) => {
            const active = label === 'Marketplace' ? pathname.startsWith('/marketplace') : false;
            return <Link key={label} href={href} className={`marketplace-topnav-link ${active ? 'active' : ''}`} aria-label={label} aria-current={active ? 'page' : undefined}><Icon size={20} /><span>{label}</span></Link>;
          })}
        </div>
        <Link href="/marketplace/profile" className="marketplace-profile-chip" aria-label={`Profil Marketplace ${displayName}`}><span className="marketplace-avatar">{profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : initials}</span><span className="marketplace-profile-name">{displayName}</span></Link>
      </div>
    </nav>
  );
}
