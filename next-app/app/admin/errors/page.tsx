import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import { ErrorRowActions } from './ErrorRowActions';

export const dynamic = 'force-dynamic';

// FASE B1 — /admin/errors: Error Inbox terpusat.
// Dibaca server-side dari tabel error_events (satu baris per sidik error).
// Filter: ?q= (route/nama error), ?status=open|resolved|all.
// Tanpa PII: user hanya tampil sebagai hash 16-hex (lihat lib/log-error.ts).

interface ErrorRow {
  id: string;
  route: string;
  error_name: string;
  error_message: string;
  occurrence_count: number;
  first_seen: string | null;
  last_seen: string | null;
  resolved: boolean;
}

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
  } catch {
    return iso;
  }
}

export default async function AdminErrorsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/errors');
  }

  const { q, status } = await searchParams;
  const query_text = (q ?? '').trim().slice(0, 80);
  const statusFilter = status === 'resolved' ? 'resolved' : status === 'all' ? 'all' : 'open';
  const checkedAt = new Date().toISOString();

  let rows: ErrorRow[] = [];
  let error: string | null = null;
  let openCount: number | null = null;
  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('error_events')
      .select('id, route, error_name, error_message, occurrence_count, first_seen, last_seen, resolved')
      .order('last_seen', { ascending: false })
      .limit(100);
    if (statusFilter === 'open') query = query.eq('resolved', false);
    else if (statusFilter === 'resolved') query = query.eq('resolved', true);
    if (query_text) {
      const escaped = query_text.replace(/[%_\\]/g, (m) => `\\${m}`);
      query = query.or(`route.ilike.%${escaped}%,error_name.ilike.%${escaped}%`);
    }
    const { data, error: qErr } = await query;
    if (qErr) error = qErr.message;
    else rows = (data ?? []) as ErrorRow[];

    const { count } = await supabase
      .from('error_events')
      .select('id', { count: 'exact', head: true })
      .eq('resolved', false);
    openCount = count ?? null;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca error_events.';
  }

  const tab = (key: string, label: string, href: string) => {
    const active = statusFilter === key;
    return (
      <Link
        key={key}
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
          active ? 'bg-[#123f38] text-white' : 'border border-[#dcebe5] text-[#55736b] hover:bg-[#f3f8f6]'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Error inbox</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
                Pipeline error terpusat: setiap <code>logError()</code> server-side kini tercatat di tabel{' '}
                <code>error_events</code> (dikelompokkan per sidik error). Tanpa PII — user hanya hash.
              </p>
            </div>
            <div className={`rounded-2xl px-4 py-3 text-center ${openCount ? 'bg-red-500/20' : 'bg-white/10'}`}>
              <p className="text-3xl font-extrabold">{openCount ?? '—'}</p>
              <p className="text-xs uppercase tracking-wide text-[#bce8d8]">belum resolved</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#bce8d8]">Dibaca: <span className="font-mono">{checkedAt}</span> (UTC)</p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {tab('open', 'Belum resolved', '/admin/errors?status=open')}
          {tab('resolved', 'Resolved', '/admin/errors?status=resolved')}
          {tab('all', 'Semua', '/admin/errors?status=all')}
          <form method="get" className="ml-auto flex gap-2">
            <input type="hidden" name="status" value={statusFilter} />
            <input
              name="q"
              defaultValue={query_text}
              placeholder="Filter route/nama error"
              maxLength={80}
              className="w-56 rounded-xl border border-[#dcebe5] bg-white px-4 py-2 text-sm text-[#123f38] placeholder:text-[#9db5ad] focus:outline-none focus:ring-2 focus:ring-[#1b806f] dark:border-white/10 dark:bg-[#10231f] dark:text-white"
            />
            <button type="submit" className="rounded-xl bg-[#123f38] px-4 py-2 text-sm font-bold text-white hover:bg-[#1b5a50]">
              Filter
            </button>
          </form>
        </div>

        <section className="mt-4 overflow-x-auto rounded-3xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          {error ? (
            <div className="p-6 text-sm leading-6">
              <p className="font-bold text-red-700">Gagal membaca tabel <code>error_events</code>: {error}</p>
              <p className="mt-2 text-[#55736b]">
                Kemungkinan migrasi <code>20261003140000_error_events.sql</code> belum dijalankan di Supabase SQL Editor.
                Error tetap tercatat di Vercel Runtime Logs via <code>logError()</code>.
              </p>
            </div>
          ) : rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-[#78948c]">
              {query_text || statusFilter !== 'open'
                ? 'Tidak ada error yang cocok dengan filter.'
                : 'Bersih — tidak ada error yang belum di-resolved. 🎉'}
            </p>
          ) : (
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef4f1] text-xs uppercase tracking-wide text-[#78948c] dark:border-white/10">
                  <th className="p-4 font-extrabold">Error</th>
                  <th className="p-4 font-extrabold">Route</th>
                  <th className="p-4 font-extrabold">Kejadian</th>
                  <th className="p-4 font-extrabold">Terakhir (WITA)</th>
                  <th className="p-4 font-extrabold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#f2f7f5] last:border-0 dark:border-white/5">
                    <td className="max-w-[320px] p-4">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${row.resolved ? 'bg-[#e9f7f2] text-[#146355]' : 'bg-red-50 text-red-700'}`}>
                        {row.error_name}
                      </span>
                      <span className="mt-1 block truncate text-xs text-[#55736b] dark:text-white/70" title={row.error_message}>
                        {row.error_message}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#123f38] dark:text-white">{row.route}</td>
                    <td className="p-4 text-center font-extrabold text-[#123f38] dark:text-white">{row.occurrence_count}×</td>
                    <td className="whitespace-nowrap p-4 text-xs text-[#55736b] dark:text-white/60">{formatTime(row.last_seen)}</td>
                    <td className="p-4">
                      <ErrorRowActions id={row.id} resolved={row.resolved} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <p className="mt-4 text-center text-[11px] leading-5 text-[#78948c]">
          Sumber: tabel <code>error_events</code> (server-side, hak admin). Penandaan resolved tercatat di audit trail.
        </p>
      </main>
    </AppLayout>
  );
}
