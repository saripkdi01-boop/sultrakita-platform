'use client';

import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Search } from 'lucide-react';
import { BUSINESS_CATEGORIES, type PublicBusiness } from '@/lib/businesses-query';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
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
  const { language } = usePreferences();
  const b = getGroupsLabels(language);
  const initial = (business.name || '?').trim().charAt(0).toUpperCase();
  const meta = [categoryLabel(business.category), business.city].filter(Boolean).join(' · ');
  return (
    <article className="suki-business-card">
      <Link
        href={`/Business/${business.slug}`}
        className="suki-business-card-link"
        aria-label={b.bDirViewProfile.replace('{name}', business.name)}
      >
        <span className="suki-business-card-initial" aria-hidden="true">
          {initial}
        </span>
        <span className="suki-business-card-body">
          <strong className="suki-business-card-name">{business.name}</strong>
          {meta && <span className="suki-business-card-meta">{meta}</span>}
          {business.is_verified && (
            <span className="suki-business-badge-verified">
              <BadgeCheck size={13} aria-hidden="true" /> {b.bDirVerified}
            </span>
          )}
        </span>
      </Link>
    </article>
  );
}

export default function DirektoriClient({
  items,
  total,
  totalPages,
  q,
  category,
  city,
  page,
}: {
  items: PublicBusiness[];
  total: number;
  totalPages: number;
  q: string;
  category: string;
  city: string;
  page: number;
}) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  const base = { q, category, city };
  const hasFilter = Boolean(q || category || city);

  return (
    <div className="suki-business-scope">
      <header className="suki-business-subnav">
        <div className="suki-business-subnav-inner">
          <Link href="/Business" className="suki-business-subnav-brand" aria-label={b.bDirBack}>
            <span className="suki-business-mark" aria-hidden="true"><img src="/suki-logo-mark.svg" alt="" width={36} height={36} /></span>
            <span>
              <strong>SUKI</strong>
              <small>Business</small>
            </span>
          </Link>
          <Link href="/Business/daftar" className="suki-business-subnav-cta">
            {b.bDirCta}
          </Link>
        </div>
      </header>

      <main className="suki-business-dir">
        <Link href="/Business" className="suki-business-back-link">
          <ArrowLeft size={14} aria-hidden="true" /> {b.bDirBack}
        </Link>

        <div className="suki-business-dir-head">
          <p className="suki-business-kicker">
            <span /> {b.bDirKicker}
          </p>
          <h1>{b.bDirTitle}</h1>
          <p>
            {b.bDirDesc}
          </p>
        </div>

        <form
          className="suki-business-dir-filters"
          method="get"
          action="/Business/direktori"
          role="search"
          aria-label={b.bDirSearchAria}
        >
          <label className="suki-business-dir-field">
            <span>{b.bDirFieldName}</span>
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder={b.bDirFieldNamePh}
              autoComplete="off"
            />
          </label>
          <label className="suki-business-dir-field">
            <span>{b.bDirFieldCat}</span>
            <select name="category" defaultValue={category}>
              <option value="">{b.bDirFieldCatAll}</option>
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <label className="suki-business-dir-field">
            <span>{b.bDirFieldCity}</span>
            <input
              type="text"
              name="city"
              defaultValue={city}
              placeholder={b.bDirFieldCityPh}
              autoComplete="off"
            />
          </label>
          <button type="submit" className="suki-business-dir-submit">
            <Search size={16} aria-hidden="true" /> {b.bDirFieldSearch}
          </button>
        </form>

        {items.length > 0 ? (
          <>
            <p className="suki-business-dir-count" role="status">
              {hasFilter
                ? b.bDirCountFiltered.replace('{n}', total.toLocaleString('id-ID'))
                : b.bDirCount.replace('{n}', total.toLocaleString('id-ID'))}
            </p>
            <div className="suki-business-dir-grid">
              {items.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="suki-business-pagination" aria-label={b.bDirPagAria}>
                {page > 1 ? (
                  <Link href={buildPageHref(base, page - 1)} rel="prev">
                    {b.bDirPrev}
                  </Link>
                ) : (
                  <span className="is-disabled" aria-disabled="true">
                    {b.bDirPrev}
                  </span>
                )}
                <span>
                  {b.bDirPageOf.replace('{p}', String(page)).replace('{t}', String(totalPages))}
                </span>
                {page < totalPages ? (
                  <Link href={buildPageHref(base, page + 1)} rel="next">
                    {b.bDirNext}
                  </Link>
                ) : (
                  <span className="is-disabled" aria-disabled="true">
                    {b.bDirNext}
                  </span>
                )}
              </nav>
            )}
          </>
        ) : (
          <div className="suki-business-empty" role="status">
            <strong>
              {hasFilter ? b.bDirEmptyFilterT : b.bDirEmptyAllT}
            </strong>
            {hasFilter ? b.bDirEmptyFilterD : b.bDirEmptyAllD}
            <div className="suki-business-cta-row">
              {hasFilter ? (
                <Link href="/Business/direktori" className="suki-business-dir-submit suki-business-empty-cta">
                  {b.bDirEmptyShowAll}
                </Link>
              ) : (
                <Link href="/Business/daftar" className="suki-business-dir-submit suki-business-empty-cta">
                  {b.bDirEmptyRegister}
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
