import Link from 'next/link';
import { ArrowRight, BadgeCheck, BarChart3, Building2, ChevronDown, Handshake, MapPin, Megaphone, Quote, Store, TrendingUp, UsersRound } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SUKI Business — Bangun Eksistensi Bisnis di Sultra',
  description: 'Ruang untuk seller, partner, developer, sponsor, dan organisasi bertumbuh bersama ekosistem digital Sulawesi Tenggara.',
  alternates: { canonical: 'https://sukiapps.web.id/Business' },
};

const businessPaths = [
  { icon: Store, title: 'Seller & UMKM', text: 'Hadirkan produk dan layanan Anda kepada warga yang mencari pilihan lokal.', tone: 'mint' },
  { icon: Building2, title: 'Properti & developer', text: 'Tampilkan proyek dan ruang terbaik dengan konteks lokasi yang lebih jelas.', tone: 'sand' },
  { icon: Handshake, title: 'Partner & organisasi', text: 'Bangun kolaborasi, campaign, dan inisiatif yang berdampak bagi Sultra.', tone: 'blue' },
];

const steps = [
  { number: '01', title: 'Kenali kebutuhan Anda', text: 'Pilih tujuan: menjual, memperkenalkan proyek, mencari talenta, atau membangun kolaborasi.' },
  { number: '02', title: 'Susun kehadiran', text: 'Kami membantu menghubungkan cerita, penawaran, dan informasi bisnis ke ruang yang relevan.' },
  { number: '03', title: 'Tumbuh bersama', text: 'Bangun hubungan yang lebih dekat dengan warga dan komunitas di wilayah Anda.' },
];

const testimonials = [
  { quote: 'Hari ini belajar bahwa langkah kecil tetap berarti. Mulai dari mendukung satu usaha lokal di sekitar kita.', name: 'Nadia Rahma', meta: 'Kendari · Cerita warga', initials: 'NR' },
  { quote: 'Senang melihat semakin banyak anak muda Sultra yang berani berkarya dan membawa cerita daerah ke ruang yang lebih luas.', name: 'Fajar La Ode', meta: 'Baubau · Cerita warga', initials: 'FL' },
  { quote: 'Gotong royong membersihkan pesisir kembali digelar. Terima kasih untuk semua warga yang sudah hadir.', name: 'Komunitas Pesisir', meta: 'Wakatobi · Komunitas', initials: 'KP' },
];

const caseStudies = [
  { type: 'Marketplace', title: 'Kopi Tolaki Premium', place: 'Konawe', result: '320 terjual', text: 'Contoh bagaimana produk lokal dapat ditemukan melalui kategori belanja yang dekat dengan konteks wilayah.', tone: 'mint' },
  { type: 'Marketplace', title: 'Tas Anyaman Wakatobi', place: 'Wakatobi', result: '86 terjual', text: 'Cerita produk dan identitas daerah bertemu dalam satu listing yang mudah dijelajahi warga.', tone: 'sand' },
  { type: 'Property', title: 'Nirwana Residence', place: 'Anduonohu, Kendari', result: 'Hubungi via WhatsApp', text: 'SUKI Suits membantu calon pembeli menemukan ruang dan melanjutkan percakapan dengan jalur yang jelas.', tone: 'blue' },
];

