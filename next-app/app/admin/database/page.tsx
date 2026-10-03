import { AppLayout } from '@/components/layout/AppLayout';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// FASE B2 — /admin/database: kesehatan data sekilas.
// - Hitung baris per tabel utama via service-role (bypass RLS) bila
//   SUPABASE_SERVICE_ROLE_KEY tersedia; bila tidak, tampil jujur.
// - Probe baca anon-key per tabel untuk menunjukkan efek RLS apa adanya:
//   "dapat dibaca anon" vs "ditolak RLS" vs "tabel tidak ada".
// - Daftar bucket storage + hitung file (dibatasi 1000, jujur).

const TABLES: Array<{ name: string; label: string }> = [
  { name: 'profiles', label: 'Pengguna' },
  { name: 'profile_contacts', label: 'Kontak profil' },
  { name: 'listings', label: 'Listing marketplace' },
  { name: 'listing_media', label: 'Media listing' },
  { name: 'properties', label: 'Properti' },
  { name: 'jobs', label: 'Lowongan' },
  { name: 'job_applications', label: 'Lamaran kerja' },
  { name: 'businesses', label: 'Bisnis' },
  { name: 'business_inquiries', label: 'Inquiry bisnis' },
  { name: 'groups', label: 'Grup' },
  { name: 'group_posts', label: 'Post grup' },
  { name: 'group_members', label: 'Anggota grup' },
  { name: 'posts', label: 'Post beranda' },
  { name: 'comments', label: 'Komentar' },
  { name: 'conversations', label: 'Percakapan chat' },
  { name: 'messages', label: 'Pesan chat' },
  { name: 'billing_orders', label: 'Order billing' },
  { name: 'billing_entitlements', label: 'Entitlement' },
  { name: 'support_tickets', label: 'Tiket support' },
  { name: 'notifications', label: 'Notifikasi' },
  { name: 'saved_posts', label: 'Post tersimpan' },
  { name: 'follows', label: 'Follow' },
  { name: 'site_settings', label: 'Pengaturan situs' },
  { name: 'audit_events', label: 'Audit trail' },
  { name: 'error_events', label: 'Error events (B1)' },
  { name: 'announcements', label: 'Pengumuman (B4)' },
];

function getServiceClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

// OPS SWEEP — klien probe yang BENAR-BENAR anonim (tanpa cookie sesi).
// getServerSupabase() membawa sesi admin yang sedang login, sehingga "probe
// anon-key" sebelumnya sebenarnya menguji RLS sebagai admin — menyesatkan
// (mis. error_events tampak "dapat dibaca anon" padahal anon asli ditolak).
function getAnonProbeClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

interface TableStat {
  name: string;
  label: string;
  count: number | null;
  countNote: string;
  anon: 'readable' | 'denied' | 'missing' | 'unknown';
}

async function statTable(
  svc: SupabaseClient | null,
  anon: SupabaseClient | null,
  t: { name: string; label: string },
): Promise<TableStat> {
  let count: number | null = null;
  let countNote = '';
  if (svc) {
    const { count: c, error } = await svc.from(t.name).select('id', { count: 'exact', head: true });
    if (error) {
      countNote = /PGRST205|does not exist|relation/i.test(error.message) ? 'tabel tidak ada' : `gagal: ${error.message.slice(0, 60)}`;
    } else {
      count = c ?? 0;
      countNote = 'via service-role';
    }
  } else {
    countNote = 'butuh SUPABASE_SERVICE_ROLE_KEY';
  }

  let anonState: TableStat['anon'] = 'unknown';
  if (anon) {
    try {
      const { error } = await anon.from(t.name).select('id').limit(1);
      if (!error) anonState = 'readable';
      else if (/PGRST205|does not exist|relation/i.test(error.message)) anonState = 'missing';
      else anonState = 'denied';
    } catch {
      anonState = 'unknown';
    }
  }
  return { name: t.name, label: t.label, count, countNote, anon: anonState };
}

interface BucketStat {
  name: string;
  isPublic: boolean;
  files: number | null;
  note: string;
}

