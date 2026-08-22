# Audit SultraKita — Baseline Versi Terbaru

Tanggal audit: 22 Agustus 2026

## Ringkasan

SultraKita sudah memiliki fondasi marketplace lokal yang dapat dijalankan dari clone baru. Repository berisi frontend static, API Express, jalur Cloudflare Worker, database SQLite melalui `sql.js`, OTP/session, listing, filter, komentar, laporan, upload gambar, messaging/SSE, analytics, admin endpoints, serta metadata dasar SEO/PWA.

Audit lama yang menyatakan bahwa frontend, test, validasi, upload, search, dan pagination belum tersedia sudah tidak akurat. Dokumen ini menggantikannya dan harus menjadi baseline untuk upgrade berikutnya.

## Temuan P0

1. **Authorization belum konsisten.** Endpoint yang menerima `user_id`, `seller_id`, `buyer_id`, atau `sender_id` dari body belum seluruhnya memverifikasi Bearer session dan kepemilikan resource. Ini membuka risiko impersonation, akses conversation milik user lain, dan perubahan data tanpa otorisasi.

2. **Status verifikasi memiliki dua sumber data.** Schema memiliki `is_verified`, sementara migration menambahkan `phone_verified`, `verification_status`, dan `verification_note`. Proses review memperbarui `verification_status`, tetapi query listing masih memilih `is_verified`. Status badge harus disatukan atau disinkronkan melalui migration yang eksplisit.

3. **Persistence dan upload lokal belum durable untuk scale-out.** SQLite file dan folder `uploads/` dapat digunakan untuk local/demo, tetapi tidak boleh diperlakukan sebagai storage production untuk Worker atau multi-instance. Jalur D1/R2 atau managed service perlu diputuskan sebelum traffic meningkat.

4. **OTP membutuhkan abuse controls lebih kuat.** Sudah terdapat expiry dan rate limiting umum, tetapi perlu batas percobaan per challenge/nomor, invalidasi challenge lama secara deterministik, serta pemisahan rate limit OTP dari rate limit API umum.

5. **Express dan Worker berpotensi drift.** `server.js` memiliki fitur yang lebih lengkap daripada `worker.js`. Setiap perubahan bisnis harus memiliki shared service atau compatibility matrix dan smoke test untuk runtime target.

## Temuan P1

1. Homepage deployment sudah memiliki arah visual lokal yang baik, tetapi pengalaman masih dominan katalog: social feed, seller store, notification center, detail product yang kaya, dan create-listing flow belum menjadi alur end-to-end yang setara dengan target produk.

2. Frontend dan API perlu state yang konsisten untuk loading, empty, error, optimistic update, dan retry. Search perlu autocomplete, recent/trending suggestion, filter yang mudah dipakai di mobile, dan pagination yang tetap ringan.

3. Test baseline hanya mencakup health, categories, listing validation, dan locations. Critical journey serta security regression belum memiliki cakupan yang cukup.

4. Error handler utama sudah menyembunyikan stack trace, tetapi health check memberikan `error.message` sebagai detail. Detail internal tidak seharusnya dikirim pada production.

5. Upload sudah membatasi jumlah, ukuran, dan beberapa MIME type, tetapi validasi magic bytes, cleanup ketika insert database gagal, serta pengamanan URL gambar masih perlu ditambahkan.

## Prioritas Eksekusi

| Prioritas | Fokus | Exit criterion |
|---|---|---|
| P0 | Session authorization, ownership, verification consistency, OTP abuse controls, upload safety | Security tests lulus dan endpoint sensitif menolak impersonation |
| P0 | Runtime/persistence compatibility | Express/Worker behavior terdokumentasi; migration idempotent |
| P1 | Design system dan app shell mobile-first | Tidak ada overflow; state interaksi lengkap pada viewport utama |
| P1 | Marketplace discovery dan create listing | Browse-search-detail-create berjalan end-to-end |
| P2 | Seller profile, social, chat, notifications | Data model, membership, pagination, dan moderation tersedia |
| P3 | Performance, SEO, PWA, analytics, AI/monetization readiness | Diukur terhadap baseline dan tidak mengaktifkan placeholder sebagai production |

## Baseline Verification

- `npm install --no-audit --no-fund`: berhasil.
- `npm test`: 4 test lulus, 0 gagal.
- Deployment homepage: dapat dimuat dan menampilkan search, kategori, filter wilayah, sorting, listing card, CTA pasang iklan, theme toggle, navigasi, dan community CTA.

## Rekomendasi Tata Kelola

Kerjakan secara incremental pada branch kerja dari repository canonical. Gunakan satu concern per commit, jangan force push, jangan mengganti remote, dan jangan menaruh secret ke source, dokumentasi, screenshot, atau test fixture. Setiap phase harus menghasilkan perubahan kode nyata, test, dokumentasi, dan catatan rollback.
