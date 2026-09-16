# Suki Apps — Runbook Step 7 sampai Go-Live

**Domain canonical:** `https://sukiapps.web.id`  
**Domain alternatif:** `https://www.sukiapps.web.id`  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Tanggal pemeriksaan:** 16 September 2026

## Status saat ini

DNS, HTTPS, dan deployment domain baru sudah merespons. Pemeriksaan langsung menunjukkan halaman utama dan endpoint `https://sukiapps.web.id/api/health` aktif dengan status HTTP 200. Health check melaporkan API, database, storage, dan build Next.js aktif. Source code sekarang menggunakan `https://sukiapps.web.id` sebagai fallback canonical untuk metadata, sitemap, robots, referral, SEO legacy, CORS, OAuth, dan URL pembayaran.

`www.sukiapps.web.id` telah diberi redirect permanen 308 ke domain apex melalui middleware. Redirect ini akan terlihat setelah deployment perubahan selesai.

## Step 7 — Source code dan canonical URL

**Selesai pada repository.** Metadata root, metadata beranda, metadata marketplace, generator sitemap, generator robots, referral link, konfigurasi environment contoh, SEO Express, dan fallback CORS telah diselaraskan ke domain baru. Referensi domain Vercel lama yang tersisa berada pada dokumentasi historis atau catatan audit, bukan konfigurasi runtime yang digunakan.

Jangan menghapus domain Vercel lama dari provider sebelum login, callback, link referral, sitemap, dan fitur utama lolos verifikasi melalui domain baru.

## Step 8 — Environment Variables Vercel

Pada Vercel buka **Project → Settings → Environment Variables**. Pastikan nilai berikut tersedia pada **Production**. Gunakan nilai yang sama pada Preview hanya bila preview memang perlu mengakses service production.

```env
NEXT_PUBLIC_SITE_URL=https://sukiapps.web.id
NEXT_PUBLIC_API_BASE_URL=https://sukiapps.web.id
PUBLIC_SITE_URL=https://sukiapps.web.id
CORS_ORIGINS=https://sukiapps.web.id,https://www.sukiapps.web.id
GOOGLE_REDIRECT_URI=https://sukiapps.web.id/api/auth/google/callback
PAYMENT_SUCCESS_URL=https://sukiapps.web.id/?donation=success
PAYMENT_FAILURE_URL=https://sukiapps.web.id/?donation=failed
```

Pertahankan secret server-side tanpa prefix `NEXT_PUBLIC_`. Periksa minimal Supabase URL dan anon key, R2 credentials, provider OTP/email yang digunakan, Gemini bila fitur AI diaktifkan, dan webhook notification bila fitur tersebut digunakan. Jangan menyalin nilai dari `.env.example` ke Vercel sebagai secret produksi.

## Step 9 — Supabase, OAuth, dan provider callback

Pada Supabase **Authentication → URL Configuration**, set **Site URL** menjadi:

```text
https://sukiapps.web.id
```

Tambahkan redirect berikut dan pertahankan callback domain Vercel lama sementara:

```text
https://sukiapps.web.id/auth/callback
https://sukiapps.web.id/**
https://sultrakita-platform.vercel.app/auth/callback
```

Pada Google Cloud Console, Google OAuth, dan provider login lain yang digunakan, tambahkan callback yang benar-benar dipanggil aplikasi. Untuk gateway Google Express gunakan:

```text
https://sukiapps.web.id/api/auth/google/callback
```

Periksa juga allowed origins, CORS, cookie policy, dan trusted origins. Hapus domain lama hanya setelah login melalui domain baru berhasil pada browser normal dan Incognito.

## Step 10 — Deploy production

Perubahan source telah divalidasi. Jalankan dari root repository:

```bash
npm run lint
npm test
npm run build
git add .
git commit -m "chore: configure sukiapps.web.id as canonical domain"
git push origin main
```

