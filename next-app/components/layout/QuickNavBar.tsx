'use client';

import { BriefcaseBusiness, Building2, Home, Megaphone, Store, UserPlus, Users } from 'lucide-react';

export type QuickNavKey =
  | 'home'
  | 'campaigns'
  | 'groups'
  | 'market'
  | 'suits'
  | 'marketplace'
  | 'referral';

type QuickNavBarProps = {
  active?: QuickNavKey;
  onNavigate?: (key: QuickNavKey) => void;
  onCreate?: (type?: 'post' | 'reel') => void;
  communityCount?: number;
};

type QuickNavItem = {
  key: QuickNavKey;
  label: string;
  /** Longer description used as the tooltip and the accessible name. */
  hint: string;
  Icon: typeof Home;
};

/**
 * Order matters: the mobile rail scrolls horizontally, so the destinations a
 * citizen actually uses most (Beranda, Marketplace, Properti, Jobs, Komunitas)
 * come first and the promotional surfaces (Campaign, Ajak Teman) trail.
 *
 * IMPORTANT — field order is load-bearing for `suits`.
 * `scripts/test-suki-suits-branding.js` asserts the literal sequence
 * `label: 'SUKI Suits', Icon: Building2`, so `label` must be immediately
 * followed by `Icon` for that entry. Do not insert `hint` between them.
 *
 * Label rules:
 * - The property destination MUST read "SUKI Suits". That is the registered
 *   product name in the ecosystem registry and the sidebar, so renaming it
 *   here breaks the branding contract.
 * - "SUKI Marketplace" was shortened to "Marketplace" for the rail only: at 7
 *   items on a 390px viewport the "SUKI " prefix forced every label to wrap.
 *   The sidebar and page titles still carry the full name.
 *
 * The `badge: 'NEW'` markers were removed. They were hard-coded, so they had
 * been permanently "new" and carried no information.
 */
const items: QuickNavItem[] = [
  { key: 'home', label: 'Beranda', Icon: Home, hint: 'Beranda — kabar dan aktivitas warga' },
  { key: 'marketplace', label: 'Marketplace', Icon: Store, hint: 'SUKI Marketplace — belanja produk lokal' },
  { key: 'suits', label: 'SUKI Suits', Icon: Building2, hint: 'SUKI Suits — rumah, tanah, dan sewa' },
  { key: 'market', label: 'SUKI Jobs', Icon: BriefcaseBusiness, hint: 'SUKI Jobs — lowongan kerja di Sultra' },
  { key: 'groups', label: 'Komunitas', Icon: Users, hint: 'Komunitas — grup dan diskusi warga' },
  { key: 'campaigns', label: 'Campaign', Icon: Megaphone, hint: 'Campaign — program dan promo SUKI' },
  { key: 'referral', label: 'Ajak Teman', Icon: UserPlus, hint: 'Ajak Teman — program referral' },
];

export function QuickNavBar({ active = 'home', onNavigate, communityCount = 0 }: QuickNavBarProps) {
  return (
    <nav className="quick-nav" aria-label="Navigasi utama SUKI">
      <div className="quick-nav-inner">
        {items.map(({ key, label, hint, Icon }) => {
          const count = key === 'groups' ? communityCount : 0;
          const isActive = active === key;
          return (
            <button
              type="button"
              key={key}
              title={hint}
              onClick={() => onNavigate?.(key)}
              className={`quick-nav-item quick-nav-item-${key} relative ${isActive ? 'is-active' : ''}`}
              aria-label={hint}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className="quick-nav-icon-wrap">
                <span className="quick-nav-icon-3d">
                  <Icon aria-hidden="true" size={20} />
                </span>
                {count > 0 && (
                  <span className="quick-nav-badge quick-nav-count" aria-label={`${count} anggota baru`}>
                    {count}
                  </span>
                )}
              </span>
              <span className="quick-nav-label">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
