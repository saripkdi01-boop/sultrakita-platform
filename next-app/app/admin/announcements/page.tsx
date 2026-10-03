import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin } from '@/lib/admin/guards';
import { AnnouncementsClient, type AnnouncementRow } from './AnnouncementsClient';

export const dynamic = 'force-dynamic';

// FASE B4 — /admin/announcements: kelola broadcast pengumuman situs.

export default async function AdminAnnouncementsPage() {
  try {
    await requireRole('admin', 'super_admin');
  } catch {
    redirectToLogin('/admin/announcements');
  }

  let rows: AnnouncementRow[] = [];
  let error: string | null = null;
  try {
    const supabase = await getServerSupabase();
    const { data, error: qErr } = await supabase
      .from('announcements')
      .select('id, title, body, link_url, link_label, starts_at, ends_at, is_active, created_at')
      .order('created_at', { ascending: false })
      .limit(50);
    if (qErr) error = qErr.message;
    else rows = (data ?? []) as AnnouncementRow[];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Gagal membaca announcements.';
  }

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Pengumuman</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Broadcast banner ke seluruh situs — untuk maintenance, info penting, atau promo.
            Terbit tanpa deploy; tiap pengguna bisa menutupnya. Hanya admin.
          </p>
        </section>

        {error ? (
          <div className="mt-6 rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-sm leading-6 text-[#55736b] dark:text-white/70">
              <strong className="text-[#123f38] dark:text-white">Tabel <code>announcements</code> belum ada.</strong>{' '}
              Jalankan <code>20261003141000_announcements.sql</code> di Supabase SQL Editor untuk mengaktifkan modul ini.
              Detail: {error}
            </p>
          </div>
        ) : (
          <AnnouncementsClient initial={rows} />
        )}
      </main>
    </AppLayout>
  );
}
