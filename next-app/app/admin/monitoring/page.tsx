import { headers } from 'next/headers';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import cronJobsData from '@/data/cron-jobs.json';

export const dynamic = 'force-dynamic';

// /admin/monitoring — pusat monitoring operasional.
// Semua pengecekan dilakukan SERVER-SIDE saat halaman dibuka (live).
// Setiap metrik mencantumkan SUMBER + WAKTU pengecekan.
// Batasan jujur:
// - Tidak ada pipeline error terpusat di aplikasi: error runtime hanya
//   terlihat di Vercel Runtime Logs (ditautkan di bawah).
// - Status run terakhir cron GitHub Actions TIDAK bisa dibaca dari aplikasi;
//   halaman hanya menampilkan jadwal dari file workflow + tautan ke tab Actions.

interface CheckResult {
  name: string;
  ok: boolean | null; // null = tidak dapat ditentukan
  statusText: string;
  latencyMs: number | null;
  source: string;
  detail?: string;
}

async function timed<T>(fn: () => Promise<T>): Promise<{ ms: number; value: T }> {
  const start = Date.now();
  const value = await fn();
  return { ms: Date.now() - start, value };
}

function baseUrlFromHeaders(h: Headers): string {
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'sukiapps.web.id';
  return `${proto}://${host}`;
}

async function checkEndpoint(base: string, path: string, name: string, source: string): Promise<CheckResult> {
  try {
    const { ms, value: res } = await timed(() =>
      fetch(`${base}${path}`, { cache: 'no-store', redirect: 'manual' }),
    );
    const ok = res.status >= 200 && res.status < 400;
    let detail: string | undefined;
    if (path === '/api/health') {
      try {
        const body = (await res.clone().json()) as { ok?: boolean; data?: { db?: string; storage?: string } };
        detail = `db=${body?.data?.db ?? '?'} storage=${body?.data?.storage ?? '?'}`;
      } catch {
        detail = 'respons bukan JSON';
      }
    }
    return { name, ok, statusText: `HTTP ${res.status}`, latencyMs: ms, source, detail };
  } catch (err) {
    return {
      name, ok: false, statusText: 'Gagal terhubung', latencyMs: null, source,
      detail: err instanceof Error ? err.message : 'fetch gagal',
    };
  }
}

async function checkDatabase(): Promise<CheckResult> {
  const source = 'Query server-side: SELECT id FROM categories LIMIT 1 (anon key + sesi admin)';
  try {
    const supabase = await getServerSupabase();
    const { ms, value } = await timed(() => supabase.from('categories').select('id').limit(1));
    if (value.error) {
      return { name: 'Database (Supabase Postgres)', ok: false, statusText: 'Query gagal', latencyMs: ms, source, detail: value.error.message };
    }
    return { name: 'Database (Supabase Postgres)', ok: true, statusText: 'Query OK', latencyMs: ms, source };
  } catch (err) {
    return { name: 'Database (Supabase Postgres)', ok: false, statusText: 'Tidak terkonfigurasi / gagal', latencyMs: null, source, detail: err instanceof Error ? err.message : undefined };
  }
}

async function checkStorage(): Promise<CheckResult> {
  const source = 'Server-side: supabase.storage.listBuckets() (anon key + sesi admin)';
  try {
    const supabase = await getServerSupabase();
    const { ms, value } = await timed(() => supabase.storage.listBuckets());
    if (value.error) {
      return { name: 'Storage (Supabase)', ok: false, statusText: 'Gagal membaca bucket', latencyMs: ms, source, detail: value.error.message };
    }
    const names = (value.data ?? []).map((b) => b.name).join(', ') || '(tidak ada bucket)';
    return { name: 'Storage (Supabase)', ok: true, statusText: `${value.data?.length ?? 0} bucket`, latencyMs: ms, source, detail: names };
  } catch (err) {
    return { name: 'Storage (Supabase)', ok: false, statusText: 'Tidak terkonfigurasi / gagal', latencyMs: null, source, detail: err instanceof Error ? err.message : undefined };
  }
}

interface AuditRow {
  id: string;
  action: string;
  target_type: string | null;
  created_at: string | null;
}

async function recentAdminActivity(): Promise<{ rows: AuditRow[]; error: string | null }> {
  try {
    const supabase = await getServerSupabase();
    const { data, error } = await supabase
      .from('audit_events')
      .select('id, action, target_type, created_at')
      .order('created_at', { ascending: false })
      .limit(15);
    if (error) return { rows: [], error: error.message };
    return { rows: (data ?? []) as AuditRow[], error: null };
  } catch (err) {
    return { rows: [], error: err instanceof Error ? err.message : 'Gagal membaca audit_events.' };
  }
}

