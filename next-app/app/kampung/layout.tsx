import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SUKI Kampung — Main Bersama, Bangun Bersama',
  description:
    'Bangun kampung tropis virtual khas Sulawesi Tenggara: bangun dan upgrade bangunan, panen Koin SUKI, selesaikan misi harian, dan uji pengetahuan lewat Kuis Sultra. Prototipe playable Fase 1 SUKI Apps.',
  openGraph: {
    title: 'SUKI Kampung — Main Bersama, Bangun Bersama',
    description:
      'Game simulasi kampung tropis SUKI Apps: bangun, panen, misi harian, dan Kuis Sultra.',
  },
};

export default function KampungLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
