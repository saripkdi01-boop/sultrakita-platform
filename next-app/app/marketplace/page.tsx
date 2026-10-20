import type { Metadata } from 'next';
import { fetchPublicListings } from '@/lib/listings-query';
import { AppLayout } from '@/components/layout/AppLayout';
import MarketplacePageClient from './page-client';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

// Fase 1.1: halaman dirender di server — data listing awal diambil saat request
// (SSR), SEO metadata + OG hadir di HTML, client hanya me-hydrate.
// Fase 2.1: filter tersinkron URL (?q=&category=&minPrice=&maxPrice=&condition=&district=&sort=)
// + alias pendek (cat/min/max/kondisi). Shareable, tombol back browser benar,
// halaman kategori dapat diindeks Google.

export type MarketplaceFilters = {
  q: string;
  district: string;
  category: string;
  condition: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
};

const SORTS = ['terbaru', 'termurah', 'termahal'] as const;

function pick(value: string | string[] | undefined): string {
  const single = Array.isArray(value) ? value[0] : value;
  return (single || '').trim();
}

function parseFilters(params: Record<string, string | string[] | undefined>): MarketplaceFilters {
  const sort = pick(params.sort).toLowerCase();
  return {
    q: pick(params.q),
    district: pick(params.district) || 'Semua distrik',
    category: pick(params.category) || pick(params.cat),
    condition: pick(params.condition) || pick(params.kondisi),
    minPrice: pick(params.minPrice) || pick(params.min),
    maxPrice: pick(params.maxPrice) || pick(params.max),
    sort: (SORTS as readonly string[]).includes(sort) ? sort : 'terbaru',
  };
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const filters = parseFilters(await searchParams);
  const title = filters.q
    ? `Jual beli ${filters.q} di Sulawesi Tenggara | SUKI Marketplace`
    : filters.category
      ? `Kategori ${filters.category} | SUKI Marketplace`
      : 'SUKI Marketplace — Jual Beli Produk Lokal Sulawesi Tenggara';
  const description = 'Marketplace SUKI: jual beli produk, kuliner, dan jasa lokal Sulawesi Tenggara langsung dari penjual terverifikasi.';
  // Canonical menyertakan kategori agar halaman kategori terindeks sebagai satu URL.
  const canonical = filters.category ? `${siteUrl}/marketplace?category=${encodeURIComponent(filters.category)}` : `${siteUrl}/marketplace`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website', url: canonical, siteName: 'SUKI Apps', locale: 'id_ID', images: [{ url: ogImage, alt: 'SUKI Apps' }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function MarketplacePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseFilters(await searchParams);
  const result = await fetchPublicListings({
    q: filters.q || undefined,
    district: filters.district !== 'Semua distrik' ? filters.district : undefined,
    category: filters.category || undefined,
    condition: filters.condition || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    limit: 30,
    sort: filters.sort,
  });
  const initialItems = result.ok && 'items' in result ? (result.items as never[]) : [];
  const initialNotice = result.ok ? ('warning' in result ? result.warning : '') : result.error;

  // Fase 2.7: JSON-LD ItemList > Product — HANYA dengan harga asli (integer IDR).
  // Tanpa harga 0 dan tanpa klaim ketersediaan palsu.
  // Fix Search Console (20 Okt 2026): "image" adalah field KRITIS Listingan
  // penjual — listing tanpa foto asli dikeluarkan dari JSON-LD (halaman tetap
  // menampilkannya seperti biasa). Field tambahan hanya dari data nyata:
  // description listing, itemCondition dari kondisi barang, availability dari
  // stock_quantity bila terbaca (listing di query ini berstatus published/
  // active = sedang ditawarkan, jadi InStock). brand/GTIN,
  // hasMerchantReturnPolicy, shippingDetails, aggregateRating & review
  // SENGAJA tidak diisi — platform C2C tidak punya datanya (transaksi
  // langsung penjual-pembeli); mengarangnya melanggar pedoman Google.
  const jsonLdEntries = (result.ok && 'items' in result ? result.items : [])
    .map((item) => ({
      item,
      price: Math.trunc(Number(item.price) || 0),
      image: item.images?.[0] || item.thumbnail_url || undefined,
    }))
    .filter((entry) => entry.image && entry.price > 0)
    .slice(0, 20);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: jsonLdEntries.map(({ item, price, image }, index) => {
      const url = `${siteUrl}/marketplace?listing=${encodeURIComponent(String(item.id))}`;
      const description = typeof item.description === 'string' ? item.description.trim() : '';
      const condition = typeof item.condition === 'string' ? item.condition : '';
      const stock = typeof item.stock_quantity === 'number' ? item.stock_quantity : null;
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: item.title,
          image,
          ...(description ? { description: description.slice(0, 500) } : {}),
          url,
          offers: {
            '@type': 'Offer',
            price,
            priceCurrency: 'IDR',
            url,
            availability: stock !== null && stock <= 0 ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            ...(condition === 'new'
              ? { itemCondition: 'https://schema.org/NewCondition' }
              : condition
                ? { itemCondition: 'https://schema.org/UsedCondition' }
                : {}),
          },
        },
      };
    }),
  };

  return (
    <AppLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <MarketplacePageClient initialItems={initialItems} initialFilters={filters} initialNotice={initialNotice} />
    </AppLayout>
  );
}

