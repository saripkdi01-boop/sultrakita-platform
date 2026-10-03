'use client';

// Halaman admin "Listing" (/admin/listings) — terhubung langsung dengan
// fitur posting/jual marketplace: semua listing yang terbit (termasuk yang
// disetujui otomatis via prosedur ketentuan form) tampil di sini untuk
// ditinjau admin: ditarik dari publik atau dipulihkan.

import { CheckCircle2, ExternalLink, Filter, RefreshCw, Search, ShieldCheck, Undo2, XCircle, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { listAdminListings, takedownListing, restoreListing, type AdminListingItem } from '@/actions/admin-listings';

type FilterValue = 'auto' | 'approved' | 'rejected' | 'pending' | 'all';
type BusyKey = string | null;

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: 'auto', label: 'Otomatis disetujui' },
  { value: 'approved', label: 'Disetujui admin' },
  { value: 'rejected', label: 'Ditarik' },
  { value: 'pending', label: 'Menunggu' },
  { value: 'all', label: 'Semua' },
];

const STATUS_STYLES: Record<string, string> = {
  auto_approved: 'bg-emerald-100 text-emerald-800',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-800',
};

const STATUS_LABELS: Record<string, string> = {
  auto_approved: 'Otomatis disetujui',
  approved: 'Disetujui admin',
  rejected: 'Ditarik',
  pending: 'Menunggu',
};

