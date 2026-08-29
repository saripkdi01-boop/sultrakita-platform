# Audit Koneksi Frontend–Backend SultraKita

Tanggal audit: 29 Agustus 2026. Scope audit meliputi `public/index.html`, `public/app.js`, `public/styles.css`, dan route API pada `server.js`.

## Kesimpulan

Frontend telah memakai kontrak backend utama untuk listing, detail, images, comments, favorites, suggestions, community summary, stats, donation campaigns, donations, OTP, conversations, dan notifications. Beberapa elemen sebelumnya hanya bersifat simulasi atau memanggil endpoint yang tidak ditemukan pada backend aktif. Elemen tersebut sudah dinonaktifkan atau diarahkan ke aksi yang benar.

## Matriks koneksi

| Kontrol/UI | Endpoint atau mekanisme | Status | Catatan |
|---|---|---|---|
| Feed listing, pencarian, distrik, kategori, sort, pagination | `GET /api/listings?q&category&district&min_price&max_price&sort&page&limit` | Terkoneksi | Query page/limit dan fallback offline aktif. |
| Kategori composer/filter | `GET /api/categories` | Terkoneksi | Fallback kategori dipakai ketika API offline. |
| Detail listing | `GET /api/listings/:id` | Terkoneksi | Dipakai sebelum membuka detail sheet. |
| Galeri listing | `GET /api/listings/:id/images` | Terkoneksi | Upload memakai multipart `POST /api/listings/:id/images`. |
| Komentar detail | `GET /api/listings/:id/comments` | Terkoneksi baca | Form komentar belum ditampilkan karena belum ada kontrol UI final. |
| Simpan listing | `POST/DELETE /api/favorites` | Terkoneksi | Optimistic UI; fallback tersimpan lokal ketika offline. |
| Buat listing | `POST /api/listings` | Terkoneksi | Data listing JSON dan file image dikirim terpisah. |
| Buat saran komunitas | `POST /api/suggestions` | Terkoneksi | Form submit memakai payload form. |
| Ringkasan komunitas | `GET /api/community/summary` | Terkoneksi | Mengisi metric card. |
| Dashboard | `GET /api/stats`, `GET /api/donation/campaigns` | Terkoneksi | Metrik dan progres donasi dibaca dari respons backend. |
| Donasi | `POST /api/donations` | Terkoneksi | Frontend hanya membuka `payment_url`; tidak menulis status pembayaran. |
| OTP | `POST /api/auth/request-otp`, `POST /api/auth/verify-otp` | Terkoneksi | Dua tahap request/verify. |
| Chat seller | `POST /api/conversations`, `POST /api/conversations/:id/messages` | Terkoneksi | Mengikuti route backend aktif. |
| Notifikasi | `GET /api/notifications`, `POST /api/notifications/:id/read` | Diperbaiki | Static notification list diganti dengan loader backend dan mark-read. |
| WhatsApp topbar | `wa.me` | Terkoneksi eksternal | Bukan API backend; aksi membuka WhatsApp dengan template awal. |
| Theme terang/gelap | `localStorage` + `data-theme` | Lokal-only | Tidak perlu backend karena preferensi UI perangkat. |
| Video | Tidak ditemukan route video aktif | Dinonaktifkan | Tab menjadi disabled agar tidak menampilkan view palsu. |
| Follow partner | Tidak ditemukan route follow yang kompatibel dengan ID UI saat ini | Dinonaktifkan | Tombol diubah menjadi “Ikuti segera hadir”. |
| Seller verification | Tidak ditemukan route `POST /api/seller-verifications` pada `server.js` aktif | Dinonaktifkan | Tombol menjadi “Verifikasi seller segera hadir”. |
| Sidebar “Lihat semua” | Tidak perlu route baru | Diperbaiki | Membuka search/filter sheet, bukan hash kosong. |

## Temuan penting

Frontend memiliki lebih banyak route backend daripada daftar kontrak awal, termasuk conversations, search-history, cart, checkout, orders, offers, notifications, analytics, addresses, dan reviews. Route tersebut belum seluruhnya memiliki UI pada SPA ini; sengaja tidak dibuatkan koneksi palsu. Fitur berikutnya dapat ditambahkan setelah payload dan ownership UI disepakati.

Kontrol yang tetap lokal dan tidak dianggap gagal adalah theme switcher, drawer open/close, filter state, optimistic favorite/follow lokal, dan fallback sample data ketika API offline. Seluruh aksi yang mengubah data marketplace atau akun diarahkan ke route backend yang tersedia.

## Validasi

`node --check public/app.js`, `npm run lint`, `npm run build`, dan `git diff --check` lulus setelah audit dan perbaikan.
