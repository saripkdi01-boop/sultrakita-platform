/**
 * Konten homepage Suki Apps (sukiapps.web.id) — satu sumber kebenaran.
 *
 * Aturan kejujuran (master prompt homepage v2 + prompt Ren v1, 26 Nov 2026):
 * - Harga: SATU HARGA, DUA MATA UANG (keputusan owner 26 Nov 2026). Jangan ubah
 *   tanpa keputusan Kiki. Rp 99rb dan $290 sebagai harga awal SUDAH DIBUANG.
 * - Fitur tiap paket diterjemahkan dari halaman Studio (public/suki-studio/index.html),
 *   bukan dikarang.
 * - Portofolio: tiga produk yang benar-benar live (sama dengan seksi "Work" di Studio).
 * - Testimoni: BELUM ADA kutipan terverifikasi → placeholder jelas, tidak dikarang.
 * - Cari penanda: [CONTOH], [TESTIMONI …], [NOMOR WA RESMI], [HARGA RUPIAH CARE PLAN …].
 */

export type DoorId = 'marketplace' | 'properti' | 'lowongan' | 'komunitas' | 'bisnis' | 'kendari';

export type Door = {
  id: DoorId;
  name: string;
  href: string;
  /** Satuan angka hidup, mis. "listing aktif". */
  unit: string;
  /** Satu kalimat manfaat spesifik per ruang. */
  benefit: string;
};

export const DOORS: Door[] = [
  {
    id: 'marketplace',
    name: 'Marketplace',
    href: '/marketplace',
    unit: 'listing aktif',
    benefit: 'Jual dan beli barang dari penjual di sekitarmu, langsung dari HP.',
  },
  {
    id: 'properti',
    name: 'Properti',
    href: '/properti',
    unit: 'properti tersedia',
    benefit: 'Rumah, tanah, dan kos di Sultra — lengkap dengan simulasi KPR.',
  },
  {
    id: 'lowongan',
    name: 'Lowongan',
    href: '/jobs',
    unit: 'lowongan dibuka',
    benefit: 'Peluang kerja dari usaha dan perusahaan lokal Sulawesi Tenggara.',
  },
  {
    id: 'komunitas',
    name: 'Komunitas',
    href: '/groups',
    unit: 'grup publik',
    benefit: 'Gabung grup warga, hobi, dan usaha — ngobrol dengan orang sekampung.',
  },
  {
    id: 'bisnis',
    name: 'Bisnis',
    href: '/Business',
    unit: 'usaha terdaftar',
    benefit: 'Daftarkan usahamu di direktori supaya gampang ditemukan pelanggan lokal.',
  },
  {
    id: 'kendari',
    name: 'Kendari Lokal',
    href: '/kendari',
    unit: 'panduan kategori',
    benefit: 'Panduan jual-beli khas Kendari: motor bekas, kos, kuliner, sampai jasa tukang.',
  },
];

/* ------------------------------------------------------------------ */
/* Harga — satu harga, dua mata uang                                   */
/* ------------------------------------------------------------------ */

export type Currency = 'idr' | 'usd';

export type Tier = {
  id: 'website' | 'ai-web-app' | 'saas';
  name: string;
  price: Record<Currency, string>;
  /** Ringkasan durasi & sifat, dari Studio. */
  meta: string;
  features: string[];
};

export const PRICE_SENTENCE =
  'Harga yang sama, dalam rupiah untuk Indonesia dan dolar untuk klien internasional.';

