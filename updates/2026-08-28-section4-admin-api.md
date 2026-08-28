# SultraKita — Section 4 Backend Admin API

## Keputusan arsitektur

Section 4 diimplementasikan sebagai router CommonJS pada `api/admin/index.js` dan dipasang secara additive pada `server.js` dengan prefix `/api/admin/v2`. Route `/api/admin` existing tidak dihapus atau diganti. Keputusan ini diperlukan karena `vercel.json` mendeploy satu Express handler `server.js`, bukan Vercel function terpisah pada `api/admin/index.js`.

Contoh implementasi pada attachment menggunakan `@supabase/supabase-js`, JWT cookie, bcrypt, dan `express-rate-limit`. Stack SultraKita existing menggunakan bearer session token, `pg`, middleware `authenticate`, `requireAuth`, permission matrix Section 2, dan secondary `ADMIN_TOKEN`. Adapter baru memakai kontrak existing agar tidak membuat authentication stack kedua atau secret runtime yang tidak kompatibel.

## Endpoint v2

Router menyediakan `GET /api/admin/v2/` untuk introspeksi aman, dashboard overview, paginated users, user detail/update, listing query/status/delete/feature, report list/update, seller verification list/update, analytics, CSV analytics export, audit log, dan platform settings read/update. Semua handler memakai `requireAuth`, `requirePermission`, dan `x-admin-token`; operasi mutation menulis ke `audit_logs` secara best effort dengan actor, action, entity, metadata, IP, dan user-agent.

PII pengguna hanya dikembalikan ketika role efektif memiliki `view_user_pii`. Perubahan role tidak diterima melalui endpoint user update; role tetap dikelola melalui endpoint RBAC Super Admin existing agar tidak melanggar constraint legacy `users.role`. Pagination, filter, status allowlist, input length, dan identifier validation diterapkan pada endpoint baru.

## Validasi dan batasan

Contract test memastikan router benar-benar mounted, route inti tersedia, dan tidak mengimpor `@supabase/supabase-js`, JWT, atau `SUPABASE_SERVICE_ROLE_KEY`. Syntax check, lint, build, unit tests, dan `git diff --check` dijalankan. Smoke test lokal mengonfirmasi `/api/admin/v2` tanpa session menghasilkan `401` dengan security headers existing.

Endpoint yang memerlukan database fixture belum diuji dengan akun tiap role di sandbox karena credential test resmi belum diberikan. Server tetap menjadi otoritas; UI hiding tidak digunakan sebagai kontrol keamanan.

## Release verification

GitHub Actions pada commit `20a5174` sukses menjalankan migration PostgreSQL, idempotency check, lint, unit test, security regression, build, dan API smoke test. Live health kemudian mengonfirmasi `api: up`, `db: up`, dan build `20a517468a2ee8de7a4fba5b57d95481a709abbb`. Request tanpa session ke `GET /api/admin/v2/` mengembalikan HTTP 401; route `/admin` tetap mengembalikan HTTP 200 dengan `Cache-Control: no-store, no-cache, must-revalidate` serta CSP, nosniff, Referrer-Policy, dan Permissions-Policy.
