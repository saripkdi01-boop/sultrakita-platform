'use client';

/**
 * SUKI Web Studio — halaman publik jasa pembuatan website.
 *
 * JUJUR BY DESIGN: form pemesanan TIDAK mengirim ke backend. Saat submit,
 * pesan terformat dibuka ke WhatsApp resmi SUKI via sukiWaLink() (wa.me).
 * Tidak ada data yang disimpan — ini disengaja sampai ada keputusan
 * untuk membangun alur order server-side.
 */

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Sparkles,
  Store,
  Wrench,
  Globe,
  LayoutDashboard,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { sukiWaLink } from '@/lib/whatsapp';
import './web-studio.css';

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
    harga: 'Rp 1,5 jt',
    periode: 'harga mulai',
    deskripsi: 'Satu halaman yang fokus menjual satu produk atau mengumpulkan leads.',
    fitur: [
      'Desain mobile-friendly & cepat',
      'Tombol WhatsApp + form kontak',
      'Domain & hosting 1 tahun',
      'SSL & SEO dasar',
    ],
    waktu: '3–5 hari kerja',
    ikon: Rocket,
  },
  {
    id: 'company-profile',
    nama: 'Company Profile',
    harga: 'Rp 3 jt',
    periode: 'harga mulai',
    deskripsi: 'Website perusahaan profesional yang bikin bisnismu terlihat kredibel.',
    fitur: [
      '8–15 halaman (profil, layanan, blog, kontak)',
      'Desain sesuai identitas brand',
      'Admin panel — update konten mandiri',
      'SEO on-page + Google Analytics',
      'Domain & hosting 1 tahun',
    ],
    waktu: '10–14 hari kerja',
    ikon: Globe,
  },
  {
    id: 'toko-online',
    nama: 'Toko Online',
    harga: 'Rp 6 jt',
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
    waktu: '21–30 hari kerja',
    ikon: Store,
  },
  {
    id: 'web-aplikasi',
    nama: 'Web Aplikasi Custom',
    harga: 'Rp 15 jt',
    periode: 'harga mulai',
    deskripsi: 'Sistem web sesuai alur kerja bisnismu — kasir, inventori, booking, dashboard.',
    fitur: [
      'Login & dashboard admin',
      'Fitur sesuai kebutuhan operasional',
      'Laporan & export data',
      'Integrasi API (pembayaran, dsb.)',
      'Pelatihan penggunaan',
    ],
    waktu: '4–8 minggu',
    ikon: LayoutDashboard,
  },
  {
    id: 'care-plan',
    nama: 'Care Plan',
    harga: 'Rp 500 rb',
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

const KEUNGGULAN = [
  {
    ikon: MessagesSquare,
    judul: 'Konsultasi gratis, tanpa komitmen',
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

const FAQS = [
  {
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
  'Halo SUKI Web Studio! Saya ingin konsultasi gratis tentang pembuatan website untuk bisnis saya.';

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
          <div className="sws-wrap">
            <p className="sws-kicker">Jasa Pembuatan Website</p>
            <h1 id="sws-judul">SUKI Web Studio</h1>
            <p className="sws-sub">
              Website profesional untuk UMKM &amp; bisnis Indonesia — dari landing page sampai toko
              online. Kami rancang, kami bangun, kamu terima beres.
            </p>
            <div className="sws-cta-row">
              {waKonsultasi ? (
                <a
                  className="sws-btn sws-btn-primary"
                  href={waKonsultasi}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessagesSquare size={18} aria-hidden />
                  Konsultasi Gratis
                </a>
              ) : null}
              <a className="sws-btn sws-btn-ghost" href="#sws-paket" onClick={(e) => {
                e.preventDefault();
                scrollKe(document.getElementById('sws-paket'));
              }}>
                Lihat Paket
                <ArrowRight size={18} aria-hidden />
              </a>
            </div>
            <ul className="sws-hero-points">
              <li><Check size={16} aria-hidden /> Harga transparan dalam rupiah</li>
              <li><Check size={16} aria-hidden /> Domain &amp; hosting 1 tahun termasuk</li>
              <li><Check size={16} aria-hidden /> Garansi bug 30 hari</li>
            </ul>
          </div>
        </section>

        {/* PRICELIST */}
        <section className="sws-seksi" id="sws-paket" aria-labelledby="sws-paket-judul">
          <div className="sws-wrap">
            <h2 id="sws-paket-judul">Pilih paket yang pas untuk bisnismu</h2>
            <p className="sws-lead">
              Semua harga dalam rupiah, sekali bayar — kecuali Care Plan yang bersifat bulanan.
            </p>
            <div className="sws-grid">
              {PAKETS.map((p) => {
                const Ikon = p.ikon;
                return (
                  <article
                    key={p.id}
                    className={`sws-kartu${p.badge ? ' sws-kartu-unggulan' : ''}`}
                    aria-label={`Paket ${p.nama}`}
                  >
                    {p.badge ? <span className="sws-badge">{p.badge}</span> : null}
                    <div className="sws-kartu-ikon" aria-hidden>
                      <Ikon size={22} />
                    </div>
                    <h3>{p.nama}</h3>
                    <p className="sws-harga">
                      <span className="sws-harga-mulai">{p.periode === '/bulan' ? '' : 'mulai '}</span>
                      <strong>{p.harga}</strong>
                      <span className="sws-harga-periode">{p.periode === '/bulan' ? '/bulan' : ''}</span>
                    </p>
                    <p className="sws-deskripsi">{p.deskripsi}</p>
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
                      className="sws-btn sws-btn-paket"
                      onClick={() => pilihPaket(p.id)}
                    >
                      Pilih Paket
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* KENAPA SUKI */}
        <section className="sws-seksi sws-seksi-alternatif" aria-labelledby="sws-kenapa-judul">
          <div className="sws-wrap">
            <h2 id="sws-kenapa-judul">Kenapa SUKI Web Studio?</h2>
            <div className="sws-grid sws-grid-kenapa">
              {KEUNGGULAN.map((k) => {
                const Ikon = k.ikon;
                return (
                  <article key={k.judul} className="sws-kenapa">
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

        {/* FORM PEMESANAN */}
        <section className="sws-seksi" aria-labelledby="sws-form-judul">
          <div className="sws-wrap">
            <h2 id="sws-form-judul">Formulir pemesanan</h2>
            <p className="sws-lead">
              Isi formulir di bawah — pesananmu akan diteruskan ke WhatsApp resmi SUKI Web Studio.
            </p>
            <form ref={formRef} className="sws-form" onSubmit={kirimKeWA} noValidate>
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

        {/* FAQ */}
        <section className="sws-seksi sws-seksi-alternatif" aria-labelledby="sws-faq-judul">
          <div className="sws-wrap sws-wrap-sempit">
            <h2 id="sws-faq-judul">Pertanyaan yang sering ditanyakan</h2>
            <div className="sws-faq">
              {FAQS.map((f) => (
                <details key={f.q} className="sws-faq-item">
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
      </main>
    </AppLayout>
  );
}
