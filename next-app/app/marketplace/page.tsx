import type { Metadata } from 'next';
import { fetchPublicListings } from '@/lib/listings-query';
import MarketplacePageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/suki-logo-mark.png`;

// Fase 1.1: halaman dirender di server — data listing awal diambil saat request
// (SSR), SEO metadata + OG hadir di HTML, client hanya me-hydrate.
export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const params = await searchParams;
  const q = Array.isArray(params.q) ? params.q[0] : params.q;
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const title = q
    ? `Jual beli ${q} di Sulawesi Tenggara | SUKI Marketplace`
    : category
      ? `Kategori ${category} | SUKI Marketplace`
      : 'SUKI Marketplace — Jual Beli Produk Lokal Sulawesi Tenggara';
  const description = 'Marketplace SUKI: jual beli produk, kuliner, dan jasa lokal Sulawesi Tenggara langsung dari penjual terverifikasi.';
  const canonical = `${siteUrl}/marketplace`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website', url: canonical, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const pick = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const result = await fetchPublicListings({
    q: pick(params.q),
    district: pick(params.district),
    category: pick(params.category),
    condition: pick(params.condition),
    minPrice: params.minPrice ? Number(pick(params.minPrice)) : undefined,
    maxPrice: params.maxPrice ? Number(pick(params.maxPrice)) : undefined,
    limit: 30,
  });
  const initialItems = result.ok && 'items' in result ? (result.items as never[]) : [];
  const initialNotice = result.ok ? ('warning' in result ? result.warning : '') : result.error;
  return <MarketplacePageClient initialItems={initialItems} initialNotice={initialNotice} />;
}
