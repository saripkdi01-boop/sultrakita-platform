import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { KENDARI_KATEGORI } from '@/lib/seo/lokal-kendari';
import { breadcrumbJsonLd, serializeJsonLd } from '@/lib/seo/jsonld';
import './kendari.css';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

const title = 'Jual Beli di Kendari — Marketplace, Properti & Lowongan | SUKI Apps';
const description =
  'Panduan jual beli di Kendari: motor bekas, kos murah, mobil bekas, rumah dijual, jasa tukang, kuliner, HP bekas, tanah dijual, lowongan kerja, dan kontrakan — dari penjual lokal di SUKI Apps.';

export const metadata: Metadata = {
  title,
  description,
  keywords: ['jual beli Kendari', 'marketplace Kendari', 'kos Kendari', 'properti Kendari', 'lowongan kerja Kendari', 'SUKI Apps'],
  alternates: { canonical: `${siteUrl}/kendari` },
  openGraph: {
    title,
    description,
    type: 'website',
    url: `${siteUrl}/kendari`,
    siteName: 'SUKI Apps',
    locale: 'id_ID',
    images: [{ url: ogImage, alt: 'SUKI Apps' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
};

export default function KendariIndexPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: 'SUKI Apps', url: siteUrl },
    { name: 'Kendari' },
  ]);

  return (
    <main className="kdr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />

      <header className="kdr-top">
        <div className="kdr-wrap kdr-top-inner">
          <Link href="/" className="kdr-brand" aria-label="SUKI Apps — beranda">
            <span className="kdr-brand-mark" aria-hidden="true">s</span>
            <span><strong>SUKI Apps</strong><small>Sulawesi Tenggara</small></span>
          </Link>
          <Link href="/beranda" className="kdr-top-cta">Buka SUKI Apps</Link>
        </div>
      </header>

      <div className="kdr-wrap">
        <nav className="kdr-crumb" aria-label="Breadcrumb">
          <Link href="/">Beranda</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Kendari</span>
        </nav>

        <h1 className="kdr-h1">Jual Beli di Kendari</h1>
        <div className="kdr-intro">
          <p>
            Kendari adalah ibu kota Sulawesi Tenggara sekaligus pusat aktivitas jual beli,
            hunian, dan lapangan kerja di wilayah ini. Halaman ini menghimpun panduan
            kategori paling dicari warga Kendari — dari motor bekas dan kos murah hingga
            tanah dijual dan lowongan kerja.
          </p>
          <p>
            Setiap kategori menampilkan listing terbaru yang dipasang penjual lokal di
            SUKI Apps. Pilih kategori di bawah untuk melihat daftarnya.
          </p>
        </div>

        <section className="kdr-list" aria-label="Kategori populer di Kendari">
          <ul className="kdr-grid">
            {KENDARI_KATEGORI.map((kategori) => (
              <li key={kategori.slug}>
                <Link href={`/kendari/${kategori.slug}`} className="kdr-card">
                  <strong>{kategori.h1}</strong>
                  <span className="kdr-district">{kategori.description.split('.')[0]}.</span>
                  <span className="kdr-more">Lihat panduan <ArrowRight size={13} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <footer className="kdr-foot">
        <div className="kdr-wrap">
          <p>© 2026 SUKI Apps · Ekosistem digital Sulawesi Tenggara</p>
          <p><Link href="/legal/privacy">Privasi</Link> · <Link href="/legal/terms">Syarat &amp; Ketentuan</Link> · <Link href="/help-center">Pusat Bantuan</Link></p>
        </div>
      </footer>
    </main>
  );
}
