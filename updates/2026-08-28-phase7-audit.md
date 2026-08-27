# SultraKita Phase 7 — Performance & SEO Audit

## Temuan awal

Homepage sudah memiliki meta description, keywords, robots, Open Graph, Twitter card, canonical, JSON-LD WebSite, sitemap, robots.txt, manifest PWA, serta `public/og-image.svg`. Title existing masih lebih pendek dari target SEO Phase 7, sementara social preview sudah menunjuk asset vector resmi.

Listing card existing merender media sebagai CSS background-image. Pola ini tidak menyediakan `loading="lazy"`, `decoding="async"`, width/height intrinsic, atau `<picture>` responsive secara langsung. Perbaikan akan memakai markup media progressive: `<picture>` untuk URL asset yang aman, fallback placeholder untuk listing tanpa image, serta video lazy/preload metadata bila `video_url` tersedia.

CSS existing cukup besar dan dimuat sebagai stylesheet eksternal. Critical CSS inline akan ditambahkan terbatas pada token viewport, topbar, hero compact, category strip, dan fallback background agar first paint tidak menunggu seluruh interaction layer. Stylesheet utama tetap dipertahankan untuk menghindari rebuild dan regression.

Sitemap saat ini hanya berisi homepage; karena route public marketplace bersifat query-driven dan detail listing memerlukan ID dinamis, sitemap akan dilengkapi halaman statis yang memang sudah tersedia tanpa memasukkan endpoint API/admin.

## Implementasi Phase 7

- `public/index.html` mempertahankan satu title, description absolut, canonical absolut, Open Graph lengkap (`type`, `url`, `title`, `description`, `image`, `image:alt`, `image:type`, ukuran), Twitter Card lengkap, dua JSON-LD terpisah untuk `WebSite` dan `Organization`, serta critical CSS inline untuk topbar, hero, category strip, listing grid, dan breakpoint 1024/768/480.
- Cache-buster stylesheet preload, stylesheet utama, dan `app.js` dinaikkan menjadi `phase7-seo-1`; URL preload sama persis dengan stylesheet utama.
- `public/app.js` memakai `<picture>` untuk listing image dengan fallback `<img>` yang memiliki `alt`, `loading="lazy"`, `decoding="async"`, `width="400"`, `height="300"`; AVIF/WebP hanya dirender bila field URL tervalidasi tersedia. Thumbnail external jobs juga diberi lazy loading, decoding async, dan dimensi intrinsik.
- `public/styles.css` menambahkan `.listing-picture` absolute-fill dan `.listing-picture img` object-fit cover.
- `public/sitemap.xml` mempertahankan homepage dan menambahkan halaman terms/privacy yang public.
- Tidak dibuat URL JPG/AVIF sosial baru: target `og-image.svg` dipertahankan karena aset tersebut benar-benar tersedia dan URL JPG belum ada.

## Verifikasi lokal

Hasil validasi lokal: `git diff --check` lulus; `npm run lint` lulus; `npm run build` lulus (31 artefak/marker); `node --check public/app.js` lulus. Browser homepage lokal memuat title `SultraKita — Marketplace Lokal #1 Kendari & Sulawesi Tenggara`, description yang diminta, canonical production, 11 OG markers, 6 Twitter markers, critical CSS aktif, stylesheet/app cache-buster `phase7-seo-1`, dan 2 JSON-LD.

Fixture aman sementara di browser memanggil `listingCard()` tanpa menyentuh database: output memiliki `<picture>`, fallback `<img alt="Fixture media Phase 7">`, `loading="lazy"`, `decoding="async"`, dimensi markup 400×300, serta source `image/avif` dan `image/webp`; node fixture langsung dihapus sesudah inspeksi. Console hanya mencatat error `[stats]` karena database lokal tidak dikonfigurasi, sesuai batasan lingkungan; tidak ada error runtime dari renderer media.

Database lokal tetap tidak tersedia sehingga listing kosong. Integration test DB dan API smoke test utama tetap mengandalkan CI PostgreSQL sesuai pola fase sebelumnya.

## Status release

Belum commit, push, atau deploy. Tahap berikutnya adalah pemeriksaan diff final, commit Phase 7, push ke `main`, menunggu seluruh GitHub Actions lulus, kemudian verifikasi build SHA, metadata, robots, sitemap, dan endpoint API pada deployment Vercel.
