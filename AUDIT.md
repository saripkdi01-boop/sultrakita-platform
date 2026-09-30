# Audit UI/UX Homepage — SUKI Apps (sukiapps.web.id)
Tanggal: 1 Oktober 2026 (WITA) · Pelaksana: Muse (subagent overhaul) · Branch: `redesign/ui-ux-overhaul`

## 1. Konteks teknis (terverifikasi)
- **Repo**: `saripkdi01-boop/sultrakita-platform`, publik, branch `main` bersih sebelum kerja.
- **Yang di-deploy ke Vercel**: `next-app/` — Next.js 15.5.25, React 18.3.1, Tailwind 3.4, TypeScript 5.6, `framer-motion` 13.2, `lucide-react`. Node 24.x. (Root repo adalah server Express terpisah yang TIDAK di-deploy ke Vercel.)
- **Homepage live** dirender oleh `next-app/app/page.tsx` → `app/home-client.tsx` (client component) + style `suki-overhaul-*` di `app/globals.css` (light: baris 3227–3231, dark: 3334–3358).
- **Font**: Plus Jakarta Sans + Playfair Display via Google Fonts `@import` (nyata, termuat).
- **Logo resmi**: `next-app/public/brand/suki-logo-mark.svg` — kotak teal bergradasi (#18B6A4→#087F73), huruf "S" putih, aksen emas (#F4D35E).
- **Route yang dipakai homepage** — semua terverifikasi ada: `/beranda`, `/Business`, `/marketplace`, `/properti`, `/jobs`, `/groups`, `/login`, `/help-center`, `/legal/privacy`, `/legal/terms`.

## 2. Masalah UX/UI utama
1. **Search box palsu (fungsional)**: homepage submit ke `/beranda?search=...`, tetapi `/beranda` hanya membaca param `compose` — query **dibuang diam-diam**. `/marketplace` justru membaca param `q`. Pengguna mengira mencari, hasilnya nihil.
2. **Menu mobile tidak aksesibel penuh**: tidak merespons Escape, tidak ada focus trap / focus return ke tombol hamburger.
3. **Shortcut ⌘K dekoratif**: hint `kbd` "⌘ K" ditampilkan, tetapi tidak ada listener keyboard.
4. **Tipografi terlalu mungil**: teks 8–11px di topbar, kicker, proof chips, footer, detail peta — sulit dibaca di ponsel, berisiko gagal kontras WCAG AA.
5. **Sistem token terfragmentasi**: 4+ sistem warna paralel (token Tailwind `suki`/`sultra-*`/cream/gold, `--so-*` homepage, `design-system/tokens.css`, `:root` vars). Mislabel: `--suki-teal:#A16207` (sebenarnya coklat keemasan).
6. **EcosystemMap rapuh di mobile**: `transform: scale(.82)` hack di ≤620px; node absolut berisiko overflow di 360px; update detail hanya via hover (keyboard tab tidak memperbarui panel).
7. **`overflow:hidden` pada `<main>`** + sticky header di dalamnya — kombinasi rapuh.
8. **SEO**: OG/Twitter `summary_large_image` tanpa image.
9. **Kontras**: `--so-muted #687973` pada teks 9–10px berisiko < 4.5:1.

## 3. Yang sudah baik (pertahankan)
- Tanpa statistik/testimoni/mitra/klaim palsu. Alur section sudah sesuai IA prompt.
- Skip link, satu H1, heading berurutan, `prefers-reduced-motion` dihormati, focus-visible ada, dark mode homepage ada.
- Semua CTA/navigasi menuju route yang benar-benar ada; tidak ada tautan mati.
- Motion tokens terpusat (`lib/motion-tokens.ts`), durasi 160–520ms.

## 4. Risiko menjaga fungsionalitas
- Search wajib ke route yang memproses query (`/marketplace?q=`). Theme toggle (`localStorage` + `data-theme`) dipertahankan. Framer-motion tetap dipakai; tanpa library animasi baru. Jangan sentuh API routes, auth, DB, env, `middleware.ts`, domain/DNS.

## 5. Aset yang ditemukan
- **Figma/Canva/Drive/Linear**: TIDAK ada aset resmi SUKI Apps (laporan: `docs/DISCOVERY-ASSET-SUKI-2026-10-01.md`). Baseline merek = logo SVG + `public/design-tokens.css` (`--color-brand:#0D5C4B`) di repo.

## 6. Urutan kerja
Branch → tulis ulang `home-client.tsx` + CSS `suki-overhaul-*` (satu sistem token "Teluk & Tenun": pine/teal dari logo + aksen emas + sand hangat) → perbaiki search/menu/a11y → metadata OG image → typecheck/lint/build → push (tanpa force/merge) → verifikasi Vercel Preview READY. Production TIDAK disentuh.

## 7. Catatan QA
- Vercel memakai **SSO Protection** (`all_except_custom_domains`): URL preview `*.vercel.app` kemungkinan meminta login Vercel.
- Root directory proyek tidak terekspos via MCP `get_project`; pipeline yang sama dipakai untuk branch baru.

---

# Audit SultraKita — Baseline Versi Terbaru

Tanggal audit: 22 Agustus 2026

## Ringkasan

SultraKita sudah memiliki fondasi marketplace lokal yang dapat dijalankan dari clone baru. Repository berisi frontend static, API Express, jalur Cloudflare Worker, database SQLite melalui `sql.js`, OTP/session, listing, filter, komentar, laporan, upload gambar, messaging/SSE, analytics, admin endpoints, serta metadata dasar SEO/PWA.

Audit lama yang menyatakan bahwa frontend, test, validasi, upload, search, dan pagination belum tersedia sudah tidak akurat. Dokumen ini menggantikannya dan harus menjadi baseline untuk upgrade berikutnya.

## Temuan P0

1. **Authorization belum konsisten.** Endpoint yang menerima `user_id`, `seller_id`, `buyer_id`, atau `sender_id` dari body belum seluruhnya memverifikasi Bearer session dan kepemilikan resource. Ini membuka risiko impersonation, akses conversation milik user lain, dan perubahan data tanpa otorisasi.

2. **Status verifikasi memiliki dua sumber data.** Schema memiliki `is_verified`, sementara migration menambahkan `phone_verified`, `verification_status`, dan `verification_note`. Proses review memperbarui `verification_status`, tetapi query listing masih memilih `is_verified`. Status badge harus disatukan atau disinkronkan melalui migration yang eksplisit.

3. **Persistence dan upload lokal belum durable untuk scale-out.** SQLite file dan folder `uploads/` dapat digunakan untuk local/demo, tetapi tidak boleh diperlakukan sebagai storage production untuk Worker atau multi-instance. Jalur D1/R2 atau managed service perlu diputuskan sebelum traffic meningkat.

4. **OTP membutuhkan abuse controls lebih kuat.** Sudah terdapat expiry dan rate limiting umum, tetapi perlu batas percobaan per challenge/nomor, invalidasi challenge lama secara deterministik, serta pemisahan rate limit OTP dari rate limit API umum.

5. **Express dan Worker berpotensi drift.** `server.js` memiliki fitur yang lebih lengkap daripada `worker.js`. Setiap perubahan bisnis perlu memiliki shared service atau compatibility matrix dan smoke test untuk runtime target.

## Temuan P1

1. Homepage deployment sudah memiliki arah visual lokal yang baik, tetapi pengalaman masih dominan katalog: social feed, seller store, notification center, detail product yang kaya, dan create-listing flow belum menjadi alur end-to-end yang setara dengan target produk.

2. Frontend dan API perlu state yang konsisten untuk loading, empty, error, optimistic update, dan retry. Search perlu autocomplete, recent/trending suggestion, filter yang mudah dipakai di mobile, dan pagination yang tetap ringan.

3. Test baseline hanya mencakup health, categories, listing validation, dan locations. Critical journey serta security regression belum memiliki cakupan yang cukup.

4. Error handler utama sudah menyembunyikan stack trace, tetapi health check memberikan `error.message` sebagai detail. Detail internal tidak seharusnya dikirim pada production.

5. Upload sudah membatasi jumlah, ukuran, dan beberapa MIME type, tetapi validasi magic bytes, cleanup ketika insert database gagal, serta pengamanan URL gambar masih perlu ditambahkan.

## Prioritas Eksekusi

| Prioritas | Fokus | Exit criterion |
|---|---|---|
| P0 | Session authorization, ownership, verification consistency, OTP abuse controls, upload safety | Security tests lulus dan endpoint sensitif menolak impersonation |
| P0 | Runtime/persistence compatibility | Express/Worker behavior terdokumentasi; migration idempotent |
| P1 | Design system dan app shell mobile-first | Tidak ada overflow; state interaksi lengkap pada viewport utama |
| P1 | Marketplace discovery dan create listing | Browse-search-detail-create berjalan end-to-end |
| P1 | Seller profile, social, chat, notifications | Data model, membership, pagination, dan moderation tersedia |
| P3 | Performance, SEO, PWA, analytics, AI/monetization readiness | Diukur terhadap baseline dan tidak mengaktifkan placeholder sebagai production |

## Baseline Verification

- `npm install --no-audit --no-fund`: berhasil.
- `npm test`: 4 test lulus, 0 gagal.
- Deployment homepage: dapat dimuat dan menampilkan search, kategori, filter wilayah, sorting, listing card, CTA pasang iklan, theme toggle, navigasi, dan community CTA.

## Rekomendasi Tata Kelola

Kerjakan secara incremental pada branch kerja dari repository canonical. Gunakan satu concern per commit, jangan force push, jangan mengganti remote, dan jangan menaruh secret ke source, dokumentasi, screenshot, atau test fixture. Setiap phase harus menghasilkan perubahan kode nyata, test, dokumentasi, dan catatan rollback.