Di Vercel tunggu deployment branch `main` berstatus **Ready** dan targetnya **Production**. Jangan mengubah Root Directory pada project secara bersamaan dengan perubahan domain. Runtime live sudah terdeteksi sebagai Next.js; perubahan domain ini tidak memindahkan arsitektur deployment.

## Step 11 — Smoke test domain dan SEO

Setelah deployment Ready, jalankan:

```bash
curl -I https://sukiapps.web.id
curl -I https://www.sukiapps.web.id
curl -I https://sukiapps.web.id/api/health
curl -sS https://sukiapps.web.id/robots.txt
curl -sS https://sukiapps.web.id/sitemap.xml | head -40
```

Hasil minimum yang diharapkan:

- `sukiapps.web.id` merespons HTTPS tanpa error sertifikat.
- `www.sukiapps.web.id` merespons `308` menuju `https://sukiapps.web.id/...`.
- `/api/health` merespons `200` dengan `ok: true`, database `up`, dan storage `up`.
- `robots.txt` menunjuk ke `https://sukiapps.web.id/sitemap.xml`.
- Semua URL pada sitemap memakai `https://sukiapps.web.id`.
- Source HTML tidak memuat canonical domain Vercel lama.

Setelah hasil stabil, daftarkan sitemap baru pada Google Search Console dan lakukan inspeksi URL homepage serta halaman publik utama.

## Step 12 — QA fitur wajib

Jalankan QA dengan akun staging atau akun QA, bukan akun pelanggan nyata. Uji halaman utama, navigasi marketplace, detail properti, jobs, komunitas, chat, dashboard, admin, login, signup, logout, reset password, OAuth, redirect setelah login, upload gambar, referral link, dan halaman legal. Untuk setiap alur, periksa browser normal dan Incognito.

Untuk fitur yang terhubung provider, uji callback dan webhook pada sandbox terlebih dahulu. Pastikan email notifikasi tidak mengandung secret, upload gagal dengan pesan yang aman, Gemini fallback tidak membuat UI crash, dan webhook gagal tidak membuat pesan utama hilang.

## Gate keamanan sebelum launch publik

Audit dependency saat pemeriksaan ini menemukan satu kerentanan **high** pada `multer` dan tiga **moderate** pada dependency transitif `qs`. Jalankan review terpisah sebelum go-live:

```bash
npm audit --omit=dev
npm audit fix --dry-run
```

Tinjau perubahan lockfile dan lakukan regresi upload sebelum menerima upgrade. Jangan mengabaikan temuan high tanpa keputusan tertulis.

Pastikan RLS Supabase aktif pada tabel sensitif, akun admin menggunakan MFA bila tersedia, service-role key tidak pernah masuk browser, deployment preview tidak membocorkan data production, dan log Vercel tidak mencetak token, cookie, OTP, atau URL secret.

## Keputusan launch

Status yang tepat setelah perubahan ini adalah **Ready for controlled QA**, bukan langsung go-live publik. Launch publik baru boleh dilakukan setelah environment Production diverifikasi, callback login berhasil, smoke test domain lulus, QA fitur utama lulus, temuan dependency high ditangani atau diterima secara eksplisit, dan ada rollback plan.

Rollback domain dapat dilakukan dengan mengembalikan deployment Vercel sebelumnya atau menghapus commit canonical domain, sementara domain Vercel lama dipertahankan sebagai fallback. Jangan menghapus DNS, OAuth callback lama, atau data produksi selama periode observasi.

## References

[1]: https://vercel.com/docs/domains/working-with-domains/add-a-domain "Vercel Custom Domains"
[2]: https://vercel.com/docs/domains/troubleshooting "Vercel Domain Troubleshooting"
[3]: https://supabase.com/docs/guides/auth/redirect-urls "Supabase Auth Redirect URLs"
[4]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots "Next.js robots metadata"
[5]: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap "Next.js sitemap metadata"
