import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sultrakita-platform-28icbgib9-saripkdi01-boops-projects.vercel.app'),
  title: 'Marketplace Sultra | Produk Lokal Sulawesi Tenggara',
  description: 'Temukan produk, jasa, kendaraan, properti, dan penawaran lokal terpercaya dari Kendari, Baubau, Kolaka, Konawe, dan seluruh Sulawesi Tenggara.',
  keywords: ['marketplace Sultra', 'jual beli Kendari', 'produk lokal Sulawesi Tenggara', 'SUKI Marketplace'],
  alternates: { canonical: '/marketplace' },
  openGraph: { title: 'Marketplace Sultra | Produk Lokal Sulawesi Tenggara', description: 'Belanja dekat dan dukung usaha lokal Sulawesi Tenggara.', type: 'website', locale: 'id_ID', siteName: 'SUKI Platforms', url: '/marketplace' },
  twitter: { card: 'summary', title: 'Marketplace Sultra | SUKI Platforms', description: 'Temukan produk dan jasa lokal terpercaya dari Sulawesi Tenggara.' },
};

const structuredData = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'SUKI Marketplace', description: 'Marketplace produk dan jasa lokal Sulawesi Tenggara.', url: '/marketplace', inLanguage: 'id-ID', about: { '@type': 'Place', name: 'Sulawesi Tenggara', address: { '@type': 'PostalAddress', addressRegion: 'Sulawesi Tenggara', addressCountry: 'ID' } }, isPartOf: { '@type': 'WebSite', name: 'SUKI Platforms' } };

export default function MarketplaceLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /></>; }
