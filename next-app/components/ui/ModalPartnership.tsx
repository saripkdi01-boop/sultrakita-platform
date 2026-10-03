'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { postToApi } from '@/lib/api/client';
import { usePreferences } from '@/lib/preferences';
import { dictChatNews } from '@/lib/i18n/dict-chatnews';

/** Captures a partnership lead only; it does not create a commercial commitment. */
export function ModalPartnership({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language } = usePreferences();
  const t = dictChatNews[language] ?? dictChatNews.id;
  const schema = z.object({ name: z.string().min(2, t.uiPartnerNameRequired), email: z.string().email(t.uiPartnerEmailInvalid), organization: z.string().min(2, t.uiPartnerOrgRequired) });
  type PartnershipValues = z.infer<typeof schema>;
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PartnershipValues>({ resolver: zodResolver(schema) });
  async function submit(values: PartnershipValues) {
    try {
      await postToApi<{ id: number; message: string }, { name: string; email: string; body: string }>('/api/suggestions', {
        name: values.name,
        email: values.email,
        body: `${t.uiPartnerInterestPrefix}${values.organization}`,
      });
      setMessage(t.uiPartnerThanks);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : t.uiPartnerFailed);
    }
  }
  if (!open) return null;
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="partnership-title"><div className="modal-card"><button className="modal-close" onClick={onClose} aria-label={t.uiClose}>×</button><span className="eyebrow">{t.uiPartnerEyebrow}</span><h2 id="partnership-title">{t.uiPartnerTitle}</h2><form onSubmit={handleSubmit(submit)}><label>{t.uiPartnerName}<input {...register('name')} /></label>{errors.name && <small>{errors.name.message}</small>}<label>{t.uiPartnerEmail}<input type="email" {...register('email')} /></label>{errors.email && <small>{errors.email.message}</small>}<label>{t.uiPartnerOrg}<input {...register('organization')} /></label>{errors.organization && <small>{errors.organization.message}</small>}<button className="primary-btn" disabled={isSubmitting}>{t.uiPartnerSubmit}</button>{message && <p role="status">{message}</p>}</form></div></div>;
}
