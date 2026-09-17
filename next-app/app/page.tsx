import Link from 'next/link';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleCheck,
  Compass,
  HeartHandshake,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SUKI Apps — Temukan, Terhubung, Bertumbuh di Sultra',
  description:
    'SUKI Apps adalah ekosistem digital Sulawesi Tenggara untuk menemukan peluang lokal, terhubung dengan komunitas, dan membantu bisnis bertumbuh.',
  alternates: { canonical: 'https://sukiapps.web.id/' },
};

const products = [
  {
    icon: ShoppingBag,
    tone: 'mint',
    label: 'Belanja lokal',
    title: 'SUKI Marketplace',
    text: 'Temukan produk pilihan dan dukung pelaku usaha lokal di Sultra.',
    href: '/marketplace',
  },
  {
    icon: Building2,
    tone: 'sand',
    label: 'Ruang & properti',
    title: 'SUKI Suits',
    text: 'Jelajahi properti, proyek, dan ruang terbaik untuk langkah berikutnya.',
    href: '/properti',
  },
  {
    icon: BriefcaseBusiness,
    tone: 'blue',
    label: 'Peluang baru',
    title: 'SUKI Jobs',
    text: 'Buka akses ke peluang kerja dan talenta yang relevan di wilayah Anda.',
    href: '/jobs',
  },
  {
    icon: Users,
    tone: 'coral',
    label: 'Ruang warga',
    title: 'Komunitas Sultra',
    text: 'Bagikan cerita, temukan kabar, dan bangun koneksi yang lebih dekat.',
    href: '/groups',
  },
];

const signals = [
  { value: 'Lokal', label: 'berangkat dari konteks Sulawesi Tenggara' },
  { value: 'Terhubung', label: 'satu ruang untuk warga dan pelaku usaha' },
  { value: 'Bertumbuh', label: 'dibangun untuk peluang yang lebih terbuka' },
];