export default async function AdminDatabasePage() {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/database');
  }

  const checkedAt = new Date().toISOString();
  const svc = getServiceClient();
  const anon = getAnonProbeClient();

  const stats = await Promise.all(TABLES.map((t) => statTable(svc, anon, t)));

  let buckets: BucketStat[] = [];
  let bucketError: string | null = null;
  const bucketClient = svc ?? anon;
  if (!bucketClient) {
    bucketError = 'Supabase belum dikonfigurasi (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY).';
  } else {
  try {
    const client = bucketClient;
    const { data: list, error } = await client.storage.listBuckets();
    if (error) {
      bucketError = error.message;
    } else {
      buckets = await Promise.all(
        (list ?? []).map(async (b) => {
          try {
            // Hitung dibatasi 1000 file — label jujur bila menyentuh batas.
            const { data, error: listErr } = await client.storage.from(b.name).list('', { limit: 1000 });
            if (listErr) return { name: b.name, isPublic: b.public, files: null, note: listErr.message.slice(0, 60) };
            const n = data?.length ?? 0;
            return { name: b.name, isPublic: b.public, files: n, note: n >= 1000 ? 'dihitung maks 1000' : 'pasti' };
          } catch (err) {
            return { name: b.name, isPublic: b.public, files: null, note: err instanceof Error ? err.message.slice(0, 60) : 'gagal' };
          }
        }),
      );
    }
  } catch (err) {
    bucketError = err instanceof Error ? err.message : 'Gagal membaca storage.';
  }
  }

  const totalRows = stats.reduce((sum, s) => sum + (s.count ?? 0), 0);
  const missingTables = stats.filter((s) => s.anon === 'missing' || s.countNote === 'tabel tidak ada');

  const anonBadge = (s: TableStat['anon']) => {
    if (s === 'readable') return <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">dapat dibaca anon</span>;
    if (s === 'denied') return <span className="rounded-full bg-[#e9f7f2] px-2.5 py-0.5 text-[11px] font-bold text-[#146355]">ditolak RLS</span>;
    if (s === 'missing') return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-600">tabel tidak ada</span>;
    return <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-500">tak diketahui</span>;
  };

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Database</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
                Hitung baris per tabel utama dan efek RLS dari sudut pandang anon-key — dibaca live server-side.
                Hanya admin.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-3 text-center">
              <p className="text-3xl font-extrabold">{svc ? totalRows.toLocaleString('id-ID') : '—'}</p>
              <p className="text-xs uppercase tracking-wide text-[#bce8d8]">total baris terhitung</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-[#bce8d8]">Dibaca: <span className="font-mono">{checkedAt}</span> (UTC)</p>
        </section>

        {!svc && (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-extrabold">Mode terbatas: SUPABASE_SERVICE_ROLE_KEY belum terpasang</p>
            <p className="mt-1">Hitung baris memakai anon-key + RLS sehingga angkanya bukan total sebenarnya. Pasang key di Vercel env untuk hitung pasti.</p>
          </div>
        )}

        {missingTables.length > 0 && (
          <div className="mt-6 rounded-3xl border border-[#dcebe5] bg-white p-5 dark:border-white/10 dark:bg-[#10231f]">
            <p className="text-sm font-extrabold text-[#123f38] dark:text-white">
              {missingTables.length} tabel dari daftar belum ada di production:
            </p>
            <p className="mt-1 font-mono text-xs text-[#78948c]">{missingTables.map((t) => t.name).join(', ')}</p>
            <p className="mt-1 text-xs text-[#78948c]">Wajar untuk tabel fitur yang migrasinya belum dijalankan (mis. error_events / announcements sebelum SQL Fase B dijalankan).</p>
          </div>
        )}

        <section className="mt-6 overflow-x-auto rounded-3xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-[#eef4f1] text-xs uppercase tracking-wide text-[#78948c] dark:border-white/10">
                <th className="p-4 font-extrabold">Tabel</th>
                <th className="p-4 font-extrabold">Baris</th>
                <th className="p-4 font-extrabold">Akses anon-key (efek RLS)</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.name} className="border-b border-[#f2f7f5] last:border-0 dark:border-white/5">
                  <td className="p-4">
                    <span className="font-bold text-[#123f38] dark:text-white">{s.label}</span>
                    <span className="block font-mono text-[11px] text-[#9db5ad]">{s.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-[#123f38] dark:text-white">
                      {s.count === null ? '—' : s.count.toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[11px] text-[#9db5ad]">{s.countNote}</span>
                  </td>
                  <td className="p-4">{anonBadge(s.anon)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold text-[#123f38] dark:text-white">Storage buckets</h2>
          <div className="rounded-3xl border border-[#dcebe5] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
            {bucketError ? (
              <p className="text-sm text-red-700">Gagal membaca bucket: {bucketError}</p>
            ) : buckets.length === 0 ? (
              <p className="text-sm text-[#78948c]">Tidak ada bucket.</p>
            ) : (
              <ul className="divide-y divide-[#eef4f1] dark:divide-white/10">
                {buckets.map((b) => (
                  <li key={b.name} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span>
                      <span className="font-mono font-bold text-[#123f38] dark:text-white">{b.name}</span>
                      <span className={`ml-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${b.isPublic ? 'bg-amber-50 text-amber-800' : 'bg-[#e9f7f2] text-[#146355]'}`}>
                        {b.isPublic ? 'publik' : 'privat'}
                      </span>
                    </span>
                    <span className="text-xs text-[#78948c]">
                      {b.files === null ? b.note : `${b.files.toLocaleString('id-ID')} file (${b.note})`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <p className="mt-4 text-center text-[11px] leading-5 text-[#78948c]">
          Hitung baris memakai service-role (bypass RLS) bila tersedia; probe anon-key menunjukkan efek RLS apa adanya.
        </p>
      </main>
    </AppLayout>
  );
}
