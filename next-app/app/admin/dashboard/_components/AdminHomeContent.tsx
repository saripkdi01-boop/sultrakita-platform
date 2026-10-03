import Link from 'next/link';
import {
  Activity,
  BellRing,
  Bug,
  Building2,
  CreditCard,
  Database,
  Gift,
  House,
  Images,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  ScrollText,
  Settings2,
  ShieldCheck,
  Store,
  UsersRound,
  Rocket,
  type LucideIcon,
} from 'lucide-react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';
import styles from './AdminHomeContent.module.css';

// ---------------------------------------------------------------------------
// Daftar modul Operations Center — dipakai bersama oleh
// /admin/dashboard dan /dashboard/admin agar satu sumber kebenaran.
// ---------------------------------------------------------------------------
export const ADMIN_MODULES: { href: string; title: string; description: string; icon: LucideIcon }[] = [
  { href: '/admin/overview', title: 'Ringkasan operasional', description: 'KPI jujur dari database: pengguna, listing, laporan, dan aktivitas admin terbaru.', icon: LayoutDashboard },
  { href: '/admin/users', title: 'Kelola pengguna', description: 'Cari, saring, tangguhkan/pulihkan akun, ubah peran, dan catatan internal.', icon: UsersRound },
  { href: '/admin/team', title: 'Tim admin', description: 'Kelola staf SUKI: beri/cabut role admin, moderator, support — khusus super_admin, tercatat di audit.', icon: KeyRound },
  { href: '/admin/moderation', title: 'Moderasi laporan', description: 'Antrean laporan marketplace: tinjau, tolak, atau takedown listing dengan alasan.', icon: ShieldCheck },
  { href: '/admin/monitoring', title: 'Monitoring operasional', description: 'Uptime endpoint, latensi, kesehatan DB/storage, status cron & integrasi — dicek live saat halaman dibuka.', icon: Activity },
  { href: '/admin/errors', title: 'Error inbox', description: 'Pipeline error terpusat: kelompok error server-side, hitung kejadian, tandai resolved.', icon: Bug },
  { href: '/admin/database', title: 'Database', description: 'Hitung baris per tabel utama, efek RLS dari sudut anon-key, dan bucket storage.', icon: Database },
  { href: '/admin/audit', title: 'Audit trail', description: 'Jejak aksi admin & moderasi: siapa melakukan apa dan kapan — transparan, dapat diaudit.', icon: ScrollText },
  { href: '/admin/billing', title: 'Billing & langganan', description: 'Paket, entitlement, dan pesanan (sandbox).', icon: CreditCard },
  { href: '/admin/ads', title: 'Iklan', description: 'Kelola slot iklan dan inventaris monetisasi ekosistem.', icon: Megaphone },
  { href: '/admin/announcements', title: 'Pengumuman', description: 'Broadcast banner ke seluruh situs: maintenance, info penting, promo — tanpa deploy.', icon: BellRing },
  { href: '/admin/settings', title: 'Pengaturan situs', description: 'Feature flags & maintenance mode. Perubahan berlaku ≤60 detik, tercatat di audit.', icon: Settings2 },
  { href: '/admin/support-tickets', title: 'Support tickets', description: 'Triage, respons, dan lifecycle tiket dukungan.', icon: LifeBuoy },
  { href: '/admin/ecosystem-banners', title: 'Ecosystem banners', description: 'Kelola banner lintas Marketplace, Jobs, dan SUKI Suits.', icon: Images },
  { href: '/admin/property-verification', title: 'Property verification', description: 'Tinjau dokumen dan status verifikasi properti.', icon: House },
  { href: '/admin/businesses', title: 'Moderasi bisnis', description: 'Tinjau pengajuan direktori bisnis: setujui, tolak, kelola unggulan & verifikasi.', icon: Building2 },
  { href: '/admin/affiliate-rewards', title: 'Affiliate rewards', description: 'Review dan rekonsiliasi antrean payout affiliate.', icon: Gift },
  { href: '/admin/launch', title: 'Checklist launch', description: 'Daftar verifikasi pra-launch dari data/launch-checklist.json — status lolos/gagal/belum diperiksa.', icon: Rocket },
];

