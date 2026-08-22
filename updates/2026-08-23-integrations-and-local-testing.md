# Aktivasi R2, Marketplace Partner, Audit Produksi, dan Pengujian Lokal

**Status:** implementasi kode sudah tersedia pada repository SultraKita. Gateway R2 Worker, adapter feed marketplace eksternal, partner picks UI, audit produksi, dan smoke test lokal sudah dipush ke branch `main`.

## 1. Aktivasi Cloudflare R2

Worker sudah memiliki route upload `POST /api/listings/:id/images` dan media retrieval `GET /media/listings/<listing-id>/<object-key>`. Route tersebut melakukan validasi session, ownership listing, ukuran maksimal 5 MB, MIME allow-list JPG/PNG/WEBP, pemeriksaan magic bytes, cache-control immutable, dan metadata content type. Route akan mengembalikan `503 R2 belum dikonfigurasi pada Worker` sampai binding bucket benar-benar tersedia.

Pada pemeriksaan terakhir, account Cloudflare mengembalikan code `10042` dengan pesan bahwa R2 harus diaktifkan melalui Cloudflare Dashboard. Ini adalah blocker account-level, bukan blocker kode. Cloudflare mendokumentasikan alur pembuatan bucket dan binding Worker pada [Workers API for R2](https://developers.cloudflare.com/r2/get-started/workers-api/) [1].

| Langkah | Perintah atau tindakan |
|---|---|
| Aktifkan R2 | Buka Cloudflare Dashboard → **R2 Object Storage** → **Create bucket**. Gunakan nama `sultrakita-images` dan pilih lokasi/storage class sesuai kebutuhan account. |
| Verifikasi dari komputer | Jalankan `npx wrangler r2 bucket list`. Jika R2 sudah aktif, bucket akan tercantum. |
| Aktifkan binding repository | Buka `wrangler.toml`, hapus tanda komentar pada blok `[[r2_buckets]]`, lalu pastikan `binding = "IMAGES"` dan `bucket_name = "sultrakita-images"`. |
| Deploy | Jalankan `npx wrangler deploy` dari root repository. Output harus menampilkan `env.IMAGES` selain `env.DB`. |
| Verifikasi upload | Login sebagai seller melalui UI, buat listing, tambahkan foto JPG/PNG/WEBP, lalu pastikan response upload `201` dan URL `/media/listings/...` dapat dibuka. |

Bucket tidak dibuat otomatis karena provider menolak operasi sebelum R2 diaktifkan pada account. Setelah langkah Dashboard selesai, konfigurasi yang sudah tersedia di repository dapat langsung digunakan tanpa perubahan pada route.

## 2. Aktivasi integrasi marketplace pihak ketiga

Repository sekarang memiliki adapter generik yang hanya menerima URL HTTPS resmi, membaca array item dari `items_path`, membatasi hingga sepuluh feed dan seratus item per feed, memberi timeout 4,5 detik pada Express, menyimpan cache memory selama 60 detik, menormalisasi title/category/city/price/image/link, serta menambahkan `source`, `source_label`, `provenance`, dan `observed_at`. Frontend menampilkan hasilnya di bagian **Partner picks** hanya jika feed menghasilkan data.

Adapter ini sengaja **tidak melakukan scraping Facebook Marketplace, Shopee, Tokopedia, atau situs lain**. Integrasi produksi membutuhkan API, katalog, atau feed resmi yang memang diizinkan oleh masing-masing partner. Credential tidak boleh dimasukkan ke GitHub, URL, atau file commit.

Tambahkan konfigurasi JSON sebagai environment secret. Contoh konfigurasi non-rahasia berikut hanya menunjukkan bentuknya:

```json
[
  {
    "id": "partner-example",
    "label": "Partner Example",
    "url": "https://partner.example/api/listings",
    "items_path": "items",
    "category": "Lainnya",
    "auth_env": "PARTNER_EXAMPLE_TOKEN",
    "auth_header": "authorization"
  }
]
```

Untuk Vercel, tambahkan `EXTERNAL_MARKETPLACE_FEEDS_JSON` dan secret provider melalui project environment settings atau CLI. Untuk Worker, simpan feed JSON dengan `npx wrangler secret put EXTERNAL_MARKETPLACE_FEEDS_JSON` dan simpan token partner dengan `npx wrangler secret put PARTNER_EXAMPLE_TOKEN`. Setelah itu deploy ulang Worker dan tunggu deployment Vercel dari branch `main`.

Uji endpoint dengan `GET /api/external-listings`. Tanpa konfigurasi, response menyatakan `live_sync: false` dan `configured_feeds: 0`. Dengan feed aktif, response menyatakan `live_sync: true`, menampilkan jumlah item, serta status setiap feed. Item invalid, URL non-HTTPS, error HTTP, dan timeout tidak dipublikasikan sebagai listing partner.

## 3. Metrik performa dan audit keamanan terbaru

Snapshot terakhir dibuat pada **22 Agustus 2026 23:16 UTC** menggunakan lima sample per endpoint untuk `/api/health`, `/api/categories`, `/api/listings?limit=8`, dan homepage. Artefak JSON lengkap tersedia pada `updates/2026-08-23-production-audit-live.json`.

| Target | Request berhasil | Latency P50 | Latency P95 | Maksimum | Rata-rata | Response terbesar |
|---|---:|---:|---:|---:|---:|---:|
| Vercel | 20/20 (100%) | 71,34 ms | 186,30 ms | 530,19 ms | 104,17 ms | 13.877 byte |
| Cloudflare Worker | 20/20 (100%) | 651,64 ms | 943,53 ms | 2.681,23 ms | 734,28 ms | 70.619 byte |

Enam header keamanan berikut hadir pada **5/5 sample** Vercel dan **5/5 sample** Worker: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, dan Content Security Policy. CSP menggunakan `frame-ancestors 'none'`, `img-src` terbatas ke self/data/HTTPS, serta `connect-src` self/HTTPS.

Cloudflare GraphQL untuk window tujuh hari melaporkan **137 request, 0 error, 0 subrequest, error rate 0%, dan seluruh 137 invocation berstatus success**. Nilai `cpuTimeP50` dan `cpuTimeP99` disimpan sebagai nilai mentah dataset pada artefak audit; keduanya tidak dikonversi karena unit harus mengikuti interpretasi dataset/account Cloudflare. Query mengacu pada dataset `workersInvocationsAdaptive` sebagaimana dijelaskan pada tutorial resmi Cloudflare [2]. Cloudflare menjelaskan bahwa metrics Worker mencakup requests, errors, subrequests, CPU time, wall time, memory, dan invocation statuses [3].

Interpretasi operasionalnya adalah Vercel saat ini menjadi jalur HTTP yang lebih cepat pada sampling ini, sedangkan Worker sudah sehat dan error-free tetapi masih memiliki overhead D1/edge yang terlihat pada P95. Optimasi `seedPromise` sudah mengurangi kerja schema berulang per request. Perbaikan berikutnya yang disarankan adalah cache publik terkontrol untuk categories/listings dan pengukuran regional yang lebih banyak sebelum mengubah arsitektur database.

## 4. Pengujian chat realtime dan posting seller secara lokal

Cara paling cepat adalah menggunakan smoke test otomatis yang sudah ditambahkan ke repository:

```bash
git clone https://github.com/saripkdi01-boop/sultrakita-platform.git
cd sultrakita-platform
npm ci
npm run e2e:marketplace
```

Script `e2e:marketplace` menyalakan server terisolasi dengan `VERCEL=true`, memakai direktori `/tmp`, mengaktifkan `OTP_DEV_MODE` hanya selama test, membuat seller dan buyer, mengambil OTP demo, membuat listing seller, mengunggah gambar dengan magic bytes, membuat conversation, mengirim pesan, membaca history, membuka SSE stream dengan bearer token, dan membaca detail listing. Output sukses yang diharapkan mencantumkan `seller_post: true`, `image_upload: true`, `message_history: true`, `realtime_stream: true`, dan `listing_detail: true`.

Untuk pengujian manual, jalankan:

```bash
cp .env.example .env
# Pastikan OTP_DEV_MODE=true hanya untuk komputer lokal
npm run dev
```

Buka `http://localhost:3000`. Klik **Pasang iklan**, masukkan nomor Indonesia demo seperti `081234560101`, klik **Kirim OTP**, salin `dev_code` yang muncul pada toast, isi judul/deskripsi/harga/kategori/wilayah/foto, lalu kirim. Setelah listing tayang, buka detailnya dan pilih **Tanya penjual**. Untuk melihat stream secara langsung, ambil token session dari browser storage/session atau dari response `POST /api/auth/verify-otp`, lalu jalankan:

```bash
curl -N \\
  -H "Authorization: Bearer <TOKEN_SELLER_OR_BUYER>" \\
  "http://localhost:3000/api/conversations/<CONVERSATION_ID>/stream?after=0"
```

Biarkan terminal `curl` tetap terbuka, kirim pesan dari halaman chat atau gunakan `POST /api/conversations/<id>/messages` dari sesi lain, dan event SSE akan muncul sebagai baris `data:`. Untuk alur seller, pengujian paling representatif adalah memakai dua sesi browser: satu seller untuk posting dan satu buyer untuk membuka detail, membuat conversation, lalu mengirim pertanyaan.

## References

[1]: https://developers.cloudflare.com/r2/get-started/workers-api/ — Cloudflare, “Workers API for R2”.

[2]: https://developers.cloudflare.com/analytics/graphql-api/tutorials/querying-workers-metrics/ — Cloudflare, “Querying Workers Metrics with GraphQL”.

[3]: https://developers.cloudflare.com/workers/observability/metrics-and-analytics/ — Cloudflare, “Metrics and analytics”.

[4]: https://github.com/saripkdi01-boop/sultrakita-platform — Repository SultraKita.
