# PSI Kendari — Partai Super TBK

Situs berita dan profil **PSI (Partai Solidaritas Indonesia) wilayah Kota Kendari dan sekitarnya,
Sulawesi Tenggara**. Rubrik meniru pola psi.id (Liputan, Siaran Pers & Sikap, Kolom, Blog Ketum,
Galeri, video), ditambah konten lokal Kendari/Sultra, agregasi politik terbaru, dan data Pemilu.

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · SSG + ISR (900 detik)
- **Bahasa & zona waktu:** Bahasa Indonesia · WITA (Asia/Makassar)
- **URL produksi:** https://psi-kendari-website.vercel.app

---

## ⚠️ Temuan penting: psi.id menolak akses otomatis

Per **27 November 2026**, setiap permintaan ke `https://psi.id/` — termasuk WordPress REST API
`/wp-json/wp/v2/*` — dari IP datacenter mendapat **HTTP 403 dengan `cf-mitigated: challenge`**
(Cloudflare “Just a moment…”). Ini terjadi dari container pengembangan **dan dari server Vercel**
(sudah diuji dengan deployment uji di region `iad1`). Situs ini **tidak** mencoba menembus
challenge/CAPTCHA.

Cara situs menanganinya:

1. **Server (ISR)** tetap mencoba API psi.id setiap 15 menit. Begitu psi.id mengizinkan server ini
   (atau `PSI_API_BASE` diarahkan ke endpoint yang di-allowlist DPP), berita psi.id otomatis tampil
   sebagai HTML statis yang ramah SEO — tanpa perubahan kode.
2. **Fallback di browser pengunjung**: bila server terblokir, komponen `PsiClientFeed` /
   `PsiClientArticle` meminta API psi.id langsung dari browser pengunjung (CORS bawaan WordPress).
   Ada pemutus sirkuit: satu cek per sesi; bila gagal, permintaan lain tidak dikirim selama 10 menit.
3. Bila keduanya gagal, tampil pesan rapi “sementara tidak dapat dimuat” + tombol **Buka di psi.id**.

