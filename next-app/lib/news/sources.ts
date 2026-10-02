// T-NEWS · Registry sumber Portal Berita SUKI Apps.
//
// PRINSIP JUJUR & LEGAL:
// - Hanya feed RSS/Atom PUBLIK yang sudah DIVERIFIKASI aktif yang boleh
//   terdaftar di sini. Jangan menambahkan URL yang belum diuji dengan curl.
// - Yang ditampilkan: headline + excerpt pendek + gambar (hanya dari field
//   feed: enclosure/media:content/media:thumbnail — milik penerbit, dimuat
//   dari CDN resmi mereka) + nama sumber + waktu terbit + link outbound ke
//   artikel asli. TIDAK pernah menyalin isi artikel penuh, TIDAK scraping
//   halaman artikel untuk mencari gambar.
// - Kemitraan lisensi resmi (mis. dengan Kompas) adalah langkah BISNIS
//   terpisah dan TIDAK dicakup kode ini. Arsitektur mendukung "partner feed
//   resmi" di masa depan: cukup tambah entri dengan `partner: true` dan
//   feed khusus dari mitra (baca: docs/NEWS-PORTAL.md).
//
// LOG VERIFIKASI (2026-10-02, curl + UA SUKIApps/1.0):
//   OK   https://inet.detik.com/rss                      → RSS 2.0, 100 item (teknologi, ada enclosure image)
//   OK   https://www.cnnindonesia.com/teknologi/rss       → RSS 2.0, 100 item (teknologi, ada enclosure image)
//   OK   https://news.detik.com/rss                       → RSS 2.0, 100 item (umum, ada enclosure image)
//   OK   https://www.cnnindonesia.com/nasional/rss        → RSS 2.0, 100 item (politik, ada enclosure image)
//   OK   https://www.cnnindonesia.com/internasional/rss   → RSS 2.0, 100 item (global, ada enclosure image)
//   OK   https://www.detik.com/edu/rss                    → RSS 2.0, 100 item (riset: kanal edukasi/akademisi, ada enclosure image)
//   OK   https://www.antaranews.com/rss/tekno             → RSS 2.0, 20 item (cadangan — belum dipakai)
//   404  https://tekno.kompas.com/rss  & /feed            → tidak ada feed publik
//   404  https://www.liputan6.com/rss/tekno, /rss, /feed  → tidak ada feed publik
//   403  https://www.tempo.co/rss/tekno                   → memblokir bot
//   404  https://www.detik.com/rss                        → tidak ada feed root detik.com
//   404  https://www.antaranews.com/rss/nasional          → kanal tidak ada
//   404  https://www.brin.go.id/rss & https://brin.go.id/rss → tidak ada feed publik
//   404  https://sains.kompas.com/rss                     → tidak ada feed publik

export type NewsCategory = 'teknologi' | 'umum' | 'politik' | 'global' | 'riset' | 'komunitas';

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  teknologi: 'Teknologi',
  umum: 'Umum',
  politik: 'Politik',
  global: 'Global',
  riset: 'Riset',
  komunitas: 'Komunitas',
};

export const NEWS_CATEGORIES: NewsCategory[] = ['teknologi', 'umum', 'politik', 'global', 'riset', 'komunitas'];

export interface NewsSource {
  /** id unik, stabil — dipakai sebagai key cache & dedup */
  id: string;
  /** Nama penerbit untuk badge sumber */
  name: string;
  /** URL feed RSS/Atom publik (sudah terverifikasi) */
  feedUrl: string;
  /** URL situs penerbit (fallback link) */
  siteUrl: string;
  /** Kategori yang dilayani feed ini */
  categories: NewsCategory[];
  /** Tanggal verifikasi terakhir (YYYY-MM-DD) */
  verifiedAt: string;
  /** true bila feed berasal dari kemitraan lisensi resmi */
  partner?: boolean;
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'detik-inet',
    name: 'detikINET',
    feedUrl: 'https://inet.detik.com/rss',
    siteUrl: 'https://inet.detik.com',
    categories: ['teknologi'],
    verifiedAt: '2026-10-02',
  },
  {
    id: 'cnn-teknologi',
    name: 'CNN Indonesia',
    feedUrl: 'https://www.cnnindonesia.com/teknologi/rss',
    siteUrl: 'https://www.cnnindonesia.com/teknologi',
    categories: ['teknologi'],
    verifiedAt: '2026-10-02',
  },
  {
    id: 'detik-news',
    name: 'detikNews',
    feedUrl: 'https://news.detik.com/rss',
    siteUrl: 'https://news.detik.com',
    categories: ['umum'],
    verifiedAt: '2026-10-02',
  },
  {
    id: 'cnn-nasional',
    name: 'CNN Indonesia',
    feedUrl: 'https://www.cnnindonesia.com/nasional/rss',
    siteUrl: 'https://www.cnnindonesia.com/nasional',
    categories: ['politik'],
    verifiedAt: '2026-10-02',
  },
  {
    id: 'cnn-internasional',
    name: 'CNN Indonesia',
    feedUrl: 'https://www.cnnindonesia.com/internasional/rss',
    siteUrl: 'https://www.cnnindonesia.com/internasional',
    categories: ['global'],
    verifiedAt: '2026-10-02',
  },
  {
    // Kanal edukasi/akademisi detik.com — mencakup riset, kampus, dan sains.
    id: 'detik-edu',
    name: 'detikEdu',
    feedUrl: 'https://www.detik.com/edu/rss',
    siteUrl: 'https://www.detik.com/edu',
    categories: ['riset'],
    verifiedAt: '2026-10-02',
  },
];

/** Daftar sumber untuk satu kategori (hanya yang terverifikasi). */
export function sourcesForCategory(category: NewsCategory): NewsSource[] {
  return NEWS_SOURCES.filter((s) => s.categories.includes(category));
}
