'use client';

import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { usePreferences } from '@/lib/preferences';
import { tpj } from '@/lib/i18n/dict-propertijobs';

export default function JobsCreatePage() {
  const { language } = usePreferences();
  const p = (key: string) => tpj(language, key);
  return <AppLayout><main className="platform-shell mx-auto max-w-2xl p-6"><Link href="/jobs" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-sultra-teal"><ArrowLeft size={16}/> {p('pjJobsCreateBack')}</Link><section className="rounded-3xl border border-sultra-mint bg-white p-8 shadow-sm dark:bg-sultra-dark"><BriefcaseBusiness size={28} className="text-sultra-teal"/><h1 className="mt-4 text-2xl font-bold text-sultra-forest dark:text-sultra-sand">{p('pjJobsCreateTitle')}</h1><p className="mt-2 text-sm leading-6 text-gray-600 dark:text-sultra-sand/70">{p('pjJobsCreateDesc')}</p><Link href="/jobs" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-sultra-forest px-5 text-sm font-bold text-white">{p('pjExploreJobs')}</Link></section></main></AppLayout>;
}
