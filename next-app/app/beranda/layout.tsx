import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Beranda SUKI | Cerita, Komunitas, dan Properti Sulawesi Tenggara',
  description: 'Temukan cerita warga, komunitas, layanan, dan properti terpercaya dari Sulawesi Tenggara di SUKI Platforms.',
  alternates: { canonical: 'https://sultrakita-platform.vercel.app/beranda' },
  openGraph: {
    title: 'Beranda SUKI Platforms',
    description: 'Ruang warga untuk menemukan cerita, komunitas, layanan, dan properti Sulawesi Tenggara.',
    url: 'https://sultrakita-platform.vercel.app/beranda',
    type: 'website',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'SUKI Platforms' }],
  },
  twitter: { card: 'summary_large_image', title: 'Beranda SUKI Platforms', description: 'Cerita dan layanan Sulawesi Tenggara dalam satu ruang warga.', images: ['/og-image.svg'] },
};

export default function BerandaLayout({ children }: Readonly<{ children: React.ReactNode }>) { return children; }
