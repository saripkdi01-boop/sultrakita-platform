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

`NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` dipakai oleh client Supabase. `NEXT_PUBLIC_R2_BUCKET_URL` disiapkan sebagai hook URL aset avatar/listing Cloudflare R2; URL tersebut belum dipakai untuk upload nyata pada prototipe ini.

## Supabase

Buat tabel `notifications` dengan kolom `id`, `is_read`, dan `user_id` untuk badge notifikasi. Buat tabel `donations` dengan `amount`, `note`, dan `status`, serta tabel `partnerships` dengan `name`, `email`, `organization`, dan `status`. Terapkan RLS sebelum data produksi diaktifkan. Modal hanya mencatat intent sebagai `pending support` atau `pending`; tidak ada pembayaran nyata.

## Vercel

Import repository GitHub ke Vercel, set **Root Directory** ke `next-app`, gunakan build command `npm run build`, dan tambahkan tiga environment variable pada Project Settings untuk Preview dan Production. Preview deployment dapat dipakai untuk QA sebelum merge ke branch utama.

## Cloudflare R2

Buat bucket R2 privat untuk aset pengguna, expose melalui custom domain/CDN, lalu isi `NEXT_PUBLIC_R2_BUCKET_URL` dengan base URL publik yang aman. Untuk upload produksi, gunakan signed URL dari server-side function; jangan menaruh access key R2 di browser.

## Catatan RBAC

`requiredRole` sudah tersedia pada `config/navigation.ts`. Sidebar menyembunyikan menu seller/admin secara default dan memiliki komentar TODO untuk menggantinya dengan role dari Supabase Auth Session.
