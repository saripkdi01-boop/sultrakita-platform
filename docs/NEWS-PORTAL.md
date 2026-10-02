# Portal Berita — /beranda (T-NEWS)

Gateway berita dalam ekosistem SUKI Apps. Agregasi headline teknologi dari
media Indonesia, tampil sebagai section full-width di bawah feed `/beranda`.

## Arsitektur

```
Feed RSS publik (detikINET, CNN Indonesia)
        │  server-side fetch, UA teridentifikasi, timeout 12 dtk
        ▼
lib/news/rss.ts  ── parser RSS 2.0 minimal + cache in-memory 20 mnt
        │
        ▼
GET /api/news?category=teknologi   (zod + rate limit, error jujur)
        │                                ▲
        ▼                                │ JSON-LD ItemList/NewsArticle
components/news/NewsPortal.tsx     components/news/NewsJsonLd.tsx
(client: tabs, skeleton,            (server component: hanya item
 empty/error states, ad slot)       yang benar-benar terambil)
```

## Sumber data — jujur & legal

- Hanya feed RSS/Atom **publik** yang **sudah diverifikasi aktif** (curl,
  2026-10-02): `inet.detik.com/rss` dan `cnnindonesia.com/teknologi/rss`.
  Daftar di `next-app/lib/news/sources.ts`.
- Yang ditampilkan: **headline + excerpt ≤180 karakter + nama sumber +
  waktu terbit + link outbound** ke artikel asli. Tidak menyalin isi penuh,
  tidak hotlink gambar penerbit.
- Cache 20 menit → sopan ke server sumber (tidak menghantam tiap request).
- **Kemitraan lisensi resmi** (mis. Kompas) adalah langkah bisnis terpisah.
  Bila sudah ada, tambah entri di `NEWS_SOURCES` dengan `partner: true`
  dan feed khusus dari mitra — tidak perlu ubah arsitektur.

### Cara menambah / memverifikasi feed baru

1. `curl -sL -A "SUKIApps-NewsBot/1.0 (+https://sukiapps.web.id)" <URL> -o /tmp/x.xml`
2. Pastikan HTTP 200, diawali `<?xml`, dan berisi `<item>` dengan
   `<title>`, `<link>`/`<guid>`, `<pubDate>`, `<description>`.
3. Tambah entri di `NEWS_SOURCES` + catat `verifiedAt` + hasil di komentar
   `sources.ts`.
4. Tes: `curl "http://localhost:3000/api/news?category=teknologi"`.

## Kategori

`teknologi` = live. `umum`, `politik`, `riset`, `komunitas` mengembalikan
`{ ok:true, items:[], comingSoon:true }` — UI menampilkan empty-state jujur
"segera hadir", bukan konten palsu.

## Iklan

- Slot `news-infeed` terdaftar di `lib/ads/config.ts` — native tiap 6 kartu
  berita via `<AdSlot placementId="news-infeed" />` (infra `house_ads` /
  `ad_placements` yang sudah ada).
- **AdSense-ready, nonaktif by default**: slot otomatis menjadi AdSense bila
  (1) env `NEXT_PUBLIC_ADSENSE_CLIENT_ID` terisi, dan (2) placement
  `news-infeed` dikonfigurasi `provider='adsense'` + `adsense_slot` di tabel
  `ad_placements`. Cara lengkap: `docs/ADS-MONETIZATION.md`.
- Tanpa konfigurasi → slot me-reserve ruang kosong (zero layout shift).

## API

`GET /api/news?category=teknologi&limit=12`
- Sukses: `{ ok:true, category, categoryLabel, items, sources, stale, fetchedAt }`
- `stale:true` = data dari cache basi karena upstream gagal (tetap jujur).
- 400 kategori tidak valid · 503 upstream mati & tanpa cache · 429 rate limit.

## SEO

- HTML semantik (`section`/`article`/`time`, heading hierarchy benar).
- JSON-LD `ItemList` → `NewsArticle` (headline, url, datePublished,
  publisher asli) — hanya untuk item yang benar-benar terambil.
