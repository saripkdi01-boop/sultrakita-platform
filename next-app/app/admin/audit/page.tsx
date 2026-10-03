import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';

export const dynamic = 'force-dynamic';

// /admin/audit — Audit trail: jejak aksi admin & moderasi.
// Dibaca server-side dari tabel audit_events (100 baris terbaru).
// Filter ?q= mencocokkan kolom action (ilike, best-effort).
// RLS: SELECT hanya untuk admin/super_admin (policy audit_events_admin_select).

interface AuditRow {
  id: string;
  created_at: string | null;
  actor_id: string | null;
  action: string;
  target_type: string;
  target_id: string | null;
  reason: string | null;
}

function formatTime(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });
  } catch {
    return iso;
  }
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/audit');
  }

  const { q } = await searchParams;
  const query_text = (q ?? '').trim().slice(0, 80);
  const checkedAt = new Date().toISOString();

  let rows: AuditRow[] = [];
  let error: string | null = null;
  try {
    const supabase = await getServerSupabase();
    let query = supabase
      .from('audit_events')
      .select('id, created_at, actor_id, action, target_type, target_id, reason')
      .order('created_at', { ascending: false })
      .limit(100);
    if (query_text) {
      // Escape karakter wildcard LIKE agar filter jujur (bukan regex).
      const escaped = query_text.replace(/[%_\\]/g, (m) => `\\${m}`);
      query = query.ilike('action', `%${escaped}%`);
    }
    const { data, error: qErr } = await query;
    if (qErr) error = qErr.message;
    else rows = (data ?? []) as AuditRow[];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca audit_events.';
  }

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Audit trail</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Jejak aksi admin &amp; moderasi dari tabel <code>audit_events</code> — siapa melakukan apa, kapan.
            100 baris terbaru, dibaca live server-side. Hanya admin.
          </p>
          <p className="mt-4 text-xs text-[#bce8d8]">Dibaca: <span className="font-mono">{checkedAt}</span> (UTC)</p>
        </section>

        <form method="get" className="mt-6 flex gap-2">
          <input
            name="q"
            defaultValue={query_text}
            placeholder="Filter aksi, mis. business.approve"
            maxLength={80}
            className="w-full rounded-xl border border-[#dcebe5] bg-white px-4 py-2.5 text-sm text-[#123f38] placeholder:text-[#9db5ad] focus:outline-none focus:ring-2 focus:ring-[#1b806f] dark:border-white/10 dark:bg-[#10231f] dark:text-white"
          />
          <button
            type="submit"
            className="shrink-0 rounded-xl bg-[#123f38] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1b5a50]"
          >
            Filter
          </button>
          {query_text && (
            <Link
              href="/admin/audit"
              className="shrink-0 rounded-xl border border-[#dcebe5] px-5 py-2.5 text-sm font-bold text-[#55736b] transition hover:bg-[#f3f8f6]"
            >
              Reset
            </Link>
          )}
        </form>

        <section className="mt-4 overflow-x-auto rounded-3xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          {error ? (
            <p className="p-6 text-sm text-red-700">
              Gagal membaca tabel <code>audit_events</code>: {error}
            </p>
          ) : rows.length === 0 ? (
            <p className="p-10 text-center text-sm text-[#78948c]">
              {query_text
                ? `Tidak ada aksi yang cocok dengan "${query_text}".`
                : 'Belum ada aktivitas tercatat di audit_events — tampil apa adanya.'}
            </p>
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef4f1] text-xs uppercase tracking-wide text-[#78948c] dark:border-white/10">
                  <th className="p-4 font-extrabold">Waktu (WITA)</th>
                  <th className="p-4 font-extrabold">Aksi</th>
                  <th className="p-4 font-extrabold">Target</th>
                  <th className="p-4 font-extrabold">Alasan</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-[#f2f7f5] last:border-0 dark:border-white/5">
                    <td className="whitespace-nowrap p-4 text-xs text-[#55736b] dark:text-white/60">
                      {formatTime(row.created_at)}
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-[#123f38] dark:text-white">{row.action}</span>
                      <span className="block font-mono text-[11px] text-[#9db5ad]">
                        {row.actor_id ? `actor ${row.actor_id.slice(0, 8)}…` : 'actor —'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[#55736b] dark:text-white/70">
                      <span className="font-bold">{row.target_type}</span>
                      {row.target_id && <span className="block font-mono text-[11px]">{row.target_id.slice(0, 24)}</span>}
                    </td>
                    <td className="max-w-[280px] p-4 text-xs leading-5 text-[#55736b] dark:text-white/70">
                      {row.reason || <span className="text-[#b9cdc6]">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <p className="mt-4 text-center text-[11px] leading-5 text-[#78948c]">
          Sumber: tabel <code>audit_events</code> (server-side, hak admin). Penulisan hanya via service-role dari server —
          tidak ada aksi yang bisa ditulis dari browser.
        </p>
      </main>
    </AppLayout>
  );
}
