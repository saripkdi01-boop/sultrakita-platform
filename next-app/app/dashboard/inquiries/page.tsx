'use client';

import Link from 'next/link';
import { Inbox, MessageCircle, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getMyPropertyInquiries, updateMyPropertyInquiryStatus } from '@/lib/actions/property';

type Inquiry = { id: string; property_id: string; property_title: string; inquirer_id: string; message: string; contact_method: string; status: 'new' | 'contacted' | 'scheduled' | 'closed'; created_at: string };
const labels: Record<Inquiry['status'], string> = { new: 'Baru', contacted: 'Sudah dihubungi', scheduled: 'Terjadwal', closed: 'Selesai' };

export default function SellerInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  async function load() { setError(''); const response = await getMyPropertyInquiries(); if (response.ok) setItems(response.data as Inquiry[]); else setError(response.error); }
  useEffect(() => { void load(); }, []);
  async function update(id: string, status: Inquiry['status']) { setBusy(id); const response = await updateMyPropertyInquiryStatus(id, status); setBusy(null); if (!response.ok) { setError(response.error); return; } setItems(current => current.map(item => item.id === id ? { ...item, status } : item)); }
  return <AppLayout><main className="platform-shell mx-auto max-w-5xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><span className="eyebrow text-sultra-teal"><Inbox size={14}/> SUKI SUITS · SELLER INBOX</span><h1 className="mt-2 text-3xl font-bold">Pesan Masuk Properti</h1><p className="mt-1 text-sm text-gray-500">Inquiry yang tampil hanya berasal dari listing milikmu.</p></div><button onClick={() => void load()} className="soft-btn inline-flex items-center gap-2"><RefreshCw size={16}/> Refresh</button></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="grid gap-4">{items.map(item => <article key={item.id} className="rounded-2xl border border-sultra-mint bg-white p-5 shadow-sm dark:bg-sultra-dark"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-sultra-teal">{item.property_title}</p><p className="mt-2 text-sm leading-6 text-sultra-forest dark:text-sultra-sand">{item.message}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.status === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-sultra-mint text-sultra-forest'}`}>{labels[item.status]}</span></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-sultra-mint pt-4"><p className="inline-flex items-center gap-2 text-xs text-gray-500"><MessageCircle size={14}/> {item.contact_method} · {new Date(item.created_at).toLocaleString('id-ID')}</p><div className="flex gap-2"><Link href={`/properti/${item.property_id}`} className="soft-btn text-xs">Lihat listing</Link><select disabled={busy === item.id} value={item.status} onChange={event => void update(item.id, event.target.value as Inquiry['status'])} className="rounded-lg border border-gray-200 px-2 py-1 text-xs"><option value="new">Baru</option><option value="contacted">Sudah dihubungi</option><option value="scheduled">Terjadwal</option><option value="closed">Selesai</option></select></div></div></article>)}{!items.length && <div className="rounded-2xl border border-dashed border-sultra-mint p-12 text-center text-sm text-gray-500">Belum ada inquiry untuk listing milikmu.</div>}</div></main></AppLayout>;
}
