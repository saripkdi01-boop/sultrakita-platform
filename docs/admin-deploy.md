# SultraKita Admin Deployment

Route canonical admin: `https://sultrakita-platform.vercel.app/admin/dashboard`

## Pipeline existing

Deployment mengikuti pipeline Vercel yang terhubung ke repository GitHub `saripkdi01-boop/sultrakita-platform`. Perubahan admin dikembangkan pada branch `main`, lalu dikirim dengan commit dan push biasa. Vercel akan membuat deployment dari commit tersebut sesuai konfigurasi project yang sudah terhubung; tidak ada deployment manual dari direktori WebDev eksternal yang diperlukan.

Perintah validasi lokal sebelum push:

```bash
npm install
npm run build
npm test
```

`npm run build` menjalankan `scripts/build-check.js` untuk memeriksa artefak dan marker HTML yang diwajibkan. `npm test` menjalankan regression suite API dan security. Dalam sandbox ini, build dan syntax check lulus; satu test statistik dapat gagal apabila koneksi SSL database test tidak tersedia. Itu adalah keterbatasan environment, bukan perubahan pada shell admin.

## Verifikasi setelah push

Buka `https://sultrakita-platform.vercel.app/admin/dashboard`. Route harus menampilkan Google Admin SSO asli pada `/api/auth/google/admin/start` ketika belum login. Setelah login menggunakan akun owner yang diizinkan, verifikasi bahwa topbar tiga zona, sidebar permission-aware, center navigation, right operations panel, dashboard live, dan bottom navigation mobile termuat.

Uji pencarian dengan kata kunci listing atau pengguna, buka tab analytics/listing/donasi/pengguna, cek menu mobile pada viewport kecil, lalu pastikan logout kembali ke halaman login. Untuk perubahan backend atau data, verifikasi juga status pada endpoint admin yang terkait dan jangan menyalin service-role key ke browser.

## Commit migrasi

Commit awal migrasi tampilan utama: `77513ef` pada branch `main`.
