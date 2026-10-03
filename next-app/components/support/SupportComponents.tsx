'use client';

import { Check, ChevronRight, ShieldCheck, Trash2 } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { usePreferences } from '@/lib/preferences';
import { getMiscLabels } from '@/lib/i18n/dict-misc';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_user' | 'resolved' | 'closed';

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: t.ticketInProgress,
    waiting_user: t.ticketWaitingUser,
    resolved: t.ticketResolved,
    closed: t.ticketClosed,
  };
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'resolved' || status === 'closed' ? 'bg-green-100 text-green-700' : status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-sultra-sand text-sultra-forest'}`}>{labels[status]}</span>;
}

export function ArticleCard({ article }: { article: { slug: string; title: string; category: string; views_count?: number } }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  return (
    <Link href={`/help-center/${article.slug}`} className="group flex items-center gap-3 rounded-2xl border border-sultra-mint bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-sultra-dark">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-sultra-mint text-sultra-teal"><ChevronRight size={18} /></span>
      <span className="min-w-0 flex-1">
        <strong className="line-clamp-2 text-sm">{article.title}</strong>
        <small className="text-gray-500">{article.category} · {article.views_count || 0} {t.helpReadCount}</small>
      </span>
    </Link>
  );
}

export function SecurityCheckup() {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  const checks = [t.checkStrongPassword, t.checkEmailVerified, t.checkPhoneVerified, t.check2fa];
  const [done, setDone] = React.useState([true, true, false, false]);
  const score = Math.round(done.filter(Boolean).length / checks.length * 100);
  return (
    <section className="rounded-2xl border border-sultra-mint bg-white p-5 dark:bg-sultra-dark">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold">{t.securityCheckupTitle}</h2>
          <p className="text-sm text-gray-500">{t.securityCheckupDesc}</p>
        </div>
        <ShieldCheck className="text-sultra-teal" />
      </div>
      <div className="mt-4 h-2 rounded-full bg-sultra-mint"><div className="h-2 rounded-full bg-sultra-teal" style={{ width: `${score}%` }} /></div>
      <p className="mt-2 text-sm font-semibold text-sultra-teal">{score >= 75 ? t.scoreStrong : score >= 50 ? t.scoreMedium : t.scoreWeak} · {score}%</p>
      <div className="mt-4 space-y-2">
        {checks.map((label, index) => (
          <button key={label} onClick={() => setDone(current => current.map((value, item) => item === index ? !value : value))} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-sultra-mint/50">
            <span className={`grid h-6 w-6 place-items-center rounded-full ${done[index] ? 'bg-sultra-teal text-white' : 'border border-gray-300'}`}>{done[index] && <Check size={14} />}</span>
            <span className="text-sm">{label}</span>
            {!done[index] && <span className="ml-auto text-xs text-sultra-teal">{t.fixNow}</span>}
          </button>
        ))}
      </div>
    </section>
  );
}

export function DeviceList({ devices, onRemove }: { devices: { id: string; device_name: string; last_active_at: string }[]; onRemove?: (id: string) => void }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  return (
    <section className="rounded-2xl border border-sultra-mint bg-white p-5 dark:bg-sultra-dark">
      <h2 className="font-bold">{t.devicesTitle}</h2>
      <div className="mt-3 space-y-2">
        {devices.length ? devices.map(device => (
          <div key={device.id} className="flex items-center justify-between rounded-xl bg-sultra-mint/40 p-3">
            <div>
              <p className="text-sm font-semibold">{device.device_name}</p>
              <small className="text-gray-500">{t.deviceActive} {new Date(device.last_active_at).toLocaleDateString(language === 'id' ? 'id-ID' : language)}</small>
            </div>
            {onRemove && <button onClick={() => onRemove(device.id)} className="text-red-600" aria-label={t.sessRemoveAria.replace('{name}', device.device_name)}><Trash2 size={16} /></button>}
          </div>
        )) : <p className="text-sm text-gray-500">{t.deviceEmpty}</p>}
      </div>
    </section>
  );
}

export function LegalDocumentViewer({ title, version, content }: { title: string; version: string; content: string }) {
  const { language } = usePreferences();
  const t = getMiscLabels(language);
  return (
    <article className="rounded-2xl border border-sultra-mint bg-white p-6 dark:bg-sultra-dark">
      <p className="text-xs font-semibold uppercase text-sultra-teal">{t.legalVersion} {version}</p>
      <h1 className="mt-2 font-serif text-3xl font-bold">{title}</h1>
      <div className="prose prose-sm mt-6 max-w-none dark:prose-invert">{content.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>
    </article>
  );
}
