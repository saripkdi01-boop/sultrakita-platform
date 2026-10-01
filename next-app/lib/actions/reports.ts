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

/**
 * Mencatat laporan konten ke tabel analytics_events (event report_content)
 * untuk ditinjau tim moderasi. Server action — CSRF ditangani Next.js.
 * Tidak pernah melempar; kegagalan dilaporkan lewat { ok: false }.
 */
export async function reportPost(postId: string, reason: string): Promise<{ ok: boolean; message: string }> {
  if (!ID_RE.test(postId)) return { ok: false, message: 'Postingan tidak valid.' };
  if (!(REASONS as readonly string[]).includes(reason)) return { ok: false, message: 'Alasan laporan tidak valid.' };
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
    return { ok: true, message: 'Terima kasih. Laporan dicatat dan akan ditinjau moderasi.' };
  } catch {
    return { ok: false, message: 'Laporan belum dapat dicatat. Coba lagi nanti.' };
  }
}
