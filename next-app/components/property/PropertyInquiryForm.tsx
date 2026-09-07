'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { createPropertyInquiry } from '@/lib/actions/property';

export function PropertyInquiryForm({ propertyId }: { propertyId: string }) {
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit() { if (message.trim().length < 2) { setNotice('Tulis pertanyaan minimal 2 karakter.'); return; } setSaving(true); setNotice(''); const response = await createPropertyInquiry(propertyId, message.trim()); setSaving(false); if (!response.ok) { setNotice(response.error.includes('login') || response.error.includes('Sesi') ? 'Login diperlukan untuk menghubungi seller.' : response.error); return; } setMessage(''); setNotice('Pesan terkirim ke seller.'); }
  return <div className="mt-3 w-full rounded-2xl bg-sultra-mint/50 p-3"><textarea value={message} onChange={event => setMessage(event.target.value)} className="field-input min-h-20 w-full bg-white" placeholder="Tanyakan ketersediaan, lokasi, atau jadwal survei..." maxLength={2000}/>{notice && <p className="mt-2 text-xs text-sultra-forest">{notice}</p>}<div className="mt-2 flex justify-end gap-2"><Link href={`/login?redirect=/properti/${propertyId}`} className="soft-btn text-xs">Login</Link><button onClick={() => void submit()} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Send size={14}/>{saving ? 'Mengirim...' : 'Kirim inquiry'}</button></div></div>;
}
