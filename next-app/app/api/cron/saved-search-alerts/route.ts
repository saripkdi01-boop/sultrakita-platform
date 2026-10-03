import { NextRequest, NextResponse } from 'next/server';
import { runSavedSearchAlerts } from '@/lib/saved-search-matcher';

// Fase 2.6: cron per jam — cocokkan saved_searches dengan listing baru,
// kirim notifikasi in-app (tabel notifications).
// Dijadwalkan di .github/workflows/saved-search-alerts.yml (GitHub Actions,
// per jam) — BUKAN Vercel Cron. Actions mengirim
// `Authorization: Bearer <CRON_SECRET>` (secret repo CRON_SECRET).
// Bila CRON_SECRET belum di-set di environment: skip graceful (bukan error),
// agar deploy tanpa konfigurasi cron tetap hijau.

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'CRON_SECRET belum dikonfigurasi di environment — alert pencarian dinonaktifkan.' });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Tidak berwenang.' }, { status: 401 });
  }
  try {
    const result = await runSavedSearchAlerts();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, error: 'Gagal menjalankan pencocokan alert.' }, { status: 500 });
  }
}
