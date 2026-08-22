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
| GET | `/api/donation/campaigns` | Daftar kampanye donasi aktif |
| GET | `/api/donation/stats` | Statistik progres dan jumlah donatur |
| POST | `/api/donations` | Membuat transaksi donasi dan payment URL |
| POST | `/api/donation/webhook` | Menerima serta memverifikasi notifikasi Midtrans/Xendit |
| POST | `/api/reports` | Melaporkan listing bermasalah |
| GET | `/api/community/summary` | Ringkasan aktivitas komunitas |

Contoh pencarian: `/api/listings?q=rumah&category=properti&district=Mandonga&min_price=100000000&max_price=1000000000&sort=cheapest&page=1&limit=12`.

## Fitur production prioritas

Autentikasi OTP tersedia melalui `POST /api/auth/request-otp` dan `POST /api/auth/verify-otp`. Pada demo lokal, set `OTP_DEV_MODE=true` agar kode pengujian dikembalikan dalam respons; pada production, kode tidak boleh dikembalikan dan harus dikirim melalui provider SMS atau WhatsApp resmi.

Seller dapat mengajukan verifikasi melalui `POST /api/seller-verifications` menggunakan `document_type` `ktp`, `nib`, atau `other`. Sistem menyimpan referensi dokumen dan status moderasi, bukan data KTP mentah. Foto listing dapat dikirim melalui `POST /api/listings/:id/images` sebagai multipart field `images`, maksimal lima file JPG, PNG, atau WEBP dengan ukuran maksimal 5 MB per file. Foto dapat dibaca melalui `GET /api/listings/:id/images`.

Endpoint API memiliki rate limiting berbasis IP dan path sebagai perlindungan awal terhadap spam. Untuk deployment multi-instance, mekanisme ini perlu dipindahkan ke Redis atau Cloudflare KV agar counter tidak berbeda antar-instance. Upload lokal Express juga perlu dipindahkan ke R2 atau object storage terkelola sebelum traffic production meningkat.

## Komunitas dan donasi

Fitur donasi menggunakan kampanye aktif, transaksi berstatus `pending/success/failed/expired`, dan penghitungan progres yang hanya berubah setelah webhook pembayaran terverifikasi. Transaksi sukses bersifat idempoten: webhook yang sama atau webhook duplikat tidak menambahkan nominal dua kali.

| Endpoint | Payload/parameter penting | Respons utama |
|---|---|---|
| `GET /api/donation/campaigns` | Opsional tanpa payload | Array kampanye aktif dengan target dan nominal terkumpul |
| `GET /api/donation/stats?campaign_id=1` | `campaign_id` opsional | Kampanye, `progress_percent`, dan jumlah donatur sukses |
| `POST /api/donations` | `{ "campaign_id": 1, "amount": 25000, "name": "Hamba Allah", "email": "", "message": "", "payment_method": "qris" }` | `donation_id`, `transaction_id`, `payment_status`, `provider`, `payment_url` |
| `POST /api/donation/webhook` | Payload Midtrans atau Xendit; signature/header wajib | Status transaksi dan tanda idempotensi |

### Kredensial produksi Midtrans

Pilih `PAYMENT_PROVIDER=midtrans`. Untuk sandbox gunakan `MIDTRANS_MODE=sandbox` dan server key sandbox; untuk penerimaan dana nyata gunakan `MIDTRANS_MODE=production` dan server key production. Server key hanya boleh berada pada environment backend dan tidak boleh diberi prefix `VITE_` atau dikirim ke browser. API akan membuat Snap transaction melalui backend dan mengembalikan `payment_url`.

Di Midtrans MAP, atur **Settings → Configuration → Payment Notification URL** ke `https://DOMAIN-ANDA/api/donation/webhook`. Gunakan URL HTTPS publik. Midtrans memverifikasi notifikasi melalui `signature_key`; endpoint SultraKita mencocokkan signature SHA-512 dan hanya menganggap `settlement` atau `capture` yang diterima sebagai sukses.

### Kredensial produksi Xendit

Pilih `PAYMENT_PROVIDER=xendit`, isi `XENDIT_SECRET_KEY`, dan isi `XENDIT_CALLBACK_TOKEN` dari Dashboard Xendit pada pengaturan webhook. Secret key digunakan backend untuk membuat Invoice dan callback token digunakan hanya untuk memverifikasi header `x-callback-token`. Atur URL webhook Xendit ke `https://DOMAIN-ANDA/api/donation/webhook`. Xendit akan mengembalikan invoice URL melalui API; SultraKita menyimpan transaksi sebagai pending sampai webhook valid diterima.

### Pengaturan environment variable

Untuk lokal, salin `.env.example` menjadi `.env`, lalu isi hanya secret sandbox pada mesin pengembang:

