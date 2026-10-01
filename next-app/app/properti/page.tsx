import type { Metadata } from 'next';
import { getProperties } from '@/lib/actions/property';
import PropertiPageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

const title = 'SUKI Properti — Jual Beli & Sewa Properti Sulawesi Tenggara';
const description = 'Cari rumah, tanah, ruko, dan properti lelang di Sulawesi Tenggara. Data terverifikasi, bisa KPR, dengan peta dan foto lengkap.';

// Fase 1.1: data properti awal di-render di server (ISR, refresh 2 menit) + metadata SEO/OG.
export const revalidate = 120;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/properti` },
  openGraph: { title, description, type: 'website', url: `${siteUrl}/properti`, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default async function PropertiPage() {
  const result = await getProperties();
  return <PropertiPageClient initialProperties={result.ok ? result.data : []} />;
}
