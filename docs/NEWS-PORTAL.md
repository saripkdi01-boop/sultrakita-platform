# Portal Berita — /beranda (T-NEWS)

Gateway berita dalam ekosistem SUKI Apps. Agregasi headline dari media
Indonesia, tampil sebagai section full-width di bawah feed `/beranda`.

## Arsitektur

```
Feed RSS publik (detik, CNN Indonesia)
        │  server-side fetch, UA teridentifikasi, timeout 12 dtk
        ▼
lib/news/rss.ts  ── parser RSS 2.0 minimal + ekstraksi gambar dari field
        │            feed + cache in-memory 20 mnt
        ▼
GET /api/news?category=teknologi   (zod + rate limit, error jujur)
        │                                ▲
        ▼                                │ JSON-LD ItemList/NewsArticle
components/news/NewsPortal.tsx     components/news/NewsJsonLd.tsx
(client: tabs, skeleton,            (server component: hanya item
 kartu bergambar, empty/            yang benar-benar terambil;
 error states, ad slot)             image hanya bila ada)
```

## Sumber data — jujur & legal

- Hanya feed RSS/Atom **publik** yang **sudah diverifikasi aktif** (curl,
  2026-10-02). Daftar di `next-app/lib/news/sources.ts`:

| Kategori   | Sumber         | Feed URL                                  | Status |
|------------|----------------|-------------------------------------------|--------|
| teknologi  | detikINET      | `inet.detik.com/rss`                      | ✅ 200, 100 item |
| teknologi  | CNN Indonesia  | `cnnindonesia.com/teknologi/rss`          | ✅ 200, 100 item |
| umum       | detikNews      | `news.detik.com/rss`                      | ✅ 200, 100 item |
| politik    | CNN Indonesia  | `cnnindonesia.com/nasional/rss`           | ✅ 200, 100 item |
| global     | CNN Indonesia  | `cnnindonesia.com/internasional/rss`      | ✅ 200, 100 item |
| riset      | detikEdu       | `detik.com/edu/rss`                       | ✅ 200, 100 item (kanal edukasi/akademisi) |
| komunitas  | —              | —                                         | ⏳ segera hadir |

- **Gagal verifikasi (tidak dipakai):** Kompas Tekno & Liputan6 Tekno = 404
  (tidak ada feed publik), Tempo = 403 (blokir bot), `detik.com/rss` = 404,
  `antaranews.com/rss/nasional` = 404, `brin.go.id/rss` = 404,
  `sains.kompas.com/rss` = 404. Cadangan terverifikasi tapi belum dipakai:
  `antaranews.com/rss/tekno` (200, 20 item).
- Yang ditampilkan: **gambar (bila ada) + headline + excerpt ≤180 karakter +
  nama sumber + waktu terbit + link outbound** ke artikel asli. Tidak
  menyalin isi penuh, tidak scraping halaman artikel.

### Kebijakan gambar

- Gambar diambil **hanya** dari field feed itu sendiri: `<enclosure url>`
  (type `image/*`), `<media:content url>` (medium="image"), atau
  `<media:thumbnail url>` — dalam urutan prioritas itu. URL harus `http(s)`.
- Gambar adalah **milik penerbit** dan dimuat langsung dari **CDN resmi
  mereka** (mis. `akcdn.detik.net.id`, `cdn.antaranews.com`).
- Render: `loading="lazy"`, `referrerpolicy="no-referrer"`, aspect-ratio
  16/9 fixed (zero CLS). Gagal dimuat → kartu kembali text-first.
- JSON-LD `NewsArticle` menyertakan `image` hanya bila URL benar-benar ada.
- Footer section mencantumkan atribusi: "Headline & ringkasan milik
  masing-masing penerbit … SUKI Apps menampilkan kutipan singkat + tautan
  ke artikel asli."

### Cara menambah / memverifikasi feed atau kategori baru

1. `curl -sL -A "SUKIApps-NewsBot/1.0 (+https://sukiapps.web.id)" <URL> -o /tmp/x.xml`
2. Pastikan HTTP 200, diawali `<?xml`, dan berisi `<item>` dengan
   `<title>`, `<link>`/`<guid>`, `<pubDate>`, `<description>`. Untuk gambar,
   pastikan ada `<enclosure type="image/…">` atau `<media:content>`.
3. Tambah kategori di `NewsCategory` + `NEWS_CATEGORY_LABELS` +
   `NEWS_CATEGORIES`, lalu entri di `NEWS_SOURCES` + `verifiedAt` + hasil di
   komentar `sources.ts`.
4. Tes: `curl "http://localhost:3000/api/news?category=<baru>"` — harus 200
   dengan item asli. Kategori tanpa feed valid otomatis `comingSoon:true`.

## Kategori

`teknologi`, `umum`, `politik`, `global`, `riset` = live.
`komunitas` mengembalikan `{ ok:true, items:[], comingSoon:true }` — UI
menampilkan empty-state jujur "segera hadir", bukan konten palsu.

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
- Item: `{ id, title, link, excerpt, sourceId, sourceName, publishedAt, image }`
  (`image` = string URL atau null).
- `stale:true` = data dari cache basi karena upstream gagal (tetap jujur).
- 400 kategori tidak valid · 503 upstream mati & tanpa cache · 429 rate limit.

## SEO

- HTML semantik (`section`/`article`/`time`, heading hierarchy benar).
- JSON-LD `ItemList` → `NewsArticle` (headline, url, datePublished, image
  bila ada, publisher asli) — hanya untuk item yang benar-benar terambil.
