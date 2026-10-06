import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchBusinessBySlug,
  type PublicBusiness,
} from '@/lib/businesses-query';
import BusinessProfileClient from './profile-client';

type Params = { params: Promise<{ slug: string }> };

async function getBusiness(slug: string): Promise<PublicBusiness | null> {
  try {
    return await fetchBusinessBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) {
    return { title: 'Bisnis tidak ditemukan — SUKI Business' };
  }
  const description =
    (business.description || '').trim().slice(0, 155) ||
    `Profil ${business.name} di direktori SUKI Business.`;
  return {
    title: `${business.name} — SUKI Business`,
    description,
    alternates: { canonical: `https://sukiapps.web.id/Business/${business.slug}` },
    openGraph: {
      title: `${business.name} — SUKI Business`,
      description,
      url: `https://sukiapps.web.id/Business/${business.slug}`,
      type: 'website',
      locale: 'id_ID',
      siteName: 'SUKI Apps',
      images: business.logo_url || business.cover_url ? [{ url: (business.logo_url || business.cover_url) as string }] : undefined,
    },
  };
}

export default async function BusinessProfilePage({ params }: Params) {
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) notFound();

  return <BusinessProfileClient business={business} />;
}
