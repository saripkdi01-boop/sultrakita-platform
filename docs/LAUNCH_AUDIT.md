# LAUNCH AUDIT — SukiApps (sukiapps.web.id)

Tanggal: 2026-10-01. Basis: branch `upgrade/fase-0-stabilisasi` (commit `e3c97dc`) + inspeksi kode.
Stack: Next.js 15.5.25 App Router + React 18.3.1 + Tailwind 3.4 + Supabase (60+ tabel, 49 migrasi, RLS aktif).
Catatan: branch `upgrade/fase-1-ssr-seo-fondasi` (SSR/SEO) dikerjakan paralel oleh tim lain — file yang disentuhnya
DILARANG diubah (daftar di `docs/IMPLEMENTATION_PLAN.md`).

## Ringkasan severity

| Severity | Jumlah | Contoh |
|---|---|---|
| P0 kritis | 3 | tanpa rate limiting; CSRF token diterbitkan tapi tidak ditegakkan; tanpa audit trail aksi admin |
| P1 launch-blocking | 6 | admin tanpa modul users/moderasi/settings; tanpa halaman 404/500; tanpa event analytics; RBAC peran belum least-privilege; tanpa validasi input terpusat di API; upload avatar tanpa validasi ketat terpusat |
| P2 penting | 5 | tanpa monetisasi (sandbox pun belum); SEO listing dinamis parsial; tanpa maintenance mode; tanpa runbook operasi; performance image/font belum diaudit |
| P3 polish | 3 | empty states tidak konsisten; copy campur EN/ID di admin; dashboard seller minim |

## Temuan detail

### P0-1 — Tidak ada rate limiting di mana pun
Bukti: `grep -ril "ratelimit|upstash|rate-limit" next-app/lib next-app/app` → kosong.
Dampak: endpoint login/signup/contact/report/upload/search rentan brute force & spam.
Rekomendasi: rate limiter di `middleware.ts` + batas per-route untuk API mahal. Tanpa dependensi berbayar (in-memory + header Retry-After).

### P0-2 — CSRF tidak ditegakkan
Bukti: `app/api/csrf/route.ts` hanya menerbitkan token (`suki_csrf` cookie); tidak ada route mutasi yang memverifikasinya.
Dampak: aksi mutasi via cookie rentan CSRF bila session berbasis cookie.
Rekomendasi: verifikasi double-submit (cookie vs header/body) di semua route mutasi; dokumentasikan pengecualian (webhook dengan signature).

### P0-3 — Tidak ada audit trail untuk aksi admin/moderasi
Bukti: tidak ada tabel `audit_events`; aksi admin (suspend, takedown, verifikasi properti) tidak mencatat actor/waktu/alasan.
Dampak: tidak akuntabel; insiden moderasi tidak bisa ditelusur.
Rekomendasi: tabel `audit_events` + helper `lib/security/audit.ts`; wajib dipakai semua mutasi admin.

### P1-1 — Admin control plane belum lengkap
Bukti: `/admin/dashboard` hanya menautkan 4 modul (support-tickets, ecosystem-banners, property-verification, affiliate-rewards).
Belum ada: ringkasan KPI operasional, manajemen users/roles, antrean moderasi laporan, CRUD kategori, feature flags/settings, analytics, operasi/kesehatan.
Rekomendasi: bangun modul bertahap sesuai playbook (overview → users → moderation → content → settings).

### P1-2 — RBAC belum least-privilege
Bukti: `requireAdminUser()` (lib/supabase/server.ts) — perlu verifikasi apakah membedakan `super_admin`/`moderator`/`support`.
Ada tabel `user_roles` (buyer/seller/admin/creator/community/moderator) dan `profiles.role`, tapi pemakaian di server actions belum diaudit menyeluruh.
Rekomendasi: matriks peran eksplisit; aksi sensitif (ubah role, suspend) hanya super_admin; test kepemilikan data.

### P1-3 — Tanpa halaman 404/500
Bukti: `app/not-found.tsx`, `app/global-error.tsx`, `app/error.tsx` tidak ada.
Dampak: route mati menampilkan halaman error default Next.js yang tidak ber-branding dan tanpa panduan.
Rekomendasi: tambahkan ketiganya + halaman maintenance.

### P1-4 — Validasi input API tidak konsisten
Bukti: zod tersedia (`^3.23.8`) tapi pemakaian belum terpusat; beberapa route mem-parse body mentah.
Rekomendasi: skema zod per route mutasi + helper error 400 yang konsisten.

### P1-5 — Tidak ada event analytics platform
Bukti: hanya `getSellerStats` (view/contact/conversation per listing). Tidak ada taksonomi event global, tidak ada tabel `analytics_events`.
Dampak: keputusan produk/launch buta data.
Rekomendasi: taksonomi event + tabel + `trackEvent` (server action), privacy-friendly, tanpa angka palsu di admin.

### P1-6 — Upload validation tersebar
Bukti: `app/api/profile/avatar/route.ts` (disentuh Fase 1 — jangan ubah); belum ada helper validasi MIME/ukuran terpusat.
Rekomendasi: helper `lib/security/uploads.ts` dipakai semua endpoint upload baru; daftar di KNOWN_LIMITATIONS untuk file Fase 1.

