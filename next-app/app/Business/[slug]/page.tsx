import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
  fetchBusinessBySlug,
  type PublicBusiness,
} from '@/lib/businesses-query';
import InquiryForm from './inquiry-form';
import { toWaDigits, waLink } from '@/lib/whatsapp';

type Params = { params: Promise<{ slug: string }> };

const DAYS: Array<[string, string]> = [
  ['senin', 'Senin'],
  ['selasa', 'Selasa'],
  ['rabu', 'Rabu'],
  ['kamis', 'Kamis'],
  ['jumat', 'Jumat'],
  ['sabtu', 'Sabtu'],
  ['minggu', 'Minggu'],
];

type HoursValue = { open?: string; close?: string } | string | null | undefined;

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
}

function parseHours(hours: unknown): Record<string, HoursValue> | null {
  if (!hours || typeof hours !== 'object' || Array.isArray(hours)) return null;
  return hours as Record<string, HoursValue>;
}

function formatHourValue(value: HoursValue): { text: string; closed: boolean } {
  if (value === null || value === undefined) return { text: 'Tutup', closed: true };
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    if (v === '' || v === 'tutup' || v === 'closed' || v === '-') return { text: 'Tutup', closed: true };
    return { text: value.trim(), closed: false };
  }
  const open = (value.open || '').trim();
  const close = (value.close || '').trim();
  if (!open && !close) return { text: 'Tutup', closed: true };
  return { text: close ? `${open} – ${close}` : open, closed: false };
}

function normalizeWebsite(url: string | null | undefined): string | null {
  const raw = (url || '').trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

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

  const initial = (business.name || '?').trim().charAt(0).toUpperCase();
  const hours = parseHours(business.hours);
  const location = [business.city, business.province].filter(Boolean).join(', ');
  const website = normalizeWebsite(business.website);
  const waDigits = toWaDigits(business.whatsapp);
  // Pesan terisi otomatis supaya inquiry dari SUKI langsung jelas konteksnya.
  const waHref = waDigits ? waLink(waDigits, `Halo ${business.name}, saya menemukan bisnis Anda di SUKI (sukiapps.web.id) dan ingin bertanya.`) : null;
  const lat = typeof business.latitude === 'number' ? business.latitude : null;
  const lng = typeof business.longitude === 'number' ? business.longitude : null;
  const mapHref =
    lat !== null && lng !== null
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : business.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.address)}`
        : null;

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
          <Link href="/Business" className="suki-business-subnav-brand" aria-label="Kembali ke SUKI Business">
            <span className="suki-business-mark">S</span>
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

      <main className="suki-business-profile">
        <Link href="/Business/direktori" className="suki-business-back-link">
          <ArrowLeft size={14} aria-hidden="true" /> Direktori bisnis
        </Link>

        {business.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={business.cover_url}
            alt={`Foto sampul ${business.name}`}
            className="suki-business-profile-cover"
          />
        )}

        <div className="suki-business-profile-head">
          {business.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={business.logo_url}
              alt={`Logo ${business.name}`}
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
                  <BadgeCheck size={13} aria-hidden="true" /> Terverifikasi
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
            <MapPin size={14} aria-hidden="true" /> Lihat di Google Maps
          </a>
        )}

        <div className="suki-business-profile-layout">
          <div>
            {business.description && (
              <section className="suki-business-profile-section" aria-labelledby="tentang-heading">
                <h2 id="tentang-heading">Tentang</h2>
                <p className="suki-business-profile-desc">{business.description}</p>
              </section>
            )}

            {hours && (
              <section className="suki-business-profile-section" aria-labelledby="jam-heading">
                <h2 id="jam-heading">Jam operasional</h2>
                <dl className="suki-business-hours-list">
                  {DAYS.map(([key, label]) => {
                    const { text, closed } = formatHourValue(hours[key]);
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
              <h2 id="tanya-heading">Kirim pertanyaan</h2>
              <p className="suki-business-profile-desc suki-business-inquiry-lead">
                Punya pertanyaan untuk {business.name}? Kirim pesan langsung dari sini.
              </p>
              <InquiryForm businessId={business.id} businessName={business.name} />
            </section>
          </div>

          <aside
            className="suki-business-profile-section suki-business-contact"
            aria-labelledby="kontak-heading"
          >
            <h2 id="kontak-heading">Hubungi</h2>
            <div className="suki-business-contact-grid">
              {business.phone && (
                <a href={`tel:${business.phone.replace(/[\s()-]/g, '')}`} className="suki-business-contact-btn is-primary">
                  <Phone size={17} aria-hidden="true" />
                  <span>
                    Telepon
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
                    WhatsApp
                    <small>Chat langsung</small>
                  </span>
                </a>
              )}
              {business.email && (
                <a href={`mailto:${business.email}`} className="suki-business-contact-btn">
                  <Mail size={17} aria-hidden="true" />
                  <span>
                    Email
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
                    Website
                    <small>Kunjungi situs resmi</small>
                  </span>
                </a>
              )}
            </div>
            {!business.phone && !waDigits && !business.email && !website && (
              <p className="suki-business-profile-desc">
                Kontak bisnis ini belum tersedia. Silakan gunakan formulir pertanyaan di samping.
              </p>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
