# Universal Link Cards SultraKita

## Ringkasan

SultraKita mendukung alur sederhana **tempel URL → baca metadata publik → ringkas deskripsi → simpan kartu → tampil pada kategori**. Admin tidak perlu mengisi judul, gambar, atau deskripsi secara manual untuk setiap link.

Panel admin berada di `/admin.html` pada bagian **Tambah kartu marketplace dari link**. Satu atau beberapa URL HTTPS dapat ditempel sekaligus. Kategori dapat dibiarkan **Otomatis** atau dipilih manual bila URL marketplace tidak memuat nama produk yang cukup jelas.

## Kategori yang didukung

Pemetaan otomatis memakai istilah dari judul, deskripsi, dan URL. Contoh kata kunci handphone, smartphone, iPhone, Samsung, laptop, dan elektronik masuk ke `elektronik`; mobil, motor, dan sepeda masuk ke `kendaraan`; rumah, tanah, kos, dan ruko masuk ke `properti`; istilah lowongan, loker, job, karir, dan rekrut masuk ke `lowongan`. Kategori lain yang tersedia adalah fashion, rumah tangga, hobi, kuliner, jasa, dan fallback `lainnya`.

| Jenis link | Penyimpanan | Tampilan |
|---|---|---|
| Lowongan kerja | `external_jobs` | Kategori `lowongan` |
| Produk handphone/elektronik/kendaraan/properti dan lainnya | `external_listings` | Kategori sesuai slug hasil inferensi |

## Metadata dan ringkasan

Server hanya mengambil metadata publik terbatas: `og:title` atau title, `og:description` atau description, serta `og:image`. Jika situs memblokir preview otomatis, kartu tetap dibuat dari URL dengan favicon sumber dan deskripsi fallback. Kartu tidak menyalin seluruh halaman, tidak mengambil sesi login, dan selalu menampilkan link **Buka sumber**.

Ringkasan AI bersifat optional dan dipanggil server-side melalui konfigurasi `OPENAI_API_KEY` yang sudah tersedia pada arsitektur project. Jika key kosong, SultraKita menggunakan fallback lokal gratis berbasis metadata sehingga fitur tetap berjalan tanpa biaya API. AI tidak boleh mengarang harga, kondisi, gaji, syarat, atau status aktif.

## Endpoint

```text
POST /api/admin/catalog/import-url
POST /api/admin/catalog/import-urls
GET  /api/external-cards?category=elektronik&q=iphone&district=Kadia
```

Endpoint admin membutuhkan bearer session dan `x-admin-token`. Endpoint publik hanya mengembalikan kartu yang sudah tersimpan atau berasal dari feed partner yang diizinkan. Deduplikasi menggunakan hash URL dan kunci `(source, external_id)`.

## Domain yang diizinkan

Default mencakup beberapa marketplace dan portal lowongan umum: Shopee, Tokopedia, Facebook, Instagram, Lazada, Blibli, Bukalapak, Carousell, JobStreet, Jora, Indeed, dan Loker.my.id. Domain tambahan harus dimasukkan melalui `LINK_URL_ALLOWED_HOSTS` pada environment server. URL harus HTTPS; alamat lokal/private network ditolak untuk mengurangi risiko SSRF.

## Operasional

Jalankan migration `010_universal_link_cards.sql` sebelum memakai universal cards pada database production. Setelah deployment selesai, admin cukup memasukkan URL dan memilih kategori bila diperlukan. Kartu akan masuk ke grid utama kategori, bukan hanya section partner terpisah.