// ---------------------------------------------------------------------------
// Data layer: semua angka di halaman ini berasal dari query DB nyata.
// Best-effort: tiap query yang gagal menghasilkan null → kartu menampilkan "—".
// ---------------------------------------------------------------------------
type StatValue = number | null;

interface RecentError {
  id: string;
  error_name: string;
  route: string | null;
  occurrences: number;
  last_seen_at: string;
}

interface PendingBusiness {
  id: string;
  name: string;
  created_at: string;
}

interface DashboardStats {
  users: StatValue;
  listings: StatValue;
  billingOrders: StatValue;
  openErrors: StatValue;
  announcements: StatValue;
  pendingBusinesses: StatValue;
  errorsReadable: boolean;
  recentErrors: RecentError[];
  oldestPendingBiz: PendingBusiness[];
}

const EMPTY_STATS: DashboardStats = {
  users: null,
  listings: null,
  billingOrders: null,
  openErrors: null,
  announcements: null,
  pendingBusinesses: null,
  errorsReadable: false,
  recentErrors: [],
  oldestPendingBiz: [],
};

async function getDbClient(): Promise<SupabaseClient | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceKey) {
    return createClient(url, serviceKey, { auth: { persistSession: false } });
  }
  try {
    return await getServerSupabase();
  } catch {
    return null;
  }
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const db = await getDbClient();
  if (!db) return EMPTY_STATS;

  const countExact = async (table: string, match?: Record<string, string | boolean>): Promise<StatValue> => {
    try {
      let q = db.from(table).select('id', { count: 'exact', head: true });
      if (match) {
        for (const [k, v] of Object.entries(match)) q = q.eq(k, v);
      }
      const { count, error } = await q;
      return error ? null : (count ?? 0);
    } catch {
      return null;
    }
  };

  const [users, listings, billingOrders, openErrors, pendingBusinesses] = await Promise.all([
    countExact('profiles'),
    countExact('listings', { status: 'published' }),
    countExact('billing_orders'),
    countExact('error_events', { resolved: false }),
    countExact('businesses', { status: 'pending' }),
  ]);

  // Pengumuman aktif = is_active + berada di jendela waktu tayang.
  let announcements: StatValue = null;
  try {
    const { data, error } = await db.from('announcements').select('id, starts_at, ends_at').eq('is_active', true);
    if (!error && data) {
      const now = Date.now();
      announcements = (data as { starts_at: string | null; ends_at: string | null }[]).filter((a) => {
        const s = a.starts_at ? new Date(a.starts_at).getTime() : null;
        const e = a.ends_at ? new Date(a.ends_at).getTime() : null;
        return (s === null || Number.isNaN(s) || s <= now) && (e === null || Number.isNaN(e) || e >= now);
      }).length;
    }
  } catch {
    announcements = null;
  }

  // Error terbaru yang belum resolved (untuk pill status + seksi perhatian).
  let errorsReadable = false;
  let recentErrors: RecentError[] = [];
  try {
    const { data, error } = await db
      .from('error_events')
      .select('id, error_name, route, occurrences, last_seen_at')
      .eq('resolved', false)
      .order('last_seen_at', { ascending: false })
      .limit(5);
    if (!error && data) {
      errorsReadable = true;
      recentErrors = data as RecentError[];
    }
  } catch {
    errorsReadable = false;
    recentErrors = [];
  }

  // Bisnis pending tertua (untuk seksi perhatian).
  let oldestPendingBiz: PendingBusiness[] = [];
  try {
    const { data, error } = await db
      .from('businesses')
      .select('id, name, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5);
    if (!error && data) oldestPendingBiz = data as PendingBusiness[];
  } catch {
    oldestPendingBiz = [];
  }

  return { users, listings, billingOrders, openErrors, announcements, pendingBusinesses, errorsReadable, recentErrors, oldestPendingBiz };
}

const fmtWita = (iso: string) =>
  new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Makassar',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

