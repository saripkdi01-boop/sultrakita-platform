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

## Notifikasi WhatsApp penjual

Notifikasi WhatsApp otomatis dipicu setelah komentar atau pesan pembeli tersimpan berhasil. Adapter menggunakan WhatsApp Cloud API resmi dan bersifat non-blocking: kegagalan provider dicatat di server tanpa menggagalkan penyimpanan pesan. Konfigurasikan `WHATSAPP_API_VERSION`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_TEMPLATE_NAME`, dan `WHATSAPP_TEMPLATE_LANGUAGE` melalui secret manager. Template default yang dicontohkan adalah `sultrakita_new_message` dengan empat parameter body berurutan: nama penjual, judul listing, nama pembeli, dan isi pesan. Nama serta urutan variabel harus sama persis dengan template yang disetujui di WhatsApp Manager. Nomor `08...` dinormalisasi menjadi format internasional `62...`. Untuk pesan di luar jendela layanan pelanggan, gunakan template pesan yang disetujui Meta dan pastikan penerima telah memberikan opt-in.

Untuk menguji alur tanpa memanggil Meta, jalankan `node scripts/simulate-whatsapp-webhook.js`. Dengan server lokal aktif, gunakan `SIMULATE_HTTP=true SULTRAKITA_URL=http://localhost:3000 SIMULATION_TOKEN=local-only node scripts/simulate-whatsapp-webhook.js`. Endpoint `/api/dev/whatsapp-webhook` hanya menerima token simulasi dan menandai `provider_called:false`; pada `NODE_ENV=production`, endpoint Express dinonaktifkan.

## Secret Cloudflare Workers

Jangan memasukkan nilai token ke `wrangler.toml`, `.env`, commit Git, screenshot, atau chat. Set secret production menggunakan Wrangler:

```bash
printf '%s' 'TOKEN_ADMIN_PANJANG' | npx wrangler secret put ADMIN_TOKEN --config wrangler-short.toml
printf '%s' 'TOKEN_META_WHATSAPP' | npx wrangler secret put WHATSAPP_ACCESS_TOKEN --config wrangler-short.toml
printf '%s' 'PHONE_NUMBER_ID_META' | npx wrangler secret put WHATSAPP_PHONE_NUMBER_ID --config wrangler-short.toml
printf '%s' 'sultrakita_new_message' | npx wrangler secret put WHATSAPP_TEMPLATE_NAME --config wrangler-short.toml
printf '%s' 'id' | npx wrangler secret put WHATSAPP_TEMPLATE_LANGUAGE --config wrangler-short.toml
```

Periksa nama secret tanpa mencetak nilainya melalui dashboard Cloudflare atau daftar konfigurasi Wrangler. Setelah rotasi token, lakukan smoke test endpoint admin menggunakan header `x-admin-token` dari terminal lokal yang aman. `ADMIN_TOKEN` sebaiknya dibuat acak, panjang, berbeda dari password, dan dirotasi ketika ada perubahan anggota tim. Hapus token lama dari secret store setelah deployment baru tervalidasi.

## Prioritas produk berikutnya

Setelah fondasi ini, platform perlu dilengkapi dengan template WhatsApp yang disetujui, delivery log dan retry queue, dashboard notifikasi admin, provider OTP resmi, object storage R2, chat berskala tinggi, moderasi laporan, analytics, backup, dan dashboard operasional. Checkout serta pembayaran dapat diintegrasikan setelah alur transaksi dan kebijakan marketplace lokal telah ditetapkan.

## Keamanan

Jangan menaruh kredensial database atau token API di source code. Kredensial yang pernah masuk ke histori Git harus segera dirotasi dan dihapus dari histori jika sudah terpublikasi. Gunakan secret manager pada deployment produksi.
