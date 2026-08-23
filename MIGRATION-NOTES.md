# SultraKita — Migration Notes

Dokumen ini menjelaskan perubahan fondasi data pada upgrade besar SultraKita. **PostgreSQL menjadi satu-satunya database runtime**. Jalur `sql.js`, SQLite file lokal, dan penyimpanan `/tmp` tidak lagi digunakan untuk data aplikasi maupun foto.

## Urutan perubahan

| Migrasi | Isi | Risiko utama | Rollback |
|---|---|---|---|
| `001_initial.sql` | Domain marketplace, sesi, OTP, listing, gambar, order, donasi, analytics, audit log, rate limit, feature flags, FTS, indeks | Tabel/kolom baru dan trigger search | Restore backup sebelum migrasi; jangan drop tabel produksi |

Jalankan migrasi memakai connection string **Postgres transaction pooler** dengan secret manager. Sebelum eksekusi, lakukan backup dan pastikan `DATABASE_SSL=true`. Setelah migrasi, verifikasi `SELECT COUNT(*) FROM listings`, `SELECT COUNT(*) FROM listing_images`, dan `SELECT key, enabled FROM feature_flags`.

## Kontrak environment minimum

| Variabel | Wajib production | Kegunaan |
|---|---:|---|
| `DATABASE_URL` | Ya | Postgres pooler Supabase/managed Postgres |
| `PUBLIC_SITE_URL` | Ya | Canonical URL, sitemap, Open Graph |
| `R2_UPLOAD_URL` | Ya untuk foto | Endpoint PUT object storage |
| `R2_UPLOAD_TOKEN` | Ya untuk foto | Credential server-side |
| `R2_PUBLIC_BASE_URL` | Ya untuk foto | URL publik foto |
| `CORS_ORIGINS` | Ya | Daftar origin eksplisit, dipisah koma |
| `OTP_PROVIDER_URL` dan token | Ya untuk login OTP | Provider OTP produksi |

Rollback tidak menghidupkan kembali SQLite. Jika deployment gagal, kembalikan kode ke commit sebelumnya dan restore database hanya jika migrasi mengubah data secara tidak dapat dibalik. Kolom tambahan dibuat dengan `IF NOT EXISTS`, sehingga migrasi aman dijalankan ulang.