```bash
cp .env.example .env
# pilih salah satu provider
PAYMENT_PROVIDER=midtrans
MIDTRANS_MODE=sandbox
MIDTRANS_SERVER_KEY=SB-Mid-server-...
```

Untuk production, gunakan secret manager platform deployment. Jangan commit `.env`, jangan menaruh secret di `wrangler.toml`, dan jangan mengirim secret melalui chat atau frontend. Contoh Cloudflare Workers:

```bash
printf '%s' 'midtrans' | npx wrangler secret put PAYMENT_PROVIDER --config wrangler-short.toml
printf '%s' 'production' | npx wrangler secret put MIDTRANS_MODE --config wrangler-short.toml
printf '%s' 'SB-or-Mid-server-key' | npx wrangler secret put MIDTRANS_SERVER_KEY --config wrangler-short.toml
# Alternatif Xendit:
printf '%s' 'xendit' | npx wrangler secret put PAYMENT_PROVIDER --config wrangler-short.toml
printf '%s' 'xnd_development_or_production_secret' | npx wrangler secret put XENDIT_SECRET_KEY --config wrangler-short.toml
printf '%s' 'webhook-callback-token' | npx wrangler secret put XENDIT_CALLBACK_TOKEN --config wrangler-short.toml
```

Ganti seluruh contoh nilai di atas dengan secret asli melalui terminal yang aman. Setelah deployment, periksa hanya nama secret, bukan nilainya. Atur `PAYMENT_SUCCESS_URL` dan `PAYMENT_FAILURE_URL` ke URL HTTPS platform produksi jika menggunakan Xendit.

### Pengujian lokal

Mode tanpa provider tidak memanggil layanan eksternal dan cocok untuk UI/API development. Jalankan `npm run smoke:donation` untuk menguji statistik kampanye, pembuatan transaksi, penolakan signature palsu, settlement Midtrans simulasi, dan replay webhook idempoten. Untuk pengujian penuh seluruh platform, jalankan `npm run verify:local`.

Contoh manual:

```bash
npm install
npm run smoke:donation
curl http://localhost:3000/api/donation/stats
curl -X POST http://localhost:3000/api/donations \\
  -H 'content-type: application/json' \\
  -d '{"amount":25000,"name":"Donatur Uji","payment_method":"qris"}'
```

Jangan menandai donasi sebagai sukses berdasarkan redirect browser. Hanya webhook provider yang sudah diverifikasi yang boleh mengubah status menjadi `success` dan menambah `current_amount`.

### React/Vite checkout

Contoh komponen siap pakai tersedia di [`docs/DonationCheckout.jsx`](./docs/DonationCheckout.jsx). Komponen mengirim `POST /api/donations`, menyimpan `transaction_id` di `localStorage`, lalu menjalankan `window.location.assign(result.data.payment_url)` untuk mengarahkan pengguna ke halaman Midtrans Snap atau Xendit Invoice. Setelah pengguna kembali ke aplikasi, komponen membaca status melalui `GET /api/donations/:transaction_id` setiap lima detik. Redirect hanya memberi indikasi navigasi; status final tetap berasal dari webhook server-side.

```jsx
import DonationCheckout from './DonationCheckout';

export default function DonatePage() {
  return <DonationCheckout campaignId={1} apiBaseUrl="https://api.sultrakita.id" />;
}
```

### Pengujian webhook melalui ngrok

Jalankan server lokal terlebih dahulu, kemudian buka tunnel HTTPS ke port aplikasi:

```bash
npm start
ngrok http 3000
```

Salin URL HTTPS ngrok, misalnya `https://contoh.ngrok-free.app`, lalu masukkan alamat berikut ke dashboard Midtrans atau Xendit:

```text
https://contoh.ngrok-free.app/api/donation/webhook
```

Buat transaksi lokal untuk memperoleh `transaction_id`:

```bash
curl -s -X POST http://localhost:3000/api/donations \\
  -H 'content-type: application/json' \\
  -d '{"campaign_id":1,"amount":25000,"name":"Webhook Uji"}'
```

Untuk simulasi Midtrans tanpa menunggu dashboard:

```bash
WEBHOOK_URL=https://contoh.ngrok-free.app/api/donation/webhook \\
WEBHOOK_PROVIDER=midtrans TRANSACTION_ID=SK-... AMOUNT=25000 \\
MIDTRANS_SERVER_KEY=local-test-server-key npm run test:webhook
```

Untuk simulasi Xendit:

```bash
WEBHOOK_URL=https://contoh.ngrok-free.app/api/donation/webhook \\
WEBHOOK_PROVIDER=xendit TRANSACTION_ID=SK-... AMOUNT=25000 \\
XENDIT_CALLBACK_TOKEN=token-lokal-uji npm run test:webhook
```

