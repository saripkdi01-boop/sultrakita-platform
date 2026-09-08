# SultraKita — Final Soft-Launch Gate Status

Tanggal verifikasi terakhir: **9 September 2026**.

## Status keseluruhan

**Status: READY FOR CONTROLLED SOFT LAUNCH, bukan public launch penuh.** Jalur read-only utama dan hardening P0 yang dapat diverifikasi otomatis sudah lulus. Peluncuran tetap harus dibatasi kepada cohort kecil sampai gate manual yang memerlukan akun uji, storage durable, OTP production, serta backup/restore benar-benar ditandatangani.

## Checklist otomatis yang selesai

| Gate | Status | Bukti |
|---|---:|---|
| Lint | Lulus | `npm run lint` |
| Regression suite | Lulus | 79 test, 72 lulus, 7 skip integration, 0 gagal |
| Build check | Lulus | 31 artefak/marker terverifikasi |
| Feed production | Lulus | `/api/feed` mengembalikan HTTP 200 dengan contract pagination |
| Marketplace production | Lulus | `/api/listings?limit=3` mengembalikan listing dari Supabase, bukan fallback demo |
| Filter harga negatif | Lulus | `/api/listings?minPrice=-1` mengembalikan HTTP 400 `invalid_price_filter` |
| Feed schema compatibility | Lulus | Query hanya memakai `profiles.display_name, avatar_url` yang tersedia |
| Listing schema compatibility | Lulus | Query memakai `image_url` dan memetakan ke format UI |
| Deep link listing | Lulus | `/marketplace?listing=demo-tenun` menampilkan dialog detail |
| Production deployment | Lulus | Deployment Vercel `READY`, commit terakhir `2b3aa57` |
| Demo data safety | Lulus | Fallback demo dibatasi ke development eksplisit; production mengembalikan empty/503 |
| Public listing RLS | Lulus | Policy `listings_public_read` hanya untuk status `active`/`published` |

## Gate manual yang masih wajib sebelum public launch

1. **Authentication and authorization:** uji login, logout, session revocation, ownership listing, membership conversation, dan akses seller/admin menggunakan minimal dua akun staging.
2. **Durable upload:** uji JPG, PNG, WEBP, MIME spoofing, ukuran maksimum, persistence setelah redeploy, dan penghapusan object storage.
3. **OTP production:** uji provider aktif, cooldown per destination, expiry, lima percobaan salah, resend, dan provider failure.
4. **Marketplace mutation:** buat listing staging, edit, upload image, save/wishlist, compare, inquiry, dan hapus fixture uji yang dibuat sendiri.
5. **Backup/restore:** lakukan drill restore Supabase sebelum menerima data organik pengguna.
6. **Observability:** siapkan monitoring untuk HTTP 5xx, auth failures, upload failures, dan database latency selama cohort soft launch.

## Keputusan launch

SultraKita **boleh masuk controlled soft launch** dengan fitur read-only dan cohort kecil. SultraKita **belum boleh dinyatakan GO untuk public launch penuh** sebelum enam gate manual di atas lulus dan dicatat dengan bukti staging. n8n/Slack/Customer.io tetap bukan blocker P0 untuk fungsi inti website dan boleh diaktifkan setelah alur utama stabil.
