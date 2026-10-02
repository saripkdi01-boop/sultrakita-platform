import type { Metadata } from 'next';
import CreateListingForm from './create-form';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');

export const metadata: Metadata = {
  title: 'Jual di Marketplace | SUKI Apps',
  description:
    'Pasang listing produk dan jasa lokal Sulawesi Tenggara di SUKI Marketplace — gratis, langsung tampil setelah terbit.',
  alternates: { canonical: '/marketplace/create' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Jual di Marketplace Sultra | SUKI Apps',
    description: 'Pasang listing produk & jasa lokal — gratis dan langsung tampil.',
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUKI Apps',
    url: `${siteUrl}/marketplace/create`,
  },
};

export default function MarketplaceCreatePage() {
  return <CreateListingForm />;
}
