'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase/client';

const schema = z.object({ name: z.string().min(2, 'Nama wajib diisi'), email: z.string().email('Email belum valid'), organization: z.string().min(2, 'Organisasi wajib diisi') });
type PartnershipValues = z.infer<typeof schema>;

/** Captures a partnership lead only; it does not create a commercial commitment. */
export function ModalPartnership({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PartnershipValues>({ resolver: zodResolver(schema) });
  async function submit(values: PartnershipValues) {
    const { error } = await supabase.from('partnerships').insert({ ...values, status: 'pending' });
    setMessage(error ? 'Form belum terkirim. Coba lagi.' : 'Terima kasih. Tim kami akan menghubungi Anda.');
  }
  if (!open) return null;
  return <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="partnership-title"><div className="modal-card"><button className="modal-close" onClick={onClose} aria-label="Tutup">×</button><span className="eyebrow">Mitra pertumbuhan</span><h2 id="partnership-title">Bangun ekosistem Sultra bersama.</h2><form onSubmit={handleSubmit(submit)}><label>Nama<input {...register('name')} /></label>{errors.name && <small>{errors.name.message}</small>}<label>Email<input type="email" {...register('email')} /></label>{errors.email && <small>{errors.email.message}</small>}<label>Organisasi<input {...register('organization')} /></label>{errors.organization && <small>{errors.organization.message}</small>}<button className="primary-btn" disabled={isSubmitting}>Kirim minat kemitraan</button>{message && <p role="status">{message}</p>}</form></div></div>;
}
