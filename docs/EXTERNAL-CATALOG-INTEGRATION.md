# Integrasi katalog eksternal SultraKita

## Tujuan

SultraKita sekarang memiliki jalur ingestion bertahap untuk produk marketplace dan lowongan kerja yang berasal dari **feed JSON/API berizin**. Data produk dan lowongan tidak dianggap sebagai listing milik SultraKita; kartu selalu menampilkan sumber asli, URL sumber, provenance, dan waktu observasi.

## Produk marketplace

Gunakan environment `EXTERNAL_MARKETPLACE_FEEDS_JSON` dengan array maksimal 10 feed HTTPS. Feed produk dapat berasal dari Shopee Open Platform/affiliate atau partner yang memberikan akses resmi. Contoh bentuk konfigurasi tanpa secret:

```json
[
  {
    "id": "shopee-kendari-authorized",
    "label": "Shopee — partner resmi",
    "url": "https://partner.example.id/feeds/shopee/kendari.json",
    "items_path": "items",
    "region_filter": true,
    "region_terms": ["kendari", "sulawesi tenggara", "sultra"],
    "auth_env": "SHOPEE_FEED_TOKEN",
    "auth_header": "authorization",
    "provenance": "authorized_partner_feed"
  }
]
```

Item yang diterima minimal memiliki `title` dan URL HTTPS. Field `category`, `city`, `province`, `price`, `image_url`, dan `id` dipakai bila tersedia. `region_filter: true` hanya memasukkan item yang lokasi atau label feed-nya cocok dengan istilah Kendari/Sultra. Jika feed merepresentasikan barang yang dapat dikirim ke Sultra tetapi tidak mempunyai lokasi seller, gunakan `include_unknown: true` hanya setelah sumber memberi dasar yang jelas.

## Lowongan kerja

Gunakan `EXTERNAL_JOB_FEEDS_JSON`. Feed lowongan selalu menerapkan filter wilayah Kendari/Sultra dan tidak menampilkan item yang tidak mempunyai kecocokan lokasi kecuali `include_unknown: true` dikonfigurasi secara sadar.

```json
[
  {
    "id": "company-careers-sultra",
    "label": "Karier perusahaan — sumber resmi",
    "url": "https://company.example.id/careers/feed.json",
    "items_path": "jobs",
    "region_filter": true,
    "region_terms": ["kendari", "sulawesi tenggara", "konawe"],
    "provenance": "official_company_career_feed"
  }
]
```

Item lowongan mendukung `title`, `company`, `url`, `city`, `province`, `category`, `employment_type`, `salary`/`salary_text`, `description`, `posted_at`, dan `expires_at`. SultraKita menampilkan ringkasan singkat dan mengarahkan pengguna ke sumber asli untuk detail serta lamaran. Lowongan yang sudah kedaluwarsa harus dihentikan oleh feed sumber atau dihapus melalui endpoint/admin operation berikutnya; platform tidak mengklaim melakukan verifikasi hubungan kerja.

## Penyimpanan dan deduplikasi

Migration `007_external_catalogs.sql` membuat `external_listings` dan `external_jobs`. Kunci unik `(source, external_id)` membuat sinkronisasi berulang menjadi upsert, bukan duplikasi. `raw_json` dipertahankan untuk audit terbatas, sedangkan `observed_at`, `provenance`, dan URL sumber dipakai untuk transparansi.

## Shopee dan Instagram

SultraKita tidak melakukan scraping halaman Shopee atau Instagram, tidak mengambil posting akun personal, dan tidak mengunduh ulang aset berhak cipta tanpa izin. Shopee harus dihubungkan melalui Open Platform/affiliate/partner feed resmi. Instagram harus memakai akun professional dan akses Meta yang diotorisasi atau submission manual dari pemilik akun; Business Discovery bukan izin umum untuk memirror semua posting.

## Tahapan aktivasi

Tahap pertama sebaiknya memakai satu feed produk resmi dan satu feed lowongan resmi yang sudah diuji dengan 5–20 item di staging. Setelah validasi region, link, deduplikasi, dan expiry selesai, feed dapat ditambahkan ke Vercel Production. Tanpa URL feed dan credential yang benar-benar diberikan oleh pemilik sumber, repository sengaja tidak mengaktifkan feed default dan UI akan menyembunyikan section kosong.

## Referensi resmi

[1]: https://open.shopee.com/developer-guide/4 "Shopee Open Platform Developer Guide"
[2]: https://developers.facebook.com/documentation/instagram-platform/overview "Instagram Platform Overview"
[3]: https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login/business-discovery "Instagram Business Discovery"
[4]: https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media "Instagram Media API"
