import './business-wc.css';
import type { Metadata } from 'next';
import BusinessLandingClient from './landing-client';
import {
  fetchBusinessStats,
  fetchPublicBusinesses,
  type PublicBusiness,
} from '@/lib/businesses-query';

export const metadata: Metadata = {
  title: 'SUKI Business — Ruang tumbuh untuk bisnis lokal',
  description:
    'Bangun kehadiran bisnis yang lebih dekat dengan warga Sulawesi Tenggara melalui SUKI Business. Jelajahi direktori bisnis lokal atau daftarkan usaha Anda.',
  alternates: { canonical: 'https://sukiapps.web.id/Business' },
  openGraph: {
    title: 'SUKI Business — Ruang tumbuh untuk bisnis lokal',
    description:
      'Bangun kehadiran bisnis yang lebih dekat dengan warga Sulawesi Tenggara melalui SUKI Business.',
    url: 'https://sukiapps.web.id/Business',
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUKI Apps',
  },
};

/** Statistik & bisnis unggulan — gagal diam-diam (fallback disembunyikan), jangan 500. */
async function getLiveData(): Promise<{
  stats: { total: number; cities: number } | null;
  featured: PublicBusiness[];
}> {
  try {
    const [stats, featured] = await Promise.all([
      fetchBusinessStats(),
      fetchPublicBusinesses({ featuredOnly: true, limit: 6 }),
    ]);
    return { stats, featured: featured.items ?? [] };
  } catch {
    return { stats: null, featured: [] };
  }
}

export default async function BusinessPage() {
  const { stats, featured } = await getLiveData();
  return <BusinessLandingClient stats={stats} featured={featured} />;
}
