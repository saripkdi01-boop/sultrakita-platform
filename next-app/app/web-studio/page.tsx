'use client';

/**
 * SUKI Web Studio — halaman publik jasa pembuatan website.
 *
 * Desain ulang "kelas Hostinger": hero berani + jaminan, kartu harga premium,
 * strip "sudah termasuk di semua paket", alur pemesanan 4 langkah, banner CTA
 * akhir, dan CTA sticky di mobile — tanpa mengubah fakta harga, fitur, FAQ.
 *
 * JUJUR BY DESIGN: form pemesanan TIDAK mengirim ke backend. Saat submit,
 * pesan terformat dibuka ke WhatsApp resmi SUKI via sukiWaLink() (wa.me).
 * Tidak ada data yang disimpan — ini disengaja sampai ada keputusan
 * untuk membangun alur order server-side. Tidak ada testimoni, diskon,
 * atau statistik klien yang dikarang di halaman ini.
 */

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Bike,
  Briefcase,
  Building2,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  Footprints,
  Globe,
  Home,
  LayoutDashboard,
  Lock,
  MapPin,
  MessagesSquare,
  Minus,
  PenTool,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  User,
  Wallet,
  Wrench,
  X,
  ArrowRight,
  BadgeCheck,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { sukiWaLink } from '@/lib/whatsapp';
import './web-studio.css';
import './web-studio-prestige.css';

type Paket = {
  id: string;
  nama: string;
  harga: string;
  periode: string;
  badge?: string;
  deskripsi: string;
  fitur: string[];
  waktu: string;
  ikon: typeof Globe;
};

const PAKETS: Paket[] = [
  {
    id: 'landing-page',
    nama: 'Landing Page',
    harga: 'Rp 99 rb',
    periode: 'harga mulai',
    deskripsi: 'Min. 5 halaman yang fokus menjual produk/jasamu dan mengumpulkan leads.',
    fitur: [
      'Desain mobile-friendly & cepat',
      'Tombol WhatsApp + form kontak',
      'Domain & hosting 1 tahun',
      'SSL & SEO dasar',
    ],
    waktu: '1–2 hari kerja',
    ikon: Rocket,
  },
  {
    id: 'company-profile',
    nama: 'Company Profile',
    harga: 'Rp 299 rb',
    periode: 'harga mulai',
    deskripsi: 'Website perusahaan profesional yang bikin bisnismu terlihat kredibel.',
    fitur: [
      '8–15 halaman (profil, layanan, blog, kontak)',
      'Desain sesuai identitas brand',
      'Admin panel — update konten mandiri',
      'SEO on-page + Google Analytics',
      'Domain & hosting 1 tahun',
    ],
    waktu: '3–5 hari kerja',
    ikon: Globe,
  },
  {
    id: 'toko-online',
    nama: 'Toko Online',
    harga: 'Rp 499 rb',
    periode: 'harga mulai',
    badge: 'Paling diminati',
    deskripsi: 'Jualan online di websitemu sendiri — tanpa potongan komisi marketplace.',
    fitur: [
      'Katalog, keranjang & checkout',
      'Pembayaran QRIS, transfer bank, e-wallet',
      'Ongkir otomatis (JNE, J&T, dll.)',
      'Admin panel kelola produk & pesanan',
      'Notifikasi pesanan via WhatsApp',
      'Domain & hosting 1 tahun',
    ],
    waktu: '5–7 hari kerja',
    ikon: Store,
  },
  {
    id: 'web-aplikasi',
    nama: 'Web Aplikasi Custom',
    harga: 'Rp 999 rb',
    periode: 'harga mulai',
    deskripsi: 'Sistem web sesuai alur kerja bisnismu — kasir, inventori, booking, dashboard.',
    fitur: [
      'Login & dashboard admin',
      'Fitur sesuai kebutuhan operasional',
      'Laporan & export data',
      'Integrasi API (pembayaran, dsb.)',
      'Pelatihan penggunaan',
    ],
    waktu: '7 hari kerja',
    ikon: LayoutDashboard,
  },
  {
    id: 'care-plan',
    nama: 'Care Plan',
    harga: 'Rp 49 rb',
    periode: '/bulan',
    deskripsi: 'Website-mu kami rawat: aman, ter-backup, dan selalu up-to-date.',
    fitur: [
      'Monitoring & backup rutin',
      'Update konten ringan',
      'Perbaikan bug/error',
      'Support chat jam kerja',
    ],
    waktu: 'Periode bulanan',
    ikon: Wrench,
  },
];

/** Sudah termasuk di SEMUA paket — dari keunggulan "Harga transparan". */
const TERMASUK = [
  { ikon: Globe, teks: 'Domain 1 tahun' },
  { ikon: Server, teks: 'Hosting 1 tahun' },
  { ikon: Lock, teks: 'Sertifikat SSL' },
  { ikon: BadgeCheck, teks: 'Tanpa biaya tersembunyi' },
];

