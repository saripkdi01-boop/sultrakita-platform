'use client';

// Navigasi 8 seksi Operations Center — dirender di app/admin/layout.tsx
// (semua halaman /admin/* sudah terproteksi requireAdminUser di layout).
// Daftar seksi: overview, users, moderation, monitoring, billing, ads, settings, launch.
// CATATAN: /admin/ads dibangun track T-ADS (branch upgrade/launch-ad-monetization);
// link sudah disiapkan di sini agar navigasi lengkap setelah assembly.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UsersRound, ShieldCheck, Activity,
  CreditCard, Megaphone, Settings2, Rocket,
} from 'lucide-react';

const SECTIONS = [
  { href: '/admin/overview', label: 'Ringkasan', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Pengguna', icon: UsersRound },
  { href: '/admin/moderation', label: 'Moderasi', icon: ShieldCheck },
  { href: '/admin/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/admin/billing', label: 'Billing', icon: CreditCard },
  { href: '/admin/ads', label: 'Iklan', icon: Megaphone },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings2 },
  { href: '/admin/launch', label: 'Launch', icon: Rocket },
] as const;

export function AdminNav() {
  const pathname = usePathname() ?? '';
  return (
    <nav aria-label="Navigasi admin" className="sticky top-0 z-40 border-b border-[#dcebe5] bg-white/95 backdrop-blur dark:border-white/10 dark:bg-[#0d1512]/95">
      <div className="mx-auto flex max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2">
        <span className="mr-2 hidden shrink-0 rounded-lg bg-[#123f38] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[.14em] text-white sm:block">
          Admin
        </span>
        {SECTIONS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
