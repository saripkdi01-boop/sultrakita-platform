'use client';

import { BadgeCheck, CheckCircle2, ExternalLink, Filter, RefreshCw, Search, ShieldCheck, Star, XCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { listAdminBusinesses, reviewBusiness, setBusinessFeatured, setBusinessVerified, type AdminBusinessItem } from '@/actions/admin-businesses';
import { businessCategoryLabel } from '@/lib/business-categories';

type FilterValue = 'review' | 'approved' | 'rejected' | 'all';
type BusyKey = string | null;

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'review', label: 'Perlu ditinjau' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'all', label: 'Semua' },
];

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  draft: 'bg-gray-100 text-gray-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Menunggu',
  draft: 'Draf',
  approved: 'Disetujui',
  rejected: 'Ditolak',
};

function categoryLabel(value: string) {
  return businessCategoryLabel(value);
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function AdminBusinessesPage() {
  const [filter, setFilter] = useState<FilterValue>('review');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminBusinessItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<BusyKey>(null);
  const [rejectFor, setRejectFor] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const load = useCallback(async () => {
    setError('');
    const response = await listAdminBusinesses({ status: filter, q: search || undefined, page, limit: 20 });
    if (response.ok) {
      setItems(response.data.items);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } else {
      setError(response.error);
    }
  }, [filter, search, page]);

  useEffect(() => { void load(); }, [load]);

  function switchFilter(value: FilterValue) {
    setFilter(value);
    setPage(1);
    setRejectFor(null);
  }

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  async function handleReview(id: string, decision: 'approved' | 'rejected', note?: string) {
    setBusy(`${id}:${decision}`);
    const response = await reviewBusiness({ id, decision, note });
    setBusy(null);
    if (!response.ok) { setError(response.error); return; }
    setRejectFor(null);
    setRejectNote('');
    await load();
  }

  async function handleToggle(id: string, kind: 'featured' | 'verified', value: boolean) {
    setBusy(`${id}:${kind}`);
    const response = kind === 'featured' ? await setBusinessFeatured({ id, value }) : await setBusinessVerified({ id, value });
    setBusy(null);
    if (!response.ok) { setError(response.error); return; }
    await load();
  }

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-sultra-teal"><ShieldCheck size={14} /> ADMIN MODERATION</span>
            <h1 className="mt-2 text-3xl font-bold">Moderasi Bisnis</h1>
            <p className="mt-1 text-sm text-gray-500">Tinjau pengajuan direktori bisnis: setujui, tolak dengan alasan, atau kelola badge unggulan &amp; verifikasi. Setiap aksi tercatat di audit.</p>
          </div>
          <button onClick={() => void load()} className="soft-btn flex items-center gap-2" aria-label="Muat ulang daftar bisnis">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Filter size={18} className="text-sultra-teal" aria-hidden />
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => switchFilter(value)}
              className={`soft-btn whitespace-nowrap ${filter === value ? 'ring-2 ring-sultra-gold' : ''}`}
              aria-pressed={filter === value}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          className="mb-5 flex gap-2"
          onSubmit={(event) => { event.preventDefault(); applySearch(); }}
          role="search"
        >
          <label htmlFor="admin-business-search" className="sr-only">Cari bisnis</label>
          <input
            id="admin-business-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari nama atau kota…"
            className="min-w-0 flex-1 rounded-xl border border-sultra-mint bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sultra-gold dark:bg-sultra-dark"
          />
          <button type="submit" className="soft-btn flex items-center gap-2" aria-label="Cari bisnis">
            <Search size={16} /> <span className="hidden sm:inline">Cari</span>
          </button>
        </form>

        <p className="mb-3 text-xs text-gray-500">{total} bisnis{dsearchNote(search)}</p>

        <div className="grid gap-4">
          {items.map((item) => {
            const busyApprove = busy === `${item.id}:approved`;
            const busyReject = busy === `${item.id}:rejected`;
            const busyFeature = busy === `${item.id}:featured`;
            const busyVerify = busy === `${item.id}:verified`;
            const anyBusy = busyApprove || busyReject || busyFeature || busyVerify;
            const ownerName = item.owner?.display_name || item.owner?.full_name || 'Pemilik tidak diketahui';
            return (
              <article key={item.id} className="rounded-2xl border border-sultra-mint bg-white p-5 shadow-sm dark:bg-sultra-dark">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase text-sultra-teal">{categoryLabel(item.category)} · {item.city}</p>
                    <h2 className="mt-1 text-lg font-bold text-sultra-forest dark:text-sultra-sand">
                      <a
                        href={`/Business/${item.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:underline"
                        aria-label={`Lihat profil publik ${item.name} di tab baru`}
                      >
                        {item.name} <ExternalLink size={14} aria-hidden />
                      </a>
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Pemilik: {ownerName} · Daftar: {formatDate(item.created_at)} · {item.view_count} dilihat
                    </p>
                    {(item.address || item.phone || item.whatsapp || item.email || item.website) && (
                      <p className="mt-1 text-xs text-gray-500">
                        {[item.address, item.phone, item.whatsapp, item.email, item.website].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {item.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[item.status] ?? 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[item.status] ?? item.status}
                    </span>
                    {item.is_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                        <BadgeCheck size={13} aria-hidden /> Terverifikasi
                      </span>
                    )}
                    {item.is_featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                        <Star size={13} aria-hidden /> Unggulan
                      </span>
                    )}
                  </div>
                </div>

                {rejectFor === item.id ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
                    <label htmlFor={`reject-note-${item.id}`} className="mb-2 block text-xs font-bold text-red-800">
                      Alasan penolakan (wajib, min. 3 karakter) — akan dicatat di audit.
                    </label>
                    <textarea
                      id={`reject-note-${item.id}`}
                      value={rejectNote}
                      onChange={(event) => setRejectNote(event.target.value)}
                      rows={3}
                      maxLength={1000}
                      placeholder="Contoh: data kontak tidak valid, kategori tidak sesuai…"
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        disabled={busyReject || rejectNote.trim().length < 3}
                        onClick={() => void handleReview(item.id, 'rejected', rejectNote.trim())}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                        aria-label={`Kirim penolakan untuk ${item.name}`}
                      >
                        <XCircle size={15} /> {busyReject ? 'Mengirim…' : 'Kirim penolakan'}
                      </button>
                      <button
                        disabled={busyReject}
                        onClick={() => { setRejectFor(null); setRejectNote(''); }}
                        className="soft-btn text-xs"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-sultra-mint pt-4">
                    {(item.status === 'pending' || item.status === 'draft') && (
                      <>
                        <button
                          disabled={anyBusy}
                          onClick={() => void handleReview(item.id, 'approved')}
                          className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                          aria-label={`Setujui bisnis ${item.name}`}
                        >
                          <CheckCircle2 size={15} /> {busyApprove ? 'Memproses…' : 'Setujui'}
                        </button>
                        <button
                          disabled={anyBusy}
                          onClick={() => { setRejectFor(item.id); setRejectNote(''); }}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 disabled:opacity-50"
                          aria-label={`Tolak bisnis ${item.name}`}
                        >
                          <XCircle size={15} /> Tolak
                        </button>
                      </>
                    )}
                    {item.status === 'rejected' && (
                      <button
                        disabled={anyBusy}
                        onClick={() => void handleReview(item.id, 'approved')}
                        className="inline-flex items-center gap-2 rounded-xl bg-sultra-teal px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                        aria-label={`Setujui ulang bisnis ${item.name}`}
                      >
                        <CheckCircle2 size={15} /> {busyApprove ? 'Memproses…' : 'Setujui ulang'}
                      </button>
                    )}
                    <button
                      disabled={anyBusy}
                      onClick={() => void handleToggle(item.id, 'featured', !item.is_featured)}
                      className="soft-btn inline-flex items-center gap-2 text-xs"
                      aria-label={item.is_featured ? `Batalkan unggulan untuk ${item.name}` : `Jadikan unggulan: ${item.name}`}
                      aria-pressed={item.is_featured}
                    >
                      <Star size={14} /> {busyFeature ? 'Memproses…' : item.is_featured ? 'Batalkan unggulan' : 'Jadikan unggulan'}
                    </button>
                    <button
                      disabled={anyBusy}
                      onClick={() => void handleToggle(item.id, 'verified', !item.is_verified)}
                      className="soft-btn inline-flex items-center gap-2 text-xs"
                      aria-label={item.is_verified ? `Cabut verifikasi ${item.name}` : `Verifikasi ${item.name}`}
                      aria-pressed={item.is_verified}
                    >
                      <BadgeCheck size={14} /> {busyVerify ? 'Memproses…' : item.is_verified ? 'Cabut verifikasi' : 'Verifikasi'}
                    </button>
                  </div>
                )}
              </article>
            );
          })}

          {!items.length && !error && (
            <div className="rounded-2xl border border-dashed border-sultra-mint p-12 text-center text-sm text-gray-500">
              Tidak ada bisnis pada filter ini. Pengajuan baru dari pemilik bisnis akan muncul di tab “Perlu ditinjau”.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="soft-btn text-xs disabled:opacity-50"
              aria-label="Halaman sebelumnya"
            >
              ← Sebelumnya
            </button>
            <span className="text-xs text-gray-500">Halaman {page} dari {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="soft-btn text-xs disabled:opacity-50"
              aria-label="Halaman berikutnya"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </main>
    </AppLayout>
  );
}

function dsearchNote(search: string) {
  return search ? ` untuk pencarian “${search}”` : '';
}
