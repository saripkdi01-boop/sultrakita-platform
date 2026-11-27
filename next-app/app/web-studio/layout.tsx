import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SUKI Web Studio — Jasa Pembuatan Website untuk UMKM & Bisnis Indonesia',
  description:
    'SUKI Web Studio: jasa pembuatan website profesional — website, AI web app, SaaS platform, dan care plan maintenance. Satu harga dalam rupiah & dolar: Website Rp 2,5 jt ($149), konsultasi via WhatsApp.',
  alternates: {
    canonical: 'https://sukiapps.web.id/web-studio',
  },
  openGraph: {
    title: 'SUKI Web Studio — Jasa Pembuatan Website untuk UMKM & Bisnis Indonesia',
    description:
      'Website, AI web app, dan SaaS platform. Website Rp 2,5 jt ($149). Konsultasi via WhatsApp.',
    url: 'https://sukiapps.web.id/web-studio',
    type: 'website',
  },
};

export default function WebStudioLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
