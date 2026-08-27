# SultraKita v2.0 Upgrade Baseline — 2026-08-27

Audit menunjukkan repository `saripkdi01-boop/sultrakita-platform` sudah memiliki homepage tunggal, API-driven discovery, kategori fallback, pencarian, filter wilayah, sorting, detail listing, favorit lokal, chat handoff, seller onboarding, donation flow, policy consent, dan server Express yang tetap dipertahankan.

Baseline runtime sebelum perubahan lulus `npm run lint`, `npm test` (7 test terdeteksi namun seluruhnya skip karena environment test tidak diaktifkan), dan `npm run build` (31 artifact/marker lulus). Homepage live dan lokal memuat struktur visual Tropical Commerce: sidebar desktop, hero split, metrik, kategori, listing discovery, community banner, help strip, dan bottom navigation.

Upgrade yang diterapkan pada 27 Agustus 2026: link font Fontshare Clash Display/Satoshi dan Google Plus Jakarta Sans/JetBrains Mono pada `public/index.html`; cache-buster stylesheet baru `tropical-commerce-2`; serta layer CSS additive pada `public/styles.css` yang menambahkan design tokens sesuai brief, gradient brand/ocean/energy, typography hierarchy, glassmorphism, layered card shadows, improved focus states, listing/category hover states, empty/skeleton states, dialog depth, mobile layout refinement, dan `prefers-reduced-motion` fallback.

Verifikasi browser lokal: computed body font adalah `Plus Jakarta Sans`, headline font adalah `Clash Display`, token `--brand-800` bernilai `#065f46`, 12 kategori fallback tampil, rule reduced-motion terdeteksi, dan hero gradient aktif. Backend/API serta markup interaktif tidak diubah.


Verifikasi lintas halaman: `account.html` berhasil dimuat dengan form OTP, Google login, dashboard shell, kartu surface, dan tombol kembali. `chat.html` berhasil dimuat dengan panel pesan, session form, composer, serta font Clash Display/Plus Jakarta Sans yang sudah aktif. Tidak ada perubahan pada handler autentikasi, conversation stream, atau endpoint backend.
