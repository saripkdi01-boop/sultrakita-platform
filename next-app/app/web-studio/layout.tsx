import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SUKI Web Studio — Jasa Pembuatan Website untuk UMKM & Bisnis Indonesia',
  description:
    'SUKI Web Studio: jasa pembuatan website profesional — landing page, company profile, toko online, web aplikasi custom, dan care plan maintenance. Harga transparan dalam rupiah, konsultasi gratis via WhatsApp.',
  alternates: {
    canonical: 'https://sukiapps.web.id/web-studio',
  },
  openGraph: {
    title: 'SUKI Web Studio — Jasa Pembuatan Website untuk UMKM & Bisnis Indonesia',
    description:
      'Landing page, company profile, toko online, web aplikasi custom. Harga mulai Rp 1,5 juta. Konsultasi gratis via WhatsApp.',
    url: 'https://sukiapps.web.id/web-studio',
    type: 'website',
  },
};

export default function WebStudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