### P2-1 — Monetisasi: belum ada fondasi sama sekali
Bukti: ada tabel `orders`/`promotions` dari migrasi lama tapi tanpa kontrak entitlement, tanpa adapter pembayaran, tanpa UI admin billing.
Rekomendasi: bangun lapis sandbox (plans, entitlements, orders, webhook idempotent) + `docs/MONETIZATION_PLAN.md`. JANGAN aktifkan pembayaran nyata.

### P2-2 — SEO listing dinamis parsial
Bukti: robots.ts/sitemap.ts sedang dikerjakan Fase 1. JSON-LD per listing, breadcrumb, dan canonical dinamis belum terverifikasi di branch ini.
Rekomendasi: helper JSON-LD + breadcrumb (file baru saja); SEO_CHECKLIST.md.

### P2-3 — Tanpa maintenance mode & feature flags
Bukti: tidak ada tabel/settings untuk itu; middleware tidak mengenal mode perawatan.
Rekomendasi: `site_settings` + flag `maintenance_mode` yang dibaca middleware.

### P2-4 — Tanpa runbook operasi & release checklist
Bukti: docs/ punya banyak laporan historis tapi tidak ada OPERATIONS_RUNBOOK / RELEASE_CHECKLIST yang hidup.
Rekomendasi: buat keduanya + LAUNCH_STATUS.

### P2-5 — Performance belum diaudit di branch ini
Bukti: belum ada audit bundle/image/font; `next/image` remotePatterns sudah dibatasi (baik).
Rekomendasi: audit cepat + perbaikan murah (lazy, sizes, font display).

### P3 — Polish
- Empty states tidak konsisten antar modul (daftar saat implementasi).
- Copy admin campur Inggris/Indonesia.
- Seller dashboard analytics minim (sudah ada getSellerStats — cukup untuk sekarang).

## Yang SUDAH baik (jangan rusak)
- Security headers di `next.config.mjs` (CSP, X-Frame-Options, dll.) + redirect 308 /komunitas → /groups.
- Middleware auth + redirect www → apex.
- Health endpoint `/api/health` (db + storage R2).
- RLS: 32 migrasi mengandung policies.
- Fase 0: data demo dihapus dari produksi, chat dinonaktifkan rapi, filter kategori marketplace tersambung backend.

---

## APPENDIX V1.0 — Audit Visual Live (2026-10-03, program Visual Transformation V1.0)

**Metode:** fetch teks server (browser.open) ke https://sukiapps.web.id/ + 6 rute utama.
**Batasan metode:** konten CSR tidak terlihat; tampilan visual aktual, mobile, dan
interaksi butuh verifikasi browser live (dicatat sebagai butuh delegasi).

### Temuan prioritas untuk transformasi visual

**P0:**
1. `/marketplace` tanpa SSR — blank untuk crawler & first paint.
2. Data lokasi properti salah massal (", Kendari" ditempel ke kecamatan kota/kabupaten
   lain: Betoambari, Wundulako, Unaaha, Wolio, Raha, Pomalaa) — merusak kredibilitas lokal.
   → DI LUAR cakupan visual; diteruskan sebagai rekomendasi perbaikan data.
3. `/Business` memajang "0 bisnis terdaftar · 0 kota" di halaman akuisisi partner.

**P1:**
1. Hero homepage: headline kuat tapi tanpa CTA terlihat di teks fetch.
2. 35× "0 dilihat · 0 disimpan" di kartu properti menegaskan kesan sepi → sembunyikan
   counter sampai ada angka bermakna (rekomendasi; di luar cakupan visual murni).
3. 4 kartu "Empat ruang" tidak ter-render di teks server (risiko blank bila CSR).
4. Kategori properti salah ("Rumah subsidi" utk harga 850jt) + foto Unsplash generik dipakai ulang.
5. `/beranda` tak menunjukkan bukti aktivitas komunitas di SSR.
6. `/Business/direktori` 100% kosong — butuh ilustrasi "coming soon" yang bermartabat.

**P2:**
1. Footer homepage tak terverifikasi di teks fetch. 2. Tiga section /Business repetitif.
3. `/jobs` tanpa logo perusahaan/tanggal posting — daftar teks murni.
4. `/login` generik tanpa identitas visual Sultra — kandidat sentuhan Digital Nusantara.
5. Inkonsistensi tone ("Anda" vs "kamu"/"mu") lintas halaman.
6. Search section tidak terlihat di homepage (teks fetch).

**P3:** Label tombol OAuth tak terbaca di teks; detail kecil lain.

### Butuh verifikasi browser live (delegasi ke parent)
Screenshot visual aktual semua halaman; tampilan mobile/responsive; konten CSR
(/marketplace, feed /beranda, kartu ekosistem, header/nav, footer, tombol OAuth);
interaksi (filter, bottom-sheet, hover, animasi); kualitas foto listing; metadata
lengkap (view-source); performa aktual/Lighthouse.

**Catatan integritas:** fakta di atas dari teks ter-fetch server 2026-10-03 ~06:36 WITA.
Tidak ada perubahan repo/situs saat audit. Tidak ada klaim kunjungan visual.
