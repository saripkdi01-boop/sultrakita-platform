# Audit Deployment Vercel dan Checklist Environment SultraKita

**Tanggal audit:** 4 September 2026  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Project Vercel:** `sultrakita-platform`  
**URL produksi:** https://sultrakita-platform.vercel.app/

## Ringkasan audit

Project Vercel terhubung ke repository GitHub yang benar dan deployment produksi terbaru berstatus `READY`. Deployment tersebut berasal dari commit `d28bf0b` pada branch `main` dan berjalan sebagai deployment berbasis Lambda. Namun, project belum mengidentifikasi framework secara eksplisit (`framework: null`), sehingga Vercel saat ini mengikuti konfigurasi repository dan `vercel.json`.

Pemeriksaan terhadap respons live menunjukkan bahwa URL produksi saat ini menyajikan aplikasi **Express.js dengan frontend vanilla dari direktori `public/`**, bukan halaman Next.js dari `next-app/`. Oleh karena itu, `next-app` belum menjadi runtime utama produksi. Perubahan pada `next-app` hanya akan tampil di production apabila Root Directory Vercel diubah atau dibuat sebagai project Vercel terpisah.

| Pemeriksaan | Hasil audit | Dampak |
|---|---|---|
| Repository Git | Terhubung ke `saripkdi01-boop/sultrakita-platform` | Sesuai |
| Branch production | `main` | Push ke `main` memicu deployment |
| Latest deployment | `READY`, target `production` | Deployment berhasil |
| Framework Vercel | Tidak terdeteksi secara eksplisit | Perlu dokumentasi/konfigurasi yang lebih tegas |
| Runtime live | Express.js + `public/` | Bukan `next-app` |
| Node runtime | `24.x` | Perlu dicocokkan dengan versi lokal/CI |
| Region | `iad1` | Layak, tetapi latensi ke Indonesia perlu dipantau |
| Deployment protection | Belum diverifikasi melalui audit ini | Periksa sebelum membuka preview internal |

## Checklist environment Vercel

### Variabel publik untuk aplikasi Next.js

Variabel berikut aman untuk dibaca browser karena memang menggunakan prefix `NEXT_PUBLIC_`. Nilainya tetap harus diisi pada environment **Preview** dan **Production** secara terpisah.

```env
NEXT_PUBLIC_SUPABASE_URL=https://ibvcfdfsjpytwpnxgylm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-or-anon-key>
NEXT_PUBLIC_API_BASE_URL=https://sultrakita-platform.vercel.app
NEXT_PUBLIC_R2_BUCKET_URL=https://assets.sultrakita.com
```

### Variabel server-side untuk Express.js

Variabel berikut tidak boleh menggunakan prefix `NEXT_PUBLIC_` dan tidak boleh dikomit ke Git.

```env
DATABASE_URL=<supabase-postgres-pooler-or-managed-postgresql-url>
DATABASE_SSL=true
DATABASE_POOL_MAX=5
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_BUCKET_NAME=sultrakita-assets
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_S3_ENDPOINT=<cloudflare-r2-s3-endpoint>
R2_PUBLIC_BASE_URL=https://assets.sultrakita.com
SUPABASE_URL=https://ibvcfdfsjpytwpnxgylm.supabase.co
SUPABASE_ANON_KEY=<server-side-anon-key-if-needed>
SUPABASE_SERVICE_ROLE_KEY=<only-if-server-operation-requires-it>
```

### Bantuan AI listing berbasis Gemini

Fitur bantuan AI pada modal **Pasang Iklan** berjalan server-side melalui endpoint `/api/ai/listing-assist`. Tambahkan variabel berikut pada Vercel untuk target **Preview** dan **Production** sesuai kebutuhan:

```env
GEMINI_API_KEY=<Google AI Studio API key>
GEMINI_API_BASE=https://generativelanguage.googleapis.com/v1beta
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_API_KEY` adalah secret dan tidak boleh memakai prefix `NEXT_PUBLIC_`, `VITE_`, atau ditulis ke source code. Jika key kosong atau request Gemini gagal, endpoint tetap mengembalikan fallback lokal agar alur listing tidak terputus.

### Pembayaran dan autentikasi

Sebelum produksi, isi hanya provider yang benar-benar telah diverifikasi. Jangan menetapkan mode produksi sebelum webhook, signature validation, callback URL, dan settlement diuji pada staging.

```env
PAYMENT_PROVIDER=midtrans
MIDTRANS_MODE=production
MIDTRANS_SERVER_KEY=<server-side-key>
PAYMENT_SUCCESS_URL=https://sultrakita-platform.vercel.app/?donation=success
PAYMENT_FAILURE_URL=https://sultrakita-platform.vercel.app/?donation=failed

GOOGLE_CLIENT_ID=<oauth-client-id>
GOOGLE_CLIENT_SECRET=<oauth-client-secret>
GOOGLE_REDIRECT_URI=https://sultrakita-platform.vercel.app/api/auth/google/callback

OTP_DEV_MODE=false
OTP_PROVIDER_URL=<provider-endpoint>
OTP_PROVIDER_TOKEN=<server-side-token>
```

## Verifikasi sebelum go-live

Pastikan Vercel memiliki semua variabel wajib pada target yang benar, terutama Production. Pastikan secret tidak muncul pada log build, source map publik, HTML, atau bundle browser. Jalankan health check tanpa melakukan mutasi data, kemudian uji login, listing read, upload staging, submit suggestions, dan alur donasi sandbox.

Perlu dicatat bahwa `next-app` menggunakan `NEXT_PUBLIC_API_BASE_URL` untuk mengarah ke Express. Jika Next.js ditempatkan pada domain berbeda, Express harus mengizinkan origin Next.js melalui `CORS_ORIGINS`, cookie harus memakai konfigurasi lintas-origin yang tepat, dan endpoint harus menggunakan HTTPS.

## Keputusan deployment yang direkomendasikan

Untuk saat ini, pertahankan project Vercel yang ada sebagai **Express production deployment**. Deploy `next-app` sebagai project Vercel terpisah dengan Root Directory `next-app`, atau ubah Root Directory project utama hanya setelah seluruh endpoint Express yang dibutuhkan Next.js tersedia pada deployment baru. Pendekatan ini menghindari perubahan produksi yang tidak disengaja.

## Referensi repository

- [`vercel.json`](../vercel.json)
- [`.env.example`](../.env.example)
- [`next-app/.env.example`](../next-app/.env.example)
- [`server.js`](../server.js)
- [`database.js`](../database.js)
- [Dokumentasi Vercel](https://vercel.com/docs)
