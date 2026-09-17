import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'SUKI Apps — Ekosistem Digital Sulawesi Tenggara',
  description:
    'Temukan produk lokal, properti, peluang kerja, komunitas, dan layanan bisnis dalam satu ekosistem digital Sulawesi Tenggara.',
  alternates: { canonical: 'https://sukiapps.web.id/' },
  openGraph: {
    title: 'SUKI Apps — Ekosistem Digital Sulawesi Tenggara',
    description:
      'Satu ruang digital untuk menemukan, terhubung, dan bertumbuh bersama ekosistem lokal Sulawesi Tenggara.',
    url: 'https://sukiapps.web.id/',
    siteName: 'SUKI Apps',
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUKI Apps — Ekosistem Digital Sulawesi Tenggara',
    description:
      'Temukan produk lokal, properti, peluang, komunitas, dan layanan bisnis di satu ekosistem.',
  },
};

export default function HomePage() {
  return <HomeClient />;
}