function formatPrice(value: number | null) {
  if (value === null) return '—';
  return `Rp ${new Intl.NumberFormat('id-ID').format(value)}`;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function AdminListingsPage() {
  const [filter, setFilter] = useState<FilterValue>('auto');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminListingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState<BusyKey>(null);
  const [takedownFor, setTakedownFor] = useState<string | null>(null);
  const [takedownReason, setTakedownReason] = useState('');

  const load = useCallback(async () => {
    setError('');
    const response = await listAdminListings({ status: filter, q: search || undefined, page, limit: 20 });
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
    setTakedownFor(null);
  }

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  async function handleTakedown(id: string) {
    setBusy(`${id}:takedown`);
    const response = await takedownListing({ id, reason: takedownReason.trim() });
    setBusy(null);
    if (!response.ok) { setError(response.error); return; }
    setTakedownFor(null);
    setTakedownReason('');
    setNotice('Listing ditarik dari publik dan tercatat di audit.');
    await load();
  }

  async function handleRestore(id: string) {
    setBusy(`${id}:restore`);
    const response = await restoreListing({ id });
    setBusy(null);
    if (!response.ok) { setError(response.error); return; }
    setNotice('Listing dipulihkan dan tayang kembali.');
    await load();
  }

  return (
    <AppLayout>
      <main className="platform-shell mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="eyebrow text-sultra-teal"><ShieldCheck size={14} /> ADMIN MODERATION</span>
            <h1 className="mt-2 text-3xl font-bold">Listing Marketplace</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Terhubung dengan tombol <strong>Jual</strong> di marketplace: posting yang lolos seluruh ketentuan form
              disetujui otomatis dan langsung tayang — tinjau di sini, tarik yang bermasalah, pulihkan bila sudah benar.
              Setiap aksi tercatat di audit.
            </p>
          </div>
          <button onClick={() => void load()} className="soft-btn flex items-center gap-2" aria-label="Muat ulang daftar listing">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
        {notice && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{notice}</p>}

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
          <label htmlFor="admin-listing-search" className="sr-only">Cari listing</label>
          <input
            id="admin-listing-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari judul atau kota…"
            className="min-w-0 flex-1 rounded-xl border border-sultra-mint bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sultra-gold dark:bg-sultra-dark"
          />
          <button type="submit" className="soft-btn flex items-center gap-2" aria-label="Cari listing">
            <Search size={16} /> <span className="hidden sm:inline">Cari</span>
          </button>
        </form>

        <p className="mb-3 text-xs text-gray-500">{total} listing{search ? ` untuk “${search}”` : ''}</p>

        <div className="grid gap-4">
          {items.map((item) => {
            const busyTakedown = busy === `${item.id}:takedown`;
            const busyRestore = busy === `${item.id}:restore`;
            const anyBusy = busyTakedown || busyRestore;
            const modStatus = item.moderation_status ?? item.status;
            const isRejected = modStatus === 'rejected';
            const ownerName = item.owner?.display_name || 'Penjual tidak diketahui';
            return (
              <article key={item.id} className="rounded-2xl border border-sultra-mint bg-white p-5 shadow-sm dark:bg-sultra-dark">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase text-sultra-teal">
                      {[item.district || item.city, item.condition].filter(Boolean).join(' · ') || 'Marketplace'}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-sultra-forest dark:text-sultra-sand">
                      <a
                        href={`/marketplace?listing=${encodeURIComponent(item.id)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:underline"
                        aria-label={`Lihat listing ${item.title} di tab baru`}
                      >
                        {item.title} <ExternalLink size={14} aria-hidden />
                      </a>
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Penjual: {ownerName} · Terbit: {formatDate(item.created_at)} · Harga: {formatPrice(item.price)}
                    </p>
                    {item.approved_at && (
                      <p className="mt-1 text-xs text-gray-500">
                        <Zap size={11} className="mr-1 inline" aria-hidden />
                        Disetujui {item.approved_by === 'system:auto-approve' ? 'otomatis oleh sistem' : `oleh ${item.approved_by}`} · {formatDate(item.approved_at)}
                      </p>
                    )}
                    {item.rejection_reason && (
                      <p className="mt-1 text-xs text-red-600">Alasan penarikan: {item.rejection_reason}</p>
                    )}
                    {item.description && <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {item.thumbnail_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnail_url} alt="" className="h-16 w-16 rounded-xl object-cover" loading="lazy" />
                    )}
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLES[modStatus] ?? 'bg-gray-100 text-gray-700'}`}>
                      {STATUS_LABELS[modStatus] ?? modStatus}
                    </span>
                  </div>
                </div>

                {takedownFor === item.id ? (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50/50 p-4">
                    <label htmlFor={`takedown-note-${item.id}`} className="mb-2 block text-xs font-bold text-red-800">
                      Alasan penarikan (wajib, min. 3 karakter) — listing hilang dari publik &amp; tercatat di audit.
                    </label>
                    <textarea
                      id={`takedown-note-${item.id}`}
                      value={takedownReason}
                      onChange={(event) => setTakedownReason(event.target.value)}
                      rows={3}
                      maxLength={1000}
                      placeholder="Contoh: barang terlarang, harga tidak wajar, foto tidak sesuai…"
                      className="w-full rounded-xl border border-red-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-300"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        disabled={busyTakedown || takedownReason.trim().length < 3}
                        onClick={() => void handleTakedown(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        <XCircle size={14} aria-hidden /> {busyTakedown ? 'Menarik…' : 'Tarik listing'}
                      </button>
                      <button
                        onClick={() => { setTakedownFor(null); setTakedownReason(''); }}
                        className="soft-btn px-4 py-2 text-xs font-bold"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {!isRejected ? (
                      <button
                        disabled={anyBusy}
                        onClick={() => setTakedownFor(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        <XCircle size={14} aria-hidden /> Tarik dari publik
                      </button>
                    ) : (
                      <button
                        disabled={anyBusy}
                        onClick={() => void handleRestore(item.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        {busyRestore ? <RefreshCw size={14} className="animate-spin" aria-hidden /> : <Undo2 size={14} aria-hidden />}
                        {busyRestore ? 'Memulihkan…' : 'Pulihkan & tayangkan'}
                      </button>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-2 py-2 text-xs text-gray-500">
                      <CheckCircle2 size={14} className="text-emerald-600" aria-hidden />
                      {item.moderation_status === 'auto_approved'
                        ? 'Lolos prosedur ketentuan form — tanpa persetujuan manual'
                        : 'Status tercatat di sistem'}
                    </span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {items.length === 0 && !error && (
          <p className="mt-4 rounded-2xl border border-dashed border-sultra-mint bg-white/60 p-10 text-center text-sm text-gray-500 dark:bg-sultra-dark">
            Belum ada listing dengan status ini — tampil apa adanya.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="soft-btn px-4 py-2 text-xs font-bold disabled:opacity-50"
            >
              ← Sebelumnya
            </button>
            <span className="text-xs text-gray-500">Halaman {page} dari {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="soft-btn px-4 py-2 text-xs font-bold disabled:opacity-50"
            >
              Berikutnya →
            </button>
          </div>
        )}
      </main>
    </AppLayout>
  );
}