export const TIERS: Tier[] = [
  {
    id: 'website',
    name: 'Website',
    price: { idr: 'Rp 2,5 jt', usd: '$149' },
    meta: 'Sekali bayar · 5+ halaman · tayang ±2 hari',
    features: [
      'Website premium 5+ halaman',
      'Desain mobile-first dengan animasi',
      'Integrasi kontak & WhatsApp',
      'Pengaturan SEO dasar',
    ],
  },
  {
    id: 'ai-web-app',
    name: 'AI Web App',
    price: { idr: 'Rp 5 jt', usd: '$299' },
    meta: 'Sekali bayar · terhubung AI · tayang ≤1 minggu',
    features: [
      'Semua yang ada di paket Website',
      'Chat AI & fitur pintar bawaan',
      'Toko online atau sistem booking',
      'Analitik + SEO lanjutan',
      'Dukungan prioritas 30 hari',
    ],
  },
  {
    id: 'saas',
    name: 'SaaS Platform',
    price: { idr: 'Rp 8 jt', usd: '$499' },
    meta: 'Sekali bayar · platform custom · tayang ≤1 minggu',
    features: [
      'Web app atau produk SaaS',
      'Login, database, dan dashboard',
      'Integrasi fitur AI',
      'Dukungan prioritas 90 hari',
    ],
  },
];

export const CARE_PLAN = {
  name: 'Care Plan',
  /** Owner baru menetapkan harga dolar. Rupiah belum ditetapkan — jangan dikarang. */
  price: '$29',
  period: '/bln',
  /* [HARGA RUPIAH CARE PLAN — KONFIRMASI OWNER] — ganti catatan ini bila Kiki menetapkan angka rupiah. */
  idrNote: 'Harga rupiah dikonfirmasi saat konsultasi.',
  features: ['Hosting & cek uptime', 'Backup rutin', 'Update keamanan', 'Perubahan konten kecil'],
  footnote: 'Opsional, bisa berhenti kapan saja.',
};

/** Pengurang risiko — semuanya fakta dari halaman Studio (FAQ & pricing). */
export const RISK_REDUCERS = [
  { title: 'Bayar 50/50', text: 'Separuh di awal, separuh saat website tayang.' },
  { title: 'Kode 100% milik klien', text: 'Domain, kode, dan konten jadi milikmu sepenuhnya.' },
  { title: 'Harga dikunci di awal', text: 'Disepakati tertulis sebelum mulai — tanpa tagihan kejutan.' },
  { title: 'Revisi termasuk', text: 'Setiap paket sudah termasuk putaran revisi desain.' },
];

/** Jangkar harga pasar — angka publikasi penyedia, dikutip dari Studio (dicek Okt 2026). */
export const MARKET_ANCHOR = {
  rows: [
    { label: 'Agensi kreatif premium', value: 'mulai $50.000' },
    { label: 'Rentang pasar desain web (data WebFX)', value: '$1.000 – $30.000' },
    { label: 'Suki Studio — harga tetap', value: '$149 – $499', ours: true },
  ],
  source:
    'Angka pasar adalah rentang yang dipublikasikan penyedia sendiri (dicek Oktober 2026) — untuk menunjukkan selisih, bukan hasil kerja kami.',
};

/* ------------------------------------------------------------------ */
/* Bukti nyata                                                         */
/* ------------------------------------------------------------------ */

export type PortfolioItem = {
  id: string;
  kind: string;
  title: string;
  problem: string;
  outcome: string;
  url: string;
  urlLabel: string;
  mobileShot: string;
  mobileAlt: string;
  desktopShot?: string;
  desktopAlt?: string;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: 'senten',
    kind: 'Proyek klien · Live',
    title: 'Website personal agen properti — Senten Febrari Kadir Massa, Kendari',
    problem: 'Listing tersebar di brosur dan chat.',
    outcome: 'Personal branding + katalog Bumi Samarkand & Villa Madinah Land, simulasi KPR, tombol WhatsApp. Live dan dikelola klien.',
    url: 'https://senchen.vercel.app/',
    urlLabel: 'senchen.vercel.app',
    mobileShot: '/images/homepage/portfolio-senten-mobile.jpg',
    mobileAlt: 'Tampilan HP website agen properti Senten Febrari Kadir Massa',
    // Screenshot asli lama dipertahankan sebagai tampilan detail desktop.
    desktopShot: '/images/portfolio-senten.jpg',
    desktopAlt: 'Tampilan desktop website agen properti Senten Febrari Kadir Massa',
  },
  {
    id: 'grahaos',
    kind: 'Produk kami · Live',
    title: 'GrahaOS — sistem operasi untuk developer properti',
    problem: 'Proyek, keuangan, dan legal dicatat di spreadsheet terpisah.',
    outcome: 'SaaS multi-tenant: proyek, keuangan, inventori, legal, dan CRM dalam satu sistem. Live, database penuh sudah dimigrasi.',
    url: 'https://grahaos.vercel.app/',
    urlLabel: 'grahaos.vercel.app',
    mobileShot: '/images/homepage/portfolio-grahaos-mobile.jpg',
    mobileAlt: 'Tampilan HP layar masuk GrahaOS',
  },
  {
    id: 'sukiapps',
    kind: 'Platform kami · Live',
    title: 'Suki Apps — ekosistem digital Sulawesi Tenggara',
    problem: 'Layanan lokal tersebar di banyak aplikasi dan grup chat.',
    outcome: 'Marketplace, properti, lowongan, komunitas, dan direktori bisnis dalam satu ekosistem. Live di produksi — halaman yang sedang kamu baca.',
    url: 'https://sukiapps.web.id/',
    urlLabel: 'sukiapps.web.id',
    mobileShot: '/images/homepage/portfolio-sukiapps-mobile.jpg',
    mobileAlt: 'Tampilan HP beranda Suki Apps',
  },
];

