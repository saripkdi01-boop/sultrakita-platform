# Laporan Upgrade SultraKita V6 Worldclass

**Commit implementasi:** `721dca295e3d90f6bf2f84d0b4407c06090a9a3f` (`feat: ship SultraKita V6 worldclass foundation`).

## Implementasi nyata

| Area | Perubahan |
|---|---|
| P0 stats | Query `/api/stats`, analytics, dan donation analytics memakai `COUNT(*) FILTER`, `::int`, dan interval PostgreSQL; metrik `weekly_new_listings` berasal dari query nyata. |
| Migration ledger | Runner membaca seluruh migration berurutan, membuat `schema_migrations`, menghitung SHA-256 checksum, memakai advisory lock, transaksi per migration, skip aman untuk checksum sama, dan fail-fast untuk checksum berubah. |
| Type normalization | Migration `002_normalize_postgres_types.sql` mengubah kolom waktu legacy TEXT menjadi `TIMESTAMPTZ` dan flag verifikasi integer menjadi `BOOLEAN` tanpa mengubah kolom epoch session/OTP yang masih menjadi kontrak runtime. |
| Commerce schema | Migration marketplace yang sebelumnya sudah ada dibersihkan dari `BEGIN/COMMIT` internal agar kompatibel dengan ledger. Index notifications prematur pada migration 001 dihapus karena tabel dibuat oleh migration marketplace. |
| Storage | Ditambahkan `/api/uploads/presign` dan `/api/uploads/commit` dengan ownership check, batas file, MIME/ukuran, domain public URL, dan token storage tetap server-side. Frontend mencoba presign terlebih dahulu dan hanya fallback ke multipart bila provider mengembalikan `STORAGE_UNAVAILABLE`. |
| Demo data | `scripts/seed-demo.js` menyiapkan 24 listing staging-only lintas wilayah, guarded oleh `SEED_DEMO=true`, `NODE_ENV` non-production, dan penanda `is_demo`. Tidak ada seed otomatis ke production. |
| UX/data integrity | Klaim `+1.2k` hardcoded dihapus dan diganti metrik mingguan nyata. Error statistik menjadi inline status, bukan toast yang menutupi mobile header. Filter sort/category/district/search dipulihkan melalui URL dan `popstate`. |
| PWA/performance | Service worker diberi cache version, membersihkan cache lama, tidak mencache API/private paths, dan tidak diregistrasikan pada localhost/test. Static asset non-HTML diberi immutable cache header. |
| CI | CI menjalankan migration dua kali, lint, test, security regression, build, dan API smoke test. Build-check juga memverifikasi artefak V6. |

## Validasi lokal

Berhasil: `node --check` pada backend/frontend/service worker/migration/seed, `npm run lint`, `npm test`, `npm run build`, dan `git diff --check`. Test lokal mendeteksi tidak adanya `DATABASE_URL` dan melewati 7 integration test secara eksplisit; tidak ada hasil palsu yang mengklaim database telah diuji.

Migration runner belum dapat dieksekusi di sandbox karena tidak tersedia PostgreSQL lokal dan `DATABASE_URL` tidak tersedia. CI PostgreSQL akan menjadi validasi database kosong dan idempotency nyata setelah workflow dijalankan.

## Production dan batasan

Deployment production V6 serta endpoint smoke test production belum dapat diverifikasi pada task ini karena koneksi Vercel sedang mengembalikan `permission_denied: The service is currently under maintenance`. Karena itu laporan ini tidak mengklaim CI hijau, latency, screenshot, Lighthouse, axe, atau upload cold-start sebagai fakta.

Environment yang perlu diisi tanpa menampilkan nilainya: `DATABASE_URL`, `DATABASE_SSL`, `R2_UPLOAD_URL`, `R2_UPLOAD_TOKEN`, `R2_PUBLIC_BASE_URL`, `R2_PRESIGN_URL`, `OTP_PROVIDER_URL`, `OTP_PROVIDER_TOKEN`, provider WhatsApp, provider pembayaran, dan `PUBLIC_SITE_URL`. Upload production baru dapat disebut selesai setelah provider presign resmi dan public media domain dikonfigurasi, kemudian alur upload lima foto diuji setelah cold start/deploy ulang.

## Rollback

Rollback kode dapat dilakukan ke commit parent sebelum V6. Untuk database, jangan menghapus kolom atau tabel secara otomatis; gunakan backup Postgres dan migration forward yang terdokumentasi. Jika migration 002 gagal pada data existing, hentikan deploy, pulihkan snapshot, perbaiki data timestamp invalid, lalu jalankan migration kembali melalui ledger.

## Referensi

1. [Repository SultraKita](https://github.com/saripkdi01-boop/sultrakita-platform)
2. [Spesifikasi V6 Worldclass](file:///home/ubuntu/upload/PROMPT-MANUS-SULTRAKITA-V6-WORLDCLASS.md)
