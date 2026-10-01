import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import type { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface Kpi {
  label: string;
  value: number | null;
  hint: string;
  href?: string;
}

async function countRows(client: SupabaseClient, table: string, match: Record<string, unknown> = {}): Promise<number | null> {
  try {
    let query = client.from(table).select('id', { count: 'exact', head: true });
    for (const [column, value] of Object.entries(match)) {
      query = Array.isArray(value) ? query.in(column, value as string[]) : query.eq(column, value);
    }
    const { count, error } = await query;
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

async function dailyCounts(client: SupabaseClient, table: string): Promise<{ labels: string[]; values: (number | null)[]; available: boolean }> {
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  try {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    const { data, error } = await client
      .from(table)
      .select('created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })
      .limit(5000);
    if (error) return { labels: days, values: days.map(() => null), available: false };
    const buckets = new Map<string, number>(days.map((d) => [d, 0]));
    for (const row of data ?? []) {
      const day = String(row.created_at ?? '').slice(0, 10);
      if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return { labels: days, values: days.map((d) => buckets.get(d) ?? 0), available: true };
  } catch {
    return { labels: days, values: days.map(() => null), available: false };
  }
}

interface AuditRow {
  id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  reason: string | null;
  created_at: string | null;
}

async function recentAudit(client: SupabaseClient): Promise<{ rows: AuditRow[]; available: boolean }> {
  try {
    const { data, error } = await client
      .from('audit_events')
      .select('id, action, target_type, target_id, reason, created_at')
      .order('created_at', { ascending: false })
      .limit(8);
    if (error) return { rows: [], available: false };
    return { rows: (data ?? []) as AuditRow[], available: true };
  } catch {
    return { rows: [], available: false };
  }
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">{kpi.label}</p>
      <p className="mt-3 text-4xl font-extrabold text-[#123f38] dark:text-white">
        {kpi.value === null ? '—' : kpi.value.toLocaleString('id-ID')}
      </p>
      <p className="mt-2 text-xs leading-5 text-[#55736b] dark:text-[#9db8b0]">{kpi.hint}</p>
      {kpi.href && (
        <Link href={kpi.href} className="mt-4 inline-flex text-sm font-bold text-[#1b806f]">
          Lihat detail →
        </Link>
      )}
    </div>
  );
}

function TrendBar({ label, trend }: { label: string; trend: { labels: string[]; values: (number | null)[]; available: boolean } }) {
  const max = Math.max(1, ...trend.values.map((v) => v ?? 0));
  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">{label}</p>
      {!trend.available ? (
        <p className="mt-4 text-sm text-[#55736b] dark:text-[#9db8b0]">Tren belum tersedia.</p>
      ) : (
        <div className="mt-4 flex h-24 items-end gap-1.5">
          {trend.values.map((value, i) => (
            <div key={trend.labels[i]} className="flex flex-1 flex-col items-center justify-end gap-1" title={`${trend.labels[i]}: ${value ?? 0}`}>
              <div
                className="w-full rounded-t-lg bg-[#1b806f]/80"
                style={{ height: `${Math.max(4, ((value ?? 0) / max) * 88)}px` }}
              />
              <span className="text-[10px] text-[#78948c]">{trend.labels[i].slice(8)}</span>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-[#78948c]">Data nyata 7 hari terakhir dari database.</p>
    </div>
  );
}

export default async function AdminOverviewPage() {
  try {
    await requireRole('admin', 'super_admin', 'moderator', 'support');
  } catch {
    redirectToLogin('/admin/overview');
  }

  const supabase = await getServerSupabase();
  const [totalUsers, listingsAktif, listingsPending, laporanTerbuka, orders, usersTrend, listingsTrend, audit] = await Promise.all([
    countRows(supabase, 'profiles'),
    countRows(supabase, 'listings', { status: 'published' }),
    countRows(supabase, 'listings', { status: 'pending' }),
    countRows(supabase, 'marketplace_reports', { status: ['pending', 'under_review'] }),
    countRows(supabase, 'orders'),
    dailyCounts(supabase, 'profiles'),
    dailyCounts(supabase, 'listings'),
    recentAudit(supabase),
  ]);

  const kpis: Kpi[] = [
    { label: 'Total pengguna', value: totalUsers, hint: 'Jumlah baris di tabel profiles (query nyata).', href: '/admin/users' },
    { label: 'Listing aktif', value: listingsAktif, hint: 'Listings berstatus published.', href: '/admin/moderation' },
    { label: 'Listing pending', value: listingsPending, hint: 'Menunggu tinjauan sebelum tayang.' },
    { label: 'Laporan terbuka', value: laporanTerbuka, hint: 'marketplace_reports berstatus pending/under_review.', href: '/admin/moderation' },
    { label: 'Orders (sandbox)', value: orders, hint: 'Belum ada pembayaran nyata — sandbox saja.' },
  ];

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Ringkasan operasional</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Angka-angka di bawah ini dibaca langsung dari database — tanpa angka palsu. Bila suatu sumber belum tersedia, tertulis apa adanya.
          </p>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
          <div className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#1b806f]">Catatan data</p>
            <p className="mt-3 text-sm leading-6 text-[#55736b] dark:text-[#9db8b0]">
              Semua KPI dihitung dari query nyata saat halaman dibuka. Nilai 0 berarti memang belum ada data — tampil apa adanya.
            </p>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-2">
          <TrendBar label="Pengguna baru (7 hari)" trend={usersTrend} />
          <TrendBar label="Listing dibuat (7 hari)" trend={listingsTrend} />
        </section>

        <section className="mt-8 rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Aktivitas admin terbaru</h2>
            <span className="rounded-full bg-[#e9f7f2] px-3 py-1 text-xs font-bold text-[#1b806f]">audit trail</span>
          </div>
          {!audit.available ? (
            <p className="mt-4 rounded-2xl bg-[#f6fbf9] p-4 text-sm text-[#55736b] dark:bg-white/5 dark:text-[#9db8b0]">
              Riwayat audit belum tersedia — tabel <code>audit_events</code> dibangun paralel oleh slice keamanan. Aksi admin baru tetap dicatat otomatis begitu tabelnya ada.
            </p>
          ) : audit.rows.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-[#f6fbf9] p-4 text-sm text-[#55736b] dark:bg-white/5 dark:text-[#9db8b0]">
              Belum ada data — tampil apa adanya. Aksi admin yang tercatat akan muncul di sini.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[#eef4f1] dark:divide-white/10">
              {audit.rows.map((row) => (
                <li key={row.id} className="py-3">
                  <p className="text-sm font-bold text-[#123f38] dark:text-white">
                    <code className="rounded bg-[#eef4f1] px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">{row.action}</code>
                  </p>
                  <p className="mt-1 text-xs text-[#55736b] dark:text-[#9db8b0]">
                    {row.target_type ?? '—'} · {row.target_id ? row.target_id.slice(0, 8) + '…' : '—'} ·{' '}
                    {row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '—'}
                  </p>
                  {row.reason && <p className="mt-1 text-xs text-[#78948c]">{row.reason}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </AppLayout>
  );
}
