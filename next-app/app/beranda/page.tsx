import type { Metadata } from 'next';
import { getBerandaData } from '@/lib/beranda-data';
import BerandaPageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/suki-logo-mark.png`;

const title = 'SUKI Apps — Platform Digital Sulawesi Tenggara';
const description = 'SUKI Apps: marketplace, properti, lowongan kerja, dan komunitas Sulawesi Tenggara dalam satu platform. Jual beli produk lokal, cari hunian, temukan kerja, bergabung dengan warga.';

// Fase 1.1: hero (produk + event komunitas) di-render di server (ISR, refresh 2 menit)
// + metadata SEO/OG. Feed infinite scroll tetap client-side.
export const revalidate = 120;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/beranda` },
  openGraph: { title, description, type: 'website', url: `${siteUrl}/beranda`, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default async function BerandaPage() {
  const data = await getBerandaData().catch(() => ({ ok: false as const, products: [], events: [] }));
  return <BerandaPageClient initialProducts={data.products} initialEvents={data.events} initialReady={data.ok} />;
}
