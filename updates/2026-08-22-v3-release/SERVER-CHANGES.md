# `server.js` — Rincian Perbaikan P0/P1

## Perubahan yang benar-benar sudah diterapkan

| Area | Perubahan | Dampak |
|---|---|---|
| Health/error disclosure | Pada handler `GET /api/health`, detail internal `error.message` tidak lagi diteruskan ke client ketika database gagal | Mengurangi kebocoran informasi internal dan stack-adjacent diagnostics |
| OTP brute-force | Query challenge pada `POST /api/auth/verify-otp` sekarang hanya mengambil challenge dengan `attempts < 5` | Setelah lima kesalahan, challenge tidak dapat terus ditebak |
| Verified seller consistency | Query listing dan detail listing memakai ekspresi `CASE` yang menganggap seller verified bila `verification_status = 'approved'` atau legacy `is_verified = 1` | Badge/status seller tetap kompatibel dengan data lama dan mengikuti status moderasi baru |

## Lokasi teknis

Perubahan berada pada handler health sekitar baris 38–41, query OTP sekitar baris 61–67, serta query listing/detail sekitar baris 121–149 pada commit `ec0236d`.

## Gap P0/P1 yang sudah ditemukan tetapi belum diklaim selesai

Perubahan di atas adalah **hardening awal**, bukan penyelesaian seluruh gap P0/P1. Beberapa pekerjaan besar masih terbuka dan harus dilakukan pada folder update berikutnya secara incremental.

### Authorization dan ownership

Endpoint mutation masih memiliki pola menerima `user_id`, `seller_id`, `buyer_id`, atau `sender_id` dari request body. Tahap berikutnya harus menambahkan middleware Bearer session, lookup token hash, expiry handling, `req.user`, dan ownership checks. Tanpa tahap ini, client yang memanipulasi ID masih dapat mencoba bertindak sebagai user lain.

### OTP rate limiting

Batas lima percobaan sudah ditambahkan pada lookup challenge, tetapi rate limit khusus kombinasi IP dan nomor telepon, invalidasi challenge lama, dan observability delivery OTP masih perlu diperkuat.

### Upload security

Ukuran, jumlah file, dan MIME allow-list sudah ada pada baseline. Validasi magic bytes, cleanup file jika insert database gagal, penolakan `image_url` arbitrer, serta object storage durable masih belum menjadi hardening lengkap.

### Runtime parity

`worker.js` dan `server.js` belum menjadi satu business service yang sepenuhnya shared. Setiap perbaikan API harus diuji pada runtime yang dipakai production agar tidak terjadi feature drift.

### API and messaging safety

Conversation membership, message sender authorization, listing ownership pada create/edit/delete, serta admin authorization yang lebih granular masih memerlukan test regresi dan implementasi lanjutan.

## Verifikasi perubahan

Perintah berikut lulus setelah perubahan diterapkan:

```bash
npm test
git diff --check
```

Hasil baseline: 4 test lulus, 0 gagal. Test tambahan yang wajib dibuat pada update berikutnya adalah OTP lockout, verified-status consistency, unauthorized mutation, conversation membership, upload signature validation, dan production-safe error response.
