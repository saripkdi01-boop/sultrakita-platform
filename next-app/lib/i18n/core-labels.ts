/**
 * SUKI Apps — Kamus label inti Bahasa Indonesia (sumber kebenaran)
 * Kunci ini diterjemahkan ke 27 bahasa di lib/i18n.ts
 */

export const CORE_LABELS_ID = {
  // Navigasi utama
  home: 'Beranda',
  ecosystem: 'Ekosistem',
  marketplace: 'Marketplace',
  property: 'Properti',
  jobs: 'Lowongan',
  groups: 'Komunitas',
  business: 'Bisnis',
  chat: 'Pesan',
  notifications: 'Notifikasi',
  profile: 'Profil',
  settings: 'Pengaturan',
  help: 'Bantuan',

  // Homepage hero
  heroBadge: 'Ekosistem digital Sulawesi Tenggara',
  heroTitle1: 'Temukan.',
  heroTitle2: 'Terhubung.',
  heroTitle3: 'Bertumbuh.',
  heroSubtitle: 'Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.',
  heroCtaPrimary: 'Jelajahi Ekosistem',
  heroCtaBusiness: 'Masuk ke SUKI Business',
  login: 'Masuk',
  register: 'Daftar',
  logout: 'Keluar',

  // Aksi umum
  search: 'Cari',
  searchPlaceholder: 'Cari produk, lokasi, atau warga',
  close: 'Tutup',
  open: 'Buka',
  save: 'Simpan',
  cancel: 'Batal',
  delete: 'Hapus',
  edit: 'Ubah',
  loading: 'Memuat...',
  viewAll: 'Lihat Semua',
  back: 'Kembali',
  next: 'Lanjut',
  submit: 'Kirim',
  confirm: 'Konfirmasi',

  // Pengaturan & bahasa
  language: 'Bahasa',
  chooseLanguage: 'Pilih bahasa',
  darkMode: 'Mode gelap',
  lightMode: 'Mode terang',
  privacy: 'Pusat Privasi',
  system: 'Ikuti perangkat',
  active: 'Aktif',

  // Footer / umum
  aboutUs: 'Tentang Kami',
  contact: 'Kontak',
  terms: 'Syarat & Ketentuan',
  copyright: 'Hak cipta dilindungi',
} as const;

export type CoreLabelKey = keyof typeof CORE_LABELS_ID;
