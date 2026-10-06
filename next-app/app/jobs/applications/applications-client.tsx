'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, BellOff, Building2, CheckCircle2, ChevronRight, FileText, Inbox, XCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { toggleJobAlert, withdrawApplication, type JobAlert, type JobApplication } from '@/lib/actions/jobs';
import { usePreferences } from '@/lib/preferences';
import { tpj } from '@/lib/i18n/dict-propertijobs';

// Tracker lamaran ala JobStreet/Glints/LinkedIn: status lamaran divisualkan
// sebagai lini masa progres, plus kelola notifikasi lowongan (job alert).
function statusLabels(language: string): Record<string, string> {
  const c = (key: string) => tpj(language, key);
  return {
    submitted: c('pjStatusSubmitted'), viewed: c('pjStatusViewed'), screening: c('pjStatusScreening'), interview: c('pjStatusInterview'),
    offered: c('pjStatusOffered'), accepted: c('pjStatusAccepted'), rejected: c('pjStatusRejected'), withdrawn: c('pjStatusWithdrawn'),
  };
}
function stepLabels(language: string): string[] {
  const c = (key: string) => tpj(language, key);
  return [c('pjStepSubmitted'), c('pjStepViewed'), c('pjStepScreening'), c('pjStepInterview'), c('pjStepOffered'), c('pjStepAccepted')];
}
/** Map app language code to an Intl locale for date formatting. */
function dateLocale(language: string): string {
  const map: Record<string, string> = { id: 'id-ID', en: 'en-US', ms: 'ms-MY', jv: 'jv-ID', su: 'su-ID', zh: 'zh-CN', ja: 'ja-JP', ko: 'ko-KR', th: 'th-TH', vi: 'vi-VN', tl: 'fil-PH', hi: 'hi-IN', bn: 'bn-BD', ur: 'ur-PK', ta: 'ta-IN', my: 'my-MM', km: 'km-KH', ar: 'ar-SA', fa: 'fa-IR', tr: 'tr-TR', es: 'es-ES', fr: 'fr-FR', de: 'de-DE', pt: 'pt-BR', it: 'it-IT', nl: 'nl-NL', ru: 'ru-RU' };
  return map[language] || 'id-ID';
}
const STATUS_COLOR: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  viewed: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  screening: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  interview: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  offered: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  withdrawn: 'bg-gray-200 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
};
const STEPS = ['submitted', 'viewed', 'screening', 'interview', 'offered', 'accepted'];