export default function HomePage() {
  return (
    <main className="marketing-shell">
      <header className="marketing-nav">
        <Link href="/" className="marketing-brand" aria-label="SUKI Apps beranda">
          <span className="marketing-brand-mark">S</span>
          <span>
            <strong>SUKI Apps</strong>
            <small>by SULTRAKITA</small>
          </span>
        </Link>
        <nav className="marketing-links" aria-label="Navigasi utama">
          <a href="#ekosistem">Ekosistem</a>
          <a href="#cara-kerja">Cara kerja</a>
          <Link href="/Business">Untuk bisnis</Link>
        </nav>
        <div className="marketing-nav-actions">
          <Link href="/login" className="marketing-login">Masuk</Link>
          <Link href="/beranda" className="marketing-nav-cta">Jelajahi SUKI <ArrowRight size={15} /></Link>
        </div>
      </header>

      <section className="marketing-hero" aria-labelledby="hero-title">
        <div className="marketing-hero-copy">
          <p className="marketing-eyebrow"><span className="eyebrow-dot" /> Ekosistem digital Sulawesi Tenggara</p>
          <h1 id="hero-title">Ruang digital untuk <em>menemukan</em>, terhubung, dan bertumbuh.</h1>
          <p className="marketing-hero-lede">SUKI Apps mempertemukan warga, usaha lokal, peluang, dan cerita Sultra dalam satu ekosistem yang terasa dekat.</p>
          <div className="marketing-hero-actions">
            <Link href="/beranda" className="marketing-button marketing-button-primary">Mulai menjelajah <ArrowRight size={17} /></Link>
            <Link href="/Business" className="marketing-button marketing-button-secondary">Saya punya bisnis <BriefcaseBusiness size={16} /></Link>
          </div>
          <div className="marketing-proof-line"><CircleCheck size={16} /> Dibangun dari kebutuhan warga dan pelaku usaha lokal</div>
        </div>
        <div className="marketing-hero-visual" aria-label="Pratinjau ekosistem SUKI Apps">
          <div className="hero-orbit hero-orbit-a" />
          <div className="hero-orbit hero-orbit-b" />
          <div className="hero-visual-label"><Sparkles size={14} /> Satu ekosistem, banyak langkah</div>
          <div className="hero-card hero-card-main">
            <div className="hero-card-top"><span className="hero-card-icon"><Compass size={18} /></span><span>Aktif di Sultra</span><span className="hero-card-live">●</span></div>
            <strong>Temukan yang dekat denganmu.</strong>
            <p>Produk, properti, peluang, dan cerita warga dalam satu ruang.</p>
            <div className="hero-search"><Search size={15} /><span>Cari produk, lokasi, atau warga</span></div>
          </div>
          <div className="hero-card hero-card-float hero-card-community"><span className="mini-avatar">NR</span><div><b>Cerita warga</b><small>Ruang untuk terhubung</small></div><MessageCircle size={16} /></div>
          <div className="hero-card hero-card-float hero-card-business"><HeartHandshake size={16} /><div><b>Untuk bisnis</b><small>Bangun eksistensi lokal</small></div></div>
        </div>
      </section>

      <section className="marketing-signal-strip" aria-label="Nilai SUKI Apps">
        {signals.map((signal) => <div className="signal-item" key={signal.value}><strong>{signal.value}</strong><span>{signal.label}</span></div>)}
      </section>

      <section className="marketing-section marketing-promise" id="cara-kerja">
        <div className="marketing-section-heading">
          <p className="marketing-eyebrow">Lebih dari sekadar aplikasi</p>
          <h2>Hal-hal lokal yang penting, dibuat lebih mudah ditemukan.</h2>
        </div>
        <p className="marketing-section-intro">Mulai dari kebutuhan sehari-hari sampai peluang baru, SUKI Apps menyatukan ruang digital yang membantu Anda bergerak dengan konteks yang lebih dekat.</p>
        <div className="promise-grid">
          <article><span className="promise-number">01</span><h3>Temukan</h3><p>Jelajahi produk, properti, pekerjaan, dan rekomendasi yang relevan dengan wilayah Anda.</p></article>
          <article><span className="promise-number">02</span><h3>Terhubung</h3><p>Bangun percakapan dan hubungan melalui komunitas, chat, serta cerita warga.</p></article>
          <article><span className="promise-number">03</span><h3>Bertumbuh</h3><p>Hadirkan karya, usaha, dan peluang Anda kepada orang-orang yang tepat.</p></article>
        </div>
      </section>

      <section className="marketing-section ecosystem-section" id="ekosistem">
        <div className="marketing-section-heading split-heading"><div><p className="marketing-eyebrow">Ekosistem SUKI</p><h2>Satu tempat untuk banyak kemungkinan.</h2></div><Link href="/beranda" className="marketing-text-link">Buka aplikasi <ArrowRight size={15} /></Link></div>
        <div className="product-grid">{products.map((product) => { const Icon = product.icon; return <Link href={product.href} className={`product-card product-${product.tone}`} key={product.title}><span className="product-icon"><Icon size={20} /></span><span className="product-label">{product.label}</span><h3>{product.title}</h3><p>{product.text}</p><span className="product-link">Jelajahi <ChevronRight size={15} /></span></Link>; })}</div>
      </section>

      <section className="marketing-business-banner">
        <div><p className="marketing-eyebrow">Untuk seller, partner, dan organisasi</p><h2>Bisnis lokal punya cerita. Mari beri ruang untuk tumbuh.</h2><p>Bangun eksistensi, hadirkan penawaran, atau mulai kolaborasi di ekosistem yang memahami konteks Sulawesi Tenggara.</p></div>
        <Link href="/Business" className="marketing-button marketing-button-light">Masuk ke SUKI Business <ArrowRight size={17} /></Link>
      </section>

      <section className="marketing-section local-proof-section">
        <div className="local-proof-copy"><p className="marketing-eyebrow">Dari Sultra, untuk Sultra</p><h2>Teknologi yang tetap terasa manusiawi.</h2><p>SUKI Apps tumbuh dari kebutuhan untuk membuat hal-hal yang dekat menjadi lebih mudah diakses. Setiap ruang dirancang untuk membantu warga dan pelaku usaha mengambil langkah berikutnya dengan percaya diri.</p><Link href="/help-center" className="marketing-text-link">Pelajari lebih lanjut <ArrowRight size={15} /></Link></div>
        <div className="local-proof-card"><div className="proof-quote">“</div><blockquote>Langkah kecil tetap berarti ketika kita melakukannya bersama.</blockquote><div className="proof-author"><span className="mini-avatar">NR</span><span><b>Cerita warga Sultra</b><small>Ruang Komunitas SUKI</small></span></div></div>
      </section>

      <section className="marketing-final-cta"><p className="marketing-eyebrow">Langkah berikutnya dimulai di sini</p><h2>Temukan ruang Anda di SUKI Apps.</h2><p>Jelajahi ekosistem digital yang dekat dengan kebutuhan dan peluang di sekitar Anda.</p><Link href="/beranda" className="marketing-button marketing-button-primary">Jelajahi SUKI Apps <ArrowRight size={17} /></Link></section>

      <footer className="marketing-footer"><div className="marketing-brand footer-brand"><span className="marketing-brand-mark">S</span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></div><div className="footer-links"><Link href="/beranda">Beranda aplikasi</Link><Link href="/Business">Untuk bisnis</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div><span className="footer-copy">© 2026 SUKI Apps · Sulawesi Tenggara</span></footer>
    </main>
  );
}
