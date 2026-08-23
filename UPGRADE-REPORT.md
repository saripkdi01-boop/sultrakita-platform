# SultraKita — Upgrade Report

Upgrade ini mengubah fondasi SultraKita dari aplikasi demo yang dapat kehilangan data menjadi baseline marketplace produksi yang lebih aman dan siap dikembangkan. Implementasi mengikuti spesifikasi v4 tanpa mengubah arah copy Indonesia lokal dan karakter desain publik.

## Perbandingan

| Area | Sebelum | Sesudah |
|---|---|---|
| Persistence | SQLite `sql.js` dan file `/tmp` pada Vercel | Postgres-only melalui connection pool dengan migration bernomor |
| Foto | Disk storage temporer | Memory upload tervalidasi signature lalu PUT ke object storage; URL durable disimpan di `listing_images` |
| Rate limit | `Map` in-memory per instance | Tabel `rate_limits` Postgres untuk lintas instance |
| CORS | Default wildcard `*` | Origin eksplisit dari `CORS_ORIGINS` |
| Runtime | Express dan Worker paralel | Worker/Wrangler dihapus; Express/Vercel menjadi runtime tunggal |
| SEO | SPA tanpa URL listing dan domain sitemap salah | SSR HTML listing/kategori/wilayah/pencarian, canonical, OG absolut, Product/Offer/Place JSON-LD, sitemap dinamis |
| Admin | Panel analytics/token ikut tertanam di homepage | Panel token dihapus dari homepage; operasi tetap berada di `/admin` |
| Search | Query listing biasa | `tsvector` + GIN index dengan trigger pembaruan otomatis |
| Monetisasi | Donasi saja | Feature flags untuk boost, toko, verifikasi, lowongan, dan escrow; payment ledger lanjutan tetap dikunci sebelum aktivasi |

## Bukti yang tersedia

`node --check server.js`, `node --check seo.js`, `npm run lint`, dan `npm run build` berhasil dijalankan setelah patch. Pengujian API yang memerlukan database belum dapat dinyatakan lulus di sandbox ini karena `DATABASE_URL` tidak tersedia; hal ini sengaja tidak ditutup dengan SQLite fallback karena justru akan mengembalikan blocker produksi yang hendak dihapus.

## Risiko dan pekerjaan lanjutan

Sebelum go-live, maintainer harus menerapkan migration ke Postgres production, mengisi environment object storage dan provider OTP, melakukan integrasi payment provider dengan webhook signature/idempotensi, serta menjalankan smoke test menggunakan database staging. Dashboard admin idealnya dimigrasikan dari token manual menuju session role admin penuh. Setelah itu, Lighthouse dan Rich Results Test perlu dijalankan pada domain final, bukan hanya pada sandbox.

> Prinsip yang dipertahankan: angka publik hanya boleh berasal dari database; ketika data kosong, UI harus jujur dan mengajak warga menjadi pemasang iklan pertama.
