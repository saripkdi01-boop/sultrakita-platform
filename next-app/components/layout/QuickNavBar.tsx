'use client';

import { BriefcaseBusiness, Building2, Home, MessageCircle, Store, Users } from 'lucide-react';
import { CreateMenu } from './CreateMenu';
import { NotificationCenter } from './NotificationCenter';

export type QuickNavKey = 'home' | 'chat' | 'campaigns' | 'groups' | 'market' | 'suits' | 'marketplace';
type QuickNavBarProps = { active?: QuickNavKey; onNavigate?: (key: QuickNavKey) => void; onCreate?: (type?: 'post' | 'reel') => void; communityCount?: number; chatCount?: number };
const items: Array<{ key: QuickNavKey; label: string; Icon: typeof Home; badge?: string }> = [
  { key: 'home', label: 'Beranda', Icon: Home },
  { key: 'groups', label: 'Komunitas', Icon: Users },
  { key: 'chat', label: 'SUKI Chat', Icon: MessageCircle },
  { key: 'market', label: 'SUKI Jobs', Icon: BriefcaseBusiness, badge: 'NEW' },
  { key: 'suits', label: 'SUKI Suits', Icon: Building2, badge: 'NEW' },
  { key: 'marketplace', label: 'SUKI Marketplace', Icon: Store },
];

export function QuickNavBar({ active = 'home', onNavigate, onCreate, communityCount = 0, chatCount = 0 }: QuickNavBarProps) {
  return <nav className="quick-nav" aria-label="Navigasi cepat">
    <div className="quick-nav-inner">
      {items.map(({ key, label, Icon, badge }) => {
        const count = key === 'chat' ? chatCount : key === 'groups' ? communityCount : 0;
        const isActive = active === key;
        return <button type="button" key={key} title={label} onClick={() => onNavigate?.(key)} className={`quick-nav-item quick-nav-item-${key} relative ${isActive ? 'is-active' : ''}`} aria-label={label} aria-current={isActive ? 'page' : undefined} aria-pressed={isActive}>
          <span className="quick-nav-icon-wrap"><span className="quick-nav-icon-flat"><Icon aria-hidden="true" size={20} /></span>{badge && <span className="quick-nav-badge">{badge}</span>}{count > 0 && <span className="quick-nav-badge quick-nav-count" aria-label={`${count} pesan belum dibaca`}>{count}</span>}</span>
          <span className="quick-nav-label">{label}</span>
        </button>;
      })}
      <span className="quick-nav-mobile-action quick-nav-mobile-create"><CreateMenu onCreateStory={onCreate} /></span>
      <span className="quick-nav-mobile-action quick-nav-mobile-notification"><NotificationCenter /></span>
    </div>
  </nav>;
}
