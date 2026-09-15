import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beranda SUKI | Bagikan Kabar dan Temukan Informasi Sulawesi Tenggara',
  description: 'Bagikan kabar, temukan informasi, peluang, layanan, dan properti terpercaya dari Sulawesi Tenggara di SUKI Platforms.',
  alternates: { canonical: 'https://sultrakita-platform.vercel.app/beranda' },
  openGraph: {
    title: 'Beranda SUKI | Informasi Sulawesi Tenggara',
    description: 'Bagikan kabar dan temukan informasi, peluang, layanan, serta properti dari Sulawesi Tenggara.',
    url: 'https://sultrakita-platform.vercel.app/beranda',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'SUKI Platforms' }],
  },
  twitter: { card: 'summary_large_image', title: 'Beranda SUKI | Informasi Sulawesi Tenggara', description: 'Bagikan kabar dan temukan informasi, peluang, layanan, serta properti dari Sulawesi Tenggara.', images: ['/og-image.svg'] },
};

export default function BerandaLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
