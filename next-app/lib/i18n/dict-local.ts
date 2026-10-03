/**
 * SUKI Apps — Kamus label lokal: id (Indonesia), jv (Basa Jawa), su (Basa Sunda)
 *
 * Kunci WAJIB selaras dengan CORE_LABELS_ID di core-labels.ts.
 * `satisfies Record<CoreLabelKey, string>` menjamin tidak ada kunci yang hilang
 * di bahasa mana pun — TypeScript akan error saat compile bila ada yang kurang.
 *
 * - jv: ngoko sopan/krama lugu yang lazim dipakai di UI aplikasi.
 * - su: basa lemes yang wajar untuk UI aplikasi.
 */

import type { CoreLabelKey } from './core-labels';

export const dictLocal = {
  id: {
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
    heroSubtitle:
      'Ekosistem digital yang menghubungkan kebutuhan, peluang, dan jejaring lokal Sulawesi Tenggara.',
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
  } satisfies Record<CoreLabelKey, string>,

  jv: {
    // Navigasi utama
    home: 'Omah',
    ecosystem: 'Ekosistem',
    marketplace: 'Marketplace',
    property: 'Properti',
    jobs: 'Lowongan',
    groups: 'Komunitas',
    business: 'Bisnis',
    chat: 'Pesen',
    notifications: 'Kabar',
    profile: 'Profil',
    settings: 'Setelan',
    help: 'Pitulungan',

    // Homepage hero
    heroBadge: 'Ekosistem digital Sulawesi Kidul-Wétan',
    heroTitle1: 'Temokaké.',
    heroTitle2: 'Kegayutan.',
    heroTitle3: 'Tuwuh.',
    heroSubtitle:
      'Ekosistem digital sing nggayutaké kabutuhan, kasempatan, lan jejaring lokal Sulawesi Kidul-Wétan.',
    heroCtaPrimary: 'Jelajahana Ekosistem',
    heroCtaBusiness: 'Mlebu ing SUKI Business',
    login: 'Mlebu',
    register: 'Ndaftar',
    logout: 'Metu',

    // Aksi umum
    search: 'Golèk',
    searchPlaceholder: 'Golèk produk, papan, utawa warga',
    close: 'Tutup',
    open: 'Buka',
    save: 'Simpen',
    cancel: 'Batal',
    delete: 'Busak',
    edit: 'Owahi',
    loading: 'Muat...',
    viewAll: 'Deleng Kabèh',
    back: 'Bali',
    next: 'Sabanjuré',
    submit: 'Kirim',
    confirm: 'Konfirmasi',

    // Pengaturan & bahasa
    language: 'Basa',
    chooseLanguage: 'Pilih basa',
    darkMode: 'Mode peteng',
    lightMode: 'Mode padhang',
    privacy: 'Pusat Privasi',
    system: 'Ndhèrèk piranti',
    active: 'Aktif',

    // Footer / umum
    aboutUs: 'Babagan Kita',
    contact: 'Kontak',
    terms: 'Syarat & Katemtuan',
    copyright: 'Hak cipta dilindhungi',
  } satisfies Record<CoreLabelKey, string>,

  su: {
    // Navigasi utama
    home: 'Tepi',
    ecosystem: 'Ékosistem',
    marketplace: 'Marketplace',
    property: 'Properti',
    jobs: 'Lowongan Gawé',
    groups: 'Komunitas',
    business: 'Bisnis',
    chat: 'Pesen',
    notifications: 'Bewara',
    profile: 'Profil',
    settings: 'Setélan',
    help: 'Pitulung',

    // Homepage hero
    heroBadge: 'Ékosistem digital Sulawesi Kidul-Wétan',
    heroTitle1: 'Panggihan.',
    heroTitle2: 'Kahubung.',
    heroTitle3: 'Tumuwuh.',
    heroSubtitle:
      'Ékosistem digital anu ngahubungkeun kabutuhan, kasempetan, jeung jaringan lokal Sulawesi Kidul-Wétan.',
    heroCtaPrimary: 'Jajap Ékosistem',
    heroCtaBusiness: 'Lebet ka SUKI Business',
    login: 'Lebet',
    register: 'Ngadaptar',
    logout: 'Kaluar',

    // Aksi umum
    search: 'Téang',
    searchPlaceholder: 'Téang produk, lokasi, atawa warga',
    close: 'Tutup',
    open: 'Buka',
    save: 'Simpen',
    cancel: 'Batal',
    delete: 'Pupus',
    edit: 'Robah',
    loading: 'Nuju dimuat...',
    viewAll: 'Tingali Sadayana',
    back: 'Balik',
    next: 'Teraskeun',
    submit: 'Kirim',
    confirm: 'Konfirmasi',

    // Pengaturan & bahasa
    language: 'Basa',
    chooseLanguage: 'Pilih basa',
    darkMode: 'Mode poék',
    lightMode: 'Mode caang',
    privacy: 'Pusat Privasi',
    system: 'Tuturkeun alat',
    active: 'Aktif',

    // Footer / umum
    aboutUs: 'Ngeunaan Kami',
    contact: 'Kontak',
    terms: 'Syarat & Katangtuan',
    copyright: 'Hak cipta ditangtayungan',
  } satisfies Record<CoreLabelKey, string>,
} as const;

export type DictLocalLang = keyof typeof dictLocal;
export type DictLocalKey = keyof typeof dictLocal.id;
