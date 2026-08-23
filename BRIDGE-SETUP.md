# SultraKita Bridge Upgrade

Upgrade ini mempertahankan runtime Express yang sudah terhubung ke Vercel dan menambahkan modul browser ringan, bukan rewrite destruktif ke Next.js. Pendekatan ini menjaga route produksi, migrasi Postgres, dan kontrak API yang sudah diuji.

## Fitur baru

Modul `public/marketplace-bridge.js` menyediakan format teks siap salin untuk Facebook Marketplace, poster flyer PNG 1:1 yang dibuat di browser, command palette `Ctrl/⌘ + K`, tautan tawar melalui WhatsApp, serta daftar safe zone COD dengan deep-link Google Maps. Detail listing dan kartu listing publik menggunakan fitur ini tanpa mengekspor token atau secret.

## Setup Supabase blueprint

`supabase/schema.sql` adalah blueprint untuk proyek Supabase baru yang menggunakan UUID `auth.users`, RLS, Postgres full-text search, trigram index, kategori, lokasi bertingkat, listing, review, dan token WhatsApp. Jangan menjalankannya langsung pada database production legacy SultraKita tanpa review mapping ID; database legacy memakai migration runner terpisah pada `database/migrations/`.

## Environment

Runtime existing memerlukan `DATABASE_URL`, `PUBLIC_SITE_URL`, `CORS_ORIGINS`, dan konfigurasi storage. Untuk upload presigned, isi `R2_PRESIGN_URL`, `R2_PUBLIC_BASE_URL`, dan token server-side sesuai provider object storage resmi. `R2_UPLOAD_URL` tetap dipakai sebagai fallback multipart. Jangan menaruh token di browser atau URL publik.

Untuk WhatsApp, nomor seller disimpan sesuai consent seller dan hanya dipakai untuk deep-link. Jika nomor kosong, gunakan link chat internal atau minta seller melengkapi nomor; jangan mengarang nomor.

## Safe zones

Safe zone saat ini adalah Eks MTQ Kendari, Tugu Religi Kendari, Kampus UHO, Kendari Beach, dan Polresta Kendari. Daftar ini adalah rekomendasi UX, bukan jaminan keamanan. Pengguna tetap harus mengonfirmasi lokasi, waktu, dan kondisi transaksi secara langsung.

## Verification

Quality gate yang tersedia adalah `node --check`, `npm run lint`, `npm test`, `npm run build`, dan `git diff --check`. Integration test membutuhkan `DATABASE_URL`; ketika tidak ada, test dilewati secara eksplisit. Setelah environment production tersedia, lakukan smoke test listing detail, copy text, flyer download, WhatsApp link, dan presigned upload lima foto setelah cold start.
