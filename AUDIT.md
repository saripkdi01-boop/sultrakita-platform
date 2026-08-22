# Audit Awal SultraKita

## Temuan Utama

Repositori saat ini adalah stub backend Node.js yang terdiri dari `server.js`, `database.js`, `package.json`, `package-lock.json`, dan `vercel.json`. Belum terdapat frontend, dokumentasi API, skema database, test, validasi input, autentikasi, upload gambar, pencarian, pagination, atau model transaksi marketplace.

`package.json` hanya mendeklarasikan `sql.js`, sedangkan `server.js` mengimpor `express`, `cors`, dan `dotenv`, serta `database.js` mengimpor `mysql2`; dependensi tersebut belum dikunci dalam package manifest. Akibatnya aplikasi tidak siap dijalankan secara bersih dari clone baru.

`database.js` berisi kredensial database yang ditulis langsung di source code. Ini merupakan risiko keamanan kritis. Kredensial perlu segera dicabut/dirotasi oleh pemilik dan seluruh konfigurasi harus dipindahkan ke environment variables. Nilai rahasia tidak disalin ke dokumentasi refactor.

Konfigurasi Vercel mengarahkan seluruh request ke `server.js`, tetapi server hanya memakai `app.listen`, sehingga pola serverless perlu diperbaiki dengan mengekspor handler dan hanya menjalankan listener saat lokal.

## Arah Refactor

Tahap pertama upgrade akan membangun fondasi marketplace lokal yang dapat berjalan dari clone baru: API modular, penyimpanan SQLite berbasis `sql.js` tanpa kredensial hard-coded, schema untuk users/listings/categories/favorites/messages, pencarian dan filter berbasis lokasi/kategori/harga, pagination, validasi input, error handler konsisten, health check, seed kategori Sulawesi Tenggara, serta test API dasar.

Tahap berikutnya dapat menambahkan autentikasi, verifikasi penjual, upload media ke object storage, chat realtime, moderasi, transaksi, pembayaran, notifikasi, admin dashboard, dan frontend responsif.
