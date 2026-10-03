import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, BadgeCheck, Search } from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  fetchPublicBusinesses,
  type PublicBusiness,
} from '@/lib/businesses-query';

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

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
}

function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

function buildPageHref(base: { q: string; category: string; city: string }, page: number): string {
  const params = new URLSearchParams();
  if (base.q) params.set('q', base.q);
  if (base.category) params.set('category', base.category);
  if (base.city) params.set('city', base.city);
  if (page > 1) params.set('page', String(page));
  const query = params.toString();
  return query ? `/Business/direktori?${query}` : '/Business/direktori';
}

function BusinessCard({ business }: { business: PublicBusiness }) {
  const initial = (business.name || '?').trim().charAt(0).toUpperCase();
  const meta = [categoryLabel(business.category), business.city].filter(Boolean).join(' · ');
  return (
    <article className="suki-business-card">
      <Link
        href={`/Business/${business.slug}`}
        className="suki-business-card-link"
        aria-label={`Lihat profil ${business.name}`}
      >
        <span className="suki-business-card-initial" aria-hidden="true">
          {initial}
        </span>
        <span className="suki-business-card-body">
          <strong className="suki-business-card-name">{business.name}</strong>
          {meta && <span className="suki-business-card-meta">{meta}</span>}
          {business.is_verified && (
            <span className="suki-business-badge-verified">
              <BadgeCheck size={13} aria-hidden="true" /> Terverifikasi
            </span>
          )}
        </span>
      </Link>
    </article>
  );
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

  const base = { q, category, city };
  const hasFilter = Boolean(q || category || city);

  return (
    <div className="suki-business-scope">
      <header className="suki-business-subnav">
        <div className="suki-business-subnav-inner">
          <Link href="/Business" className="suki-business-subnav-brand" aria-label="Kembali ke SUKI Business">
            <span className="suki-business-mark" aria-hidden="true"><img src="/suki-logo-mark.svg" alt="" width={36} height={36} /></span>
            <span>
              <strong>SUKI</strong>
              <small>Business</small>
            </span>
          </Link>
          <Link href="/Business/daftar" className="suki-business-subnav-cta">
            Daftarkan bisnis
          </Link>
        </div>
      </header>

      <main className="suki-business-dir">
        <Link href="/Business" className="suki-business-back-link">
          <ArrowLeft size={14} aria-hidden="true" /> SUKI Business
        </Link>

        <div className="suki-business-dir-head">
          <p className="suki-business-kicker">
            <span /> Direktori
          </p>
          <h1>Temukan bisnis lokal di Sultra.</h1>
          <p>
            Usaha yang terdaftar dan terverifikasi di SUKI Business — dari Kendari dan kota lain di
            Sulawesi Tenggara.
          </p>
        </div>

        <form
          className="suki-business-dir-filters"
          method="get"
          action="/Business/direktori"
          role="search"
          aria-label="Cari bisnis"
        >
          <label className="suki-business-dir-field">
            <span>Nama bisnis</span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Contoh: kopi, laundry, bengkel"
              autoComplete="off"
            />
          </label>
          <label className="suki-business-dir-field">
            <span>Kategori</span>
            <select name="category" defaultValue={category}>
              <option value="">Semua kategori</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="suki-business-dir-field">
            <span>Kota</span>
            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder="Contoh: Kendari"
              autoComplete="off"
            />
          </label>
          <button type="submit" className="suki-business-dir-submit">
            <Search size={16} aria-hidden="true" /> Cari
          </button>
        </form>

        {items.length > 0 ? (
          <>
            <p className="suki-business-dir-count" role="status">
              {total.toLocaleString('id-ID')} bisnis ditemukan
              {hasFilter && ' sesuai pencarian Anda'}
            </p>
            <div className="suki-business-dir-grid">
              {items.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="suki-business-pagination" aria-label="Navigasi halaman direktori">
                {page > 1 ? (
                  <Link href={buildPageHref(base, page - 1)} rel="prev">
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="is-disabled" aria-disabled="true">
                    ← Sebelumnya
                  </span>
                )}
                <span>
                  Halaman {page} dari {totalPages}
                </span>
                {page < totalPages ? (
                  <Link href={buildPageHref(base, page + 1)} rel="next">
                    Berikutnya →
                  </Link>
                ) : (
                  <span className="is-disabled" aria-disabled="true">
                    Berikutnya →
                  </span>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="suki-business-empty" role="status">
            <strong>
              {hasFilter
                ? 'Tidak ada bisnis yang cocok dengan pencarian Anda'
                : 'Belum ada bisnis yang terdaftar'}
            </strong>
            {hasFilter
              ? 'Coba ubah kata kunci, kategori, atau kota yang Anda cari.'
              : 'Jadilah yang pertama — daftarkan usaha Anda dan tampil di direktori ini.'}
            <div className="suki-business-cta-row">
              {hasFilter ? (
                <Link href="/Business/direktori" className="suki-business-dir-submit suki-business-empty-cta">
                  Tampilkan semua bisnis
                </Link>
              ) : (
                <Link href="/Business/daftar" className="suki-business-dir-submit suki-business-empty-cta">
                  Daftarkan bisnis Anda
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
