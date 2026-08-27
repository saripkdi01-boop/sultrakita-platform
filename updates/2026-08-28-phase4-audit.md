# SultraKita Phase 4 — Backend API Upgrade Audit

## Temuan utama

SultraKita runtime menggunakan `database.js` berbasis PostgreSQL dengan placeholder `?` yang dikonversi menjadi `$1`, bukan Supabase client direct di frontend. Migration runner menjalankan seluruh file `database/migrations/NNN_*.sql` secara berurutan dan memverifikasi checksum dengan advisory lock.

Schema runtime menggunakan `BIGINT` IDs untuk `users`, `listings`, dan tabel marketplace. Tabel `favorites`, `reviews`, dan `notifications` sudah ada dari migration `002_marketplace_upgrade.sql`, tetapi strukturnya berbeda dari contoh Phase 4 UUID: favorites memakai composite key `(user_id, listing_id)`, reviews mengikat `order_id` serta `reviewer_id/reviewee_id`, dan notifications memakai `body` serta `read_at`.

## Keputusan kompatibilitas

Contoh UUID pada attachment tidak boleh ditempel langsung karena akan membuat tabel/foreign key duplikat atau tidak kompatibel. Phase 4 memakai migration additive dengan BIGINT foreign keys, tabel baru hanya untuk `listing_views` dan `search_history`, kolom baru hanya bila belum ada, serta indeks yang menyebut nama kolom runtime existing (`category_id`, `district`, `views`, `created_at`).

Realtime Supabase tidak akan dipasang secara buta pada frontend karena halaman static tidak memiliki Supabase browser client atau public anon key. Jalur aman adalah menambah hook frontend opsional yang aktif hanya ketika konfigurasi public tersedia; fallback tetap memakai endpoint Express yang sudah berjalan.

## Endpoint existing yang dipertahankan

`/api/favorites`, `/api/listings/:id/comments`, `/api/comments`, `/api/reports`, `/api/analytics/track`, `/api/analytics/summary`, `/api/notifications`, `/api/notifications/:id/read`, `/api/orders/:id/reviews`, `/api/listings`, dan `/api/listings/:id` tetap menjadi kontrak dasar. Perluasan Phase 4 dilakukan dengan endpoint/additive behavior, bukan penggantian route.


## Implementasi Phase 4

Migration `012_phase4_backend_upgrade.sql` menambah kolom listing featured/promoted, view/favorite counters, video URL, promotion expiry, seller rating, kolom notification `data`, tabel `listing_views`, tabel `search_history`, dan indeks partial/performa yang sesuai dengan schema BIGINT runtime. Mirror migration Supabase disimpan di `supabase/migrations/20260828120000_phase4_backend_upgrade.sql` dengan RLS untuk tabel baru.

Backend sekarang merekam view detail listing ke `listing_views`, menaikkan `views` dan `views_count`, menjaga `favorites_count` saat favorite ditambah/dihapus, menyediakan GET/POST/DELETE `/api/search-history`, GET `/api/public-config`, PATCH `/api/listings/:id/status`, dan POST `/api/listings/:id/promote`. Response `/api/notifications` menyediakan alias `message`, `data`, dan `read` sambil mempertahankan `body` serta `read_at` existing.

Frontend memuat Supabase browser client secara CDN dan menjalankan subscription `listings-changes` hanya ketika public URL dan anon key tersedia. Tanpa konfigurasi tersebut, aplikasi otomatis kembali ke Express polling/request flow dan tetap berfungsi normal. Tidak ada service-role key yang dikirim ke browser.

`git diff --check`, lint, build marker, `node --check server.js`, dan `node --check public/app.js` lulus. Test berbasis database perlu dijalankan di CI/live karena sandbox tidak memiliki `DATABASE_URL`.
