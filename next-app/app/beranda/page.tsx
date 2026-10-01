import type { Metadata } from 'next';
import BerandaPageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/suki-logo-mark.png`;

const title = 'Beranda — Cerita Warga Sulawesi Tenggara | SUKI Apps';
const description = 'Feed sosial SUKI Apps: kabar, cerita, dan percakapan terbaru dari warga Sulawesi Tenggara. Bagikan ceritamu, ikuti warga, dan temukan komunitas lokal.';

// Feed sosial content-first (ISR 120 dtk) + metadata SEO/OG.
// Infinite scroll, filter, dan interaksi feed berjalan client-side.
export const revalidate = 120;
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${siteUrl}/beranda` },
  openGraph: { title, description, type: 'website', url: `${siteUrl}/beranda`, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default function BerandaPage() {
  return <BerandaPageClient />;
}
