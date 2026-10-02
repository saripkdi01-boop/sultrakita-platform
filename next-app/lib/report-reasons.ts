/**
 * Alasan laporan konten — modul data MURNI (TANPA 'use server').
 *
 * DIPISAH dari lib/actions/reports.ts dengan sengaja: file 'use server'
 * HANYA boleh mengekspor fungsi async (aturan Next.js — pelanggaran
 * menyebabkan 500 saat route dimuat, insiden /beranda 2026-10-02).
 * Konstanta label dipakai komponen client (FeedPost, ReportButton), jadi
 * harus tinggal di modul biasa yang aman diimpor dari mana saja.
 */

// Alasan laporan terkontrol (bukan teks bebas) — sesuai kontrak event
// report_content di lib/analytics/events.ts.
export const REPORT_REASONS = [
  'spam',
  'konten_menyesatkan',
  'ujaran_kebencian',
  'konten_tidak_pantas',
  'lainnya',
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: 'Spam atau promosi mengganggu',
  konten_menyesatkan: 'Konten menyesatkan',
  ujaran_kebencian: 'Ujaran kebencian',
  konten_tidak_pantas: 'Konten tidak pantas',
  lainnya: 'Lainnya',
};

export function isValidReportReason(reason: string): reason is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(reason);
}
