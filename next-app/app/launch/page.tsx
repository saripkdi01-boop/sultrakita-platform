import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  MapPinned,
  PartyPopper,
  ShoppingBag,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import './launch.css';
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  serializeJsonLd,
  webSiteJsonLd,
} from '@/lib/seo/jsonld';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sukiapps.web.id').replace(/\/$/, '');
const ogImage = `${siteUrl}/og-image.png`;

const title = 'Peluncuran SUKI Apps — Ekosistem Digital Sulawesi Tenggara';
const description =
  'SUKI Apps resmi meluncur: marketplace lokal, properti berbasis peta, komunitas warga, dan SUKI Jobs dalam satu aplikasi untuk Sulawesi Tenggara. Daftar gratis hari ini.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'peluncuran SUKI Apps',
    'SUKI Apps',
    'marketplace Kendari',
    'properti Sulawesi Tenggara',
    'komunitas Sultra',
    'lowongan kerja Kendari',
  ],
  alternates: { canonical: `${siteUrl}/launch` },
  openGraph: {
    title,
    description,
    type: 'website',
    url: `${siteUrl}/launch`,
    siteName: 'SUKI Apps',
    locale: 'id_ID',
    images: [{ url: ogImage, width: 512, height: 512, alt: 'Logo SUKI Apps' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [ogImage],
  },
};

const modul = [
  {
    icon: ShoppingBag,
    nama: 'Marketplace',
    judul: 'Belanja dari tetangga sendiri',
    teks: 'Produk, kuliner, dan jasa dari UMKM dan penjual lokal Sulawesi Tenggara — lengkap dengan foto, harga jelas, dan chat langsung ke penjual.',
    href: '/marketplace',
    tautan: 'Buka Marketplace',
  },
  {
    icon: MapPinned,
    nama: 'Properti',
    judul: 'Cari hunian lewat peta',
    teks: 'Rumah, kos, kontrakan, tanah, dan ruko ditampilkan di peta interaktif. Lihat lokasi persisnya sebelum menghubungi pemilik.',
    href: '/properti',
    tautan: 'Jelajahi Properti',
  },
  {
    icon: Users,
    nama: 'Komunitas',
    judul: 'Ruang warga Sultra',
    teks: 'Bergabung dengan komunitas sesuai minat dan daerahmu. Diskusi, berbagi info, dan ikut kegiatan warga sekitar.',
    href: '/groups',
    tautan: 'Temukan Komunitas',
  },
  {
    icon: BriefcaseBusiness,
    nama: 'SUKI Jobs',
    judul: 'Kerja dekat rumah',
    teks: 'Lowongan dari perusahaan dan usaha di Sulawesi Tenggara. Buat profil sekali, lamar ke banyak peluang.',
    href: '/jobs',
    tautan: 'Lihat Lowongan',
  },
];

const langkah = [
  {
    nomor: '1',
    judul: 'Daftar gratis',
    teks: 'Buat akun SUKI Apps dalam hitungan menit. Cukup nama dan email atau nomor HP.',
  },
  {
    nomor: '2',
    judul: 'Jelajahi ekosistemmu',
    teks: 'Cari barang, properti, komunitas, atau lowongan di sekitarmu — semua dalam satu aplikasi.',
  },
  {
    nomor: '3',
    judul: 'Pasang & bertransaksi',
    teks: 'Jual produk, pasang kos, atau buka lowongan. Terhubung langsung tanpa perantara.',
  },
];

const faq = [
  {
    tanya: 'Apakah SUKI Apps gratis?',
    jawab:
      'Ya. Mendaftar dan menjelajah SUKI Apps gratis. Memasang listing dasar juga gratis — paket berbayar opsional hanya menambah jangkauan promosi.',
  },
  {
    tanya: 'Bagaimana cara mulai berjualan?',
    jawab:
      'Daftar akun, buka halaman Seller, lalu buat listing pertamamu dengan foto dan harga yang jelas. Panduan lengkap tersedia di Pusat Bantuan.',
  },
  {
    tanya: 'Apakah SUKI Apps hanya untuk Kendari?',
    jawab:
      'SUKI Apps dibangun untuk seluruh Sulawesi Tenggara — mulai dari Kendari, dan berkembang ke Baubau, Kolaka, Konawe, dan kabupaten lainnya.',
  },
];

export default function LaunchPage() {
  const organization = organizationJsonLd({
    name: 'SUKI Apps',
    url: siteUrl,
    logo: ogImage,
    description:
      'Ekosistem digital Sulawesi Tenggara: marketplace lokal, properti berbasis peta, komunitas warga, dan bursa kerja.',
    address: {
      addressLocality: 'Kendari',
      addressRegion: 'Sulawesi Tenggara',
      addressCountry: 'ID',
    },
  });
  const website = webSiteJsonLd({
    name: 'SUKI Apps',
    alternateName: 'SultraKita',
    url: siteUrl,
  });
  const breadcrumb = breadcrumbJsonLd([
    { name: 'SUKI Apps', url: siteUrl },
    { name: 'Peluncuran' },
  ]);

  return (
    <main className="launch">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />

      <header className="launch-top">
        <div className="launch-wrap launch-top-inner">
          <Link href="/" className="launch-brand" aria-label="SUKI Apps — beranda">
            <Image
              src="/brand/suki-logo-mark.svg"
              alt="Logo SUKI Apps"
              width={38}
              height={38}
              priority
            />
            <span><strong>SUKI Apps</strong><small>Sulawesi Tenggara</small></span>
          </Link>
          <nav className="launch-top-nav" aria-label="Navigasi peluncuran">
            <Link href="/login">Masuk</Link>
            <Link href="/signup" className="launch-btn-small">Daftar</Link>
          </nav>
        </div>
      </header>

      <section className="launch-hero" aria-labelledby="launch-title">
        <div className="launch-wrap launch-hero-grid">
          <div className="launch-hero-copy">
            <p className="launch-kicker">
              <PartyPopper size={14} aria-hidden="true" /> Peluncuran resmi
            </p>
            <h1 id="launch-title">
              Satu ruang digital untuk <em>Sulawesi Tenggara.</em>
            </h1>
            <p className="launch-sub">
              SUKI Apps menghubungkan jual beli lokal, properti, komunitas, dan peluang
              kerja dalam satu pengalaman yang sederhana — dibangun dari Kendari,
              untuk seluruh Sultra.
            </p>
            <div className="launch-cta-row">
              <Link href="/signup" className="launch-btn-primary">
                Daftar Sekarang <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link href="/marketplace/seller-tools" className="launch-btn-secondary">
                <Store size={16} aria-hidden="true" /> Jadi Seller
              </Link>
            </div>
            <ul className="launch-trust" aria-label="Kenapa SUKI Apps">
              <li><CheckCircle2 size={15} aria-hidden="true" /> Gratis mendaftar</li>
              <li><CheckCircle2 size={15} aria-hidden="true" /> Fokus lokal Sultra</li>
              <li><CheckCircle2 size={15} aria-hidden="true" /> Langsung ke penjual</li>
            </ul>
          </div>
          <div className="launch-hero-visual" aria-hidden="true">
            <div className="launch-orb">
              <Image
                src="/brand/suki-logo-mark.svg"
                alt=""
                width={96}
                height={96}
                priority
              />
              <span className="launch-orb-ring" />
              <span className="launch-orb-ring launch-orb-ring-2" />
            </div>
            <p className="launch-orb-caption"><Sparkles size={13} /> Dibuat untuk tumbuh bersama ekosistem lokal</p>
          </div>
        </div>
      </section>

      <section className="launch-modul" aria-labelledby="launch-modul-title">
        <div className="launch-wrap">
          <div className="launch-section-head">
            <p className="launch-kicker">Ekosistem SUKI</p>
            <h2 id="launch-modul-title">Empat ruang. <em>Satu koneksi.</em></h2>
            <p>Mulai dari kebutuhan yang paling dekat denganmu hari ini.</p>
          </div>
          <ul className="launch-modul-grid">
            {modul.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.nama}>
                  <article className="launch-card">
                    <span className="launch-card-icon"><Icon size={22} aria-hidden="true" /></span>
                    <p className="launch-card-nama">{item.nama}</p>
                    <h3>{item.judul}</h3>
                    <p>{item.teks}</p>
                    <Link href={item.href} className="launch-card-link">
                      {item.tautan} <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="launch-langkah" aria-labelledby="launch-langkah-title">
        <div className="launch-wrap">
          <div className="launch-section-head">
            <p className="launch-kicker">Cara mulai</p>
            <h2 id="launch-langkah-title">Tiga langkah <em>jadi bagian.</em></h2>
          </div>
          <ol className="launch-langkah-list">
            {langkah.map((item) => (
              <li key={item.nomor}>
                <span className="launch-langkah-nomor" aria-hidden="true">{item.nomor}</span>
                <div>
                  <h3>{item.judul}</h3>
                  <p>{item.teks}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="launch-event" aria-labelledby="launch-event-title">
        <div className="launch-wrap launch-event-inner">
          <span className="launch-event-icon"><CalendarClock size={26} aria-hidden="true" /></span>
          <div>
            <p className="launch-kicker">Acara peluncuran</p>
            <h2 id="launch-event-title">Peluncuran &amp; Bazar UMKM SUKI Apps</h2>
            <p>
              Kami menyiapkan acara peluncuran offline beserta bazar UMKM lokal di Kendari.
              Tanggal dan lokasi resmi <strong>segera diumumkan</strong> di halaman ini
              dan kanal resmi SUKI Apps.
            </p>
            <p className="launch-event-note">
              <BellRing size={15} aria-hidden="true" /> Daftar akun sekarang agar tidak
              ketinggalan kabar peluncurannya.
            </p>
          </div>
          <Link href="/signup" className="launch-btn-primary">
            Daftar untuk dapat kabar <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="launch-faq" aria-labelledby="launch-faq-title">
        <div className="launch-wrap">
          <div className="launch-section-head">
            <p className="launch-kicker">Sering ditanyakan</p>
            <h2 id="launch-faq-title">Masih <em>ragu?</em></h2>
          </div>
          <dl className="launch-faq-list">
            {faq.map((item) => (
              <div key={item.tanya}>
                <dt>{item.tanya}</dt>
                <dd>{item.jawab}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="launch-final" aria-labelledby="launch-final-title">
        <div className="launch-wrap launch-final-card">
          <div>
            <h2 id="launch-final-title">Jadilah bagian dari awal cerita SUKI Apps.</h2>
            <p>Pendaftaran gratis. Ekosistemnya milik kita bersama.</p>
          </div>
          <div className="launch-cta-row">
            <Link href="/signup" className="launch-btn-primary">
              Daftar Sekarang <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/marketplace/seller-tools" className="launch-btn-secondary launch-btn-secondary-light">
              <Store size={16} aria-hidden="true" /> Jadi Seller
            </Link>
          </div>
        </div>
      </section>

      <footer className="launch-foot">
        <div className="launch-wrap launch-foot-inner">
          <p>© 2026 SUKI Apps · Ekosistem digital Sulawesi Tenggara</p>
          <nav aria-label="Tautan footer">
            <Link href="/marketplace">Marketplace</Link>
            <Link href="/properti">Properti</Link>
            <Link href="/groups">Komunitas</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/help-center">Pusat Bantuan</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
