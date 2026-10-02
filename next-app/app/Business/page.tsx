import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleDollarSign,
  Handshake,
  Layers3,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  Store,
  UsersRound,
} from 'lucide-react';
import {
  BUSINESS_CATEGORIES,
  fetchBusinessStats,
  fetchPublicBusinesses,
  type PublicBusiness,
} from '@/lib/businesses-query';

export const metadata: Metadata = {
  title: 'SUKI Business — Ruang tumbuh untuk bisnis lokal',
  description:
    'Bangun kehadiran bisnis yang lebih dekat dengan warga Sulawesi Tenggara melalui SUKI Business. Jelajahi direktori bisnis lokal atau daftarkan usaha Anda.',
  alternates: { canonical: 'https://sukiapps.web.id/Business' },
  openGraph: {
    title: 'SUKI Business — Ruang tumbuh untuk bisnis lokal',
    description:
      'Bangun kehadiran bisnis yang lebih dekat dengan warga Sulawesi Tenggara melalui SUKI Business.',
    url: 'https://sukiapps.web.id/Business',
    type: 'website',
    locale: 'id_ID',
    siteName: 'SUKI Apps',
  },
};

const audiences = [
  { icon: Store, label: 'Seller & UMKM', text: 'Temukan ruang yang tepat untuk produk, layanan, dan cerita usaha Anda.', tone: 'mint' },
  { icon: Building2, label: 'Properti & developer', text: 'Buat proyek dan ruang Anda lebih mudah dipahami calon pembeli lokal.', tone: 'sand' },
  { icon: Handshake, label: 'Partner & organisasi', text: 'Bangun campaign dan kolaborasi yang berangkat dari kebutuhan nyata.', tone: 'blue' },
];

const capabilities = [
  { icon: Layers3, title: 'Satu profil, banyak ruang', text: 'Kehadiran bisnis Anda dapat terhubung ke marketplace, properti, pekerjaan, dan komunitas.' },
  { icon: UsersRound, title: 'Lebih dekat dengan konteks', text: 'Cerita dan penawaran muncul di tempat warga memang sedang mencari dan terhubung.' },
  { icon: BarChart3, title: 'Tumbuh dengan arah', text: 'Mulai dari kebutuhan yang jelas, lalu kembangkan kehadiran Anda selangkah demi selangkah.' },
];

const plans = [
  { name: 'Mulai', description: 'Untuk bisnis yang ingin hadir dengan fondasi yang jelas.', features: ['Profil bisnis terarah', 'Ruang untuk cerita dan penawaran', 'Pendampingan langkah pertama'], featured: false },
  { name: 'Bertumbuh', description: 'Untuk bisnis yang siap menjangkau lebih banyak peluang lokal.', features: ['Semua fitur Mulai', 'Penempatan di ruang yang relevan', 'Ruang kolaborasi dengan partner'], featured: true },
  { name: 'Kolaborasi', description: 'Untuk organisasi dan inisiatif dengan kebutuhan yang lebih khusus.', features: ['Ruang campaign khusus', 'Diskusi kebutuhan bersama tim', 'Jalur integrasi dan partner'], featured: false },
];

function categoryLabel(value: string | null | undefined): string {
  return BUSINESS_CATEGORIES.find((c) => c.value === value)?.label ?? value ?? '';
}

