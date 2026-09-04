# SUKI Suits Next.js

Modular Next.js App Router implementation for the SUKI Suits property discovery experience. The page applies the hybrid design system documented in `../docs/SUKI-SUITS-HYBRID-DESIGN-SYSTEM-2026-09-04.md`.

## Jalankan lokal

```bash
cp .env.example .env.local
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Environment

`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dipakai oleh client Supabase untuk session, profil, dan notifikasi. `NEXT_PUBLIC_API_BASE_URL` menunjuk ke API Express produksi yang menangani donasi dan saran kemitraan. `NEXT_PUBLIC_R2_BUCKET_URL` hanya untuk URL publik aset; kredensial R2 tidak boleh dikirim ke browser.

## Supabase

Skema Supabase yang dipakai oleh repository harus disinkronkan melalui seluruh berkas `../supabase/migrations/`, bukan melalui tabel baru yang hanya cocok dengan prototipe. Modal dukungan mengirim `POST /api/donations` dengan `campaign_id`, `name`, `amount`, `message`, dan `payment_method`; modal kemitraan mengirim `POST /api/suggestions` dengan `name`, `email`, dan `body`. API tersebut memakai database PostgreSQL yang dikonfigurasi melalui `DATABASE_URL` pada server dan meneruskan donasi ke provider pembayaran hanya jika provider telah dikonfigurasi.

## Vercel

Import repository GitHub ke Vercel, set **Root Directory** ke `next-app`, gunakan build command `npm run build`, dan tambahkan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`, serta `NEXT_PUBLIC_R2_BUCKET_URL` pada Project Settings untuk Preview dan Production. Preview deployment dapat dipakai untuk QA sebelum merge ke branch utama.

## Cloudflare R2

Buat bucket R2 privat untuk aset pengguna, expose melalui custom domain/CDN, lalu isi `NEXT_PUBLIC_R2_BUCKET_URL` dengan base URL publik yang aman. Untuk upload produksi, gunakan signed URL dari server-side function; jangan menaruh access key R2 di browser.

## Catatan RBAC

`requiredRole` sudah tersedia pada `config/navigation.ts`. Sidebar membaca role, nama, headline, avatar, dan status session dari `useSessionProfile`; menu seller/admin disembunyikan ketika role belum tersedia.
