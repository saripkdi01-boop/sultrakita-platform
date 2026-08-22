# SultraKita Platform

SultraKita adalah fondasi marketplace lokal untuk warga Kota Kendari dan wilayah Sulawesi Tenggara. Versi 2 ini memprioritaskan pencarian listing berbasis wilayah, kategori lokal, pengalaman penjual, dan API yang sederhana untuk dihubungkan ke web atau aplikasi mobile.

## Menjalankan secara lokal

Gunakan Node.js 18 atau yang lebih baru. Salin `.env.example` menjadi `.env`, kemudian jalankan `npm install` dan `npm start`. API tersedia pada `http://localhost:3000`.

Database SQLite dibuat otomatis di folder `data/` menggunakan `sql.js`. Folder database tersebut bersifat lokal dan tidak boleh dimasukkan ke Git. Untuk produksi, lapisan persistence sebaiknya dipindahkan ke D1, PostgreSQL, atau MySQL terkelola melalui secret manager.

## Endpoint inti

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/health` | Health check service dan database |
| GET | `/api/categories` | Daftar kategori marketplace |
| GET | `/api/locations` | Provinsi, kota, dan distrik yang didukung |
| GET | `/api/stats` | Ringkasan jumlah listing dan kategori populer |
| GET | `/api/listings` | Daftar listing dengan search, filter, sort, dan pagination |
| GET | `/api/listings/:id` | Detail listing sekaligus menambah view |
| POST | `/api/listings` | Membuat listing baru dengan validasi |
| POST | `/api/favorites` | Menyimpan listing ke favorit |
| DELETE | `/api/favorites` | Menghapus listing dari favorit |
| GET | `/api/listings/:id/comments` | Komentar visible pada listing |
| POST | `/api/comments` | Menambahkan komentar |
| POST | `/api/suggestions` | Mengirim saran fitur |
| POST | `/api/donations` | Mencatat pledge dukungan proyek |
| POST | `/api/reports` | Melaporkan listing bermasalah |
| GET | `/api/community/summary` | Ringkasan aktivitas komunitas |

Contoh pencarian: `/api/listings?q=rumah&category=properti&district=Mandonga&min_price=100000000&max_price=1000000000&sort=cheapest&page=1&limit=12`.

## Fitur production prioritas

Autentikasi OTP tersedia melalui `POST /api/auth/request-otp` dan `POST /api/auth/verify-otp`. Pada demo lokal, set `OTP_DEV_MODE=true` agar kode pengujian dikembalikan dalam respons; pada production, kode tidak boleh dikembalikan dan harus dikirim melalui provider SMS atau WhatsApp resmi.

Seller dapat mengajukan verifikasi melalui `POST /api/seller-verifications` menggunakan `document_type` `ktp`, `nib`, atau `other`. Sistem menyimpan referensi dokumen dan status moderasi, bukan data KTP mentah. Foto listing dapat dikirim melalui `POST /api/listings/:id/images` sebagai multipart field `images`, maksimal lima file JPG, PNG, atau WEBP dengan ukuran maksimal 5 MB per file. Foto dapat dibaca melalui `GET /api/listings/:id/images`.

Endpoint API memiliki rate limiting berbasis IP dan path sebagai perlindungan awal terhadap spam. Untuk deployment multi-instance, mekanisme ini perlu dipindahkan ke Redis atau Cloudflare KV agar counter tidak berbeda antar-instance. Upload lokal Express juga perlu dipindahkan ke R2 atau object storage terkelola sebelum traffic production meningkat.

## Komunitas dan donasi

Fitur saran, komentar, dan laporan telah tersedia sebagai fondasi moderasi komunitas. Komentar disimpan dengan status moderasi, sedangkan laporan dipisahkan agar tim admin dapat menindaklanjuti konten bermasalah. Fitur donasi saat ini mencatat komitmen dukungan (`pledged`) dan sengaja belum memproses pembayaran nyata. Untuk production, hubungkan endpoint ini ke provider pembayaran resmi, webhook tervalidasi, rekening organisasi yang sah, kebijakan pengembalian dana, dan rekonsiliasi admin sebelum menerima dana pengguna.

## Prioritas produk berikutnya

Setelah empat fitur prioritas ini, platform perlu dilengkapi dengan dashboard admin verifikasi, provider OTP resmi, object storage R2, chat pembeli-penjual, notifikasi, moderasi laporan, analytics, backup, dan dashboard operasional. Checkout serta pembayaran dapat diintegrasikan setelah alur transaksi dan kebijakan marketplace lokal telah ditetapkan.

## Keamanan

Jangan menaruh kredensial database atau token API di source code. Kredensial yang pernah masuk ke histori Git harus segera dirotasi dan dihapus dari histori jika sudah terpublikasi. Gunakan secret manager pada deployment produksi.
