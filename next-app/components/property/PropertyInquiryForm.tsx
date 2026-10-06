'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { createPropertyInquiry } from '@/lib/actions/property';
import { usePreferences } from '@/lib/preferences';
import { getCoreLabels } from '@/lib/i18n/dictionaries';
import { tpj } from '@/lib/i18n/dict-propertijobs';

export function PropertyInquiryForm({ propertyId }: { propertyId: string }) {
  const { language } = usePreferences();
  const t = getCoreLabels(language);
  const p = (key: string, vars?: Record<string, string | number>) => tpj(language, key, vars ?? {});
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit() {
    if (message.trim().length < 2) { setNotice(p('pjInquiryMinChars')); return; }
    setSaving(true); setNotice('');
    const response = await createPropertyInquiry(propertyId, message.trim());
    setSaving(false);
    if (!response.ok) {
      setNotice(response.error.includes('login') || response.error.includes('Sesi') ? p('pjInquiryNeedLogin') : response.error);
      return;
    }
    setMessage(''); setNotice(p('pjInquirySent'));
  }
  return <div className="mt-3 w-full rounded-2xl bg-sultra-mint/50 p-3"><textarea value={message} onChange={event => setMessage(event.target.value)} className="field-input min-h-20 w-full bg-white" placeholder={p('pjInquiryPlaceholder')} maxLength={2000}/>{notice && <p className="mt-2 text-xs text-sultra-forest">{notice}</p>}<div className="mt-2 flex justify-end gap-2"><Link href={`/login?redirect=/properti/${propertyId}`} className="soft-btn text-xs">{t.login}</Link><button onClick={() => void submit()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Send size={14}/>{saving ? p('pjSending') : p('pjSendInquiry')}</button></div></div>;
}