function ProgressBar({ status, language }: { status: string; language: string }) {
  if (status === 'rejected' || status === 'withdrawn') return null;
  const current = Math.max(0, STEPS.indexOf(status));
  const labels = stepLabels(language);
  return <ol className="mt-4 flex items-center gap-0" aria-label={tpj(language, 'pjProgressAria')}>
    {labels.map((label, index) => {
      const done = index <= current;
      return <li key={STEPS[index]} className="flex flex-1 items-center last:flex-none">
        <div className="flex flex-col items-center gap-1">
          <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ${done ? 'bg-sultra-teal text-white' : 'bg-gray-200 text-gray-500 dark:bg-sultra-forest/40 dark:text-gray-400'}`}>
            {done ? <CheckCircle2 size={14}/> : index + 1}
          </span>
          <span className={`hidden text-[10px] sm:block ${done ? 'font-semibold text-sultra-teal' : 'text-gray-400'}`}>{label}</span>
        </div>
        {index < labels.length - 1 && <span className={`mx-1 mb-0 h-0.5 flex-1 rounded sm:mb-5 ${index < current ? 'bg-sultra-teal' : 'bg-gray-200 dark:bg-sultra-forest/40'}`}/>}
      </li>;
    })}
  </ol>;
}

export default function ApplicationsClient({ initialApps, initialAlerts }: {
  initialApps: { ok: boolean; applications: JobApplication[]; error?: string };
  initialAlerts: { ok: boolean; alerts: JobAlert[]; error?: string };
}) {
  const { language } = usePreferences();
  const p = (key: string, vars?: Record<string, string | number>) => tpj(language, key, vars ?? {});
  const statusLabel = statusLabels(language);
  const [apps, setApps] = useState<JobApplication[]>(initialApps.applications);
  const [alerts, setAlerts] = useState<JobAlert[]>(initialAlerts.alerts);
  const [notice, setNotice] = useState('');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const loggedIn = initialApps.ok || initialAlerts.ok;

  async function toggleAlert(id: string) {
    const result = await toggleJobAlert(id);
    if (result.ok) setAlerts(current => current.map(alert => alert.id === id ? { ...alert, is_active: result.isActive } : alert));
    else setNotice(result.error);
  }

  async function withdraw(id: string) {
    if (!window.confirm(p('pjWithdrawConfirm'))) return;
    setWithdrawingId(id); setNotice('');
    const result = await withdrawApplication(id);
    setWithdrawingId(null);
    if (result.ok) setApps(current => current.map(app => app.id === id ? { ...app, status: 'withdrawn' } : app));
    else setNotice(result.error);
  }

  return <AppLayout active="market"><main className="platform-shell mx-auto max-w-4xl">
    <Link href="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-sultra-teal"><ArrowLeft size={16}/> {p('pjJobsCreateBack')}</Link>
    <h1 className="mt-4 text-2xl font-bold text-sultra-forest dark:text-sultra-sand">{p('pjAppsTitle')}</h1>
    <p className="mt-1 text-sm text-gray-600 dark:text-sultra-sand/70">{p('pjAppsDesc')}</p>
    {notice && <div className="mt-4 rounded-2xl bg-sultra-sand/40 p-3 text-sm text-sultra-forest">{notice}</div>}

    {!loggedIn && <div className="mt-6 rounded-3xl border border-dashed p-10 text-center">
      <FileText className="mx-auto mb-3 text-sultra-teal" size={38}/>
      <p className="font-semibold text-sultra-forest dark:text-sultra-sand">{p('pjLoginToView')}</p>
      <p className="mt-1 text-sm text-gray-500">{p('pjLoginToViewDesc')}</p>
      <Link href="/login?redirect=/jobs/applications" className="mt-5 inline-block rounded-xl bg-sultra-forest px-6 py-3 text-sm font-bold text-white">{p('pjLoginRegister')}</Link>
    </div>}

    {loggedIn && <><section className="mt-6">
      <h2 className="text-lg font-bold text-sultra-forest dark:text-sultra-sand">{p('pjAppHistory')}</h2>
      {initialApps.applications.length === 0 && <div className="mt-3 rounded-3xl border border-dashed p-8 text-center text-gray-500">
        <Inbox className="mx-auto mb-2 text-sultra-teal" size={32}/>
        <p className="font-semibold">{p('pjNoApps')}</p>
        <p className="mt-1 text-sm">{p('pjNoAppsDesc')}</p>
        <Link href="/jobs" className="mt-4 inline-block rounded-xl bg-sultra-teal px-5 py-2.5 text-sm font-bold text-white">{p('pjFindJobs')}</Link>
      </div>}
      <div className="mt-4 space-y-4">
        {apps.map(app => { const canWithdraw = ['submitted', 'viewed', 'screening', 'interview'].includes(app.status); return <article key={app.id} className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sultra-teal to-sultra-gold text-white"><Building2 size={22}/></div>
              <div><Link href={`/jobs/${app.job_id}`} className="font-bold text-sultra-forest hover:text-sultra-teal dark:text-sultra-sand">{app.job?.title || p('pjJobFallback')}</Link>
                <p className="mt-0.5 text-sm text-gray-500">{app.job?.company?.name} · {app.job?.city || app.job?.location}</p>
                <p className="mt-1 text-xs text-gray-400">{p('pjAppliedOn', { date: new Date(app.applied_at).toLocaleDateString(dateLocale(language), { day: 'numeric', month: 'short', year: 'numeric' }) })}</p></div>
            </div>
            <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${STATUS_COLOR[app.status] || STATUS_COLOR.submitted}`}>{statusLabel[app.status] || app.status}</span>
          </div>
          <ProgressBar status={app.status} language={language} />
          {canWithdraw && <div className="mt-3"><button type="button" onClick={() => void withdraw(app.id)} disabled={withdrawingId === app.id} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30" aria-label={p('pjWithdrawAria', { title: app.job?.title || p('pjJobFallback') })}>{withdrawingId === app.id ? p('pjWithdrawing') : p('pjWithdraw')}</button></div>}
          {(app.status === 'rejected' || app.status === 'withdrawn') && <p className="mt-3 flex items-center gap-2 text-sm text-gray-500"><XCircle size={16}/> {app.status === 'rejected' ? p('pjRejectedNote') : p('pjWithdrawnNote')}</p>}
        </article>; })}
      </div>
    </section>

    <section className="mt-10">
      <h2 className="flex items-center gap-2 text-lg font-bold text-sultra-forest dark:text-sultra-sand"><Bell size={18}/> {p('pjJobAlert')}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-sultra-sand/70">{p('pjAlertDesc')}</p>
      {alerts.length === 0 && <p className="mt-3 rounded-2xl border border-dashed p-6 text-center text-sm text-gray-500">{p('pjNoAlerts')} {p('pjNoAlertsA')} <Link href="/jobs" className="font-semibold text-sultra-teal">SUKI Jobs</Link> {p('pjNoAlertsB')}</p>}
      <div className="mt-3 space-y-3">
        {alerts.map(alert => <div key={alert.id} className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-sultra-forest/30 dark:bg-sultra-dark">
          <div className="min-w-0"><p className="truncate font-semibold text-sultra-forest dark:text-sultra-sand">{alert.title}</p>
            <p className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-gray-500">{[...alert.keywords, ...alert.locations].slice(0, 4).map(tag => <span key={tag} className="rounded-full bg-sultra-mint/60 px-2 py-0.5">{tag}</span>)}<span className="px-1">{alert.frequency === 'daily' ? `· ${p('pjDaily')}` : `· ${p('pjWeekly')}`}</span></p></div>
          <button onClick={() => void toggleAlert(alert.id)} aria-pressed={alert.is_active} aria-label={alert.is_active ? p('pjDisableNotif') : p('pjEnableNotif')} className={`relative h-7 w-12 shrink-0 rounded-full transition ${alert.is_active ? 'bg-sultra-teal' : 'bg-gray-300 dark:bg-sultra-forest/50'}`}>
            <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${alert.is_active ? 'left-6' : 'left-1'}`}/>
          </button>
        </div>)}
      </div>
    </section></>}
  </main></AppLayout>;
}