export const TESTIMONIAL = {
  /** false = belum ada kutipan terverifikasi; JANGAN isi dengan kutipan karangan. */
  verified: false,
  quote: '[TESTIMONI — ISI DENGAN KUTIPAN KLIEN TERVERIFIKASI]',
  /** Isi saat terverifikasi: nama, peran, dan satu metrik nyata (dengan izin klien). */
  name: '',
  role: '',
  metric: '',
  pendingNote:
    'Kami tidak memakai testimoni berbayar atau kutipan karangan. Kutipan klien pertama yang terverifikasi — nama, peran, dan satu metrik nyata — tampil di sini dengan izin.',
};

/* ------------------------------------------------------------------ */
/* Produk Suki                                                         */
/* ------------------------------------------------------------------ */

export const PRODUCTS = [
  {
    id: 'grahaos',
    name: 'GrahaOS',
    tag: 'SaaS properti',
    benefit: 'Proyek, keuangan, inventori, legal, dan CRM developer properti dalam satu sistem.',
    href: 'https://grahaos.vercel.app/',
    external: true,
  },
  {
    id: 'sukiapps',
    name: 'Suki Apps',
    tag: 'Ekosistem lokal',
    benefit: 'Enam ruang digital Sultra — dari jual-beli sampai komunitas — dengan satu akun.',
    href: '/beranda',
    external: false,
  },
  {
    id: 'studio',
    name: 'Suki Studio Web',
    tag: 'Jasa website',
    benefit: 'Website, AI web app, dan SaaS dengan harga tetap yang disepakati di awal.',
    href: '/suki-studio/index.html',
    external: false,
  },
  {
    id: 'hermes',
    name: 'Hermes Agent',
    tag: 'Asisten AI Android',
    benefit: 'Chat AI dengan input suara dan lampiran, dirancang ringan untuk HP kelas pemula.',
    href: null,
    external: false,
  },
] as const;

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

/**
 * [NOMOR WA RESMI] — homepage TIDAK menulis nomor sendiri. Semua tombol WA memakai
 * helper `sukiWaLink()` (lib/whatsapp.ts) yang membaca NEXT_PUBLIC_SUKI_WA_NUMBER
 * atau nomor default resmi yang ditetapkan owner. Bila helper mengembalikan null,
 * tombol WA disembunyikan.
 */
export const WA_MESSAGES = {
  general: 'Halo Suki, saya mau tanya soal Suki Apps.',
  tier: (tierName: string, price: string) =>
    `Halo Suki, saya tertarik paket ${tierName} (${price}). Boleh konsultasi dulu?`,
  care: 'Halo Suki, saya mau tanya soal Care Plan.',
};

export const SIGNUP_HREF = '/signup';
export const STUDIO_HREF = '/suki-studio/index.html';
