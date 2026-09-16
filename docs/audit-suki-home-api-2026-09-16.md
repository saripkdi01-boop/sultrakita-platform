# Audit Optimasi Beranda dan API Suki Apps

**Tanggal:** 16 September 2026  
**Ruang lingkup:** optimasi beranda Suki Apps, pengurangan gap visual, pengujian performa endpoint API, dan pemeriksaan header keamanan.

## Perubahan yang Dilakukan

Beranda dirapatkan melalui pengurangan jarak antar kolom, antar-post, quick actions, ecosystem slider, kartu composer, metadata, dan action bar. Penyesuaian dibuat responsif untuk desktop, tablet, dan mobile tanpa menambah fitur atau mengubah kontrak backend.

Animasi tap `framer-motion` pada tombol like di feed dihapus. Tombol tetap memiliki perilaku interaksi yang sama, tetapi halaman beranda tidak lagi mengimpor modul animasi hanya untuk satu kontrol. Media feed yang berada di bawah lipatan tetap menggunakan `loading="lazy"` dan `decoding="async"`; video tetap menggunakan `preload="metadata"`.

Skrip audit produksi diperbaiki agar hanya menguji route yang benar-benar tersedia: `/api/health`, `/api/feed`, `/api/listings`, dan `/`. Route `/api/categories` yang tidak tersedia dihapus dari daftar audit sehingga tidak menghasilkan false positive 404.

## Validasi Build

Build Next.js, lint, dan `git diff --check` berhasil. Ukuran First Load JS untuk route `/beranda` turun dari sekitar **263 kB menjadi 224 kB** setelah penghapusan import animasi khusus feed.

## Hasil Uji API Production

Audit dijalankan dengan dua sampel per endpoint. Pada target Vercel, delapan dari delapan request berhasil, tanpa error HTTP atau network error. P50 latency tercatat **543,22 ms**, P95 **790,62 ms**, dan maksimum **1.114,96 ms**. Pada target pembanding, delapan dari delapan request berhasil dengan P50 **478,61 ms** dan P95 **636,39 ms**.

Uji input abnormal menunjukkan pagination tetap dibatasi ketika menerima `limit=999999`, nilai negatif tidak menyebabkan error server, cursor dengan pola SQL injection ditolak HTTP 400, method yang tidak didukung ditolak HTTP 405, dan interaksi tanpa CSRF/session yang sesuai ditolak HTTP 403. Pengujian ini tidak mengubah data production.

## Header Keamanan

Semua sampel production memiliki header berikut: Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy, dan Content-Security-Policy.

## Status Rilis

Perubahan telah dibuat pada commit `884071a` dengan pesan `perf: compact Suki home and harden production audit` dan telah dipush ke `origin/main`. Deployment Vercel production dibuat untuk commit tersebut dan perlu menunggu state `READY` sebelum verifikasi visual akhir pada alias utama.

## Catatan

Nilai latency merupakan sampel jaringan pada waktu audit, bukan pengukuran Core Web Vitals dari browser nyata. Pengukuran LCP, INP, dan CLS berbasis perangkat nyata dapat menjadi tahap terpisah setelah deployment selesai, tetapi tidak termasuk dalam perubahan tahap ini.


## Pengecekan Database Akhir

Supabase project `sultrakita-platform` berstatus `ACTIVE_HEALTHY`, menggunakan PostgreSQL 17.6.1. Query metadata read-only mengonfirmasi indeks feed `posts_feed_idx` untuk posting published berdasarkan `created_at/id`, serta indeks discovery pada tabel listings untuk status, district, category, harga, dan waktu.

Audit log 24 jam menemukan **710 error PostgreSQL SQLSTATE 42703** dan 2 error SQLSTATE 42P17. Error 42703 bukan query lambat, melainkan query profile yang meminta kolom `profiles.city`; kolom tersebut tidak tersedia pada schema aktif. Referensi invalid ini diperbaiki pada `ProfileHub.tsx` dan `useSessionProfile.ts` dengan tidak lagi mengirim atau memilih kolom `city`. Nilai kota tetap dapat dipakai sementara di state UI, tetapi tidak lagi diklaim tersimpan di database.

Setelah perbaikan, build dan lint kembali berhasil. Smoke test tiga putaran menghasilkan response HTTP 200 pada `/api/health`, `/api/feed?limit=10`, dan `/api/listings?limit=8`. Pada putaran terakhir, waktunya masing-masing sekitar **0,62 s**, **0,40 s**, dan **0,52 s**. Tidak ada indikasi query lambat pada endpoint beranda dari pengukuran ini. Perubahan schema-query ini perlu dideploy agar error 42703 berhenti pada log production.
