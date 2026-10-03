'use client';

import Link from 'next/link';
import { ArrowLeft, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { mergeLabels } from '@/lib/i18n/dict-authprofile';

export type PublicProfileData = {
  /** Nama mentah untuk inisial (boleh null). */
  initialsName: string | null;
  /** Nama yang boleh tampil publik (boleh null bila disembunyikan). */
  displayName: string | null;
  publicUsername: string | null;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  role: string | null;
};

function roleLabel(t: Record<string, string>, role: string | null): string {
  switch (role) {
    case 'buyer': return t.publicProfileRoleBuyer;
    case 'seller': return t.publicProfileRoleSeller;
    case 'creator': return t.publicProfileRoleCreator;
    case 'community': return t.publicProfileRoleCommunity;
    case 'admin':
    case 'super_admin': return t.publicProfileRoleAdmin;
    default: return t.publicProfileRoleDefault;
  }
}

export function PublicProfileView({ profile }: { profile: PublicProfileData }) {
  const { language } = usePreferences();
  const t = mergeLabels(getCoreLabels(language), language);
  const name = profile.displayName || t.publicProfileFallbackName;
  const initialsSrc = (profile.initialsName || t.publicProfileFallback).trim();
  const initials = initialsSrc
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-3xl">
        <Link href="/beranda" className="inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal">
          <ArrowLeft size={16} aria-hidden="true" /> {t.publicProfileBack}
        </Link>
        <section className="mt-5 overflow-hidden rounded-3xl border border-sultra-mint/70 bg-white shadow-sm dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="h-32 bg-gradient-to-br from-sultra-forest via-sultra-teal to-sultra-blue md:h-44" aria-hidden="true" />
          <div className="px-5 pb-7 md:px-9 md:pb-9">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-sultra-mint text-3xl font-bold text-sultra-forest shadow-md dark:border-sultra-dark dark:bg-sultra-forest dark:text-sultra-sand sm:h-32 sm:w-32">
                {profile.avatar ? <img src={profile.avatar} alt={t.publicProfilePhotoAlt.replace('{name}', name)} className="h-full w-full object-cover" /> : <span aria-label={t.publicProfileInitialsAria.replace('{name}', name)}>{initials}</span>}
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-sultra-mint px-3 py-2 text-xs font-bold text-sultra-forest dark:bg-sultra-forest/30 dark:text-sultra-sand">
                <ShieldCheck size={14} aria-hidden="true" /> {t.publicProfileBadge}
              </span>
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-sultra-forest dark:text-sultra-sand">{name}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-sultra-sand/65">{profile.publicUsername ? `@${profile.publicUsername} · ` : ''}{roleLabel(t, profile.role)}</p>
              {profile.bio && <p className="mt-5 max-w-2xl whitespace-pre-line text-sm leading-7 text-gray-700 dark:text-sultra-sand/80">{profile.bio}</p>}
              {profile.location && <p className="mt-4 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-sultra-sand/70"><MapPin size={16} className="text-sultra-teal" aria-hidden="true" /> {profile.location}</p>}
            </div>
          </div>
        </section>
        <section className="mt-5 rounded-3xl border border-gray-200 bg-white p-6 dark:border-sultra-forest/30 dark:bg-sultra-dark md:p-8">
          <div className="flex items-center gap-3 text-sultra-forest dark:text-sultra-sand"><UserRound size={20} className="text-sultra-teal" /><h2 className="font-bold">{t.publicProfileAbout}</h2></div>
          <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-sultra-sand/70">{t.publicProfileAboutDesc}</p>
        </section>
      </main>
    </AppLayout>
  );
}
