# SultraKita — Section 3 Admin System Schema

Tanggal implementasi: 28 Agustus 2026.

## Implementasi

Migration `016_admin_system_schema.sql` menambahkan schema admin secara additive. Tabel baru meliputi `admin_roles`, `admin_users`, `admin_sessions`, `admin_audit_logs`, `listing_moderation`, `platform_settings`, `admin_content`, `admin_notifications`, `report_management`, dan `platform_status`. Seed default memasukkan tujuh role dan 21 platform settings.

Production audit menunjukkan tabel marketplace SultraKita menggunakan `BIGINT` untuk `users.id`, `listings.id`, dan `reports.id`, sehingga foreign key `listing_moderation.listing_id`, `report_management.report_id`, `reporter_id`, dan `reported_content_id` dibuat `BIGINT`. Tabel admin sendiri memakai UUID dan `extensions.gen_random_uuid()` karena extension `pgcrypto` tersedia pada project Supabase.

Semua tabel admin di-enable RLS dan mendapat policy `FOR ALL USING (FALSE) WITH CHECK (FALSE)`. Akses browser langsung ditolak; server existing tetap memakai koneksi PostgreSQL runtime dan secondary authorization/permission layer yang sudah ada. Tidak ada service-role key yang diekspos ke frontend.

## Seed dan provisioning

Migration berhasil diterapkan pada project Supabase `ibvcfdfsjpytwpnxgylm`. Verifikasi production menghasilkan tujuh role (`super_admin`, `admin`, `moderator`, `support`, `analyst`, `seller`, `user`), 21 settings, 12 RLS policies, dan `admin_users` tetap kosong.

Akun Super Admin tidak dibuat otomatis. Password contoh pada instruksi tidak disimpan atau di-hash ke dalam repository/database karena pembuatan akun membutuhkan Supabase Auth user yang sah, auth_user_id yang nyata, dan proses credential/2FA resmi. Role management existing menyediakan jalur assignment yang diaudit setelah user terverifikasi. Ini mencegah akun privileged yatim atau credential yang tidak dapat diverifikasi.

## API

Server menambahkan endpoint `GET /api/admin/system/roles`, `GET /api/admin/system/settings`, dan `PATCH /api/admin/system/settings/:key`. Endpoint settings hanya dapat diakses oleh role yang memiliki `manage_settings` yaitu `super_admin`; role listing hanya dapat diakses oleh `super_admin` melalui `manage_roles`. Semua endpoint memakai bearer session, RBAC, dan secondary `x-admin-token` existing.

## Validasi

Syntax, lint, build, unit test, dan diff check harus dijalankan sebelum release. Migration production sudah berhasil; tahap berikutnya adalah CI dan live API verification setelah commit.

## Release verification

CI GitHub Actions pada commit `acf3d8d` berhasil menjalankan migration PostgreSQL, idempotency check, lint, seluruh unit test, security regression, build, dan API smoke test. Verifikasi live kemudian mengembalikan health `api: up`, `db: up`, dan build `acf3d8db1c64aacd6dfb378033a2d5d091407223`. Endpoint `GET /api/admin/system/settings` tanpa credential mengembalikan HTTP 401, sedangkan `/admin` tetap mengembalikan HTTP 200 dengan `Cache-Control: no-store, no-cache, must-revalidate` dan security headers aktif.

Catatan workflow: GitHub memberi warning non-blocking bahwa `actions/checkout@v4` dan `actions/setup-node@v4` menargetkan Node.js 20 dan runner memaksa Node.js 24. Warning tersebut tidak menggagalkan pipeline.
