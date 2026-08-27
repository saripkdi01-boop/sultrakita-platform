# SultraKita v2.0 Upgrade Baseline — 2026-08-27

Audit menunjukkan repository `saripkdi01-boop/sultrakita-platform` sudah memiliki homepage tunggal, API-driven discovery, kategori fallback, pencarian, filter wilayah, sorting, detail listing, favorit lokal, chat handoff, seller onboarding, donation flow, policy consent, dan server Express yang tetap dipertahankan.

Baseline runtime sebelum perubahan lulus `npm run lint`, `npm test` (7 test terdeteksi namun seluruhnya skip karena environment test tidak diaktifkan), dan `npm run build` (31 artifact/marker lulus). Homepage live dan lokal memuat struktur visual Tropical Commerce: sidebar desktop, hero split, metrik, kategori, listing discovery, community banner, help strip, dan bottom navigation.

Upgrade yang diterapkan pada 27 Agustus 2026: link font Fontshare Clash Display/Satoshi dan Google Plus Jakarta Sans/JetBrains Mono pada `public/index.html`; cache-buster stylesheet baru `tropical-commerce-2`; serta layer CSS additive pada `public/styles.css` yang menambahkan design tokens sesuai brief, gradient brand/ocean/energy, typography hierarchy, glassmorphism, layered card shadows, improved focus states, listing/category hover states, empty/skeleton states, dialog depth, mobile layout refinement, dan `prefers-reduced-motion` fallback.

Verifikasi browser lokal: computed body font adalah `Plus Jakarta Sans`, headline font adalah `Clash Display`, token `--brand-800` bernilai `#065f46`, 12 kategori fallback tampil, rule reduced-motion terdeteksi, dan hero gradient aktif. Backend/API serta markup interaktif tidak diubah.


Verifikasi lintas halaman: `account.html` berhasil dimuat dengan form OTP, Google login, dashboard shell, kartu surface, dan tombol kembali. `chat.html` berhasil dimuat dengan panel pesan, session form, composer, serta font Clash Display/Plus Jakarta Sans yang sudah aktif. Tidak ada perubahan pada handler autentikasi, conversation stream, atau endpoint backend.


Diagnosis live: `/api/stats` sempat mengembalikan HTTP 500 karena deployment produksi memiliki `public.listings.created_at` bertipe `text`, sedangkan query membandingkannya langsung dengan `timestamptz`. Perbaikan kompatibilitas diterapkan pada `server.js` dengan guarded cast hanya untuk nilai timestamp yang diawali format tahun, sehingga kontrak respons tetap sama dan schema tidak diubah. Query patched diuji read-only terhadap project Supabase produksi dan menghasilkan summary numerik `0` tanpa error.


Release verification: commit `a77cba3` lulus GitHub Actions `SultraKita CI` termasuk migrasi, idempotency, lint, test, security regression, build, dan API smoke test. Deployment live mengiklankan build SHA yang sama. Endpoint live `/api/health` mengembalikan HTTP 200 dengan `api: up` dan `db: up`; `/api/stats` mengembalikan HTTP 200 dengan summary numerik dan lima kategori populer; `/api/categories` mengembalikan HTTP 200 dari database. `storage: down` tetap tercatat karena object storage belum dikonfigurasi, bukan akibat upgrade visual.