**Tindak lanjut yang disarankan (di luar kode):** minta tim IT DPP PSI meng-allowlist server
situs ini di Cloudflare (atau menyediakan endpoint/mirror API), lalu isi `PSI_API_BASE`.
Karena itu, kriteria “beranda menampilkan berita asli dari API psi.id” **belum dapat dibuktikan
dari server** — lihat [Hasil uji](#hasil-uji-fase-5).

---

## Halaman

| Rute | Isi |
| --- | --- |
| `/` | Ticker headline, hero (Liputan psi.id), Siaran Pers & Sikap DPP, Kendari & Sultra (Liputan Daerah tersaring + berita lokal), Politik Terbaru (10 item RSS), Kolom & Opini + Blog Ketum, 4 video YouTube SolidaritasID, grafik Data Pemilu Kendari 2024, ajakan bergabung (ke psi.id) |
| `/berita-psi` | Daftar artikel psi.id + filter rubrik + paginasi (`/berita-psi/rubrik/<rubrik>/<halaman>`) |
| `/berita-psi/[slug]` | Artikel psi.id (HTML tersanitasi), tanggal asli, rubrik, label, “Baca di situs resmi PSI”, artikel terkait, JSON-LD `NewsArticle` |
| `/politik-terbaru` | Agregasi RSS nasional + pemilu (Bawaslu) + Sultra, filter per sumber, status feed |
| `/kendari-sultra` | Berita lokal + Liputan Daerah psi.id tersaring + kabar Sultra (ANTARA Sultra); sub-filter `/kendari-sultra/<wilayah>` untuk 13 kabupaten/kota; artikel lokal di `/kendari-sultra/berita/<slug>` |
| `/profil` | Sejarah singkat, DNA Kebajikan & Keragaman, arti “Partai Super TBK”, bagan DPP→DPRt, kantor pusat DPP |
| `/struktur` | DPP (ringkas), DPW Sultra, DPD Kota Kendari, 12 DPD sekitar; halaman `/struktur/<wilayah>` jujur “menunggu data resmi” |
| `/klarifikasi` | Kanal cek fakta dengan template baku + 3 entri awal; detail dengan JSON-LD `ClaimReview` |
| `/agenda` | Agenda DPW/DPD dari `/content/agenda` (kosong: menunggu data resmi) |
| `/galeri` | Galeri PSI (psi.id), video kanal resmi, galeri lokal (kosong: menunggu foto resmi) |
| `/data-pemilu` | Tabel + grafik suara PSI DPRD Kota Kendari 2024 per dapil, sumber KPU |
| `/kontak` | Alamat DPP, DPW Sultra, DPD Kendari; formulir **mailto saja** |
| `/cari` | Pencarian psi.id + konten lokal |
| `/uji-data` | Halaman teknis Fase 1 (10 posting per kategori + status server), `noindex` |

Fitur global: pencarian, mode gelap (tersimpan per perangkat), tombol bagikan (salin tautan,
WhatsApp, X, Facebook), breadcrumb + JSON-LD, halaman 404 & error berbahasa Indonesia.

## Jalan lokal

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

Buka http://localhost:3000. Perintah lain: `npm run build`, `npm start`, `npm run lint`,
`npm run typecheck`, `npm run check` (lint + typecheck + build), `npm run logo`.

> Di jaringan yang memakai HTTPS proxy (mis. sandbox/CI), jalankan dengan `NODE_USE_ENV_PROXY=1`
> agar `fetch` Node mengikuti `HTTPS_PROXY`. Tidak diperlukan di Vercel.

Docker (opsional): `docker build -t psi-kendari .` lalu `docker run -p 3000:3000 --env-file .env.local psi-kendari`.

## Environment variable

| Nama | Default | Keterangan |
| --- | --- | --- |
| `SITE_URL` | `http://localhost:3000` | URL publik (canonical, sitemap, robots, Open Graph). **Wajib di produksi.** |
| `PSI_API_BASE` | `https://psi.id/wp-json/wp/v2` | API psi.id untuk server |
| `NEXT_PUBLIC_PSI_API_BASE` | = `PSI_API_BASE` | API yang dipanggil browser saat fallback |
| `REVALIDATE_SECONDS` | `900` | Interval ISR untuk fetch psi.id, RSS, YouTube |
| `NEXT_PUBLIC_CONTACT_EMAIL` | (kosong) | Email tujuan formulir mailto; kosong = formulir nonaktif |
| `NEXT_PUBLIC_GA_ID` | (kosong) | Google Analytics 4 opsional (CSP menyesuaikan otomatis) |
| `PSI_LOGO_DIR` | `../psi-logo-aset` | Sumber salinan logo untuk `npm run logo` |

## Arsitektur data

```
psi.id WP REST API ──(server fetch, ISR 900 dtk)──► lib/psi-api.ts ──► halaman (HTML statis)
        │                         └─ gagal/terblokir ─► PsiClientFeed / PsiClientArticle (browser)
RSS media & Bawaslu ─(server, ISR)─► lib/feeds.ts (dedupe, ringkas ≤280, label) ─► Politik Terbaru
YouTube RSS kanal SolidaritasID ───► lib/feeds.ts#getYoutubeVideos ─► blok video (klik-untuk-putar)
/content (Markdown/JSON di repo) ──► lib/content.ts (dibaca saat build) ─► halaman lokal
```

- **`lib/psi-api.ts`** — `getPostsByCategory`, `getPostBySlug`, `searchPosts`, `getCategories`,
  `getKendariPosts`, `getRelatedPosts`. Tidak pernah melempar error; mengembalikan
  `{ ok: false, reason: "blocked" | "network" | "http" | "parse" }` bila gagal.
- **`config/psi-categories.ts`** — peta kategori psi.id → rubrik:
  57/70/133 → Siaran Pers (label Siaran Pers / Sikap DPP / Sikap PSI); 71/72 → Berita PSI
  (72 disaring “Kendari”, “Sulawesi Tenggara”, “Sultra” untuk Kendari & Sultra); 69, 50, 59, 4,
  100, 127, 68 → Kolom & Opini (68 = Pidato Ketum); 369 → Blog Ketum; 3 → Galeri.
- **Pencarian** memakai `/posts?search=` (bukan `/search`) agar ringkasan, tanggal, dan gambar
  didapat dalam satu permintaan.
- **Model cache:** Next.js 16 menyalakan `cacheComponents` secara default. Proyek ini **sengaja
  memakai model ISR klasik** (`export const revalidate = 900` + `fetch(..., { next: { revalidate } })`)
  agar sesuai spesifikasi SSG + ISR dan `REVALIDATE_SECONDS`. Migrasi ke `'use cache'` dicatat
  sebagai pekerjaan lanjutan.
- **Gambar psi.id** dirender `unoptimized` (dimuat langsung oleh browser) karena optimizer gambar
  server juga akan terkena Cloudflare challenge. `remotePatterns` psi.id tetap dikonfigurasi.
- **Konten lokal** dibaca dengan `fs` saat build; `outputFileTracingIncludes` memastikan folder
  `/content` ikut dibundel untuk render ulang ISR.

## Sumber data

| Sumber | Status (27 Nov 2026) |
| --- | --- |
| psi.id WP REST API | ⚠️ Cloudflare challenge untuk server — fallback browser aktif |
| ANTARA — politik (`antaranews.com/rss/politik.xml`) | ✅ |
| CNN Indonesia — nasional (disaring kata kunci politik) | ✅ |
| Tempo — nasional (disaring) | ✅ (kanal politik Tempo 403) |
| detikNews — berita (disaring) | ✅ (kanal pemilu detik tidak diperbarui sejak Des 2024) |
| Bawaslu RI (`bawaslu.go.id/id/rss.xml`) | ✅ kategori Pemilu |
| ANTARA Sultra — terkini, seputar Sultra, 13 kabupaten/kota | ✅ |
| YouTube SolidaritasID (`channel_id=UCY2kkUWxtRKoW_qopjGGAtw`) | ✅ |
| Kompas | ❌ tidak ditemukan RSS publik tanpa API key — dilewati |
| Tribunnews / Tribun Sultra | ❌ HTTP 403 untuk akses otomatis — dilewati |
| KPU (`kpu.go.id`) | ❌ tidak ada RSS; API berita mensyaratkan login — dilewati (tidak dibobol) |
| Media lokal zonasultra.id / telisik.id | ❌ Cloudflare challenge / tanpa feed — dilewati |

Daftar feed diubah di **`config/feeds.ts`**. Aturan agregasi: judul + ringkasan ≤ 280 karakter +
nama media + tanggal + tautan keluar; tanpa gambar/isi penuh; deduplikasi URL terkanonik +
kemiripan judul (Jaccard ≥ 0,8); urut terbaru; label **DILAPORKAN MEDIA**. Scraping cadangan
HTML tidak dipakai karena tidak ada sumber yang memerlukannya secara sah (KPU butuh login).

## Menambah konten lokal

Panduan lengkap & skema: **[`content/README.md`](content/README.md)**. Ringkasnya:

- **Berita lokal:** buat `content/berita-lokal/YYYY-MM-DD-judul.md` (frontmatter judul, tanggal
  WITA, penulis, rubrik, label, gambar opsional, ringkasan, sumber), lalu commit + push.
- **Klarifikasi:** buat `content/klarifikasi/<slug>.md` dengan template baku (klaim persis,
  pertama beredar, label, fakta + sumber + tanggal, yang belum diketahui, keputusan).
- **Struktur/agenda/galeri/data pemilu:** edit JSON di folder masing-masing.

Vercel membangun ulang otomatis setiap push ke branch produksi.

## Logo

Aset logo resmi **tidak ada** di lingkungan pembangunan (folder `psi-logo-aset/` tidak tersedia),
dan situs **tidak membuat logo tiruan/placeholder**. Selama berkas belum ada, header/footer hanya
menampilkan nama “PSI Kendari” sebagai teks, dan gambar Open Graph berupa desain tipografis.

Cara memasang: salin berkas ke `public/logo/` (atau `PSI_LOGO_DIR=/path/psi-logo-aset npm run logo`),
lalu commit. Skrip `scripts/prepare-logo.mjs` (jalan otomatis sebelum `dev`/`build`) mendeteksi
`logo-horizontal-warna.png` (header terang), `logo-horizontal-putih.png` (header gelap),
`logo-vertikal-warna.png` / `logo-vertikal-putih.png` (profil/footer), dan `logo-kepala-merah.png`
(favicon & apple-touch-icon).

## Aturan konten & keamanan

- **Lima label baku** pada setiap kartu & artikel: TERVERIFIKASI · DILAPORKAN MEDIA ·
  KLAIM — TIDAK TERBUKTI · HOAKS — DIBANTAH · TERKLARIFIKASI. Artikel psi.id = TERVERIFIKASI
  (sumber resmi); item RSS = DILAPORKAN MEDIA.
- **Tanpa data karangan:** hanya API psi.id, RSS (ringkasan), dan `/content`. Field tanpa data
  ditulis “menunggu data resmi”.
- **Tanpa pengumpulan data pribadi (UU PDP 27/2022):** tidak ada formulir pendaftaran; satu-satunya
  formulir (kontak) hanya membuka aplikasi email (`mailto:`), tanpa NIK/KTP/HP, tanpa penyimpanan.
  Pendaftaran selalu ke psi.id/menjadi-anggota dan aku.psi.id.
- **Sanitasi HTML:** `sanitize-html` di server, DOMPurify di browser (tag/atribut allowlist,
  iframe hanya YouTube, tautan eksternal `noopener`).
- **Header keamanan** (`next.config.ts`): CSP, HSTS, X-Frame-Options DENY, nosniff,
  Referrer-Policy, Permissions-Policy, COOP.
- **Hak cipta:** artikel psi.id dengan atribusi + tautan asli + “Foto: psi.id”; media lain hanya
  judul + ringkasan + tautan keluar.

## SEO

Metadata per halaman, Open Graph/Twitter card, `sitemap.xml` & `robots.txt` otomatis, URL bersih
berbahasa Indonesia, canonical ke situs ini (+ tautan sumber psi.id dan `isBasedOn` di JSON-LD),
JSON-LD `WebSite`, `BreadcrumbList`, `NewsArticle`, `Dataset`, `ClaimReview`.

## Hasil uji (Fase 5)

Diuji 27 Nov 2026 pada build produksi lokal (`next build` + `next start`).

| Uji | Hasil |
| --- | --- |
| `npm run build` | ✅ sukses, 55 halaman statis/SSG |
| `npm run lint` / `tsc --noEmit` | ✅ bersih |
| Lighthouse beranda — **mobile** | Performance **96** · Accessibility **100** · Best Practices **96** · SEO **100** |
| Lighthouse beranda — **desktop** | Performance **100** · Accessibility **100** · Best Practices **96** · SEO **100** |
| Responsif (360 / 768 / 1280 px, 20 halaman) | ✅ tanpa scroll horizontal |
| Tautan internal (crawl 48 halaman) | ✅ semua 200 |
| Tautan keluar resmi | aku.psi.id, kpu.go.id, bawaslu.go.id, YouTube ✅; psi.id = 403 challenge untuk bot (halaman ada); infopemilu.kpu.go.id tidak dapat diuji dari jaringan pengembangan |
| Keadaan error (semua akses keluar diputus) | ✅ build sukses; semua halaman tampil dengan pesan “sementara tidak dapat dimuat” |
| Agregasi RSS asli | ✅ 60 item nyata (batas tampilan) berlabel DILAPORKAN MEDIA |
| `/data-pemilu` | ✅ 67 / 112 / 37 / 55 / 276, total 547, sumber Keputusan KPU Kota Kendari No. 93/2024 |
| Berita psi.id asli di beranda | ⚠️ tidak dapat dibuktikan dari server (Cloudflare challenge); jalur fallback browser juga terblokir dari jaringan pengujian |

Catatan Lighthouse: diukur saat psi.id terblokir (blok psi.id menampilkan pesan pengganti).
Best Practices 96 karena galat konsol CORS dari permintaan browser ke psi.id yang ditolak Cloudflare.

## Deploy (Vercel)

**URL produksi: https://psi-kendari-website.vercel.app** — deploy production pertama 27 Nov 2026
dari GitHub `saripkdi01-boop/psi-kendari-website` branch `main` (commit `311a8f4`), proyek Vercel
`psi-kendari-website` (tim *saripkdi01-boop's projects*), fungsi di region `sin1` (Singapura).

Environment variable produksi yang sudah diisi: `SITE_URL`, `PSI_API_BASE`,
`NEXT_PUBLIC_PSI_API_BASE`, `REVALIDATE_SECONDS`. (`NEXT_PUBLIC_CONTACT_EMAIL` dan
`NEXT_PUBLIC_GA_ID` sengaja dikosongkan sampai ada nilai resmi.)

Verifikasi setelah deploy (diakses sebagai pengunjung anonim):

| Cek | Hasil |
| --- | --- |
| `/`, `/berita-psi`, artikel lokal, `/klarifikasi/…`, `/struktur/konawe` | 200 |
| `/politik-terbaru` | 200 — 60 item RSS asli, semua berlabel DILAPORKAN MEDIA |
| `/data-pemilu` | 200 — 67 / 112 / 37 / 55 / 276, total 547, sumber Keputusan KPU Kota Kendari No. 93/2024 |
| `/sitemap.xml`, `/robots.txt`, `/opengraph-image` | 200, URL kanonik produksi |
| Halaman tak dikenal | 404 berbahasa Indonesia |
| Header keamanan (CSP, HSTS, X-Frame-Options, dll.) | aktif |
| Lighthouse produksi (beranda) | mobile 97 · 100 · 96 · 100 — desktop 100 · 100 · 96 · 100 (Perf · A11y · BP · SEO) |
| Berita psi.id dari server | ⚠️ build Vercel juga menerima `403 cf-mitigated: challenge` dari psi.id — blok psi.id memakai fallback browser |

### ⚠️ Satu langkah manual: sambungkan Git untuk deploy otomatis

Proyek Vercel ini dibuat lebih dulu (deployment uji koneksi ke psi.id) sebelum repo GitHub ada,
dan API yang tersedia tidak bisa menautkan repo ke proyek yang sudah ada. Deploy production di atas
dibuat langsung dari repo GitHub, tetapi **push berikutnya belum memicu deploy otomatis** sampai
repo ditautkan:

1. Buka Vercel → proyek **psi-kendari-website** → **Settings → Git**.
2. **Connect Git Repository** → pilih `saripkdi01-boop/psi-kendari-website`, production branch `main`.

Setelah itu, setiap commit + push ke `main` (mis. menambah berita di `/content`) akan dibangun
ulang otomatis. Riwayat deployment juga masih memuat deployment uji lama (tidak aktif di domain
produksi) — boleh dihapus dari dashboard bila ingin rapi.

### Deploy ulang manual (tanpa Git)

```bash
npx vercel --prod
```

`vercel.json` memilih region fungsi `sin1` (Singapura) agar dekat dengan pembaca di Indonesia.

## Penyimpangan dari masterprompt (dicatat dengan jujur)

- **Alamat DPP** belum dapat diverifikasi ke halaman kontak psi.id (Cloudflare challenge, juga dari
  fetcher web). Alamat ditampilkan sesuai profil publik dengan catatan verifikasi di `/kontak`.
- **Nama pengurus DPP** tidak ditampilkan karena tidak tersedia di data yang diberikan.
- **Media sosial resmi:** hanya YouTube SolidaritasID yang terverifikasi; akun lain menunggu verifikasi.
- **Klarifikasi (c) “BELUM TERVERIFIKASI RESMI”** bukan salah satu dari lima label baku, sehingga
  dipetakan ke label **DILAPORKAN MEDIA** dengan keputusan tertulis “BELUM TERVERIFIKASI RESMI”.
- **Font** Plus Jakarta Sans (Google Fonts, lisensi OFL) di-*self-host* dari paket Fontsource —
  tanpa permintaan ke server Google saat build maupun saat dikunjungi.
- **Repo:** kode dikembangkan di subfolder `psi-kendari-website/` pada branch `claude/stoic-fermat-r78pwu`
  repo `saripkdi01-boop/sultrakita-platform` (repo yang terpasang di sesi pembangunan), lalu riwayat
  6 commit fasenya dipisahkan (`git subtree split`) ke repo baru **privat** `saripkdi01-boop/psi-kendari-website`
  branch `main`. Repo baru dibuat privat karena hanya itu yang diizinkan alat pembangunan; ubah ke publik
  di GitHub bila diinginkan.

## Pekerjaan lanjutan

1. **Allowlist Cloudflare psi.id** untuk server situs (atau endpoint API khusus dari DPP) — kunci
   agar berita psi.id tampil dari server dan terindeks mesin pencari.
2. Pasang **logo resmi** di `public/logo/` dan commit.
3. Isi **email resmi** (`NEXT_PUBLIC_CONTACT_EMAIL`) agar formulir kontak aktif.
4. Lengkapi data resmi: pengurus DPW/DPD + SK, alamat sekretariat DPD, agenda, galeri berkredit,
   cakupan kecamatan per dapil, rincian TPS (D-Hasil KPU), tautan cek fakta Kompas 20 Jul 2026.
5. Verifikasi & tambahkan akun media sosial resmi PSI lainnya.
6. Cari feed RSS resmi media lokal Sultra lain dan sumber rilis KPU yang tidak memerlukan login.
7. Pertimbangkan CMS ringan (mis. Decap/Git-based) bila pengurus non-teknis perlu menambah konten.
8. Migrasi ke Cache Components (`'use cache'`) Next.js 16 bila diperlukan.
9. Tautkan Git di Vercel (lihat bagian Deploy) agar push otomatis ter-deploy.
10. Tambah domain kustom di Vercel dan perbarui `SITE_URL`.
