# SultraKita — Section 2 RBAC

Tanggal implementasi: 28 Agustus 2026.

## Ringkasan

RBAC hierarkis diterapkan secara additive dan server-enforced. Constraint legacy `users.role` (`buyer`, `seller`, `admin`) tidak diubah. Role backoffice baru disimpan pada `admin_role_assignments`, sehingga assignment `super_admin`, `moderator`, `support`, dan `analyst` tidak memerlukan perubahan destructive pada tabel users.

## Role efektif

`buyer` dipetakan ke `user`. `admin` tetap menjadi `admin`. Jika terdapat row `admin_role_assignments`, role overlay tersebut menjadi role efektif dan mengalahkan nilai legacy hanya pada authorization runtime. Jika tabel assignment belum tersedia pada rolling deploy, authentication mempunyai fallback ke query legacy agar session valid tidak langsung gagal.

| Role | Level | Catatan utama |
|---|---:|---|
| `super_admin` | 5 | Semua permission, termasuk role/admin/settings/payment configuration. |
| `admin` | 4 | Content, moderation, users, analytics; tidak dapat mengelola admin/role/settings/payment configuration. |
| `moderator` | 3 | Dashboard, listing approval/moderation, reports, seller verification, notification, PII sesuai matrix. |
| `support` | 3 | Dashboard dan pengiriman notifikasi; tidak mendapat analytics management atau PII. |
| `analyst` | 3 | Dashboard, analytics, export read-only. |
| `seller` | 2 | Listing milik sendiri melalui guard ownership existing. |
| `user` | 1 | Marketplace consumer; tidak mendapat dashboard backoffice. |

## Endpoint server-enforced

Endpoint admin existing dipetakan ke permission spesifik: dashboard ke `view_dashboard`, verifikasi ke `verify_sellers`, reports ke `moderate_reports`, analytics ke `view_analytics`, import content ke `manage_content`, donations ke `manage_donations`, audit/webhook log ke `view_audit_log`, serta feature flags dan webhook settings ke `manage_settings`.

Endpoint baru yang ditambahkan adalah `GET /api/admin/rbac/me`, `GET /api/admin/rbac/roles`, `GET /api/admin/rbac/assignments`, `PUT /api/admin/rbac/assignments/:userId`, `DELETE /api/admin/rbac/assignments/:userId`, dan `GET /api/admin/audit-logs`. Semua endpoint tersebut memerlukan bearer session, permission RBAC, dan secondary `x-admin-token` existing untuk backward compatibility. Role assignment hanya dapat dilakukan oleh `super_admin`; self-demotion dan self-assignment removal ditolak.

## Database

Migration `015_rbac_overlay.sql` bersifat additive dan idempotent. Migration production `rbac_overlay_015` berhasil diterapkan pada project Supabase `ibvcfdfsjpytwpnxgylm`. Tabel audit dibuat bila belum ada karena feature flag existing sudah menulis ke `audit_logs`. Tidak ada Super Admin account, password, 2FA secret, JWT secret, atau credential fiktif yang dibuat.

## Validasi

`node --check`, `npm run lint`, `npm run build`, `npm test`, dan `git diff --check` lulus. Test lokal `npm run test:security` tidak dapat menyelesaikan fixture karena sandbox tidak memiliki `DATABASE_URL`/`SUPABASE_DB_URL`; CI dengan PostgreSQL menjadi jalur validasi integrasi utama.

## Catatan deployment

Provisioning Super Admin nyata tetap memerlukan user ID yang telah diverifikasi dan proses credential/2FA resmi milik operator. Endpoint assignment sudah menyediakan jalur provisioning role tanpa membuat akun atau secret baru secara otomatis. `ADMIN_TOKEN` existing tetap wajib untuk endpoint admin sampai mekanisme secondary gate diganti melalui change terpisah yang diaudit.
