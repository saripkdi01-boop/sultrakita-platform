# Admin Google owner login QA

Tanggal: 2026-08-28.

Route `/admin` berhasil mengarahkan ke `/admin/index.html` dan menampilkan layout Operations Center baru dengan satu tombol Google berikon inline empat warna, tanpa input session bearer atau admin token. Tautan tombol mengarah ke `/api/auth/google/admin/start`. Halaman responsif pada viewport mobile/desktop dan console browser tidak menghasilkan error.

Pembatasan server diperkuat di `google-admin-sso.js`, `server.js`, dan `api/admin/index.js`: satu-satunya email yang diizinkan adalah `sultrakitaplatform@gmail.com`, sedangkan role admin tetap wajib lolos pemeriksaan server-side. `public/admin.html` kini hanya mengalihkan ke canonical Google-only login agar tidak ada jalur token manual alternatif.
