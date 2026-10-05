'use client';

// Navigasi lengkap Operations Center — dirender di app/admin/layout.tsx
// (semua halaman /admin/* sudah terproteksi requireAdminUser di layout)
// dan di app/dashboard/admin/page.tsx.
// 19 seksi: overview, users, team, moderation, listings (marketplace),
// monitoring, errors, database, audit, billing, ads, announcements,
// support-tickets, ecosystem-banners, property-verification, businesses,
// affiliate-rewards, settings, launch.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UsersRound, KeyRound, ShieldCheck, Activity, Bug, Database, ScrollText,
  CreditCard, Megaphone, Settings2, BellRing, LifeBuoy, Images, House,
  Building2, Gift, Rocket, Tag,
} from 'lucide-react';

const SECTIONS = [
  { href: '/admin/overview', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Pengguna', icon: UsersRound },
  { href: '/admin/team', label: 'Tim', icon: KeyRound },
  { href: '/admin/moderation', label: 'Moderasi', icon: ShieldCheck },
  { href: '/admin/listings', label: 'Listing', icon: Tag },
  { href: '/admin/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/admin/errors', label: 'Error', icon: Bug },
  { href: '/admin/database', label: 'Database', icon: Database },
  { href: '/admin/audit', label: 'Audit', icon: ScrollText },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/admin/ads', label: 'Iklan', icon: Megaphone },
  { href: '/admin/announcements', label: 'Pengumuman', icon: BellRing },
  { href: '/admin/businesses', label: 'Bisnis', icon: Building2 },
  { href: '/admin/property-verification', label: 'Properti', icon: House },
  { href: '/admin/support-tickets', label: 'Tiket', icon: LifeBuoy },
  { href: '/admin/ecosystem-banners', label: 'Banner', icon: Images },
  { href: '/admin/affiliate-rewards', label: 'Afiliasi', icon: Gift },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings2 },
  { href: '/admin/launch', label: 'Launch', icon: Rocket },
] as const;

export interface AdminAlerts {
  /** listing marketplace menunggu moderasi */
  pendingModeration: number | null;
  /** error_events yang belum di-resolve */
  unresolvedErrors: number | null;
  /** tiket support berstatus open */
  openTickets: number | null;
}

const ALERT_FOR: Record<string, keyof AdminAlerts> = {
  '/admin/moderation': 'pendingModeration',
  '/admin/listings': 'pendingModeration',
  '/admin/errors': 'unresolvedErrors',
  '/admin/support-tickets': 'openTickets',
};

function AlertBadge({ count, tone }: { count: number; tone: 'amber' | 'red' | 'blue' }) {
  const tones = {
    amber: 'bg-amber-500 text-white',
    red: 'bg-red-600 text-white',
    blue: 'bg-sky-600 text-white',
  } as const;
  return (
    <span
      aria-label={`${count} perlu perhatian`}
      className={`ml-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${tones[tone]}`}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function AdminNav({ alerts }: { alerts?: AdminAlerts }) {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label="Navigasi admin" className="sticky top-0 z-40 border-b border-[#dcebe5] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0d1512]/95">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
        <span className="mr-2 hidden shrink-0 rounded-lg bg-[#123f38] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-white sm:block">
          Admin
        </span>
        {SECTIONS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          const alertKey = ALERT_FOR[href];
          const alertCount = alertKey && alerts ? alerts[alertKey] : null;
          const tone =
            alertKey === 'unresolvedErrors' ? 'red' : alertKey === 'openTickets' ? 'blue' : 'amber';
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-bold transition ${
                active
                  ? 'bg-[#e9f7f2] text-[#0e6258] dark:bg-white/10 dark:text-white'
                  : 'text-[#55736b] hover:bg-[#f3f8f6] hover:text-[#123f38] dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              <Icon size={15} aria-hidden="true" />
              {label}
              {alertCount !== null && alertCount !== undefined && alertCount > 0 && (
                <AlertBadge count={alertCount} tone={tone} />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}