'use server';

import { getServerSupabase } from '@/lib/supabase/server';
import { trackEvent } from '@/lib/analytics/events';

// Alasan laporan terkontrol (bukan teks bebas) — sesuai kontrak event
// report_content di lib/analytics/events.ts.
const REASONS = ['spam', 'konten_menyesatkan', 'ujaran_kebencian', 'konten_tidak_pantas', 'lainnya'] as const;
export type ReportReason = (typeof REASONS)[number];
export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam atau promosi mengganggu',
  konten_menyesatkan: 'Konten menyesatkan',
  ujaran_kebencian: 'Ujaran kebencian',
  konten_tidak_pantas: 'Konten tidak pantas',
  lainnya: 'Lainnya',
};

const ID_RE = /^[a-zA-Z0-9_-]{1,120}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Menulis laporan ke antrean moderasi admin (tabel public.marketplace_reports)
 * yang dibaca halaman /admin/moderation. Tidak memakai reported_listing_id
 * (FK bertipe uuid sementara listings.id di produksi bertipe bigint — lihat
 * catatan migrasi 2026-10-01); referensi target disimpan di description agar
 * aman dari mismatch tipe. Best-effort: kegagalan tidak melempar.
 */
async function insertModerationQueue(input: {
  reporterId: string;
  reasonLabel: string;
  description: string;
  reportedUserId?: string | null;
}): Promise<boolean> {
  try {
    const supabase = await getServerSupabase();
    const reportedUserId =
      input.reportedUserId && UUID_RE.test(input.reportedUserId) ? input.reportedUserId : null;
    const { error } = await supabase.from('marketplace_reports').insert({
      reporter_id: input.reporterId,
      reported_user_id: reportedUserId,
      reason: input.reasonLabel,
      description: input.description,
      status: 'pending',
    });
    return !error;
  } catch {
    return false;
  }
}

function validReason(reason: string): reason is ReportReason {
  return (REASONS as readonly string[]).includes(reason);
}

/**
 * Mencatat laporan konten ke tabel analytics_events (event report_content)
 * untuk ditinjau tim moderasi. Server action — CSRF ditangani Next.js.
 * Tidak pernah melempar; kegagalan dilaporkan lewat { ok: false }.
 */
export async function reportPost(postId: string, reason: string): Promise<{ ok: boolean; message: string }> {
  if (!ID_RE.test(postId)) return { ok: false, message: 'Postingan tidak valid.' };
  if (!validReason(reason)) return { ok: false, message: 'Alasan laporan tidak valid.' };
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    const result = await trackEvent(supabase, {
      eventName: 'report_content',
      userId: user?.id ?? null,
      props: { target_type: 'post', target_id: postId, reason },
      path: '/beranda',
    });
    if (!result.ok) return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
    // Masukkan juga ke antrean moderasi admin agar satu pintu dengan laporan listing.
    if (user?.id) {
      await insertModerationQueue({
        reporterId: user.id,
        reasonLabel: REPORT_REASON_LABELS[reason],
        description: `Feed post ID: ${postId} (dilaporkan dari /beranda)`,
      });
    }
    return { ok: true, message: 'Terima kasih. Laporan dicatat dan akan ditinjau moderasi.' };
  } catch {
    return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
  }
}

/**
 * Melaporkan listing marketplace ke antrean moderasi admin.
 * Wajib login (RLS marketplace_reports hanya mengizinkan reporter).
 */
export async function reportListing(
  listingId: string,
  reason: string,
  reportedUserId?: string,
): Promise<{ ok: boolean; message: string }> {
  if (!ID_RE.test(listingId)) return { ok: false, message: 'Listing tidak valid.' };
  if (!validReason(reason)) return { ok: false, message: 'Alasan laporan tidak valid.' };
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return { ok: false, message: 'Silakan masuk terlebih dahulu untuk melaporkan.' };
    const ok = await insertModerationQueue({
      reporterId: user.id,
      reasonLabel: REPORT_REASON_LABELS[reason],
      description: `Marketplace listing ID: ${listingId} (dilaporkan dari /marketplace)`,
      reportedUserId: reportedUserId ?? null,
    });
    if (!ok) return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
    return { ok: true, message: 'Terima kasih. Laporan listing dicatat dan akan ditinjau moderasi.' };
  } catch {
    return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
  }
}

/**
 * Melaporkan listing properti ke antrean moderasi admin.
 * Wajib login (RLS marketplace_reports hanya mengizinkan reporter).
 */
export async function reportProperty(
  propertyId: string,
  reason: string,
): Promise<{ ok: boolean; message: string }> {
  if (!ID_RE.test(propertyId)) return { ok: false, message: 'Properti tidak valid.' };
  if (!validReason(reason)) return { ok: false, message: 'Alasan laporan tidak valid.' };
  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) return { ok: false, message: 'Silakan masuk terlebih dahulu untuk melaporkan.' };
    const ok = await insertModerationQueue({
      reporterId: user.id,
      reasonLabel: REPORT_REASON_LABELS[reason],
      description: `Properti ID: ${propertyId} (dilaporkan dari /properti)`,
    });
    if (!ok) return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
    return { ok: true, message: 'Terima kasih. Laporan properti dicatat dan akan ditinjau moderasi.' };
  } catch {
    return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
  }
}
