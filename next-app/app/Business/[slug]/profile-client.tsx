'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  BadgeCheck,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  type PublicBusiness,
} from '@/lib/businesses-query';
import InquiryForm from './inquiry-form';
import { toWaDigits, waLink } from '@/lib/whatsapp';
import { usePreferences } from '@/lib/preferences';
import { getGroupsLabels } from '@/lib/i18n/dict-groups';

const DAY_KEYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'] as const;
const DAY_I18N: Record<string, string> = {
  senin: 'bDayMon',
  selasa: 'bDayTue',
  rabu: 'bDayWed',
  kamis: 'bDayThu',
  jumat: 'bDayFri',
  sabtu: 'bDaySat',
  minggu: 'bDaySun',
};

type HoursValue = { open?: string; close?: string } | string | null | undefined;

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
}

function parseHours(hours: unknown): Record<string, HoursValue> | null {
  if (!hours || typeof hours !== 'object' || Array.isArray(hours)) return null;
  return hours as Record<string, HoursValue>;
}

function normalizeWebsite(url: string | null | undefined): string | null {
  const raw = (url || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export default function BusinessProfileClient({ business }: { business: PublicBusiness }) {
  const { language } = usePreferences();
  const b = getGroupsLabels(language);

  const initial = (business.name || '?').trim().charAt(0).toUpperCase();
  const hours = parseHours(business.hours);
  const location = [business.city, business.province].filter(Boolean).join(', ');
  const website = normalizeWebsite(business.website);
  const waDigits = toWaDigits(business.whatsapp);
  // Pesan terisi otomatis supaya inquiry dari SUKI langsung jelas konteksnya.
  const waHref = waDigits ? waLink(waDigits, b.bProfWaMessage.replace('{name}', business.name)) : null;
  const lat = typeof business.latitude === 'number' ? business.latitude : null;
  const lng = typeof business.longitude === 'number' ? business.longitude : null;
  const mapHref =
    lat !== null && lng !== null
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : business.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
        : null;

  function formatHourValue(value: HoursValue): { text: string; closed: boolean } {
    if (value === null || value === undefined) return { text: b.bProfClosed, closed: true };
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === '' || v === 'tutup' || v === 'closed' || v === '-') return { text: b.bProfClosed, closed: true };
      return { text: value.trim(), closed: false };
    }
    const open = (value.open || '').trim();
    const close = (value.close || '').trim();
    if (!open && !close) return { text: b.bProfClosed, closed: true };
    return { text: close ? `${open} – ${close}` : open, closed: false };
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    description: business.description || undefined,
    url: `https://sukiapps.web.id/Business/${business.slug}`,
    image: business.logo_url || business.cover_url || undefined,
    telephone: business.phone || undefined,
    email: business.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address || undefined,
      addressLocality: business.city || undefined,
      addressRegion: business.province || undefined,
      addressCountry: 'ID',
    },
    geo:
      lat !== null && lng !== null
        ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lng }
        : undefined,
  };

  return (
    <div className="suki-business-scope">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="suki-business-subnav">
        <div className="suki-business-subnav-inner">
          <Link href="/Business" className="suki-business-subnav-brand" aria-label={b.bProfBack}>
            <span className="suki-business-mark" aria-hidden="true"><img src="/suki-logo-mark.svg" alt="" width={36} height={36} /></span>
            <span>
              <strong>SUKI</strong>
              <small>Business</small>
            </span>
          </Link>
          <Link href="/Business/daftar" className="suki-business-subnav-cta">
            {b.bProfRegister}
          </Link>
        </div>
      </header>

      <main className="suki-business-profile">
        <Link href="/Business/direktori" className="suki-business-back-link">
          <ArrowLeft size={14} aria-hidden="true" /> {b.bProfDirLink}
        </Link>

        {business.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.cover_url}
            alt={b.bProfCoverAlt.replace('{name}', business.name)}
            className="suki-business-profile-cover"
          />
        )}

        <div className="suki-business-profile-head">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={b.bProfLogoAlt.replace('{name}', business.name)}
              className="suki-business-profile-logo"
            />
          ) : (
            <span className="suki-business-profile-logo" aria-hidden="true">
              {initial}
            </span>
          )}
          <div>
            <h1 className="suki-business-profile-name">{business.name}</h1>
            <div className="suki-business-profile-sub">
              {business.is_verified && (
                <span className="suki-business-badge-verified">
                  <BadgeCheck size={13} aria-hidden="true" /> {b.bProfVerified}
                </span>
              )}
              {categoryLabel(business.category) && <span>{categoryLabel(business.category)}</span>}
              {location && (
                <span className="suki-business-profile-location">
                  <MapPin size={13} aria-hidden="true" /> {location}
                </span>
              )}
            </div>
          </div>
        </div>

        {business.address && (
          <p className="suki-business-profile-address">
            <MapPin size={15} aria-hidden="true" /> {business.address}
          </p>
        )}

        {mapHref && (
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="suki-business-map-link"
          >
            <MapPin size={14} aria-hidden="true" /> {b.bProfMapLink}
          </a>
        )}

        <div className="suki-business-profile-layout">
          <div>
            {business.description && (
              <section className="suki-business-profile-section" aria-labelledby="tentang-heading">
                <h2 id="tentang-heading">{b.bProfAbout}</h2>
                <p className="suki-business-profile-desc">{business.description}</p>
              </section>
            )}

            {hours && (
              <section className="suki-business-profile-section" aria-labelledby="jam-heading">
                <h2 id="jam-heading">{b.bProfHours}</h2>
                <dl className="suki-business-hours-list">
                  {DAY_KEYS.map((key) => {
                    const { text, closed } = formatHourValue(hours[key]);
                    const label = (b as Record<string, string>)[DAY_I18N[key]] ?? key;
                    return (
                      <div className="suki-business-hours-row" key={key}>
                        <dt>{label}</dt>
                        <dd className={closed ? 'suki-business-hours-closed' : undefined}>{text}</dd>
                      </div>
                    );
                  })}
                </dl>
              </section>
            )}

            <section className="suki-business-profile-section" aria-labelledby="tanya-heading">
              <h2 id="tanya-heading">{b.bProfAsk}</h2>
              <p className="suki-business-profile-desc suki-business-inquiry-lead">
                {b.bProfAskLead.replace('{name}', business.name)}
              </p>
              <InquiryForm businessId={business.id} businessName={business.name} />
            </section>
          </div>

          <aside
            className="suki-business-profile-section suki-business-contact"
            aria-labelledby="kontak-heading"
          >
            <h2 id="kontak-heading">{b.bProfContact}</h2>
            <div className="suki-business-contact-grid">
              {business.phone && (
                <a href={`tel:${business.phone.replace(/[\s()-]/g, '')}`} className="suki-business-contact-btn is-primary">
                  <Phone size={17} aria-hidden="true" />
                  <span>
                    {b.bProfCall}
                    <small>{business.phone}</small>
                  </span>
                </a>
              )}
              {waHref && (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="suki-business-contact-btn"
                >
                  <MessageCircle size={17} aria-hidden="true" />
                  <span>
                    {b.bProfWa}
                    <small>{b.bProfWaChat}</small>
                  </span>
                </a>
              )}
              {business.email && (
                <a href={`mailto:${business.email}`} className="suki-business-contact-btn">
                  <Mail size={17} aria-hidden="true" />
                  <span>
                    {b.bProfEmail}
                    <small>{business.email}</small>
                  </span>
                </a>
              )}
              {website && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="suki-business-contact-btn"
                >
                  <Globe size={17} aria-hidden="true" />
                  <span>
                    {b.bProfWebsite}
                    <small>{b.bProfWebsiteVisit}</small>
                  </span>
                </a>
              )}
            </div>
            {!business.phone && !waDigits && !business.email && !website && (
              <p className="suki-business-profile-desc">
                {b.bProfNoContact}
              </p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
