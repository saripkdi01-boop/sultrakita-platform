/**
 * Konstanta situs & fakta terverifikasi.
 * JANGAN menambah nama, angka, atau alamat yang tidak bersumber.
 */

function cleanUrl(u: string | undefined, fallback: string): string {
  const v = (u || fallback).trim();
  return v.endsWith("/") ? v.slice(0, -1) : v;
}

export const SITE = {
  name: "PSI Kendari",
  tagline: "Partai Super TBK",
  title: "PSI Kendari — Partai Super TBK",
  description:
    "Situs berita dan profil Partai Solidaritas Indonesia (PSI) wilayah Kota Kendari dan sekitarnya, Sulawesi Tenggara: berita resmi psi.id, kabar Kendari & Sultra, politik terbaru, dan data Pemilu.",
  url: cleanUrl(process.env.SITE_URL, "http://localhost:3000"),
  locale: "id_ID",
  lang: "id",
  timeZone: "Asia/Makassar",
  timeZoneLabel: "WITA",
  contactEmail: (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim(),
} as const;

/** Tautan resmi (dicantumkan di masterprompt / ditemukan di sumber resmi). */
export const LINKS = {
  psi: "https://psi.id/",
  daftarAnggota: "https://psi.id/menjadi-anggota/",
  akuPsi: "https://aku.psi.id/",
  relawan: "https://psi.id/pendaftaran-relawan-tanggap-bencana/",
  youtube: "https://www.youtube.com/c/SolidaritasID",
  kpu: "https://www.kpu.go.id/",
  infoPemilu: "https://infopemilu.kpu.go.id/",
  bawaslu: "https://www.bawaslu.go.id/",
} as const;

/** Kanal YouTube resmi PSI (ID diverifikasi dari halaman kanal SolidaritasID). */
export const YOUTUBE_CHANNEL_ID = "UCY2kkUWxtRKoW_qopjGGAtw";

/** Media sosial resmi yang sudah terverifikasi. Tambahkan hanya yang tervalidasi. */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "YouTube SolidaritasID", href: LINKS.youtube },
];

export type Kantor = {
  nama: string;
  alamat: string[];
  catatan?: string;
  sumber?: string;
};

export const KANTOR_DPP: Kantor = {
  nama: "Kantor Pusat DPP PSI",
  alamat: [
    "Jl. K.H. Wahid Hasyim No. 194",
    "Kampung Bali, Tanah Abang",
    "Jakarta Pusat 10250",
  ],
  catatan:
    "Sesuai profil publik partai. Verifikasi otomatis ke halaman kontak psi.id belum dapat dilakukan karena psi.id menolak akses otomatis (Cloudflare challenge); cocokkan dengan psi.id.",
  sumber: "https://psi.id/",
};

export const KANTOR_DPW_SULTRA: Kantor = {
  nama: "DPW PSI Sulawesi Tenggara",
  alamat: ["Jl. Laute 3 No. 9", "Mandonga, Kota Kendari", "Sulawesi Tenggara"],
};

export const KANTOR_DPD_KENDARI: Kantor = {
  nama: "DPD PSI Kota Kendari",
  alamat: [],
  catatan: "Alamat sekretariat menunggu data resmi.",
};

export const NAV: { href: string; label: string }[] = [
  { href: "/berita-psi", label: "Berita PSI" },
  { href: "/kendari-sultra", label: "Kendari & Sultra" },
  { href: "/politik-terbaru", label: "Politik Terbaru" },
  { href: "/data-pemilu", label: "Data Pemilu" },
  { href: "/klarifikasi", label: "Klarifikasi" },
  { href: "/profil", label: "Profil" },
  { href: "/struktur", label: "Struktur" },
  { href: "/agenda", label: "Agenda" },
  { href: "/galeri", label: "Galeri" },
  { href: "/kontak", label: "Kontak" },
];

export const REVALIDATE_SECONDS = (() => {
  const n = Number(process.env.REVALIDATE_SECONDS);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 900;
})();
