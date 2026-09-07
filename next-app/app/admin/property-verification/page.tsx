'use client';

import { CheckCircle2, Download, Filter, RefreshCw, ShieldCheck, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { createPropertyDocumentDownload, listAdminPropertyVerifications, reviewPropertyVerification } from '@/actions/property-document';

type FilterValue = 'all' | 'pending' | 'verified';
type Verification = { id: string; seller_id: string | null; title: string; category: string; status: string; is_admin_verified: boolean; verification_documents: string[]; created_at: string };

export default function AdminPropertyVerificationPage() {
  const [filter, setFilter] = useState<FilterValue>('pending');
  const [items, setItems] = useState<Verification[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setError('');
    const response = await listAdminPropertyVerifications(filter);
    if (response.ok) setItems(response.data as Verification[]);
    else setError(response.error);
  }

  useEffect(() => { void load(); }, [filter]);

  async function review(id: string, verified: boolean) {
    setBusy(id);
    const response = await reviewPropertyVerification(id, verified);
    setBusy(null);
    if (!response.ok) { setError(response.error); return; }
    setItems(current => current.filter(item => filter === 'pending' && verified ? item.id !== id : filter === 'verified' && !verified ? item.id !== id : true).map(item => item.id === id ? { ...item, is_admin_verified: verified } : item));
  }

  async function download(propertyId: string, key: string) {
    setBusy(`${propertyId}:${key}`);
    try {
      const response = await createPropertyDocumentDownload(propertyId, key);
      if (response.ok) window.open(response.url, '_blank', 'noopener,noreferrer');
    } catch (downloadError) { setError(downloadError instanceof Error ? downloadError.message : 'Dokumen belum dapat dibuka.'); }
    finally { setBusy(null); }
  }

  return <AppLayout><main className="platform-shell mx-auto max-w-6xl"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><span className="eyebrow text-sultra-teal"><ShieldCheck size={14}/> ADMIN VERIFICATION</span><h1 className="mt-2 text-3xl font-bold">Verifikasi Dokumen Properti</h1><p className="mt-1 text-sm text-gray-500">Dokumen hanya dibuka melalui signed URL selama 5 menit.</p></div><button onClick={() => void load()} className="soft-btn flex items-center gap-2"><RefreshCw size={16}/> Refresh</button></div>{error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}<div className="mb-4 flex gap-2 overflow-x-auto"><Filter size={18} className="mt-2 text-sultra-teal"/>{(['pending','verified','all'] as FilterValue[]).map(value => <button key={value} onClick={() => setFilter(value)} className={`soft-btn whitespace-nowrap ${filter === value ? 'ring-2 ring-sultra-gold' : ''}`}>{value === 'pending' ? 'Perlu ditinjau' : value === 'verified' ? 'Terverifikasi' : 'Semua'}</button>)}</div><div className="grid gap-4">{items.map(item => <article key={item.id} className="rounded-2xl border border-sultra-mint bg-white p-5 shadow-sm dark:bg-sultra-dark"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase text-sultra-teal">{item.category} · {item.status}</p><h2 className="mt-1 text-lg font-bold text-sultra-forest dark:text-sultra-sand">{item.title}</h2><p className="mt-1 text-xs text-gray-500">Seller: {item.seller_id || 'Tidak tersedia'} · {new Date(item.created_at).toLocaleDateString('id-ID')}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_admin_verified ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.is_admin_verified ? 'Terverifikasi' : 'Perlu ditinjau'}</span></div><div className="mt-4 flex flex-wrap gap-2">{(item.verification_documents || []).map(key => <button key={key} disabled={busy === `${item.id}:${key}`} onClick={() => void download(item.id, key)} className="soft-btn inline-flex items-center gap-2 text-xs"><Download size={14}/>{key.split('/').pop()?.slice(37) || 'Dokumen'} </button>)}</div><div className="mt-5 flex gap-2 border-t border-sultra-mint pt-4"><button disabled={busy === item.id} onClick={() => void review(item.id, true)} className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-2 text-xs font-bold text-white disabled:opacity-50"><CheckCircle2 size={15}/> Setujui</button><button disabled={busy === item.id} onClick={() => void review(item.id, false)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 disabled:opacity-50"><XCircle size={15}/> Tolak / cabut verifikasi</button></div></article>)}{!items.length && <div className="rounded-2xl border border-dashed border-sultra-mint p-12 text-center text-sm text-gray-500">Tidak ada properti pada filter ini atau akses admin diperlukan.</div>}</div></main></AppLayout>;
}
