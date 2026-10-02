import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/kampung/status
 *
 * Status jujur backend SUKI Kampung. Fase 1 = mode demo (tanpa backend);
 * endpoint game yang sebenarnya (profil, kampung, quest, minigame-submit,
 * referral, reward) BELUM diimplementasikan — kontraknya ada di
 * ~/workspace/your_files/suki-kampung/docs/04-SPESIFIKASI-API.md.
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    data: {
      game: 'suki-kampung',
      phase: 1,
      mode: 'demo',
      backend: 'not-implemented',
      message:
        'Fase 1 berjalan sebagai prototipe demo: progres tersimpan di perangkat pemain. ' +
        'Endpoint server-side (state otoritatif, validasi skor, referral) belum tersedia.',
      docs: '~/workspace/your_files/suki-kampung/docs/04-SPESIFIKASI-API.md',
      checkedAt: new Date().toISOString(),
    },
  });
}
