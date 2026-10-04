'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { applyForJob, getAppliedJobIds } from '@/lib/actions/jobs';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { tpj } from '@/lib/i18n/dict-propertijobs';

// Tombol "Lamar 1-klik" ala Glints TapLoker: pengguna login cukup menekan sekali
// (surat lamaran opsional), yang belum login diarahkan ke halaman login,
// yang sudah melamar melihat badge status.
export default function JobApplyButton({ jobId, jobTitle, redirectPath, className = '', label = 'Lamar sekarang' }: { jobId: string; jobTitle: string; redirectPath: string; className?: string; label?: string }) {
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const p = (key: string, vars?: Record<string, string | number>) => tpj(language, key, vars ?? {});
  // Server pages pass Indonesian labels; map the known ones to translations.
  const displayLabel = label === 'Lamar 1-klik' ? p('pjApplyOneClick') : label === 'Lamar sekarang' ? p('pjApplyNow') : label;
  const [state, setState] = useState<'checking' | 'guest' | 'ready' | 'applied'>('checking');
  const [open, setOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      if (!supabase) { if (active) setState('guest'); return; }
      const { data } = await supabase.auth.getUser();
      if (!active) return;
      if (!data.user) { setState('guest'); return; }
      const applied = await getAppliedJobIds();
      if (!active) return;
      setState(applied.ok && applied.ids.includes(jobId) ? 'applied' : 'ready');
    })();
    return () => { active = false; };
  }, [jobId]);

  async function send() {
    setSending(true); setError('');
    const result = await applyForJob(jobId, { cover_letter: coverLetter });
    setSending(false);
    if (result.ok) { setState('applied'); setOpen(false); setCoverLetter(''); }
    else setError(result.error);
  }

  if (state === 'checking') return <span className={`inline-block animate-pulse rounded-xl bg-gray-200 px-5 py-3 text-sm dark:bg-sultra-forest/40 ${className}`} aria-hidden />;
  if (state === 'guest') return <Link href={`/login?redirect=${encodeURIComponent(redirectPath)}`} className={className}>{displayLabel}</Link>;
  if (state === 'applied') return <span className={`inline-flex items-center gap-2 rounded-xl bg-sultra-mint px-5 py-3 text-sm font-bold text-sultra-forest dark:bg-sultra-forest/40 dark:text-sultra-sand ${className}`}><CheckCircle2 size={16}/> {p('pjApplied')}</span>;

  return <>
    <button onClick={() => setOpen(true)} className={className}><Zap size={16} className="mr-1 inline -mt-0.5"/>{displayLabel}</button>
    {open && <div className="fixed inset-0 z-50 grid place-items-center bg-sultra-forest/50 p-4" onClick={() => setOpen(false)}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-sultra-dark" onClick={event => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-bold uppercase tracking-wider text-sultra-teal">{p('pjQuickApply')}</p><h2 className="mt-1 text-xl font-bold text-sultra-forest dark:text-sultra-sand">{jobTitle}</h2></div>
          <button onClick={() => setOpen(false)} aria-label={t.close}><X size={20}/></button>
        </div>
        <p className="mt-3 text-sm text-gray-600 dark:text-sultra-sand/70">{p('pjApplyOptionalNote')}</p>
        <textarea value={coverLetter} onChange={event => setCoverLetter(event.target.value)} className="mt-4 min-h-28 w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-sultra-teal dark:border-sultra-forest/30 dark:bg-sultra-dark" placeholder={p('pjCoverPlaceholder')}/>
        {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}
        <button onClick={() => void send()} disabled={sending} className="mt-4 w-full rounded-xl bg-sultra-teal py-3 text-sm font-bold text-white disabled:opacity-60">{sending ? p('pjSendingApplication') : p('pjSendApplication')}</button>
      </div>
    </div>}
  </>;
}
