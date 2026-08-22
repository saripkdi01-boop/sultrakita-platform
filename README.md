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

## Komunitas dan donasi

Fitur saran, komentar, dan laporan telah tersedia sebagai fondasi moderasi komunitas. Komentar disimpan dengan status moderasi, sedangkan laporan dipisahkan agar tim admin dapat menindaklanjuti konten bermasalah. Fitur donasi saat ini mencatat komitmen dukungan (`pledged`) dan sengaja belum memproses pembayaran nyata. Untuk production, hubungkan endpoint ini ke provider pembayaran resmi, webhook tervalidasi, rekening organisasi yang sah, kebijakan pengembalian dana, dan rekonsiliasi admin sebelum menerima dana pengguna.

## Prioritas produk berikutnya

Fondasi API berikutnya perlu dilengkapi dengan autentikasi OTP atau OAuth, profil penjual terverifikasi, upload beberapa foto listing, chat pembeli-penjual, moderasi laporan, notifikasi, dan dashboard admin. Checkout serta pembayaran dapat diintegrasikan setelah alur transaksi dan kebijakan marketplace lokal telah ditetapkan.

## Keamanan

Jangan menaruh kredensial database atau token API di source code. Kredensial yang pernah masuk ke histori Git harus segera dirotasi dan dihapus dari histori jika sudah terpublikasi. Gunakan secret manager pada deployment produksi.
