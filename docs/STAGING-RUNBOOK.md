# SultraKita Staging Runbook

Dokumen ini menetapkan staging Postgres terpisah dari production. Jangan gunakan `DATABASE_URL` production pada staging.

## Required environment

Simpan `DATABASE_URL` staging pada GitHub Environment bernama `staging` sebagai secret `STAGING_DATABASE_URL`. Jangan commit password, service-role key, webhook secret, atau credential object storage. Referensi variable tersedia di `.env.staging.example`.

## Migration and verification

Jalankan `npm ci`, `DATABASE_URL="$STAGING_DATABASE_URL" DATABASE_SSL=true npm run db:migrate`, kemudian jalankan migration sekali lagi untuk menguji idempotency. Setelah itu gunakan `npm run lint`, `npm test`, `npm run test:security`, `npm run build`, dan `npm run smoke:api`.

## Backup and restore drill

Backup membutuhkan `DATABASE_URL`, `BACKUP_S3_URI`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, dan `AWS_REGION`. Script menghasilkan custom-format PostgreSQL dump serta file `.sha256`. Restore bersifat destruktif dan wajib memakai `CONFIRM_RESTORE=YES`; script memverifikasi checksum sebelum `pg_restore --clean --if-exists --no-owner`.

Lakukan restore hanya pada database staging kosong atau database pemulihan khusus. Setelah restore, jalankan migration idempotency dan smoke test. Catat timestamp, checksum, target database, hasil validasi, dan operator. Jangan pernah melakukan drill restore langsung ke production.

## Rollback

Rollback aplikasi dilakukan dengan mengembalikan alias Vercel ke deployment READY sebelumnya. Rollback schema dilakukan melalui migration korektif baru; jangan mengedit atau menghapus migration yang sudah pernah diterapkan. Untuk perubahan data yang destruktif, buat backup dan dry-run query terlebih dahulu.

## Exit criteria

Staging dianggap siap bila migration clean/upgrade lulus, security regression lulus, upload invalid-signature ditolak, webhook replay menghasilkan `duplicate: true` tanpa side effect, backup checksum tervalidasi, restore drill selesai, dan endpoint health production tidak mengalami regresi.