const fmtNum = (v: StatValue) => (v === null ? '—' : v.toLocaleString('id-ID'));

// ---------------------------------------------------------------------------
// Komponen (server component — data diambil server-side, tanpa angka palsu).
// ---------------------------------------------------------------------------
export async function AdminHomeContent({ displayName, role }: { displayName: string; role: string }) {
  const stats = await fetchDashboardStats();
  const roleLabel = role === 'super_admin' ? 'Super Admin' : role.replace(/_/g, ' ');

  const kpis: { label: string; value: StatValue; href: string; hint: string; icon: LucideIcon }[] = [
    { label: 'Pengguna terdaftar', value: stats.users, href: '/admin/users', hint: 'Kelola pengguna', icon: UsersRound },
    { label: 'Listing aktif', value: stats.listings, href: '/admin/moderation', hint: 'Moderasi listing', icon: Store },
    { label: 'Order billing', value: stats.billingOrders, href: '/admin/billing', hint: 'Billing', icon: CreditCard },
    { label: 'Error terbuka', value: stats.openErrors, href: '/admin/errors', hint: 'Error inbox', icon: Bug },
    { label: 'Pengumuman aktif', value: stats.announcements, href: '/admin/announcements', hint: 'Broadcast', icon: Megaphone },
    { label: 'Bisnis menunggu review', value: stats.pendingBusinesses, href: '/admin/businesses', hint: 'Moderasi bisnis', icon: Building2 },
  ];

  const attentionCount = stats.recentErrors.length + stats.oldestPendingBiz.length;

  return (
    <main className="platform-shell mx-auto max-w-6xl">
      {/* Hero — ramping & profesional */}
      <section className="rounded-3xl bg-[#123f38] p-5 shadow-xl shadow-[#123f38]/10 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI Operations Center</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Command Center</h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#d9f1e8]">
              Satu pintu untuk operasi, moderasi, dukungan, dan kontrol kualitas ekosistem SultraKita.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            {stats.errorsReadable &&
              (stats.openErrors !== null && stats.openErrors > 0 ? (
                <Link
                  href="/admin/errors"
                  className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1.5 text-xs font-bold text-[#ffd9d9] ring-1 ring-red-400/50 transition hover:bg-red-500/30"
                >
                  <span className="h-2 w-2 rounded-full bg-red-400" aria-hidden />
                  {stats.openErrors} error belum ditangani
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-3 py-1.5 text-xs font-bold text-[#b8f0d8] ring-1 ring-emerald-300/40">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
                  Semua sistem normal
                </span>
              ))}
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm">
              <p className="text-[11px] uppercase tracking-wide text-[#bce8d8]">Sesi terverifikasi</p>
              <p className="mt-0.5 font-bold text-white">{displayName}</p>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-[#bce8d8]">{roleLabel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* KPI — angka nyata dari database */}
      <section aria-label="Indikator utama" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        {kpis.map((k) => (
          <Link
            key={k.href + k.label}
            href={k.href}
            className="group flex min-w-0 flex-col gap-2 rounded-2xl border border-[#dcebe5] bg-white p-4 shadow-sm motion-safe:transition hover:shadow-md motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#10231f]"
          >
            <span className="flex items-center justify-between gap-2">
              <k.icon className="h-5 w-5 shrink-0 text-[#1b806f] dark:text-[#7fd6c2]" aria-hidden />
              <span className="truncate text-[11px] font-bold text-[#78948c] dark:text-white/50">{k.hint}</span>
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-[#123f38] dark:text-white">{fmtNum(k.value)}</span>
            <span className="text-xs font-semibold leading-5 text-[#55736b] dark:text-white/70">{k.label}</span>
          </Link>
        ))}
      </section>

      {/* Perlu perhatian — daftar jujur, tanpa angka palsu */}
      <section aria-label="Perlu perhatian" className="mt-8">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className={`text-lg font-extrabold tracking-tight ${styles.backdropHeading}`}>Perlu perhatian</h2>
          {attentionCount > 0 && (
            <span className={`text-xs font-semibold ${styles.backdropMuted}`}>{attentionCount} item</span>
          )}
        </div>
        {attentionCount === 0 ? (
          <div className="mt-3 rounded-2xl border border-[#dcebe5] bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-[#10231f]">
            <p className="text-sm font-bold text-[#123f38] dark:text-white">Nihil. Semua terkendali.</p>
            <p className="mt-1 text-xs text-[#78948c] dark:text-white/60">
              Tidak ada error terbuka maupun pengajuan bisnis yang menunggu review.
            </p>
          </div>
        ) : (
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            {stats.recentErrors.length > 0 && (
              <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
                <div className="flex items-center justify-between border-b border-[#eef4f1] px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-bold text-[#123f38] dark:text-white">Error terbaru</p>
                  <Link href="/admin/errors" className="text-xs font-bold text-[#1b806f] hover:underline dark:text-[#7fd6c2]">
                    Buka inbox →
                  </Link>
                </div>
                <ul className="divide-y divide-[#f2f7f5] dark:divide-white/5">
                  {stats.recentErrors.map((e) => (
                    <li key={e.id}>
                      <Link href="/admin/errors" className="block px-4 py-3 transition hover:bg-[#f6faf8] dark:hover:bg-white/5">
                        <p className="truncate font-mono text-xs font-bold text-[#123f38] dark:text-white">{e.error_name}</p>
                        <p className="mt-1 truncate text-xs text-[#78948c] dark:text-white/60">
                          {e.route ?? '—'} · {e.occurrences.toLocaleString('id-ID')}× · terakhir {fmtWita(e.last_seen_at)} WITA
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stats.oldestPendingBiz.length > 0 && (
              <div className="min-w-0 overflow-hidden rounded-2xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
                <div className="flex items-center justify-between border-b border-[#eef4f1] px-4 py-3 dark:border-white/10">
                  <p className="text-sm font-bold text-[#123f38] dark:text-white">Bisnis menunggu review</p>
                  <Link href="/admin/businesses" className="text-xs font-bold text-[#1b806f] hover:underline dark:text-[#7fd6c2]">
                    Tinjau →
                  </Link>
                </div>
                <ul className="divide-y divide-[#f2f7f5] dark:divide-white/5">
                  {stats.oldestPendingBiz.map((b) => (
                    <li key={b.id}>
                      <Link href="/admin/businesses" className="block px-4 py-3 transition hover:bg-[#f6faf8] dark:hover:bg-white/5">
                        <p className="truncate text-sm font-bold text-[#123f38] dark:text-white">{b.name}</p>
                        <p className="mt-1 text-xs text-[#78948c] dark:text-white/60">
                          Menunggu sejak {fmtWita(b.created_at)} WITA
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Grid modul */}
      <section aria-label="Modul operasional" className="mt-8">
        <h2 className={`text-lg font-extrabold tracking-tight ${styles.backdropHeading}`}>Modul operasional</h2>
        <p className={`mt-1 text-xs ${styles.backdropMuted}`}>18 modul governance — akses & mutasi selalu divalidasi server-side.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {ADMIN_MODULES.map((module) => (
            <Link
              key={module.href}
              href={module.href}
              className="group flex min-w-0 items-start gap-4 rounded-2xl border border-[#dcebe5] bg-white p-5 shadow-sm motion-safe:transition hover:shadow-md motion-safe:hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#10231f]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e9f7f2] text-[#1b806f] dark:bg-white/10 dark:text-[#7fd6c2]">
                <module.icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-extrabold text-[#123f38] dark:text-white">{module.title}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-5 text-[#55736b] dark:text-white/60">
                  {module.description}
                </span>
                <span className="mt-2 inline-flex items-center text-xs font-bold text-[#1b806f] dark:text-[#7fd6c2]">
                  Buka modul
                  <span className="ml-1.5 inline-block motion-safe:transition motion-safe:group-hover:translate-x-1" aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className={`mt-8 text-center text-xs ${styles.backdropMuted}`}>
        Akses dashboard dan mutasi data selalu divalidasi server-side berdasarkan sesi Supabase dan role profile.
      </p>
    </main>
  );
}
