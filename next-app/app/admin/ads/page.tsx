import { AppLayout } from '@/components/layout/AppLayout';
import { listAdPlacements, listHouseAds } from '@/lib/actions/ads';
import { AdminAdsClient } from './AdminAdsClient';

export const dynamic = 'force-dynamic';

// Dilindungi admin/layout.tsx (requireAdminUser). Halaman ini TIDAK
// menampilkan slot iklan — AdSlot me-return null di path /admin/*.
export default async function AdminAdsPage() {
  const [placementsResult, adsResult] = await Promise.all([listAdPlacements(), listHouseAds()]);

  return (
    <AppLayout active="home">
      <main className="platform-shell mx-auto max-w-6xl">
        <section className="rounded-3xl bg-[#123f38] p-6 text-white shadow-xl shadow-[#123f38]/10 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-[#bce8d8]">SUKI OPERATIONS CENTER</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Monetisasi iklan</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f1e8]">
            Kelola provider per placement (AdSense / house ads / nonaktif) dan kreatif sponsor langsung (UMKM lokal).
            Publisher ID AdSense diatur lewat env <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> — bukan di sini.
          </p>
        </section>

        <AdminAdsClient
          initialPlacements={placementsResult.ok ? placementsResult.placements : []}
          placementsError={placementsResult.ok ? null : placementsResult.error}
          initialAds={adsResult.ok ? adsResult.ads : []}
          adsError={adsResult.ok ? null : adsResult.error}
        />
      </main>
    </AppLayout>
  );
}