/** Statistik & bisnis unggulan — gagal diam-diam (fallback disembunyikan), jangan 500. */
async function getLiveData(): Promise<{
  stats: { total: number; cities: number } | null;
  featured: PublicBusiness[];
}> {
  try {
    const [stats, featured] = await Promise.all([
      fetchBusinessStats(),
      fetchPublicBusinesses({ featuredOnly: true, limit: 6 }),
    ]);
    return { stats, featured: featured.items ?? [] };
  } catch {
    return { stats: null, featured: [] };
  }
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

function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'SUKI Business',
        url: 'https://sukiapps.web.id/Business',
        parentOrganization: { '@type': 'Organization', name: 'SUKI Apps', url: 'https://sukiapps.web.id' },
      },
      {
        '@type': 'WebSite',
        name: 'SUKI Business',
        url: 'https://sukiapps.web.id/Business',
        inLanguage: 'id-ID',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sukiapps.web.id/Business/direktori?q={query}',
          'query-input': 'required name=query',
        },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export default async function BusinessPage() {
  const { stats, featured } = await getLiveData();

  return (
    <main className="suki-business-page">
      <JsonLd />
      <header className="suki-business-nav">
        <Link href="/" className="suki-business-brand" aria-label="Kembali ke SUKI Apps">
          <span className="suki-business-mark">S</span>
          <span><strong>SUKI</strong><small>Business</small></span>
        </Link>
        <nav aria-label="Navigasi SUKI Business">
          <Link href="/Business/direktori">Direktori</Link>
          <a href="#cara-kerja">Cara kerja</a>
          <a href="#ruang-tumbuh">Ruang tumbuh</a>
          <a href="#paket">Paket</a>
        </nav>
        <div className="suki-business-nav-actions">
          <Link href="/login" className="suki-business-login">Masuk</Link>
          <Link href="/Business/daftar" className="suki-business-button suki-business-button-dark">Daftarkan bisnis <ArrowRight size={15} /></Link>
        </div>
        <button className="suki-business-menu" aria-label="Buka menu"><Menu size={21} /></button>
      </header>

      <section className="suki-business-hero">
        <div className="suki-business-hero-copy">
          <p className="suki-business-kicker"><span /> LOCAL BUSINESS OPERATING SYSTEM</p>
          <h1>Bisnis lokal tidak perlu berjalan sendirian.</h1>
          <p className="suki-business-hero-text">SUKI Business membantu Anda membangun kehadiran, menemukan koneksi, dan bertumbuh di ekosistem digital yang memahami Sulawesi Tenggara.</p>
          <div className="suki-business-hero-actions">
            <Link href="/Business/daftar" className="suki-business-button suki-business-button-teal">Mulai bersama SUKI <ArrowRight size={16} /></Link>
            <Link href="/Business/direktori" className="suki-business-text-link">Jelajahi direktori bisnis <MoveUpRight size={15} /></Link>
          </div>
          <div className="suki-business-trust-line"><BadgeCheck size={16} /> Dibangun dari konteks lokal, untuk langkah yang nyata.</div>
          {stats && (
            <p className="suki-business-stats">
              <strong>{Number(stats.total ?? 0).toLocaleString('id-ID')}</strong>
              &nbsp;bisnis terdaftar ·&nbsp;
              <strong>{Number(stats.cities ?? 0).toLocaleString('id-ID')}</strong>
              &nbsp;kota
            </p>
          )}
        </div>
        <div className="suki-business-hero-visual" aria-label="Pratinjau ruang kerja SUKI Business">
          <div className="suki-business-orbit orbit-a" /><div className="suki-business-orbit orbit-b" />
          <div className="suki-business-preview">
            <div className="suki-business-preview-top"><span className="suki-business-preview-brand"><span className="suki-business-mini-mark">S</span><b>Ruang bisnis</b></span><span className="suki-business-status"><i /> Aktif</span></div>
            <div className="suki-business-preview-heading"><span>Profil Anda terlihat di</span><strong>ruang yang tepat.</strong></div>
            <div className="suki-business-preview-chart"><div className="suki-business-chart-label"><span>Kehadiran lokal</span><b>bertumbuh bersama</b></div><div className="suki-business-bars"><i /><i /><i /><i /><i /><i /><i /><i /></div></div>
            <div className="suki-business-preview-footer"><span><Store size={14} /> Marketplace</span><span><UsersRound size={14} /> Komunitas</span><span><Handshake size={14} /> Partner</span></div>
          </div>
          <div className="suki-business-float-card float-top"><CircleDollarSign size={16} /><span><b>Peluang baru</b><small>datang dari konteks</small></span></div>
          <div className="suki-business-float-card float-bottom"><MapPin size={16} /><span><b>Kendari, Sultra</b><small>mulai dari yang dekat</small></span></div>
        </div>
      </section>

      <section className="suki-business-audience" id="ruang-tumbuh">
        <div className="suki-business-section-head"><p className="suki-business-kicker">Dibuat untuk langkah Anda berikutnya</p><h2>Satu ruang untuk berbagai cara bertumbuh.</h2><p>Mulai dari kebutuhan yang paling dekat, lalu bangun kehadiran yang punya arah.</p></div>
        <div className="suki-business-audience-grid">{audiences.map(({ icon: Icon, label, text, tone }) => <article className={`suki-business-audience-card tone-${tone}`} key={label}><span className="suki-business-icon"><Icon size={20} /></span><h3>{label}</h3><p>{text}</p><a href="#mulai">Pelajari ruangnya <ArrowRight size={14} /></a></article>)}</div>
      </section>

      <section className="suki-business-featured" aria-labelledby="featured-heading">
        <div className="suki-business-section-head">
          <p className="suki-business-kicker">Direktori</p>
          <h2 id="featured-heading">Bisnis unggulan di SUKI.</h2>
          <p>Usaha lokal yang membangun kehadirannya bersama SUKI Business — dari Kendari dan kota lain di Sulawesi Tenggara.</p>
        </div>
        {featured.length > 0 ? (
          <div className="suki-business-featured-grid">
            {featured.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <p className="suki-business-empty">
            <strong>Belum ada bisnis unggulan</strong>
            Ruang ini akan diisi oleh usaha lokal yang bergabung lebih dulu.
          </p>
        )}
        <Link href="/Business/direktori" className="suki-business-text-link">
          Jelajahi direktori bisnis <ArrowRight size={15} />
        </Link>
      </section>

      <section className="suki-business-process" id="cara-kerja">
        <div className="suki-business-section-head"><p className="suki-business-kicker">Cara kerja</p><h2>Dari kebutuhan menjadi kehadiran.</h2></div>
        <div className="suki-business-process-grid"><article><span>01</span><h3>Kenali kebutuhan</h3><p>Ceritakan apa yang ingin Anda capai, siapa yang ingin dijangkau, dan ruang apa yang sudah Anda miliki.</p></article><article><span>02</span><h3>Susun kehadiran</h3><p>Kami membantu menemukan jalur yang paling relevan — dari profil, listing, campaign, sampai kolaborasi.</p></article><article><span>03</span><h3>Tumbuh bersama</h3><p>Bangun hubungan yang lebih dekat dengan warga, partner, dan komunitas di wilayah Anda.</p></article></div>
      </section>

      <section className="suki-business-capabilities"><div className="suki-business-capabilities-copy"><p className="suki-business-kicker">Kenapa SUKI Business</p><h2>Lebih dekat. Lebih relevan. Lebih manusiawi.</h2><p>SUKI bukan sekadar tempat menampilkan bisnis. Ini adalah ruang digital untuk membuat hal-hal lokal lebih mudah ditemukan, dipahami, dan dikembangkan.</p><a href="#mulai" className="suki-business-text-link">Temukan ruang Anda <ArrowRight size={15} /></a></div><div className="suki-business-capability-list">{capabilities.map(({ icon: Icon, title, text }, index) => <article key={title}><span className="suki-business-capability-number">0{index + 1}</span><span className="suki-business-icon"><Icon size={18} /></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>

      <section className="suki-business-plans" id="paket"><div className="suki-business-section-head"><p className="suki-business-kicker">Ruang yang bisa Anda mulai</p><h2>Pilih langkah, bukan sekadar paket.</h2><p>Fase awal SUKI Business dimulai dari percakapan agar bentuk kehadiran Anda benar-benar sesuai kebutuhan.</p></div><div className="suki-business-plan-grid">{plans.map((plan) => <article className={`suki-business-plan ${plan.featured ? 'is-featured' : ''}`} key={plan.name}>{plan.featured && <span className="suki-business-plan-badge">Paling relevan</span>}<h3>{plan.name}</h3><p>{plan.description}</p><div className="suki-business-plan-divider" />{plan.features.map((feature) => <span className="suki-business-plan-feature" key={feature}><Check size={14} /> {feature}</span>)}<a href="#mulai" className="suki-business-plan-link">Mulai percakapan <ArrowRight size={14} /></a></article>)}</div></section>

      <section className="suki-business-cta" id="mulai"><div><p className="suki-business-kicker">Langkah berikutnya</p><h2>Punya tujuan bisnis yang ingin diwujudkan di Sultra?</h2><p>Ceritakan kebutuhan Anda. Tim SUKI akan membantu menentukan jalur yang paling relevan untuk langkah pertama.</p></div><div className="suki-business-cta-actions"><Link href="/Business/daftar" className="suki-business-button suki-business-button-light">Daftarkan bisnis Anda <ArrowRight size={16} /></Link><Link href="/Business/direktori" className="suki-business-cta-link">Jelajahi direktori bisnis <ArrowRight size={14} /></Link><Link href="/beranda" className="suki-business-cta-link">Kembali ke aplikasi <ArrowRight size={14} /></Link></div></section>

      <section className="suki-business-faq"><div className="suki-business-section-head"><p className="suki-business-kicker">Pertanyaan umum</p><h2>Mulai dengan hal yang ingin Anda ketahui.</h2></div><div className="suki-business-faq-list"><details><summary>Siapa yang dapat bergabung dengan SUKI Business?<ChevronDown size={17} /></summary><p>Seller, UMKM, developer, pemilik properti, organisasi, sponsor, dan partner yang ingin membangun kehadiran di ekosistem digital Sulawesi Tenggara.</p></details><details><summary>Apakah saya harus memiliki toko online?<ChevronDown size={17} /></summary><p>Tidak selalu. Anda dapat memulai dari profil, cerita, listing, atau percakapan awal sesuai tujuan bisnis Anda.</p></details><details><summary>Bagaimana cara mendaftarkan bisnis saya?<ChevronDown size={17} /></summary><p>Kunjungi halaman pendaftaran di <Link href="/Business/daftar">sukiapps.web.id/Business/daftar</Link> dan isi data usaha Anda. Setelah terdaftar, profil bisnis Anda akan tampil di direktori dan dapat ditemukan warga.</p></details><details><summary>Bisakah saya melihat bisnis yang sudah bergabung?<ChevronDown size={17} /></summary><p>Bisa. Jelajahi <Link href="/Business/direktori">direktori bisnis SUKI</Link> untuk melihat usaha lokal yang terdaftar dan terverifikasi di Sulawesi Tenggara.</p></details><details><summary>Bagaimana cara memulai?<ChevronDown size={17} /></summary><p>Kirimkan kebutuhan Anda melalui email. Tim SUKI akan menghubungi Anda untuk memahami konteks dan menyusun langkah awal.</p></details></div></section>

      <footer className="suki-business-footer"><div className="suki-business-brand"><span className="suki-business-mark">S</span><span><strong>SUKI</strong><small>Business</small></span></div><p>Ruang tumbuh untuk bisnis lokal Sulawesi Tenggara.</p><div className="suki-business-footer-links"><Link href="/">SUKI Apps</Link><Link href="/beranda">Aplikasi</Link><Link href="/Business/direktori">Direktori</Link><Link href="/Business/daftar">Daftarkan bisnis</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div><small className="suki-business-copyright">© 2026 SUKI Apps · Sulawesi Tenggara</small></footer>
    </main>
  );
}