function StatusBadge({ ok }: { ok: boolean | null }) {
  const cls =
    ok === true
      ? 'bg-[#e9f7f2] text-[#146355]'
      : ok === false
        ? 'bg-red-50 text-red-700'
        : 'bg-amber-50 text-amber-800';
  const label = ok === true ? 'OK' : ok === false ? 'GANGGUAN' : 'TIDAK DIKETAHUI';
  return <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${cls}`}>{label}</span>;
}

function CheckCard({ check, checkedAt }: { check: CheckResult; checkedAt: string }) {
  return (
    <div className="rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-extrabold text-[#123f38] dark:text-white">{check.name}</h3>
        <StatusBadge ok={check.ok} />
      </div>
      <dl className="mt-3 space-y-1 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[#78948c]">Status</dt>
          <dd className="font-bold text-[#123f38] dark:text-white">{check.statusText}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#78948c]">Latensi</dt>
          <dd className="font-bold text-[#123f38] dark:text-white">{check.latencyMs === null ? '—' : `${check.latencyMs} ms`}</dd>
        </div>
        {check.detail && (
          <div className="flex justify-between gap-3">
            <dt className="text-[#78948c]">Detail</dt>
            <dd className="max-w-[60%] text-right font-mono text-xs text-[#123f38] dark:text-white">{check.detail}</dd>
          </div>
        )}
      </dl>
      <p className="mt-3 border-t border-[#eef4f1] pt-2 text-[11px] leading-5 text-[#78948c] dark:border-white/10">
        Sumber: {check.source}
        <br />
        Dicek: {checkedAt}
      </p>
    </div>
  );
}

export default async function AdminMonitoringPage() {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/monitoring');
  }

  const checkedAt = new Date().toISOString();
  const h = await headers();
  const base = baseUrlFromHeaders(h);

  const [healthApi, homePage, db, storage] = await Promise.all([
    checkEndpoint(base, '/api/health', 'API Health (/api/health)', `Fetch server-side ke ${base}/api/health saat halaman dibuka`),
    checkEndpoint(base, '/', 'Halaman utama (/)', `Fetch server-side ke ${base}/ saat halaman dibuka`),
    checkDatabase(),
    checkStorage(),
  ]);
  const activity = await recentAdminActivity();
  const jobs = (cronJobsData as { jobs: Array<{ id: string; name: string; file: string; schedule: string; schedule_human: string; target: string; description: string }>; notes: string[] }).jobs;
  const cronNotes = (cronJobsData as { notes: string[] }).notes;

  const checks = [healthApi, homePage, db, storage];
  const allOk = checks.every((c) => c.ok === true);

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Monitoring operasional</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
                Uptime endpoint, latensi, kesehatan database &amp; storage, dan status cron — semuanya dicek live
                server-side setiap kali halaman ini dibuka. Hanya admin.
              </p>
            </div>
            <StatusBadge ok={allOk} />
          </div>
          <p className="mt-4 text-xs text-[#bce8d8]">Waktu pengecekan (UTC): <span className="font-mono">{checkedAt}</span></p>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Uptime &amp; kesehatan layanan</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {checks.map((c) => (
              <CheckCard key={c.name} check={c} checkedAt={checkedAt} />
            ))}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Aktivitas admin terbaru</h2>
          <div className="rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
            {activity.error ? (
              <p className="text-sm text-red-700">Gagal membaca tabel <code>audit_events</code>: {activity.error}</p>
            ) : activity.rows.length === 0 ? (
              <p className="text-sm text-[#78948c]">
                Belum ada aktivitas tercatat di <code>audit_events</code> — tampil apa adanya.
              </p>
            ) : (
              <ul className="divide-y divide-[#eef4f1] dark:divide-white/10">
                {activity.rows.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                    <span className="font-mono text-xs font-bold text-[#123f38] dark:text-white">
                      {row.action}
                      <span className="ml-2 font-sans font-normal text-[#78948c]">· {row.target_type ?? '—'}</span>
                    </span>
                    <span className="text-xs text-[#78948c]">{row.created_at ? new Date(row.created_at).toLocaleString('id-ID') : '—'}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 border-t border-[#eef4f1] pt-2 text-[11px] leading-5 text-[#78948c] dark:border-white/10">
              Sumber: tabel <code>audit_events</code> (15 baris terbaru, server-side). Ini aktivitas admin, BUKAN feed error.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Error runtime</h2>
          <div className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm leading-6 text-[#55736b] dark:text-white/70">
              <strong className="text-[#123f38] dark:text-white">Belum ada pipeline error terpusat</strong> di aplikasi ini.
              Error runtime (500, exception server, kegagalan build) hanya tercatat di{' '}
              <a
                href="https://vercel.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#1b806f] underline"
              >
                Vercel Runtime Logs
              </a>{' '}
              (proyek <code>sultrakita-platform</code> → tab Logs). Jangan mengarang daftar error — halaman ini
              menampilkan empty state jujur sampai pipeline error (mis. Sentry) dipasang.
            </p>
            <p className="mt-2 text-[11px] text-[#78948c]">Sumber pernyataan: audit struktur repo &amp; tidak ditemukannya sink error terpusat.</p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Cron job terjadwal</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={job.id} className="rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-extrabold text-[#123f38] dark:text-white">{job.name}</h3>
                  <span className="rounded-full bg-[#eaf1ff] px-3 py-1 font-mono text-xs font-bold text-[#2b4f9e]">{job.schedule}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#55736b] dark:text-white/70">{job.description}</p>
                <dl className="mt-3 space-y-1 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78948c]">Jadwal</dt>
                    <dd className="font-bold text-[#123f38] dark:text-white">{job.schedule_human}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78948c]">File</dt>
                    <dd className="font-mono text-[#123f38] dark:text-white">{job.file}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#78948c]">Target</dt>
                    <dd className="max-w-[60%] break-all text-right font-mono text-[#123f38] dark:text-white">{job.target}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-extrabold">Status run terakhir: lihat di tab GitHub Actions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {cronNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <Link
              href="https://github.com/saripkdi01-boop/sultrakita-platform/actions"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block font-bold underline"
            >
              Buka tab GitHub Actions →
            </Link>
            <p className="mt-2 text-[11px]">Sumber jadwal: file workflow di <code>.github/workflows/</code> (dibaca saat halaman dibangun).</p>
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-[#78948c]">
          Semua pengecekan di atas berjalan server-side dengan hak admin. Non-admin diarahkan ke /login.
        </p>
      </main>
    </AppLayout>
  );
}
