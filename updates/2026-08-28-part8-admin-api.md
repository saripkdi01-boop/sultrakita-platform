# Part 8 — Admin API Contract

## Keputusan arsitektur

Spesifikasi meminta Supabase Edge Functions dengan `supabase-js`, `SUPABASE_SERVICE_ROLE_KEY`, dan Auth JWT. SultraKita production saat ini menggunakan satu Express handler di `server.js`, bearer session yang diverifikasi terhadap tabel `sessions`, PostgreSQL `pg`, RBAC server-side, serta secondary `ADMIN_TOKEN`. Karena itu Part 8 diimplementasikan sebagai function-style contract pada router `/api/admin/v2`, bukan sebagai auth stack Supabase kedua.

Pendekatan ini menjaga seluruh endpoint existing dan menghindari service-role credential di browser. RLS admin tables tetap menjadi deny-by-default; akses database admin dilakukan oleh server runtime melalui connection string existing.

## Contract mapping

| Function spec | Endpoint |
|---|---|
| admin-get-users | `GET /api/admin/v2/users` |
| admin-get-listings | `GET /api/admin/v2/listings` |
| admin-get-stats | `GET /api/admin/v2/stats` |
| admin-update-user | `PUT /api/admin/v2/users/:id` |
| admin-ban-user | `PATCH /api/admin/v2/users/:id/ban` — boundary-safe; belum persist karena schema legacy tidak memiliki kolom ban |
| admin-approve-listing | `PATCH /api/admin/v2/listings/:id/status` dengan status `active` |
| admin-reject-listing | `PATCH /api/admin/v2/listings/:id/status` dengan status `archived` |
| admin-delete-listing | `DELETE /api/admin/v2/listings/:id` |
| admin-manage-categories | `GET/POST/PATCH/DELETE /api/admin/v2/categories` |
| admin-get-analytics | `GET /api/admin/v2/analytics` |
| admin-update-settings | `PATCH /api/admin/v2/settings/:key` |
| admin-get-audit-logs | `GET /api/admin/v2/audit-logs` |
| admin-manage-roles | Existing `/api/admin/rbac/*` |
| admin-create-broadcast | `POST /api/admin/v2/content` |
| admin-get-reports | `GET /api/admin/v2/reports` |
| admin-resolve-report | `PATCH /api/admin/v2/reports/:id` |
| admin-get-verifications | `GET /api/admin/v2/verifications` |
| admin-review-verification | `PATCH /api/admin/v2/verifications/:id` |
| admin-get-donations | `GET /api/admin/v2/donations` |
| admin-manage-donation | Existing `/api/admin/donations/:transaction_id/:operation` |
| admin-export-data | `GET /api/admin/v2/analytics/export` |

## Security

Semua route memakai `requireAuth`, permission-specific middleware, dan `ADMIN_TOKEN`. Query memakai parameter binding, input memiliki allowlist/length validation, response user melakukan PII redaction, mutation menulis audit log, dan tidak ada `createClient`, service-role key, JWT library, atau credential baru.

Ban/unban tidak berpura-pura berhasil. Schema legacy `users` tidak mempunyai `is_banned`/`banned_at`; endpoint mengembalikan `409` yang menjelaskan blocker sehingga tidak ada state administratif palsu. Migration moderation dedicated diperlukan sebelum persistence ban dapat diaktifkan.

## Verification

Local syntax, lint, build, unit tests, contract test, dan diff check lulus. CI dan production verification dilakukan setelah commit release.

## Production QA

CI run `33131784972` pada commit `fa025a4` selesai sukses. Production health mengembalikan `api: up`, `db: up`, `storage: down`, build `fa025a48e876c942c1c1d9854d40c661d89285a6`. Endpoint `/api/admin/v2/`, `/api/admin/v2/stats`, `/api/admin/v2/categories`, dan `/api/admin/v2/content` semuanya HTTP 401 tanpa credential. Canonical `/admin` tetap HTTP 200 dengan `Cache-Control: no-store` dan security headers.
