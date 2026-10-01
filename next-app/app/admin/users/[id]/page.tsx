import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin, maskPII } from '@/lib/admin/guards';
import { SuspendActions, RoleActions, NotesForm } from './UserActions';

export const dynamic = 'force-dynamic';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  let actor;
  try {
    actor = await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/users');
  }

  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await getServerSupabase();
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, display_name, full_name, username, role, phone, email, is_active, is_suspended, is_seller, is_verified, city, province, admin_notes, created_at, last_login_at')
    .eq('id', id)
    .maybeSingle();
  if (!profile) notFound();

  const [{ data: contact }, { data: grants }] = await Promise.all([
    supabase.from('profile_contacts').select('email').eq('profile_id', id).maybeSingle(),
    supabase.from('user_roles').select('role, is_active, granted_at, expires_at').eq('user_id', id).order('granted_at', { ascending: false }),
  ]);

  const name = profile.display_name || profile.full_name || profile.username || 'Tanpa nama';
  const email = (contact?.email as string | undefined) ?? (profile.email as string | undefined) ?? null;

  const info: Array<[string, string]> = [
    ['Nama tampilan', profile.display_name ?? '—'],
    ['Nama lengkap', profile.full_name ?? '—'],
    ['Username', profile.username ? `@${profile.username}` : '—'],
    ['Email', maskPII(email, 'email')],
    ['Telepon', maskPII(profile.phone, 'phone')],
    ['Kota / Provinsi', [profile.city, profile.province].filter(Boolean).join(', ') || '—'],
    ['Status akun', profile.is_suspended ? 'Ditangguhkan' : profile.is_active ? 'Aktif' : 'Nonaktif'],
    ['Terverifikasi', profile.is_verified ? 'Ya' : 'Tidak'],
    ['Penjual', profile.is_seller ? 'Ya' : 'Tidak'],
    ['Terdaftar', profile.created_at ? new Date(profile.created_at).toLocaleString('id-ID') : '—'],
    ['Login terakhir', profile.last_login_at ? new Date(profile.last_login_at).toLocaleString('id-ID') : '—'],
  ];

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <Link href="/admin/users" className="text-sm font-bold text-[#1b806f]">← Kembali ke daftar pengguna</Link>
        <section className="mt-4 rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">Detail pengguna</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{name}</h1>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide">{profile.role ?? '—'}</span>
            {profile.is_suspended && <span className="rounded-full bg-red-500/80 px-3 py-1 text-xs font-bold">Ditangguhkan</span>}
          </div>
          <p className="mt-3 font-mono text-xs text-[#bce8d8]">{profile.id}</p>
        </section>

        <section className="mt-6 rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Profil</h2>
          <p className="mt-1 text-xs text-[#78948c]">PII ditampilkan sebagian (masking) untuk melindungi privasi.</p>
          <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {info.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-[#eef4f1] pb-2 dark:border-white/10">
                <dt className="text-xs font-bold uppercase tracking-wide text-[#78948c]">{label}</dt>
                <dd className="text-right text-sm font-semibold text-[#123f38] dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-6 rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
          <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Peran tambahan (user_roles)</h2>
          {!grants || grants.length === 0 ? (
            <p className="mt-3 text-sm text-[#78948c]">Belum ada data — tampil apa adanya.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[#eef4f1] dark:divide-white/10">
              {grants.map((g, i) => (
                <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                  <span className="font-bold text-[#123f38] dark:text-white">{g.role}</span>
                  <span className="text-xs text-[#78948c]">
                    {g.is_active ? 'aktif' : 'nonaktif'} · {g.granted_at ? new Date(g.granted_at).toLocaleDateString('id-ID') : '—'}
                    {g.expires_at ? ` · kedaluwarsa ${new Date(g.expires_at).toLocaleDateString('id-ID')}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-6 grid gap-6">
          <SuspendActions userId={profile.id} isSuspended={!!profile.is_suspended} />
          {actor.isSuperAdmin ? (
            <RoleActions userId={profile.id} currentRole={profile.role} />
          ) : (
            <div className="rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
              <h2 className="text-lg font-extrabold text-[#123f38] dark:text-white">Ubah peran</h2>
              <p className="mt-1 text-sm text-[#78948c]">Hanya super_admin yang dapat mengubah peran pengguna.</p>
            </div>
          )}
          <NotesForm userId={profile.id} initialNotes={profile.admin_notes} />
        </div>
      </main>
    </AppLayout>
  );
}
