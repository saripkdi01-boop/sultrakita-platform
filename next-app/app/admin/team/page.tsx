import { AppLayout } from '@/components/layout/AppLayout';
import { requireSuperAdmin, redirectToLogin } from '@/lib/admin/guards';
import { TeamClient } from './TeamClient';
import { listStaff } from './actions';

export const dynamic = 'force-dynamic';

// FASE B5 — /admin/team: manajemen tim admin. KHUSUS super_admin.

export default async function AdminTeamPage() {
  try {
    await requireSuperAdmin();
  } catch {
    redirectToLogin('/admin/team');
  }

  const res = await listStaff();

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Tim admin</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Kelola siapa yang menjadi staf SUKI — tanpa SQL manual. Khusus super_admin;
            semua perubahan tercatat di audit trail.
          </p>
        </section>

        {!res.ok ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm leading-6 text-[#55736b] dark:text-white/70">
              <strong className="text-[#123f38] dark:text-white">Tidak bisa memuat daftar tim:</strong> {res.error}
            </p>
            <p className="mt-2 text-xs text-[#78948c]">
              Umumnya karena <code>SUPABASE_SERVICE_ROLE_KEY</code> belum terpasang di Vercel env.
            </p>
          </div>
        ) : (
          <TeamClient initial={res.data ?? []} />
        )}
      </main>
    </AppLayout>
  );
}
