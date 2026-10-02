import Link from 'next/link';
import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
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

async function dailyCounts(
  client: SupabaseClient,
  table: string,
  days = 7,
  limit = 5000,
): Promise<{ labels: string[]; values: (number | null)[]; available: boolean }> {
  const dayLabels = [...Array(days)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await client
      .from(table)
      .select('created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })
      .limit(limit);
    if (error) return { labels: dayLabels, values: dayLabels.map(() => null), available: false };
    const buckets = new Map<string, number>(dayLabels.map((d) => [d, 0]));
    for (const row of data ?? []) {
      const day = String(row.created_at ?? '').slice(0, 10);
      if (buckets.has(day)) buckets.set(day, (buckets.get(day) ?? 0) + 1);
    }
    return { labels: dayLabels, values: dayLabels.map((d) => buckets.get(d) ?? 0), available: true };
  } catch {
    return { labels: dayLabels, values: dayLabels.map(() => null), available: false };
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

/* ── METRIK LAUNCH (30 hari) ────────────────────────────────────────────── */

/**
 * Klien service-role untuk membaca tabel referral yang RLS-nya USING(false).
 * HANYA dipakai di halaman ini SETELAH requireRole() lolos — proteksi admin
 * tidak dilemahkan: tanpa peran staf, fungsi ini tidak pernah dipanggil karena
 * halaman sudah redirect ke login lebih dulu.
 */
function getServiceRoleSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

interface DailyTrend {
  labels: string[];
  values: (number | null)[];
  available: boolean;
}

/**
 * DAU = sesi unik per hari dari analytics_events (distinct session_id;
 * fallback ke user_id bila session_id kosong).
 * KETERBATASAN JUJUR: tabel ini hanya terisi dari alur yang memanggil
 * trackEvent() server-side (saat ini minim) — angka bisa undercount dibanding
 * traffic sebenarnya. Lihat docs/MONITORING.md.
 */
async function dailyActiveUsers(client: SupabaseClient, days = 30): Promise<DailyTrend> {
  const labels = [...Array(days)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    return d.toISOString().slice(0, 10);
  });
  const empty = { labels, values: labels.map(() => null as number | null), available: false };
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await client
      .from('analytics_events')
      .select('session_id,user_id,created_at')
      .gte('created_at', since.toISOString())
      .limit(20000);
    if (error) return empty;
    const buckets = new Map<string, Set<string>>(labels.map((d) => [d, new Set<string>()]));
    for (const row of (data ?? []) as Array<{ session_id: string | null; user_id: string | null; created_at: string | null }>) {
      const day = String(row.created_at ?? '').slice(0, 10);
      const set = buckets.get(day);
      if (!set) continue;
      const key = row.session_id ? `s:${row.session_id}` : row.user_id ? `u:${row.user_id}` : null;
      if (key) set.add(key);
    }
    return { labels, values: labels.map((d) => buckets.get(d)?.size ?? 0), available: true };
  } catch {
    return empty;
  }
}

interface FunnelChannel {
  channel: string;
  visits: number;
  signups: number;
  qualified: number;
}

interface ReferralFunnel {
  visits: number;
  signups: number;
  qualified: number;
  channels: FunnelChannel[];
  available: boolean;
}

/**
 * Funnel referral: undangan (link_visit) → pendaftar (signup) → terverifikasi
 * (qualified), dari tabel referral_account_events. Dibaca via service-role
 * karena RLS tabel ini USING(false) untuk semua peran client.
 */
async function referralFunnel(): Promise<ReferralFunnel> {
  const empty: ReferralFunnel = { visits: 0, signups: 0, qualified: 0, channels: [], available: false };
  try {
    const db = getServiceRoleSupabase();
    if (!db) return empty;
    const { data, error } = await db
      .from('referral_account_events')
      .select('event_type,source_channel')
      .limit(10000);
    if (error) return empty;
    const rows = (data ?? []) as Array<{ event_type: string; source_channel: string | null }>;
    const byChannel = new Map<string, FunnelChannel>();
    for (const row of rows) {
      const channel = (row.source_channel || 'langsung').slice(0, 48);
      const entry = byChannel.get(channel) ?? { channel, visits: 0, signups: 0, qualified: 0 };
      if (row.event_type === 'link_visit') entry.visits += 1;
      else if (row.event_type === 'signup') entry.signups += 1;
      else if (row.event_type === 'qualified') entry.qualified += 1;
      byChannel.set(channel, entry);
    }
    const channels = Array.from(byChannel.values()).sort(
      (a, b) => b.qualified - a.qualified || b.signups - a.signups || b.visits - a.visits,
    );
    return {
      visits: channels.reduce((n, c) => n + c.visits, 0),
      signups: channels.reduce((n, c) => n + c.signups, 0),
      qualified: channels.reduce((n, c) => n + c.qualified, 0),
      channels: channels.slice(0, 12),
      available: true,
    };
  } catch {
    return empty;
  }
}

interface UtmResult {
  rows: Array<{ source: string; count: number }>;
  available: boolean;
  needsMigration: boolean;
}

/**
 * Pendaftar 30 hari per utm_source dari public.profiles.
 * needsMigration = true bila kolom utm_* belum ada (migrasi
 * 20261002070000_signup_utm_attribution.sql belum dijalankan ke Supabase).
 * CAC penuh belum dapat dihitung: butuh data biaya iklan per kanal dari luar DB.
 */
async function utmSignups(client: SupabaseClient, days = 30): Promise<UtmResult> {
  try {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await client
      .from('profiles')
      .select('utm_source')
      .gte('created_at', since.toISOString())
      .limit(20000);
    if (error) {
      const msg = `${error.code ?? ''} ${error.message ?? ''}`;
      return { rows: [], available: false, needsMigration: /42703|utm_source/i.test(msg) };
    }
    const counts = new Map<string, number>();
    for (const row of (data ?? []) as Array<{ utm_source: string | null }>) {
      const source = (row.utm_source || '(tanpa utm_source)').slice(0, 48);
      counts.set(source, (counts.get(source) ?? 0) + 1);
    }
    return {
      rows: Array.from(counts.entries())
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count),
      available: true,
      needsMigration: false,
    };
  } catch {
    return { rows: [], available: false, needsMigration: false };
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

/* ── Komponen Metrik Launch (design tokens --sk-*) ────────────────────────── */

function LaunchCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-6"
      style={{
        background: 'var(--sk-surface)',
        border: '1px solid var(--sk-line)',
        borderRadius: 'var(--sk-r-xl)',
        boxShadow: 'var(--suki-shadow-card, 0 1px 2px rgb(15 41 34 / 0.04))',
      }}
    >
      {children}
    </div>
  );
}

