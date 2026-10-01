import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { getServerSupabase } from '@/lib/supabase/server';
import { requireRole, redirectToLogin, maskPII } from '@/lib/admin/guards';
import { ModerationActions } from './ModerationActions';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu',
  under_review: 'Ditinjau',
  resolved: 'Selesai',
  dismissed: 'Ditolak',
};

interface ReportRow {
  id: string;
  reason: string;
  description: string | null;
  evidence_photos: string[];
  status: string;
  resolution: string | null;
  created_at: string | null;
  resolved_at: string | null;
  reported_listing_id: string | null;
  reported_user_id: string | null;
  reporter_id: string;
  listings: { id: string; title: string; status: string } | null;
  reporter: { display_name: string | null } | null;
  reporter_contact: { email: string }[] | null;
}

export default async function AdminModerationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  try {
    await requireRole('admin', 'super_admin', 'moderator');
  } catch {
    redirectToLogin('/admin/moderation');
  }

  const params = await searchParams;
  const statusFilter = params.status ?? 'pending';

  const supabase = await getServerSupabase();
  let query = supabase
    .from('marketplace_reports')
    .select(
      'id, reason, description, evidence_photos, status, resolution, created_at, resolved_at, reported_listing_id, reported_user_id, reporter_id, listings!marketplace_reports_reported_listing_id_fkey(id, title, status), reporter:profiles!marketplace_reports_reporter_id_fkey(display_name), reporter_contact:profile_contacts!marketplace_reports_reporter_id_fkey(email)'
    )
    .order('created_at', { ascending: false })
    .limit(100);
  if (statusFilter && statusFilter !== 'all') query = query.eq('status', statusFilter);
  const { data, error } = await query;
  const reports = ((data ?? []) as unknown as ReportRow[]).map((r) => ({
    ...r,
    reporter_contact: Array.isArray(r.reporter_contact) ? r.reporter_contact : null,
  }));

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Moderasi laporan</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Antrean laporan marketplace. Setiap tindakan wajib alasan dan dicatat di audit trail.
          </p>
        </section>

        <div className="mt-8 flex gap-2 overflow-x-auto">
          {['pending', 'under_review', 'resolved', 'dismissed', 'all'].map((s) => (
            <Link
              key={s}
              href={s === 'all' ? '/admin/moderation?status=all' : `/admin/moderation?status=${s}`}
              className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold ${
                statusFilter === s || (s === 'pending' && !params.status)
                  ? 'bg-[#1b806f] text-white'
                  : 'border border-[#dcebe5] bg-white text-[#1b806f] dark:border-white/10 dark:bg-[#10231f]'
              }`}
            >
              {s === 'all' ? 'Semua' : STATUS_LABEL[s]}
            </Link>
          ))}
        </div>

        {error && <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">Gagal memuat antrean: {error.message}</p>}

        <div className="mt-4 grid gap-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-3xl border border-[#dcebe5] bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#10231f]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#fff5dc] px-3 py-1 text-xs font-bold text-[#8a6d00]">{STATUS_LABEL[report.status] ?? report.status}</span>
                <span className="text-xs text-[#78948c]">
                  {report.created_at ? new Date(report.created_at).toLocaleString('id-ID') : '—'}
                </span>
              </div>
              <h2 className="mt-3 text-lg font-extrabold text-[#123f38] dark:text-white">{report.reason}</h2>
              {report.description && <p className="mt-1 text-sm leading-6 text-[#55736b] dark:text-[#9db8b0]">{report.description}</p>}

              <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-[#78948c]">Pelapor</dt>
                  <dd className="font-semibold text-[#123f38] dark:text-white">
                    {report.reporter?.display_name ?? '—'}{' '}
                    <span className="font-mono text-xs font-normal text-[#78948c]">
                      {maskPII(report.reporter_contact?.[0]?.email, 'email')}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wide text-[#78948c]">Listing terkait</dt>
                  <dd className="font-semibold text-[#123f38] dark:text-white">
                    {report.listings ? (
                      <>
                        {report.listings.title}{' '}
                        <span className="text-xs font-normal text-[#78948c]">(status: {report.listings.status})</span>
                      </>
                    ) : (
                      'Tidak ada'
                    )}
                  </dd>
                </div>
                {report.reported_user_id && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-[#78948c]">Pengguna terlapor</dt>
                    <dd>
                      <Link href={`/admin/users/${report.reported_user_id}`} className="font-bold text-[#1b806f]">
                        Lihat profil →
                      </Link>
                    </dd>
                  </div>
                )}
                {report.evidence_photos && report.evidence_photos.length > 0 && (
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wide text-[#78948c]">Bukti</dt>
                    <dd className="text-xs text-[#55736b]">{report.evidence_photos.length} foto terlampir</dd>
                  </div>
                )}
              </dl>

              {report.resolution && (
                <p className="mt-3 rounded-2xl bg-[#f6fbf9] p-3 text-xs text-[#55736b] dark:bg-white/5 dark:text-[#9db8b0]">
                  <span className="font-bold">Resolusi:</span> {report.resolution}
                  {report.resolved_at ? ` · ${new Date(report.resolved_at).toLocaleString('id-ID')}` : ''}
                </p>
              )}

              <ModerationActions reportId={report.id} status={report.status} hasListing={!!report.reported_listing_id} />
            </article>
          ))}
        </div>

        {reports.length === 0 && !error && (
          <p className="mt-4 rounded-3xl border border-dashed border-[#dcebe5] bg-[#f6fbf9] p-10 text-center text-sm text-[#78948c] dark:border-white/10 dark:bg-white/5">
            Belum ada data — tampil apa adanya. Tidak ada laporan dengan status ini.
          </p>
        )}
      </main>
    </AppLayout>
  );
}