export default function BusinessPage() {
  return <main className="business-shell">
    <header className="business-nav">
      <Link href="/" className="marketing-brand" aria-label="Kembali ke SUKI Apps"><span className="marketing-brand-mark">S</span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></Link>
      <nav className="business-nav-links" aria-label="Navigasi bisnis"><Link href="/#ekosistem">Ekosistem</Link><a href="#manfaat">Manfaat</a><a href="#cara-kerja">Cara kerja</a><a href="#bukti">Bukti</a></nav>
      <Link href="/beranda" className="business-nav-link">Masuk ke aplikasi <ArrowRight size={15} /></Link>
    </header>

    <section className="business-hero"><div className="business-hero-copy"><p className="marketing-eyebrow"><span className="eyebrow-dot" /> SUKI Business</p><h1>Bangun eksistensi bisnis Anda di ekosistem lokal.</h1><p className="business-lede">Hadirkan produk, properti, layanan, atau campaign Anda kepada warga yang relevan — dengan ruang digital yang dibangun dari konteks Sulawesi Tenggara.</p><div className="marketing-hero-actions"><a href="#mulai" className="marketing-button marketing-button-primary">Mulai bersama SUKI <ArrowRight size={17} /></a><a href="#cara-kerja" className="marketing-button marketing-button-secondary">Lihat cara kerja</a></div></div><div className="business-hero-art"><div className="business-art-glow" /><div className="business-dashboard-card"><div className="dashboard-top"><span className="dashboard-avatar">SK</span><span><b>Profil bisnis Anda</b><small>Terlihat di ruang yang tepat</small></span><BadgeCheck size={20} /></div><div className="dashboard-chart"><span className="chart-label">Kehadiran lokal</span><div className="chart-bars"><i /><i /><i /><i /><i /><i /><i /></div><strong>bertumbuh bersama</strong></div><div className="dashboard-tags"><span>Produk</span><span>Komunitas</span><span>Kolaborasi</span></div></div><div className="business-art-note note-one"><Megaphone size={15} /> Cerita Anda, lebih dekat</div><div className="business-art-note note-two"><UsersRound size={15} /> Warga yang relevan</div></div></section>

    <section className="business-audience" id="manfaat"><div className="business-section-heading"><p className="marketing-eyebrow">Dibuat untuk langkah Anda berikutnya</p><h2>Satu ruang untuk berbagai cara bertumbuh.</h2></div><div className="business-path-grid">{businessPaths.map((path) => { const Icon = path.icon; return <article className={`business-path-card business-path-${path.tone}`} key={path.title}><span className="product-icon"><Icon size={21} /></span><h3>{path.title}</h3><p>{path.text}</p><a href="#mulai">Pelajari lebih lanjut <ArrowRight size={15} /></a></article>; })}</div></section>

    <section className="business-steps" id="cara-kerja"><div className="business-section-heading"><p className="marketing-eyebrow">Cara kerja</p><h2>Mulai dari kebutuhan. Tumbuh dengan arah.</h2></div><div className="business-step-grid">{steps.map((step) => <article key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div></section>

    <section className="business-value-banner"><div><p className="marketing-eyebrow">Konteks lokal adalah keunggulan</p><h2>Lebih dekat dengan orang yang ingin Anda jangkau.</h2><p>SUKI Apps menghubungkan kehadiran bisnis dengan ruang yang sudah digunakan warga: marketplace, properti, pekerjaan, dan komunitas.</p></div><div className="business-value-list"><div><BadgeCheck size={18} /><span>Profil yang lebih terarah</span></div><div><BarChart3 size={18} /><span>Ruang untuk membangun kepercayaan</span></div><div><Handshake size={18} /><span>Peluang kolaborasi yang relevan</span></div></div></section>

    <section className="business-proof-section" id="bukti"><div className="business-section-heading"><p className="marketing-eyebrow">Cerita yang sudah hadir</p><h2>Kepercayaan tumbuh dari cerita yang nyata.</h2><p className="business-proof-note">Kutipan dan contoh di bawah berasal dari konten serta listing yang tampil di ekosistem SUKI. Angka bukan proyeksi dan tidak menggantikan verifikasi pemilik bisnis.</p></div><div className="testimonial-grid">{testimonials.map((item) => <article className="testimonial-card" key={item.name}><Quote size={22} className="testimonial-quote-icon" /><blockquote>“{item.quote}”</blockquote><div className="testimonial-author"><span className="mini-avatar">{item.initials}</span><span><b>{item.name}</b><small>{item.meta}</small></span></div></article>)}</div></section>

    <section className="business-cases-section"><div className="business-section-heading"><p className="marketing-eyebrow">Studi kasus dari ekosistem</p><h2>Dari listing menjadi langkah berikutnya.</h2></div><div className="case-study-grid">{caseStudies.map((item) => <article className={`case-study-card case-study-${item.tone}`} key={item.title}><div className="case-study-top"><span>{item.type}</span><TrendingUp size={17} /></div><h3>{item.title}</h3><p className="case-study-place"><MapPin size={13} /> {item.place}</p><p>{item.text}</p><strong>{item.result}</strong><small>terlihat pada listing yang ditampilkan</small></article>)}</div></section>

    <section className="business-contact" id="mulai"><div><p className="marketing-eyebrow">Mari mulai percakapan</p><h2>Punya tujuan bisnis yang ingin diwujudkan di Sultra?</h2><p>Ceritakan kebutuhan Anda. Tim SUKI akan membantu menentukan jalur yang paling relevan untuk langkah pertama.</p></div><div className="business-contact-actions"><a href="mailto:hello@sukiapps.web.id" className="marketing-button marketing-button-light">Hubungi tim SUKI <ArrowRight size={17} /></a><Link href="/beranda" className="business-back-link">Kembali ke aplikasi <ArrowRight size={15} /></Link></div></section>

    <section className="business-faq"><div className="business-section-heading"><p className="marketing-eyebrow">Pertanyaan umum</p><h2>Mulai dengan hal yang ingin Anda ketahui.</h2></div><div className="faq-list"><details><summary>Siapa yang dapat bergabung dengan SUKI Business?<ChevronDown size={17} /></summary><p>Seller, UMKM, developer, pemilik properti, organisasi, sponsor, dan partner yang ingin membangun kehadiran di ekosistem digital Sulawesi Tenggara.</p></details><details><summary>Apakah sudah ada paket bisnis yang tersedia?<ChevronDown size={17} /></summary><p>Fase awal difokuskan untuk memahami kebutuhan bisnis terlebih dahulu. Tim SUKI akan membantu menentukan bentuk kehadiran dan kolaborasi yang paling sesuai.</p></details><details><summary>Apakah saya harus memiliki toko online?<ChevronDown size={17} /></summary><p>Tidak selalu. Anda dapat memulai dari profil, cerita, listing, atau percakapan awal sesuai tujuan bisnis Anda.</p></details></div></section>

    <footer className="marketing-footer business-footer"><div className="marketing-brand footer-brand"><span className="marketing-brand-mark">S</span><span><strong>SUKI Apps</strong><small>by SULTRAKITA</small></span></div><div className="footer-links"><Link href="/">SUKI Apps</Link><Link href="/beranda">Aplikasi</Link><Link href="/help-center">Panduan</Link><Link href="/legal/privacy">Privasi</Link></div><span className="footer-copy">© 2026 SUKI Apps · Sulawesi Tenggara</span></footer>
  </main>;
}