Pada pengujian Xendit nyata, gunakan Callback Token yang sama dengan yang dikonfigurasi di dashboard. Pada pengujian Midtrans nyata, gunakan Server Key dari environment yang sesuai dengan payload sandbox atau production. Pantau request masuk melalui terminal ngrok dan periksa hasilnya dengan `GET /api/donations/:transaction_id` serta `GET /api/donation/stats?campaign_id=1`. Jangan pernah menaruh Server Key, Secret Key, atau Callback Token di kode frontend.

### QRIS dan Virtual Account

Frontend web menyediakan pilihan `QRIS` dan `Virtual Account` pada modal donasi. Pilihan ini dikirim sebagai `payment_method` ke `POST /api/donations`. Pada Midtrans, QRIS dipetakan ke `gopay/qris`, sedangkan Virtual Account dipetakan ke kanal VA aktif seperti `bca_va`, `bni_va`, `bri_va`, `permata_va`, `cimb_va`, `danamon_va`, `bsi_va`, dan `echannel`. Pada Xendit, QRIS dikirim sebagai `QRIS`, sedangkan Virtual Account meminta kanal `BCA`, `BNI`, `BRI`, `MANDIRI`, dan `PERMATA`. Ketersediaan kanal tetap mengikuti aktivasi merchant di dashboard provider.

### Load testing

Skrip [`scripts/load-test-donations.js`](./scripts/load-test-donations.js) menguji pembuatan donasi dan webhook dalam batch dengan concurrency yang dapat diatur. Jalankan hanya pada local atau sandbox, bukan production, karena setiap webhook sukses akan menambah progres kampanye.

```bash
# server lokal tanpa provider eksternal
npm start
REQUESTS=200 CONCURRENCY=20 WEBHOOK_PROVIDER=midtrans \\
MIDTRANS_SERVER_KEY=load-test-midtrans-key \\
npm run load:donation
```

Untuk Xendit webhook simulasi:

```bash
REQUESTS=200 CONCURRENCY=20 WEBHOOK_PROVIDER=xendit \\
XENDIT_CALLBACK_TOKEN=load-test-xendit-token \\
npm run load:donation
```

Output berisi jumlah request sukses/gagal, p50, p95, dan waktu maksimum. Gunakan environment database terpisah untuk pengujian beban dan pantau CPU, memory, database lock, rate limit, latency provider, serta webhook retry. Jangan menjalankan load test terhadap URL provider secara langsung; skrip ini menguji endpoint SultraKita dengan payload provider yang ditandatangani atau diberi callback token simulasi.

## Dashboard analytics dan operasi donasi

Admin dapat membaca `GET /api/admin/donations/analytics?days=30` untuk melihat percobaan pembayaran, transaksi sukses, transaksi gagal atau expired, net nominal setelah refund, tingkat keberhasilan, serta agregasi harian. Endpoint ini membutuhkan session admin Bearer token dan `x-admin-token`.

| Operasi | Endpoint | Perilaku |
|---|---|---|
| Analytics | `GET /api/admin/donations/analytics?days=30` | Statistik harian dan tingkat sukses pembayaran. |
| Log webhook | `GET /api/admin/webhook-logs?limit=50` | Daftar log webhook terbaru tanpa payload rahasia. |
| Live webhook | `GET /api/admin/webhook-logs/stream` | Server-Sent Events yang dikonsumsi frontend melalui `fetch` streaming. |
| Refund | `POST /api/admin/donations/:transaction_id/refund` | Meminta refund provider, mencatat refund, dan mengurangi net kampanye setelah provider menerima request. |
| Cancel | `POST /api/admin/donations/:transaction_id/cancel` | Membatalkan transaksi pending; Midtrans memakai cancel API dan Xendit memakai expire invoice. |

Frontend `index.html`, `app.js`, dan `styles.css` sekarang memiliki dashboard operasional dengan metrik kartu, grafik harian sederhana, form refund/cancel, dan monitor log webhook live. Kredensial hanya digunakan di memory browser dan tidak disimpan ke `localStorage`.

Refund hanya dapat dilakukan pada transaksi `success`, sedangkan cancel hanya dapat dilakukan pada transaksi `pending`. Untuk Midtrans, refund mengarah ke Refund API dan cancel mengarah ke Cancel API. Untuk Xendit, cancel meng-expire invoice; refund memakai Refund API dengan `XENDIT_REFUND_URL` opsional bila account/API version Anda menggunakan endpoint berbeda. Selalu rekonsiliasi status provider sebelum menganggap dana sudah kembali, dan terapkan persetujuan internal sebelum mengklik operasi refund di production.

Webhook disimpan ke tabel `webhook_logs` dengan provider, transaction ID, status event, HTTP status, validitas signature, timestamp, dan payload terbatas. Endpoint live stream memeriksa log baru setiap dua detik. Untuk production multi-instance, pindahkan log ke database terkelola atau queue/observability service bersama agar semua instance terlihat dalam satu aliran.

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
