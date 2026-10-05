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
    images: [
      {
        url: '/og-image.png',
        // Audit 2026-10-06 (P0-SEO): dimensi aktual public/og-image.png
        // adalah 1200x630. Nilai 512x512 sebelumnya membuat preview
        // WhatsApp/Twitter terpotong atau tidak tampil optimal.
        width: 1200,
        height: 630,
        alt: 'Logo SUKI Apps',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUKI Apps — Ekosistem Digital Sulawesi Tenggara',
    description:
      'Temukan produk lokal, properti, peluang, komunitas, dan layanan bisnis di satu ekosistem.',
    images: ['/og-image.png'],
  },
};

export default function HomePage() {
  // Audit 2026-10-06 (P1-SEO): JSON-LD Organization + WebSite agar Google
  // memahami identitas situs (knowledge panel, sitelinks searchbox).
  // String di-escape (< -> \u003c) agar aman dari injeksi walau statis.
  const siteUrl = 'https://sukiapps.web.id';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'SUKI Apps',
        alternateName: 'SULTRAKITA',
        url: `${siteUrl}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
        },
        description:
          'Ekosistem digital Sulawesi Tenggara: marketplace lokal, properti, lowongan kerja, komunitas, dan direktori bisnis.',
        areaServed: {
          '@type': 'AdministrativeArea',
          name: 'Sulawesi Tenggara',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'SUKI Apps',
        publisher: { '@id': `${siteUrl}/#organization` },
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/marketplace?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <HomeClient />
    </>
  );
}