/** Alur pemesanan — diringkas dari FAQ (sistem pembayaran & garansi). */
const LANGKAH = [
  {
    ikon: MessagesSquare,
    judul: 'Konsultasi via WhatsApp',
    teks: 'Ceritakan kebutuhanmu via WhatsApp. Kami rekomendasikan paket yang paling pas — tanpa komitmen.',
  },
  {
    ikon: Wallet,
    judul: 'DP 50% sebagai tanda jadi',
    teks: 'Harga disepakati transparan di muka dalam rupiah. Pelunasan setelah website selesai, sebelum go-live.',
  },
  {
    ikon: PenTool,
    judul: 'Pengerjaan + 2× revisi',
    teks: 'Desain dikerjakan sesuai estimasi waktu tiap paket, termasuk 2× revisi desain.',
  },
  {
    ikon: Rocket,
    judul: 'Go-live + garansi 30 hari',
    teks: 'Website diserahkan setelah lunas. Setiap bug/error kami perbaiki gratis selama 30 hari.',
  },
];

const KEUNGGULAN = [
  {
    ikon: MessagesSquare,
    judul: 'Konsultasi tanpa komitmen',
    teks: 'Ceritakan kebutuhanmu via WhatsApp. Kami beri rekomendasi paket yang paling pas — bahkan kalau jawabannya "belum butuh website".',
  },
  {
    ikon: BadgeCheck,
    judul: 'Harga transparan',
    teks: 'Harga yang tertera sudah termasuk domain, hosting 1 tahun, dan SSL. Tidak ada biaya tersembunyi di tengah jalan.',
  },
  {
    ikon: ShieldCheck,
    judul: 'Garansi bug 30 hari',
    teks: 'Setelah serah terima, setiap bug/error kami perbaiki gratis selama 30 hari. Website diserahkan setelah lunas.',
  },
  {
    ikon: Sparkles,
    judul: 'Teknologi modern',
    teks: 'Dibangun dengan teknologi web modern yang sama dengan SUKI Apps — cepat dibuka di HP maupun laptop.',
  },
];

/**
 * Contoh gaya desain. Kartu pertama adalah KONSEP DESAIN BARU marketplace
 * SUKI (visi upgrade kelas global, konten ilustrasi representatif)
 * — bukan tampilan aplikasi saat ini; dua lainnya ilustrasi konseptual.
 * Tidak ada screenshot website orang lain atau testimoni karangan.
 */
const SHOWCASE = [
  {
    id: 'sc-toko',
    judul: 'Toko Online',
    kategori: 'Gaya untuk UMKM kuliner & retail',
    label: 'Konsep desain baru — Marketplace',
    tag: 'Konsep desain baru',
    mini: 'marketplace' as const,
    tema: 'sws-sc-emas',
    deskripsi: 'Visi upgrade marketplace SUKI: kartu modern, harga tegas, rating, dan navigasi premium — konten ilustrasi representatif.',
  },
  {
    id: 'sc-company',
    judul: 'Company Profile',
    kategori: 'Gaya untuk jasa & kontraktor',
    label: 'Ilustrasi — Company Profile',
    tag: 'Ilustrasi',
    mini: null,
    tema: 'sws-sc-teal',
    deskripsi: 'Profil, layanan, galeri hasil kerja, dan tombol kontak yang jelas.',
  },
  {
    id: 'sc-landing',
    judul: 'Landing Page',
    kategori: 'Gaya untuk properti & event',
    label: 'Ilustrasi — Landing Page',
    tag: 'Ilustrasi',
    mini: null,
    tema: 'sws-sc-gelap',
    deskripsi: 'Satu halaman yang fokus: menampilkan penawaran dan mengumpulkan leads.',
  },
];

/**
 * Miniatur "konsep desain baru" marketplace SUKI untuk mockup hero &
 * kartu showcase — wadah desain naik kelas global (tipografi kuat,
 * spacing lega, kartu modern). Isi: 6 PRODUK ILUSTRASI representatif
 * khas marketplace Indonesia (nama, harga, rating, kota wajar —
 * dibuat sendiri; BUKAN data listing Suki yang masih kosong, BUKAN
 * scrape dari marketplace lain). Visual produk = gradien/ikon CSS.
 */
