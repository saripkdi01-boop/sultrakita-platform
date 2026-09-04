'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ amount: z.coerce.number().min(10000, 'Minimum dukungan Rp 10.000'), note: z.string().max(240).optional() });
type SupportValues = z.infer<typeof schema>;

/** Records a pending support intent; it never processes payment. */
export function ModalSupport({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SupportValues>({ resolver: zodResolver(schema), defaultValues: { amount: 50000 } });
  async function submit(values: SupportValues) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/donations`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          campaign_id: 1,
          name: 'Hamba Allah',
          amount: values.amount,
          message: values.note || null,
          payment_method: 'qris',
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || payload?.ok === false) throw new Error('Donation API request failed');
      setMessage(payload?.data?.payment_url ? 'Dukungan tercatat. Silakan lanjutkan pembayaran.' : 'Terima kasih. Dukungan tercatat dan menunggu pembayaran.');
    } catch {
      setMessage('Dukungan belum tercatat. Coba lagi.');
    }
  }
  if (!open) return null;
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="support-title"><div className="modal-card"><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button><span className="eyebrow">Dukung SultraKita</span><h2 id="support-title">Bantu ruang lokal tetap tumbuh.</h2><form onSubmit={handleSubmit(submit)}><label>Nominal dukungan<input type="number" {...register('amount')} /></label>{errors.amount && <small>{errors.amount.message}</small>}<label>Catatan (opsional)<textarea {...register('note')} /></label><button className="primary-btn" disabled={isSubmitting}>Berikan dukungan</button>{message && <p role="status">{message}</p>}</form></div></div>;
}