function LaunchEyebrow({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-xs font-extrabold uppercase"
      style={{ letterSpacing: '.16em', color: 'var(--sk-teal)' }}
    >
      {children}
    </p>
  );
}

function LaunchTrend({ label, trend, footnote }: { label: string; trend: DailyTrend; footnote: string }) {
  const max = Math.max(1, ...trend.values.map((v) => v ?? 0));
  const total = trend.available ? trend.values.reduce<number>((n, v) => n + (v ?? 0), 0) : null;
  return (
    <LaunchCard>
      <div className="flex items-baseline justify-between gap-2">
        <LaunchEyebrow>{label}</LaunchEyebrow>
        {total !== null && (
          <span className="text-lg font-extrabold" style={{ color: 'var(--sk-ink)' }}>
            {total.toLocaleString('id-ID')}
          </span>
        )}
      </div>
      {!trend.available ? (
        <p className="mt-4 text-sm" style={{ color: 'var(--sk-muted)' }}>
          Tren belum tersedia — sumber data tidak dapat dibaca.
        </p>
      ) : (
        <div className="mt-4 flex h-24 items-end gap-1">
          {trend.values.map((value, i) => (
            <div
              key={trend.labels[i]}
              className="flex flex-1 flex-col items-center justify-end gap-1"
              title={`${trend.labels[i]}: ${value ?? 0}`}
            >
              <div
                className="w-full"
                style={{
                  height: `${Math.max(3, ((value ?? 0) / max) * 84)}px`,
                  background: 'var(--sk-teal)',
                  opacity: 0.85,
                  borderRadius: '4px 4px 0 0',
                }}
              />
              {i % 5 === 0 && (
                <span className="text-[10px]" style={{ color: 'var(--sk-faint)' }}>
                  {trend.labels[i].slice(8)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs" style={{ color: 'var(--sk-faint)' }}>
        {footnote}
      </p>
    </LaunchCard>
  );
}

function FunnelStage({
  label,
  value,
  sub,
  pct,
}: {
  label: string;
  value: number | null;
  sub: string;
  pct: string | null;
}) {
  return (
    <div
      className="flex-1 p-4 text-center"
      style={{ background: 'var(--sk-teal-soft)', borderRadius: 'var(--sk-r-lg)' }}
    >
      <p className="text-xs font-bold uppercase" style={{ letterSpacing: '.12em', color: 'var(--sk-teal)' }}>
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold" style={{ color: 'var(--sk-ink)' }}>
        {value === null ? '—' : value.toLocaleString('id-ID')}
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--sk-muted)' }}>
        {sub}
      </p>
      {pct && (
        <p className="mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{ background: 'var(--sk-surface)', color: 'var(--sk-teal)' }}>
          {pct}
        </p>
      )}
    </div>
  );
}

function LaunchFunnel({ funnel }: { funnel: ReferralFunnel }) {
  const convSignup = funnel.visits > 0 ? `${((funnel.signups / funnel.visits) * 100).toFixed(1)}%` : null;
  const convQualified = funnel.signups > 0 ? `${((funnel.qualified / funnel.signups) * 100).toFixed(1)}%` : null;
  return (
    <LaunchCard>
      <LaunchEyebrow>Funnel referral</LaunchEyebrow>
      <p className="mt-2 text-sm" style={{ color: 'var(--sk-muted)' }}>
        Undangan → pendaftar → terverifikasi, dari tabel <code>referral_account_events</code>.
      </p>
      {!funnel.available ? (
        <p className="mt-4 rounded-2xl p-4 text-sm" style={{ background: 'var(--sk-brand-soft)', color: 'var(--sk-muted)' }}>
          Funnel belum tersedia — tabel referral tidak dapat dibaca (butuh service role di server).
        </p>
      ) : funnel.visits + funnel.signups + funnel.qualified === 0 ? (
        <p className="mt-4 rounded-2xl p-4 text-sm" style={{ background: 'var(--sk-bg)', color: 'var(--sk-muted)' }}>
          Belum ada data — tampil apa adanya. Event referral akan muncul di sini setelah kampanye berjalan.
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <FunnelStage label="Undangan" value={funnel.visits} sub="link_visit" pct={null} />
            <FunnelStage label="Pendaftar" value={funnel.signups} sub="signup" pct={convSignup ? `konversi ${convSignup}` : null} />
            <FunnelStage label="Terverifikasi" value={funnel.qualified} sub="qualified" pct={convQualified ? `konversi ${convQualified}` : null} />
          </div>
          {funnel.channels.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase" style={{ color: 'var(--sk-faint)', letterSpacing: '.08em' }}>
                    <th className="py-2 pr-3 font-bold">Kanal</th>
                    <th className="py-2 pr-3 text-right font-bold">Undangan</th>
                    <th className="py-2 pr-3 text-right font-bold">Pendaftar</th>
                    <th className="py-2 text-right font-bold">Terverifikasi</th>
                  </tr>
                </thead>
                <tbody>
                  {funnel.channels.map((c) => (
                    <tr key={c.channel} style={{ borderTop: '1px solid var(--sk-line)' }}>
                      <td className="py-2 pr-3 font-bold" style={{ color: 'var(--sk-ink)' }}>{c.channel}</td>
                      <td className="py-2 pr-3 text-right" style={{ color: 'var(--sk-muted)' }}>{c.visits.toLocaleString('id-ID')}</td>
                      <td className="py-2 pr-3 text-right" style={{ color: 'var(--sk-muted)' }}>{c.signups.toLocaleString('id-ID')}</td>
                      <td className="py-2 text-right font-bold" style={{ color: 'var(--sk-teal)' }}>{c.qualified.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </LaunchCard>
  );
}

function LaunchUtm({ utm }: { utm: UtmResult }) {
  return (
    <LaunchCard>
      <LaunchEyebrow>Pendaftar per kanal UTM</LaunchEyebrow>
      <p className="mt-2 text-sm" style={{ color: 'var(--sk-muted)' }}>
        Atribusi signup 30 hari terakhir dari kolom <code>utm_source</code> di <code>profiles</code>.
      </p>
      {!utm.available && utm.needsMigration ? (
        <p className="mt-4 rounded-2xl p-4 text-sm" style={{ background: 'var(--sk-brand-soft)', color: 'var(--sk-muted)' }}>
          Belum tersedia — kolom <code>utm_source</code>/<code>utm_medium</code>/<code>utm_campaign</code> belum ada di
          database. Jalankan migrasi <code>supabase/migrations/20261002070000_signup_utm_attribution.sql</code> ke
          Supabase terlebih dahulu (lihat docs/MONITORING.md).
        </p>
      ) : !utm.available ? (
        <p className="mt-4 text-sm" style={{ color: 'var(--sk-muted)' }}>
          Data atribusi belum dapat dibaca.
        </p>
      ) : utm.rows.length === 0 ? (
        <p className="mt-4 rounded-2xl p-4 text-sm" style={{ background: 'var(--sk-bg)', color: 'var(--sk-muted)' }}>
          Belum ada data — tampil apa adanya. Baris pendaftar 30 hari terakhir belum memiliki nilai UTM.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {utm.rows.map((r) => (
            <li key={r.source} className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-bold" style={{ color: 'var(--sk-ink)' }}>{r.source}</span>
              <span className="text-sm font-extrabold" style={{ color: 'var(--sk-teal)' }}>
                {r.count.toLocaleString('id-ID')}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs leading-5" style={{ color: 'var(--sk-faint)' }}>
        CAC (biaya per akuisisi) per kanal belum dapat dihitung — data biaya iklan per kanal tidak tersimpan di
        database. Lengkapi biaya kampanye secara manual untuk menghitung CAC = biaya ÷ pendaftar.
      </p>
    </LaunchCard>
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

  // Metrik Launch (30 hari) — diambil paralel setelah guard peran lolos.
  const [users30, listings30, properties30, dau30, funnel, utm] = await Promise.all([
    dailyCounts(supabase, 'profiles', 30, 20000),
    dailyCounts(supabase, 'listings', 30, 20000),
    dailyCounts(supabase, 'properties', 30, 20000),
    dailyActiveUsers(supabase, 30),
    referralFunnel(),
    utmSignups(supabase, 30),
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

        {/* ── METRIK LAUNCH (30 hari) ─────────────────────────────────── */}
        <section className="mt-10" aria-label="Metrik Launch">
          <div
            className="p-6 sm:p-8"
            style={{
              background: 'var(--sk-teal)',
              borderRadius: 'var(--sk-r-xl)',
              color: '#fff',
            }}
          >
            <p className="text-xs font-extrabold uppercase" style={{ letterSpacing: '.18em', color: 'var(--sk-brand-soft)' }}>
              Metrik Launch
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Pertumbuhan 30 hari terakhir</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6" style={{ color: 'var(--sk-teal-soft)' }}>
              Semua angka dibaca langsung dari database saat halaman dibuka — tanpa angka palsu. Bila suatu sumber
              belum tersedia atau belum dimigrasi, tertulis apa adanya.
            </p>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <LaunchTrend
              label="Pendaftar / hari"
              trend={users30}
              footnote="Jumlah baris baru di profiles per hari (sumber nyata)."
            />
            <LaunchTrend
              label="Listing marketplace baru / hari"
              trend={listings30}
              footnote="Baris baru di listings per hari (sumber nyata)."
            />
            <LaunchTrend
              label="Properti baru / hari"
              trend={properties30}
              footnote="Baris baru di properties per hari (sumber nyata)."
            />
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <LaunchTrend
              label="DAU (pengguna aktif harian)"
              trend={dau30}
              footnote="Sesi unik per hari dari analytics_events. Keterbatasan: hanya tercatat dari alur yang memanggil trackEvent() — bisa undercount."
            />
            <div className="lg:col-span-2">
              <LaunchFunnel funnel={funnel} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <LaunchUtm utm={utm} />
            <LaunchCard>
              <LaunchEyebrow>Catatan atribusi</LaunchEyebrow>
              <ul className="mt-3 space-y-2 text-sm leading-6" style={{ color: 'var(--sk-muted)' }}>
                <li>• Kolom <code>utm_source</code>/<code>utm_medium</code>/<code>utm_campaign</code> di <code>profiles</code> disiapkan via migrasi <code>20261002070000_signup_utm_attribution.sql</code> (file-only, belum dijalankan).</li>
                <li>• Penangkapan UTM saat signup (cookie landing → profil) belum diimplementasikan — follow-up terpisah.</li>
                <li>• CAC per kanal butuh data biaya iklan dari luar database; tabel di samping memberi pembaginya (jumlah pendaftar).</li>
                <li>• DAU memakai <code>analytics_events</code>; retensi baris 180 hari sesuai kebijakan privasi.</li>
              </ul>
            </LaunchCard>
          </div>
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
