import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin, maskPII } from '@/lib/admin/guards';
import type { SupabaseClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 50;

interface ProfileRow {
  id: string;
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  role: string | null;
  phone: string | null;
  is_active: boolean | null;
  is_suspended: boolean | null;
  created_at: string | null;
}

const ROLE_OPTIONS = ['user', 'buyer', 'seller', 'creator', 'community', 'moderator', 'support', 'admin', 'super_admin'];

async function fetchUsers(
  client: SupabaseClient,
  { q, role, status, page }: { q: string; role: string; status: string; page: number }
): Promise<{ rows: ProfileRow[]; emails: Record<string, string>; total: number; error: string | null }> {
  try {
    let idsFromEmail: string[] | null = null;
    if (q) {
      const { data: contacts } = await client.from('profile_contacts').select('profile_id').ilike('email', `%${q}%`).limit(200);
      idsFromEmail = (contacts ?? []).map((c) => c.profile_id as string);
    }

    let query = client.from('profiles').select(
      'id, display_name, full_name, username, role, phone, is_active, is_suspended, created_at',
      { count: 'exact' }
    );
    if (q) {
      const orParts = [`display_name.ilike.%${q}%`, `full_name.ilike.%${q}%`, `username.ilike.%${q}%`];
      if (idsFromEmail && idsFromEmail.length > 0) {
        query = query.or([...orParts, `id.in.(${idsFromEmail.join(',')})`].join(','));
      } else {
        query = query.or(orParts.join(','));
      }
    }
    if (role) query = query.eq('role', role);
    if (status === 'suspended') query = query.eq('is_suspended', true);
    if (status === 'active') query = query.eq('is_suspended', false).eq('is_active', true);

    const from = (page - 1) * PAGE_SIZE;
    const { data, count, error } = await query.order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    const rows = (data ?? []) as ProfileRow[];
    const emails: Record<string, string> = {};
    if (rows.length > 0) {
      const { data: contacts } = await client
        .from('profile_contacts')
        .select('profile_id, email')
        .in('profile_id', rows.map((r) => r.id));
      for (const c of contacts ?? []) emails[c.profile_id as string] = c.email as string;
    }
    return { rows, emails, total: count ?? 0, error: null };
  } catch (error) {
    return { rows: [], emails: {}, total: 0, error: error instanceof Error ? error.message : 'Gagal memuat data.' };
  }
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string }>;
}) {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/users');
  }

  const params = await searchParams;
  const q = (params.q ?? '').trim();
  const role = params.role ?? '';
  const status = params.status ?? '';
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const supabase = await getServerSupabase();
  const { rows, emails, total, error } = await fetchUsers(supabase, { q, role, status, page });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const qs = (overrides: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (role) sp.set('role', role);
    if (status) sp.set('status', status);
    for (const [k, v] of Object.entries(overrides)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    const s = sp.toString();
    return s ? `/admin/users?${s}` : '/admin/users';
  };

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Kelola pengguna</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Cari, saring, tangguhkan, pulihkan, dan ubah peran pengguna. Setiap mutasi dicatat di audit trail.
          </p>
        </section>

        <form method="get" action="/admin/users" className="mt-8 grid gap-3 rounded-3xl border border-[#dcebe5] bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto_auto_auto] dark:border-white/10 dark:bg-[#10231f]">
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari nama, username, atau email…"
            className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm text-[#123f38] outline-none focus:border-[#1b806f] dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <select name="role" defaultValue={role} className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm dark:border-white/10 dark:bg-[#10231f] dark:text-white">
            <option value="">Semua peran</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select name="status" defaultValue={status} className="rounded-2xl border border-[#dcebe5] px-4 py-2.5 text-sm dark:border-white/10 dark:bg-[#10231f] dark:text-white">
            <option value="">Semua status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Ditangguhkan</option>
          </select>
          <button type="submit" className="rounded-2xl bg-[#1b806f] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#146355]">
            Cari
          </button>
        </form>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}

        <div className="mt-4 overflow-x-auto rounded-3xl border border-[#dcebe5] bg-white shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f0f7f4] dark:bg-white/5">
              <tr>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Pengguna</th>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Email</th>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Peran</th>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Status</th>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Terdaftar</th>
                <th className="p-4 font-extrabold text-[#123f38] dark:text-white">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const name = row.display_name || row.full_name || row.username || 'Tanpa nama';
                return (
                  <tr key={row.id} className="border-t border-[#eef4f1] dark:border-white/10">
                    <td className="p-4">
                      <p className="font-bold text-[#123f38] dark:text-white">{name}</p>
                      <p className="text-xs text-[#78948c]">{row.username ? `@${row.username}` : maskPII(row.phone, 'phone')}</p>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#55736b] dark:text-[#9db8b0]">{maskPII(emails[row.id], 'email')}</td>
                    <td className="p-4">
                      <span className="rounded-full bg-[#eaf1ff] px-3 py-1 text-xs font-bold text-[#1b4fd8] dark:bg-white/10 dark:text-[#9db8b0]">{row.role ?? '—'}</span>
                    </td>
                    <td className="p-4">
                      {row.is_suspended ? (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Ditangguhkan</span>
                      ) : (
                        <span className="rounded-full bg-[#e9f7f2] px-3 py-1 text-xs font-bold text-[#1b806f]">Aktif</span>
                      )}
                    </td>
                    <td className="p-4 text-xs text-[#78948c]">{row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '—'}</td>
                    <td className="p-4">
                      <Link href={`/admin/users/${row.id}`} className="text-sm font-bold text-[#1b806f]">
                        Detail →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {rows.length === 0 && !error && (
            <p className="p-10 text-center text-sm text-[#78948c]">Belum ada data — tampil apa adanya. Coba ubah kata kunci atau filter.</p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-[#55736b] dark:text-[#9db8b0]">
          <p>Total {total.toLocaleString('id-ID')} pengguna · halaman {page} dari {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={qs({ page: String(page - 1) })} className="rounded-xl border border-[#dcebe5] px-4 py-2 font-bold text-[#1b806f] dark:border-white/10">
                ← Sebelumnya
              </Link>
            )}
            {page < totalPages && (
              <Link href={qs({ page: String(page + 1) })} className="rounded-xl border border-[#dcebe5] px-4 py-2 font-bold text-[#1b806f] dark:border-white/10">
                Berikutnya →
              </Link>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
