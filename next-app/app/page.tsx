import type { Metadata } from 'next';
import HomeClient from './home-client';
import { getHomeStats } from '@/lib/homepage/stats';

// Angka hidup dihitung ulang paling lama tiap 5 menit (ISR) — halaman tetap cepat.
export const revalidate = 300;

const title = 'Suki Apps — Satu Pintu Digital Kendari & Sulawesi Tenggara';
const description =
  'Jualan, cari rumah, cari kerja, gabung komunitas, dan daftarkan usaha di Kendari — satu akun gratis. Butuh website? Harga sama dalam rupiah & dolar: mulai Rp 2,5 jt / $149.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://sukiapps.web.id/' },
  openGraph: {
    title,
    description,
    url: 'https://sukiapps.web.id/',
    siteName: 'Suki Apps',
    locale: 'id_ID',
    type: 'website',
    images: [{ url: '/og-image.png', width: 512, height: 512, alt: 'Logo Suki Apps' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
};

export default async function HomePage() {
  const stats = await getHomeStats();
  return <HomeClient stats={stats} />;
}