const MP_MINI_KATEGORI = ['Semua', 'Elektronik', 'Fashion', 'Kendaraan', 'Kuliner', 'Properti'];
const MP_MINI_PRODUK = [
  { nama: 'Sepatu Sneakers Pria Premium', harga: 'Rp349.000', kota: 'Makassar', rating: '4.9', ikon: Footprints, g: 'g1', badge: 'Terlaris' },
  { nama: 'Kopi Robusta Lampung 500gr', harga: 'Rp85.000', kota: 'Kendari', rating: '4.8', ikon: Coffee, g: 'g2' },
  { nama: 'Motor Bekas Honda Vario 2022', harga: 'Rp18,5 jt', kota: 'Kendari', rating: '4.7', ikon: Bike, g: 'g3' },
  { nama: 'Tas Selempang Kulit Asli', harga: 'Rp275.000', kota: 'Makassar', rating: '4.8', ikon: Briefcase, g: 'g4' },
  { nama: 'Kemeja Batik Sultra', harga: 'Rp189.000', kota: 'Kendari', rating: '4.9', ikon: Shirt, g: 'g5', badge: 'Baru' },
  { nama: 'iPhone 12 Bekas Mulus', harga: 'Rp6,75 jt', kota: 'Kendari', rating: '4.6', ikon: Smartphone, g: 'g6' },
];

/** Tabel banding — klaim jujur dan dapat dipertahankan. */
const BANDING_KOLOM = ['SUKI Web Studio', 'Bikin Sendiri', 'Builder Luar Negeri'];const BANDING_BARIS: { label: string; nilai: ('ya' | 'sebagian' | 'tidak')[] }[] = [
  { label: 'Didampingi dari konsultasi sampai go-live', nilai: ['ya', 'tidak', 'sebagian'] },
  { label: 'Bahasa Indonesia & support lokal via WhatsApp', nilai: ['ya', 'tidak', 'tidak'] },
  { label: 'Harga rupiah, sekali bayar, tanpa biaya tersembunyi', nilai: ['ya', 'sebagian', 'tidak'] },
  { label: 'Revisi desain 2× sudah termasuk', nilai: ['ya', 'tidak', 'tidak'] },
  { label: 'Garansi perbaikan bug 30 hari', nilai: ['ya', 'tidak', 'tidak'] },
  { label: 'Tanpa perlu bisa coding / utak-atik teknis', nilai: ['ya', 'tidak', 'sebagian'] },
];
const BANDING_CATATAN =
  '“Sebagian” artinya tersedia tapi terbatas — misalnya builder luar negeri umumnya berbahasa Inggris dan berlangganan bulanan dalam USD, sedangkan bikin sendiri gratis tapi menuntut waktu dan kemauan belajar.';

const FAQS = [  {
    q: 'Bagaimana sistem pembayarannya?',
    a: 'DP 50% di awal sebagai tanda jadi, pelunasan setelah website selesai dan sebelum go-live. Harga belum termasuk PPN 11% untuk kebutuhan faktur perusahaan.',
  },
  {
    q: 'Berapa kali saya bisa revisi desain?',
    a: 'Setiap paket termasuk 2× revisi desain. Revisi tambahan dihitung per revisi dengan tarif yang disepakati di muka — jadi tidak ada kejutan.',
  },
  {
    q: 'Apakah ada garansi setelah website jadi?',
    a: 'Ya. Kami memberi garansi perbaikan bug selama 30 hari setelah serah terima. Penambahan fitur baru di luar scope awal dihitung sebagai project terpisah.',
  },
  {
    q: 'Berapa lama pengerjaannya?',
    a: 'Landing page 3–5 hari kerja, company profile 10–14 hari kerja, toko online 21–30 hari kerja, web aplikasi custom 4–8 minggu. Waktu dihitung sejak materi konten (logo, foto, teks) kami terima lengkap.',
  },
  {
    q: 'Apakah ada biaya tahunan setelah website jadi?',
    a: 'Ya, untuk perpanjangan domain & hosting mulai tahun kedua — mulai dari sekitar Rp 1 juta/tahun tergantung paket. Kami mengingatkan sebelum jatuh tempo.',
  },
  {
    q: 'Bisakah saya update konten sendiri?',
    a: 'Bisa. Paket Company Profile ke atas dilengkapi admin panel yang mudah dipakai, plus sesi pelatihan singkat cara menggunakannya.',
  },
];

const KONSULTASI_TEXT =
  'Halo SUKI Web Studio! Saya ingin konsultasi tentang pembuatan website untuk bisnis saya.';

function formatOrder(nama: string, wa: string, usaha: string, paket: Paket, kebutuhan: string): string {
  const baris = [
    'Halo SUKI Web Studio! Saya ingin memesan website.',
    '',
    `Nama: ${nama}`,
    `No. WA/HP: ${wa}`,
    usaha ? `Jenis usaha: ${usaha}` : 'Jenis usaha: -',
    `Paket: ${paket.nama} (mulai ${paket.harga}${paket.periode === '/bulan' ? '/bln' : ''})`,
    kebutuhan ? `Kebutuhan:\n${kebutuhan}` : 'Kebutuhan: -',
    '',
    'Mohon info langkah selanjutnya. Terima kasih.',
  ];
  return baris.join('\n');
}

