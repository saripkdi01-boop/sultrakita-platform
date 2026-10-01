'use client';

import Link from 'next/link';
import { Bell, Bookmark, Compass, Home, LifeBuoy, MessageCircle, Settings, UserRound, Users } from 'lucide-react';
import type { QuickNavKey } from './QuickNavBar';
import { requestOpenNotifications } from './skNavBus';

/** Kunci navigasi shell social workspace SUKI (pola Threads/X). */
export type SkNavKey = 'home' | 'explore' | 'notifications' | 'messages' | 'groups' | 'saved' | 'profile';

type SkLeftRailProps = {
  active: SkNavKey | null;
  profileHref: string;
  onNavigate: (key: SkNavKey | QuickNavKey) => void;
};

type RailLink = { key?: SkNavKey; label: string; href: string; Icon: typeof Home };
type RailAction = { key: SkNavKey; label: string; Icon: typeof Home; onSelect: () => void };

const secondaryLinks: RailLink[] = [
  { label: 'Pengaturan', href: '/settings/account', Icon: Settings },
  { label: 'Bantuan', href: '/help-center', Icon: LifeBuoy },
];

export function SkLeftRail({ active, profileHref, onNavigate }: SkLeftRailProps) {
  const primaryLinks: RailLink[] = [
    { key: 'home', label: 'Beranda', href: '/beranda', Icon: Home },
    { key: 'explore', label: 'Jelajahi', href: '/marketplace', Icon: Compass },
    { key: 'messages', label: 'Pesan', href: '/chat', Icon: MessageCircle },
    { key: 'saved', label: 'Tersimpan', href: '/beranda?tab=saved', Icon: Bookmark },
    { key: 'profile', label: 'Profil', href: profileHref, Icon: UserRound },
  ];
  const actions: RailAction[] = [
    { key: 'notifications', label: 'Notifikasi', Icon: Bell, onSelect: requestOpenNotifications },
  ];
  // Komunitas memakai onNavigate agar string kontrak `key === 'groups'`
  // di AppLayout tetap menjadi satu-satunya jalur (dikunci contract test).
  const groupsAction: RailAction = { key: 'groups', label: 'Komunitas', Icon: Users, onSelect: () => onNavigate('groups') };

  const renderLink = (item: RailLink) => {
    const isActive = active === item.key;
    return (
      <li key={`${item.key}-${item.label}`}>
        <Link
          href={item.href}
          className={`sk-rail-item${isActive ? ' is-active' : ''}`}
          aria-current={isActive ? 'page' : undefined}
        >
          <item.Icon size={21} aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      </li>
    );
  };

  // Tombol aksi (bukan link halaman): tanpa aria-current — "page" hanya untuk
  // navigasi link agar tidak menyesatkan screen reader.
  const renderAction = (item: RailAction) => {
    const isActive = active === item.key;
    return (
      <li key={`${item.key}-${item.label}`}>
        <button
          type="button"
          className={`sk-rail-item${isActive ? ' is-active' : ''}`}
          onClick={item.onSelect}
        >
          <item.Icon size={21} aria-hidden="true" />
          <span>{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <nav className="sk-rail" aria-label="Navigasi utama">
      <ul className="sk-rail-list">
        {renderLink(primaryLinks[0])}
        {renderLink(primaryLinks[1])}
        {renderAction(actions[0])}
        {renderLink(primaryLinks[2])}
        {renderAction(groupsAction)}
        {renderLink(primaryLinks[3])}
        {renderLink(primaryLinks[4])}
      </ul>
      <ul className="sk-rail-list sk-rail-secondary" aria-label="Navigasi pendukung">
        {secondaryLinks.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="sk-rail-item sk-rail-item-quiet">
              <item.Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
