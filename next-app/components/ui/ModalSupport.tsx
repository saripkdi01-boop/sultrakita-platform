'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postToApi } from '@/lib/api/client';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';

/** Records a pending support intent; it never processes payment. */
export function ModalSupport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  const schema = z.object({ amount: z.coerce.number().min(10000, t.uiSupportMinAmount), note: z.string().max(240).optional() });
  type SupportValues = z.infer<typeof schema>;
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SupportValues>({ resolver: zodResolver(schema), defaultValues: { amount: 50000 } });
  async function submit(values: SupportValues) {
    try {
      const payload = await postToApi<{ payment_url?: string }, { campaign_id: number; name: string; amount: number; message: string | null; payment_method: string }>('/api/donations', {
        campaign_id: 1,
        name: 'Hamba Allah',
        amount: values.amount,
        message: values.note || null,
        payment_method: 'qris',
      });
      setMessage(payload.payment_url ? t.uiSupportRecordedPay : t.uiSupportRecordedThanks);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.uiSupportFailed);
    }
  }
  if (!open) return null;
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="support-title"><div className="modal-card"><button className="modal-close" onClick={onClose} aria-label={t.uiClose}>×</button><span className="eyebrow">{t.uiSupportEyebrow}</span><h2 id="support-title">{t.uiSupportTitle}</h2><form onSubmit={handleSubmit(submit)}><label>{t.uiSupportAmount}<input type="number" {...register('amount')} /></label>{errors.amount && <small>{errors.amount.message}</small>}<label>{t.uiSupportNote}<textarea {...register('note')} /></label><button className="primary-btn" disabled={isSubmitting}>{t.uiSupportSubmit}</button>{message && <p role="status">{message}</p>}</form></div></div>;
}
