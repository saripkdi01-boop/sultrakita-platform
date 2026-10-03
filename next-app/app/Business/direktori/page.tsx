import type { Metadata } from 'next';
import {
  fetchPublicBusinesses,
  type PublicBusiness,
} from '@/lib/businesses-query';
import DirektoriClient from './direktori-client';

export const metadata: Metadata = {
  title: 'Direktori Bisnis — SUKI Business',
  description:
    'Jelajahi direktori bisnis lokal Sulawesi Tenggara yang terdaftar di SUKI Business. Cari usaha berdasarkan nama, kategori, atau kota.',
  alternates: { canonical: 'https://sukiapps.web.id/Business/direktori' },
  openGraph: {
    title: 'Direktori Bisnis — SUKI Business',
    description:
      'Jelajahi direktori bisnis lokal Sulawesi Tenggara yang terdaftar di SUKI Business.',
    url: 'https://sukiapps.web.id/Business/direktori',
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUKI Apps',
  },
};

const LIMIT = 12;

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export default async function DirektoriPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const category = first(sp.category).trim();
  const city = first(sp.city).trim();
  const page = Math.max(1, Number.parseInt(first(sp.page), 10) || 1);

  // Tabel mungkin belum ada (migrasi belum diterapkan) — jangan 500, tampilkan empty state.
  let items: PublicBusiness[] = [];
  let total = 0;
  let totalPages = 1;
  try {
    const result = await fetchPublicBusinesses({
      q: q || undefined,
      category: category || undefined,
      city: city || undefined,
      page,
      limit: LIMIT,
    });
    items = result.items ?? [];
    total = result.total ?? 0;
    totalPages = Math.max(1, result.totalPages ?? 1);
  } catch {
    items = [];
    total = 0;
    totalPages = 1;
  }

  return (
    <DirektoriClient
      items={items}
      total={total}
      totalPages={totalPages}
      q={q}
      category={category}
      city={city}
      page={page}
    />
  );
}