/**
 * Miniatur "Konsep desain baru" marketplace SUKI — visi upgrade kelas
 * global. Versi penuh (hero): topbar + search + chip kategori + grid
 * produk + bottom nav. Versi ringkas (kartu showcase): grid 2×2 saja.
 */
function MpKonsep({ ringkas = false }: { ringkas?: boolean }) {
  const produk = ringkas ? MP_MINI_PRODUK.slice(0, 4) : MP_MINI_PRODUK;
  return (
    <div className="sws-mp" aria-label="Konsep desain baru marketplace SUKI">
      {!ringkas && (
        <div className="sws-mp-top">
          <span className="sws-mp-logo" aria-hidden>S</span>
          <span className="sws-mp-search">
            <Search size={10} aria-hidden />
            Cari produk, jasa, properti…
          </span>
          <Bell size={13} aria-hidden />
          <ShoppingBag size={13} aria-hidden />
        </div>
      )}
      {!ringkas && (
        <div className="sws-mp-chips" aria-hidden>
          {MP_MINI_KATEGORI.map((k, i) => (
            <span key={k} className={i === 0 ? 'sws-mp-chip-on' : ''}>{k}</span>
          ))}
        </div>
      )}
      <div className={`sws-mp-grid${ringkas ? ' sws-mp-grid-2' : ''}`}>
        {produk.map((p) => {
          const Ikon = p.ikon;
          return (
            <div key={p.nama} className="sws-mp-card">
              <div className={`sws-mp-media sws-mp-${p.g}`} aria-hidden>
                <Ikon size={22} strokeWidth={1.8} />
                {p.badge ? <span className="sws-mp-badge">{p.badge}</span> : null}
              </div>
              <div className="sws-mp-info">
                <p className="sws-mp-harga">{p.harga}</p>
                <p className="sws-mp-nama">{p.nama}</p>
                <p className="sws-mp-meta">
                  <MapPin size={9} aria-hidden />
                  {p.kota}
                  <Star size={9} aria-hidden />
                  {p.rating}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {!ringkas && (
        <nav className="sws-mp-nav" aria-hidden>
          <span><Home size={13} />Beranda</span>
          <span className="on"><Store size={13} />Market</span>
          <span><Building2 size={13} />Properti</span>
          <span><User size={13} />Akun</span>
        </nav>
      )}
    </div>
  );
}

export default function WebStudioPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const namaId = useId();
  const waId = useId();
  const usahaId = useId();
  const paketId = useId();
  const kebutuhanId = useId();

  const [paketTerpilih, setPaketTerpilih] = useState<string>('toko-online');
  const [nama, setNama] = useState('');
  const [wa, setWa] = useState('');
  const [usaha, setUsaha] = useState('');
  const [kebutuhan, setKebutuhan] = useState('');
  const [error, setError] = useState<string | null>(null);

  const waKonsultasi = sukiWaLink(KONSULTASI_TEXT);

  /* Scroll-reveal: tambah .is-inview saat elemen masuk viewport. */
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll('.sws-reveal')
    );
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-inview'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-inview');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    /* Pengaman: tampilkan semua setelah 4 dtk bila observer tak menyala. */
    const t = window.setTimeout(() => {
      els.forEach((el) => el.classList.add('is-inview'));
    }, 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  /* 3D-MOTION: parallax hero mengikuti pointer, tilt kartu mengikuti pointer,
     parallax orbs multi-kedalaman saat scroll.
     Satu listener pointermove + satu scroll, masing-masing rAF-throttled dan
     passive. Mati total bila prefers-reduced-motion; tilt hanya untuk
     pointer halus (hover). Di touch device, idle animation CSS tetap jalan. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const stage = document.querySelector<HTMLElement>('.sws-3d-stage');
    const hero = document.querySelector<HTMLElement>('.sws-hero');
    if (!stage || !hero) return;

    let raf = 0;
    let px = 0;
    let py = 0;
    let pTarget: EventTarget | null = null;
    let activeCard: HTMLElement | null = null;

    const resetCard = (el: HTMLElement) => {
      el.style.removeProperty('--sws-tx');
      el.style.removeProperty('--sws-ty');
    };

    const tick = () => {
      raf = 0;
      /* Hero: putar panggung 3D mengikuti posisi pointer di dalam hero. */
      const hr = hero.getBoundingClientRect();
      if (px >= hr.left && px <= hr.right && py >= hr.top && py <= hr.bottom) {
        const nx = (px - hr.left) / hr.width - 0.5;
        const ny = (py - hr.top) / hr.height - 0.5;
        stage.style.setProperty('--sws-rx', `${(6 - ny * 10).toFixed(2)}deg`);
        stage.style.setProperty('--sws-ry', `${(-12 + nx * 16).toFixed(2)}deg`);
      } else {
        stage.style.setProperty('--sws-rx', '6deg');
        stage.style.setProperty('--sws-ry', '-12deg');
      }
      /* Kartu: tilt mengikuti pointer (delegasi — satu listener untuk semua). */
      const el = (pTarget as HTMLElement | null)?.closest?.(
        '.sws-kartu, .sws-sc-card'
      ) as HTMLElement | null;
      if (el !== activeCard) {
        if (activeCard) resetCard(activeCard);
        activeCard = el;
      }
      if (activeCard) {
        const r = activeCard.getBoundingClientRect();
        const nx = (px - r.left) / r.width - 0.5;
        const ny = (py - r.top) / r.height - 0.5;
        activeCard.style.setProperty('--sws-tx', `${(-ny * 9).toFixed(2)}deg`);
        activeCard.style.setProperty('--sws-ty', `${(nx * 11).toFixed(2)}deg`);
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      pTarget = e.target;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    /* Orbs: parallax multi-kedalaman — kecepatan beda per layer via CSS. */
    let sRaf = 0;
    const applyScroll = () => {
      sRaf = 0;
      if (hero.getBoundingClientRect().bottom > 0) {
        hero.style.setProperty('--sws-scroll', `${Math.round(window.scrollY)}px`);
      }
    };
    const onScroll = () => {
      if (!sRaf) sRaf = requestAnimationFrame(applyScroll);
    };

    if (fine) window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    applyScroll();

    return () => {
      if (fine) window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (sRaf) cancelAnimationFrame(sRaf);
    };
  }, []);

  const scrollKe = (el: HTMLElement | null) => {
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };

  const scrollKeForm = () => scrollKe(formRef.current);

  const pilihPaket = (id: string) => {
    setPaketTerpilih(id);
    scrollKeForm();
  };

  const kirimKeWA = (e: React.FormEvent) => {
    e.preventDefault();
    const namaBersih = nama.trim();
    const waBersih = wa.trim().replace(/[\s-]/g, '');
    if (!namaBersih) {
      setError('Isi nama kamu dulu ya.');
      return;
    }
    if (!/^\+?[0-9]{9,16}$/.test(waBersih)) {
      setError('Nomor WA/HP belum valid — contoh: 081234567890.');
      return;
    }
    setError(null);
    const paket = PAKETS.find((p) => p.id === paketTerpilih) ?? PAKETS[0];
    const link = sukiWaLink(formatOrder(namaBersih, waBersih, usaha.trim(), paket, kebutuhan.trim()));
    // By design: order diteruskan ke WhatsApp resmi SUKI, bukan ke backend.
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      setError('Nomor WhatsApp SUKI belum dikonfigurasi. Coba lagi nanti.');
    }
  };

  return (
    <AppLayout active="home">
      <main className="sws">
        {/* HERO */}
        <section className="sws-hero" aria-labelledby="sws-judul">
          <div className="sws-orb sws-orb-1" aria-hidden="true" />
          <div className="sws-orb sws-orb-2" aria-hidden="true" />
          <div className="sws-wrap sws-hero-grid">
            <div className="sws-hero-teks">
            <p className="sws-kicker">Jasa Pembuatan Website · Kendari — Sulawesi Tenggara</p>
            <h1 id="sws-judul">
              Website yang menjual,
              <br />
              bukan sekadar tampil.
            </h1>
            <p className="sws-sub">
              SUKI Web Studio merancang dan membangun website untuk UMKM &amp; bisnis
              Indonesia — dari landing page sampai toko online. Kamu terima beres,
              kami yang urus teknisnya.
            </p>
            <div className="sws-cta-row">
              {waKonsultasi ? (
                <a
                  className="sws-btn sws-btn-emas"
                  href={waKonsultasi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessagesSquare size={18} aria-hidden />
                  Chat WhatsApp
                </a>
              ) : null}
              <a
                className="sws-btn sws-btn-hero-ghost"
                href="#sws-paket"
                onClick={(e) => {
                  e.preventDefault();
                  scrollKe(document.getElementById('sws-paket'));
                }}
              >
                Lihat Paket
                <ArrowRight size={18} aria-hidden />
              </a>
            </div>
            <ul className="sws-jaminan" aria-label="Jaminan SUKI Web Studio">
              <li>
                <BadgeCheck size={17} aria-hidden />
                <span>Harga transparan dalam rupiah</span>
              </li>
              <li>
                <ShieldCheck size={17} aria-hidden />
                <span>Garansi bug 30 hari</span>
              </li>
              <li>
                <PenTool size={17} aria-hidden />
                <span>2× revisi desain</span>
              </li>
              <li>
                <Server size={17} aria-hidden />
                <span>Domain &amp; hosting 1 tahun termasuk</span>
              </li>
            </ul>
            </div>
            <div className="sws-hero-visual" aria-hidden="true">
              <div className="sws-3d-stage">
              <div className="sws-mock">
                <div className="sws-mock-bar">
                  <span className="sws-mock-dot" />
                  <span className="sws-mock-dot" />
                  <span className="sws-mock-dot" />
                  <span className="sws-mock-url">Konsep desain baru — Marketplace</span>
                </div>
                <div className="sws-mock-body">
                  <MpKonsep />
                </div>
                <span className="sws-mock-chip sws-mock-chip-1">
                  <Check size={13} aria-hidden />
                  QRIS
                </span>
                <span className="sws-mock-chip sws-mock-chip-2">
                  <MessagesSquare size={13} aria-hidden />
                  Pesanan masuk WA
                </span>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUDAH TERMASUK DI SEMUA PAKET */}
        <section className="sws-ribbon sws-reveal" aria-label="Sudah termasuk di semua paket">
          <div className="sws-wrap">
            <p className="sws-ribbon-judul">Sudah termasuk di <strong>semua paket</strong></p>
            <ul className="sws-ribbon-list">
              {TERMASUK.map((t) => {
                const Ikon = t.ikon;
                return (
                  <li key={t.teks}>
                    <Ikon size={17} aria-hidden />
                    <span>{t.teks}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* PRICELIST */}
        <section className="sws-seksi" id="sws-paket" aria-labelledby="sws-paket-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Harga transparan</p>
            <h2 id="sws-paket-judul" className="sws-reveal">Pilih paket yang pas untuk bisnismu</h2>
            <p className="sws-lead sws-reveal">
              Semua harga dalam rupiah dan sekali bayar — kecuali Care Plan yang
              bersifat bulanan. Tanpa biaya tersembunyi.
            </p>
            <div className="sws-grid">
              {PAKETS.map((p, idx) => {
                const Ikon = p.ikon;
                const unggulan = Boolean(p.badge);
                return (
                  <article
                    key={p.id}
                    className={`sws-kartu sws-reveal${unggulan ? ' sws-kartu-unggulan' : ''}`}
                    style={{ '--sws-d': `${idx * 90}ms` } as any}
                    aria-label={`Paket ${p.nama}`}
                  >
                    {p.badge ? <span className="sws-badge">{p.badge}</span> : null}
                    <div className="sws-kartu-top">
                      <div className="sws-kartu-ikon" aria-hidden>
                        <Ikon size={22} />
                      </div>
                      <div>
                        <h3>{p.nama}</h3>
                        <p className="sws-tagline">{p.deskripsi}</p>
                      </div>
                    </div>
                    <p className="sws-harga">
                      {p.periode === '/bulan' ? null : (
                        <span className="sws-harga-mulai">mulai</span>
                      )}
                      <strong>{p.harga}</strong>
                      {p.periode === '/bulan' ? (
                        <span className="sws-harga-periode">/bulan</span>
                      ) : null}
                    </p>
                    <ul className="sws-fitur">
                      {p.fitur.map((f) => (
                        <li key={f}>
                          <Check size={15} aria-hidden />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="sws-waktu">
                      <Clock3 size={15} aria-hidden />
                      Estimasi: {p.waktu}
                    </p>
                    <button
                      type="button"
                      className={`sws-btn ${unggulan ? 'sws-btn-primary' : 'sws-btn-paket'}`}
                      onClick={() => pilihPaket(p.id)}
                    >
                      Pilih {p.nama}
                    </button>
                  </article>
                );
              })}
            </div>
            <p className="sws-harga-note">
              DP 50% di awal sebagai tanda jadi, pelunasan setelah website selesai
              dan sebelum go-live. Harga belum termasuk PPN 11% untuk kebutuhan
              faktur perusahaan.
            </p>
          </div>
        </section>

        {/* CONTOH GAYA DESAIN — ilustrasi jujur, bukan portofolio klien */}
        <section className="sws-seksi sws-seksi-alternatif" aria-labelledby="sws-gaya-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Contoh hasil</p>
            <h2 id="sws-gaya-judul" className="sws-reveal">Gaya desain yang bisa kamu dapatkan</h2>
            <p className="sws-lead sws-reveal">
              Setiap website kami rancang mengikuti identitas brand-mu. Kartu pertama
              adalah konsep desain baru marketplace SUKI — visi upgrade kelas global
              dengan konten ilustrasi; sisanya ilustrasi gaya, bukan screenshot
              website orang lain.
            </p>
            <div className="sws-showcase-grid">
              {SHOWCASE.map((s, i) => (
                <article
                  key={s.id}
                  className={`sws-sc-card sws-reveal ${s.tema}`}
                  style={{ '--sws-d': `${i * 90}ms` } as any}
                  aria-label={s.judul}
                >
                  <div className="sws-sc-bar" aria-hidden="true">
                    <span className="sws-mock-dot" />
                    <span className="sws-mock-dot" />
                    <span className="sws-mock-dot" />
                    <span className="sws-mock-url">{s.label}</span>
                  </div>
                  <div className="sws-sc-view" aria-hidden="true">
                    <span className="sws-sc-tag">{s.tag}</span>
                    {s.mini === 'marketplace' ? (
                      <div className="sws-sc-mp">
                        <MpKonsep ringkas />
                      </div>
                    ) : (
                      <>
                        <div className="sws-sc-hero" />
                        <div className="sws-mock-lines">
                          <i />
                          <i />
                        </div>
                        <div className="sws-mock-btn" />
                        <div className="sws-mock-row">
                          <i />
                          <i />
                          <i />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="sws-sc-body">
                    <p className="sws-sc-kategori">{s.kategori}</p>
                    <h3>{s.judul}</h3>
                    <p>{s.deskripsi}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="sws-sc-note sws-reveal">
              <BadgeCheck size={16} aria-hidden />
              <span>
                Portofolio klien nyata akan tampil di sini setelah project pertama selesai —
                tanpa logo atau testimoni karangan.
              </span>
            </p>
          </div>
        </section>

        {/* CARA MEMESAN */}
        <section className="sws-seksi sws-seksi-alternatif" id="sws-cara" aria-labelledby="sws-cara-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Mudah &amp; transparan</p>
            <h2 id="sws-cara-judul" className="sws-reveal">Dari chat sampai go-live dalam 4 langkah</h2>
            <ol className="sws-langkah sws-reveal">
              {LANGKAH.map((l, i) => {
                const Ikon = l.ikon;
                return (
                  <li key={l.judul} className="sws-langkah-item sws-reveal" style={{ '--sws-d': `${i * 100}ms` } as any}>
                    <div className="sws-langkah-nomor" aria-hidden>
                      <span>{i + 1}</span>
                    </div>
                    <div className="sws-langkah-isi">
                      <div className="sws-kartu-ikon" aria-hidden>
                        <Ikon size={20} />
                      </div>
                      <h3>{l.judul}</h3>
                      <p>{l.teks}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* KENAPA SUKI */}
        <section className="sws-seksi" aria-labelledby="sws-kenapa-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Kenapa kami</p>
            <h2 id="sws-kenapa-judul" className="sws-reveal">Kenapa SUKI Web Studio?</h2>
            <div className="sws-grid sws-grid-kenapa">
              {KEUNGGULAN.map((k, ki) => {
                const Ikon = k.ikon;
                return (
                  <article key={k.judul} className="sws-kenapa sws-reveal" style={{ '--sws-d': `${ki * 90}ms` } as any}>
                    <div className="sws-kartu-ikon" aria-hidden>
                      <Ikon size={22} />
                    </div>
                    <h3>{k.judul}</h3>
                    <p>{k.teks}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* BANDINGKAN — SUKI vs alternatif, klaim jujur */}
        <section className="sws-seksi sws-seksi-alternatif" aria-labelledby="sws-banding-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Bandingkan</p>
            <h2 id="sws-banding-judul" className="sws-reveal">Kenapa tidak bikin sendiri saja?</h2>
            <p className="sws-lead sws-reveal">
              Pertanyaan yang wajar. Ini perbandingan jujurnya.
            </p>
            <div className="sws-banding-scroll sws-reveal">
              <table className="sws-banding">
                <thead>
                  <tr>
                    <th scope="col"><span className="sws-sr">Kriteria</span></th>
                    {BANDING_KOLOM.map((k, i) => (
                      <th key={k} scope="col" className={i === 0 ? 'sws-banding-col-suki' : ''}>{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BANDING_BARIS.map((b) => (
                    <tr key={b.label}>
                      <th scope="row">{b.label}</th>
                      {b.nilai.map((n, i) => (
                        <td key={i} className={i === 0 ? 'sws-banding-col-suki' : ''}>
                          {n === 'ya' ? (
                            <span className="sws-nilai sws-nilai-ya" role="img" aria-label="Ya"><Check size={18} aria-hidden /></span>
                          ) : n === 'sebagian' ? (
                            <span className="sws-nilai sws-nilai-sebagian" role="img" aria-label="Sebagian"><Minus size={18} aria-hidden /></span>
                          ) : (
                            <span className="sws-nilai sws-nilai-tidak" role="img" aria-label="Tidak"><X size={18} aria-hidden /></span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sws-banding-catatan sws-reveal">{BANDING_CATATAN}</p>
          </div>
        </section>

        {/* FORM PEMESANAN */}
        <section className="sws-seksi sws-seksi-alternatif" aria-labelledby="sws-form-judul">
          <div className="sws-wrap">
            <p className="sws-seksi-kicker sws-reveal">Langkah terakhir</p>
            <h2 id="sws-form-judul" className="sws-reveal">Siap mulai? Isi formulir pemesanan</h2>
            <p className="sws-lead sws-reveal">
              Isi data di bawah — pesananmu langsung diteruskan ke WhatsApp resmi
              SUKI Web Studio dengan pesan yang sudah terisi otomatis.
            </p>
            <form ref={formRef} className="sws-form sws-reveal" onSubmit={kirimKeWA} noValidate>
              <div className="sws-field">
                <label htmlFor={namaId}>Nama kamu <span aria-hidden>*</span></label>
                <input
                  id={namaId}
                  name="nama"
                  type="text"
                  autoComplete="name"
                  placeholder="cth: Budi Santoso"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                />
              </div>
              <div className="sws-field">
                <label htmlFor={waId}>Nomor WA / HP <span aria-hidden>*</span></label>
                <input
                  id={waId}
                  name="whatsapp"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="cth: 081234567890"
                  value={wa}
                  onChange={(e) => setWa(e.target.value)}
                  required
                />
              </div>
              <div className="sws-field">
                <label htmlFor={usahaId}>Jenis usaha <span className="sws-opsional">(opsional)</span></label>
                <input
                  id={usahaId}
                  name="usaha"
                  type="text"
                  placeholder="cth: Warung kopi di Kendari"
                  value={usaha}
                  onChange={(e) => setUsaha(e.target.value)}
                />
              </div>
              <div className="sws-field">
                <label htmlFor={paketId}>Paket yang dipilih</label>
                <select
                  id={paketId}
                  name="paket"
                  value={paketTerpilih}
                  onChange={(e) => setPaketTerpilih(e.target.value)}
                >
                  {PAKETS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} — mulai {p.harga}
                      {p.periode === '/bulan' ? '/bln' : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sws-field sws-field-penuh">
                <label htmlFor={kebutuhanId}>Ceritakan kebutuhanmu</label>
                <textarea
                  id={kebutuhanId}
                  name="kebutuhan"
                  rows={4}
                  placeholder="cth: Saya butuh toko online untuk jual kue kering, ada sekitar 20 varian produk, mau bisa bayar QRIS."
                  value={kebutuhan}
                  onChange={(e) => setKebutuhan(e.target.value)}
                />
              </div>
              {error ? (
                <p className="sws-error" role="alert">{error}</p>
              ) : null}
              <button type="submit" className="sws-btn sws-btn-primary sws-btn-submit">
                <MessagesSquare size={18} aria-hidden />
                Kirim via WhatsApp
              </button>
              <p className="sws-form-catatan">
                Dengan menekan tombol di atas, WhatsApp akan terbuka dengan pesan pesanan yang
                sudah terisi otomatis. Tanpa akun, tanpa ribet.
              </p>
            </form>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="sws-cta-banner" aria-labelledby="sws-cta-judul">
          <div className="sws-wrap sws-cta-banner-dalam sws-reveal">
            <div>
              <h2 id="sws-cta-judul" className="sws-reveal">Masih ragu paket mana yang cocok?</h2>
              <p>
                Ngobrol dulu via WhatsApp. Ceritakan bisnismu — kami bantu petakan
                kebutuhan dan rekomendasikan paket yang paling pas, tanpa komitmen.
              </p>
            </div>
            {waKonsultasi ? (
              <a
                className="sws-btn sws-btn-emas sws-btn-besar"
                href={waKonsultasi}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessagesSquare size={18} aria-hidden />
                Chat WhatsApp
              </a>
            ) : null}
          </div>
        </section>

        {/* FAQ */}
        <section className="sws-seksi" aria-labelledby="sws-faq-judul">
          <div className="sws-wrap sws-wrap-sempit">
            <p className="sws-seksi-kicker sws-reveal">Sering ditanyakan</p>
            <h2 id="sws-faq-judul" className="sws-reveal">Pertanyaan yang sering ditanyakan</h2>
            <div className="sws-faq">
              {FAQS.map((f, fi) => (
                <details key={f.q} className="sws-faq-item sws-reveal" style={{ '--sws-d': `${fi * 70}ms` } as any}>
                  <summary>
                    <span>{f.q}</span>
                    <ChevronDown size={18} aria-hidden className="sws-faq-chevron" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p className="sws-kembali">
              <Link href="/">← Kembali ke SUKI Apps</Link>
            </p>
          </div>
        </section>

        {/* STICKY CTA — mobile saja */}
        <div className="sws-stickybar" role="region" aria-label="Aksi cepat">
          <a
            className="sws-btn sws-btn-ghost sws-btn-sticky"
            href="#sws-paket"
            onClick={(e) => {
              e.preventDefault();
              scrollKe(document.getElementById('sws-paket'));
            }}
          >
            Lihat Paket
          </a>
          {waKonsultasi ? (
            <a
              className="sws-btn sws-btn-primary sws-btn-sticky"
              href={waKonsultasi}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessagesSquare size={17} aria-hidden />
              Chat WhatsApp
            </a>
          ) : null}
        </div>
      </main>
    </AppLayout>
  );
}
