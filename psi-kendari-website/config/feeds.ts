/**
 * Daftar feed RSS resmi media & lembaga untuk agregasi "Politik Terbaru".
 * Ubah di sini saja. Aturan: hanya JUDUL + ringkasan ≤ 280 karakter + nama media +
 * tanggal + tautan keluar. Tidak ada gambar/isi penuh dari media lain.
 *
 * Status diperiksa 27 Nov 2026 dari jaringan pengembangan:
 *  - Kompas: tidak ditemukan feed RSS publik tanpa API key → dilewati.
 *  - Tribunnews / Tribun Sultra: feed menolak akses otomatis (HTTP 403) → dilewati.
 *  - KPU (kpu.go.id): tidak ada RSS; API berita mensyaratkan login → dilewati (tidak dibobol).
 *  - Tempo kanal politik: HTTP 403 → memakai kanal nasional + saring kata kunci politik.
 *  - detik kanal pemilu: feed tidak diperbarui sejak Des 2024 → memakai kanal berita + saringan.
 *  - Media lokal zonasultra.id (Cloudflare challenge) & telisik.id (tanpa feed) → dilewati.
 */

export type FeedKategori = "nasional" | "pemilu" | "lokal";

export type FeedSource = {
  id: string;
  /** Nama media yang ditampilkan. */
  nama: string;
  url: string;
  kategori: FeedKategori;
  /** Bila true, hanya item yang memuat kata kunci politik yang diambil. */
  saringPolitik?: boolean;
  /** Maks. item yang diambil dari feed ini. */
  maks?: number;
};

export const FEEDS: FeedSource[] = [
  { id: "antara-politik", nama: "ANTARA", url: "https://www.antaranews.com/rss/politik.xml", kategori: "nasional" },
  { id: "cnn-nasional", nama: "CNN Indonesia", url: "https://www.cnnindonesia.com/nasional/rss", kategori: "nasional", saringPolitik: true },
  { id: "tempo-nasional", nama: "Tempo", url: "https://rss.tempo.co/nasional", kategori: "nasional", saringPolitik: true },
  { id: "detik-berita", nama: "detikNews", url: "https://news.detik.com/berita/rss", kategori: "nasional", saringPolitik: true },
  { id: "bawaslu", nama: "Bawaslu RI", url: "https://www.bawaslu.go.id/id/rss.xml", kategori: "pemilu" },
  { id: "antara-sultra", nama: "ANTARA Sultra", url: "https://sultra.antaranews.com/rss/terkini.xml", kategori: "lokal", saringPolitik: true },
];

/** Feed regional ANTARA Sultra per kabupaten/kota (slug = nilai `antara_feed` di content/struktur/dpd.json). */
export function antaraSultraFeed(slug: string): FeedSource {
  return {
    id: `antara-sultra-${slug}`,
    nama: "ANTARA Sultra",
    url: `https://sultra.antaranews.com/rss/${slug}.xml`,
    kategori: "lokal",
    maks: 8,
  };
}

/** Kata kunci politik/pemilu untuk menyaring feed umum (huruf kecil, pencocokan kata). */
export const KATA_POLITIK = [
  "politik", "partai", "pemilu", "pilkada", "pileg", "pilpres", "kpu", "bawaslu", "dkpp",
  "dpr", "dprd", "dpd ri", "mpr", "parlemen", "legislatif", "fraksi", "koalisi", "oposisi",
  "caleg", "capres", "cawapres", "kampanye", "presiden", "wakil presiden", "menteri", "kabinet",
  "gubernur", "bupati", "wali kota", "walikota", "kepala daerah", "ketua umum", "ketum",
  "undang-undang", "ruu", "mahkamah konstitusi", "psi", "solidaritas", "demokrasi", "pemerintah",
];

export const FEED_LABEL: Record<FeedKategori, string> = {
  nasional: "Nasional",
  pemilu: "Pemilu",
  lokal: "Sultra",
};
