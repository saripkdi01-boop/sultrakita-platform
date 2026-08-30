# Laporan Audit dan Implementasi: Pengaturan & Privasi SultraKita

**Tanggal:** 31 Agustus 2026  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Commit utama:** `ac3cad8`  
**Commit perbaikan routing:** `8d36c9e`

## Ringkasan

Audit dilakukan pada [aplikasi production][1], repository GitHub yang dipilih, dan project Supabase production `ibvcfdfsjpytwpnxgylm`. Hasilnya menunjukkan bahwa backend production telah memakai adaptor PostgreSQL melalui `DATABASE_URL`/`SUPABASE_DB_URL`; tidak dibuat database paralel. Supabase production telah memiliki fondasi tabel pengaturan dan privasi sehingga implementasi menggunakan tabel yang sudah tersedia.

Perubahan telah di-commit dan di-push ke branch `main`. Deployment Vercel terkait commit implementasi berstatus `READY` dan halaman `settings.html` pada domain production telah merespons sesuai alur autentikasi: pengguna tanpa token diarahkan ke `account.html?next=/settings.html`.

## Temuan audit

| Area | Temuan | Keputusan |
|---|---|---|
| Navigasi | Accordion “Pengaturan & privasi” hanya berisi teks dan toggle tema. | Ditambahkan tautan nyata ke `/settings.html`. |
| Runtime | Repository aktif menggunakan Node/Express dan adaptor PostgreSQL, bukan SQLite runtime. | Router baru mengikuti `query`/`run` dari `database.js`. |
| Supabase | Production memiliki `user_settings`, `privacy_settings`, `notification_settings`, `account_deletion_requests`, `data_exports`, `security_events`, serta tabel fitur marketplace lain. | Tidak membuat tabel backend paralel di production. |
| Auth | Session bearer existing diproses oleh `authenticate`/`requireAuth`. | Endpoint baru memakai middleware auth yang sama. |
| Schema repository | Sebagian tabel settings sudah ada di production tetapi belum terwakili jelas dalam schema-as-code repository. | Ditambahkan migration additive idempotent untuk instalasi baru dan alignment. |

## Fitur yang diimplementasikan

Halaman `/settings.html` sekarang menyediakan pengelolaan informasi akun, visibilitas profil (`public`, `friends`, `private`), status aktivitas, penandaan, kanal notifikasi email/push/SMS, bahasa, mode gelap, serta notifikasi aplikasi. Pengguna juga dapat meminta ekspor data JSON atau CSV, menjadwalkan penghapusan akun tujuh hari kemudian, dan membatalkan permintaan tersebut selama belum selesai.

API baru berada di bawah `/api/account` dan seluruhnya memerlukan session authenticated.

| Method | Endpoint | Fungsi |
|---|---|---|
| `GET` | `/api/account/settings` | Memuat profil, preferensi, privasi, dan notifikasi. |
| `PATCH` | `/api/account/settings` | Menyimpan perubahan secara parsial melalui upsert ke tabel existing. |
| `POST` | `/api/account/data-export` | Membuat permintaan ekspor JSON/CSV yang siap diunduh. |
| `GET` | `/api/account/data-export/:id/download` | Mengunduh data milik pengguna yang sedang login. |
| `POST` | `/api/account/deletion-request` | Menjadwalkan penghapusan akun tujuh hari ke depan. |
| `POST` | `/api/account/deletion-request/cancel` | Membatalkan permintaan penghapusan yang masih aktif. |

Pencatatan keamanan untuk permintaan penghapusan menggunakan tabel `security_events` existing. Query ekspor dibatasi ke data akun pengguna sendiri dan endpoint download memeriksa kepemilikan `user_id`.

## Berkas perubahan

`api/account-settings.js` berisi router additive untuk seluruh kontrak akun. `public/settings.html`, `public/settings.css`, dan `public/settings.js` menyediakan UI responsif dengan navigasi section, persistensi tema lokal, status loading/error sederhana, serta pengunduhan data. `supabase/migrations/20260831_account_settings.sql` menyelaraskan schema-as-code dengan tabel production yang telah ditemukan saat audit. `server.js` hanya menambahkan import, mount `/api/account`, dan route eksplisit `/settings.html` untuk memastikan static page tersaji pada Vercel. `public/index.html` mengubah accordion sidebar agar membuka pusat pengaturan.

## Verifikasi

Pemeriksaan `node --check` untuk `server.js`, `api/account-settings.js`, dan `public/settings.js` berhasil. `git diff --check`, `npm run lint`, dan `npm run build` juga berhasil. Test suite repository menghasilkan **40 test lulus, 7 test skip, 0 gagal**. Verifikasi browser pada domain production tanpa token menghasilkan redirect ke halaman login dengan parameter return `/settings.html`, yang merupakan perilaku yang diharapkan untuk halaman privat.

Pengujian alur authenticated yang benar-benar mengubah data belum dijalankan karena memerlukan session pengguna aktif. Endpoint dirancang untuk memakai token existing dan tidak mengubah atau menyalin kredensial pengguna.

## Referensi

[1]: https://sultrakita-platform.vercel.app/ "SultraKita production"
[2]: https://github.com/saripkdi01-boop/sultrakita-platform "SultraKita GitHub repository"
[3]: https://ibvcfdfsjpytwpnxgylm.supabase.co "SultraKita Supabase project URL"


## Addendum revisi arsitektur

Audit ulang menemukan bahwa Supabase production telah memiliki fondasi tambahan untuk `device_sessions`, `ad_activity_logs`, `link_history`, `data_usage_logs`, `time_management_limits`, `privacy_processing_requests`, dan `orders`. Karena itu, revisi tidak membuat model baru untuk fitur-fitur tersebut. Pesanan & pembayaran sekarang ditampilkan sebagai UI layer di atas tabel dan endpoint orders existing. Aktivitas iklan diubah menjadi **Aktivitas Promosi** dan hanya menampilkan event dari `ad_activity_logs`; ketika kosong, UI menampilkan empty state tanpa angka fiktif. Pemblokiran dinyatakan belum tersedia karena belum ditemukan block-list model dan authorization contract.

Router `/api/account` kini juga menyediakan `GET /devices`, `DELETE /devices/:id` untuk mencabut perangkat nonaktif, `GET /promotion-activity`, `GET /link-history`, `GET /data-usage`, `GET/PATCH /time-management`, `GET /orders`, dan `GET /privacy-checkup`. Semua route menggunakan `requireAuth`, membatasi query dengan `user_id`, dan tidak memakai Supabase secret di browser.

Migration `20260831_settings_rls_server_only.sql` telah diterapkan ke project Supabase production. Verifikasi pascamigrasi menunjukkan policy `*_no_client_access` dengan `USING (false)` dan `WITH CHECK (false)` pada `account_deletion_requests`, `data_exports`, `device_sessions`, `notification_settings`, `privacy_settings`, `security_events`, dan `user_settings`. Pola ini dipilih karena aplikasi menggunakan bearer session milik backend sendiri, bukan Supabase Auth JWT di browser; akses data tetap melewati authorization server. Dengan demikian tabel tidak terekspos sebagai CRUD publik dan tidak ada secret/service-role key yang dipindahkan ke frontend.
