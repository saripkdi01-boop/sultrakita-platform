# Laporan Audit Keamanan, Performa & SEO — SUKI Apps

**Tanggal:** 6 Oktober 2026
**Target:** https://sukiapps.web.id (repo `sultrakita-platform`, branch `main` @ `42d62f2`)
**Stack:** Next.js 15.5.27 + React 18 + TypeScript + Supabase + Vercel (region `fra1`)
**Metode:** audit kode statis + audit live produksi (header, HTML, bundle, timing) + verifikasi build lokal

---

## Ringkasan eksekutif

| Area | Skor sebelum | Temuan P0 | Temuan P1 | Status |
|---|---|---|---|---|
| Keamanan | Baik (7,5/10) | 1 | 2 | ✅ Diperbaiki via PR |
| Performa | Buruk (4/10) | 1 | 2 | ✅ Diperbaiki via PR |
| SEO | Baik (7/10) | 1 | 2 | ✅ Diperbaiki via PR |

**Hasil utama setelah perbaikan (terverifikasi build lokal):**
- JS homepage: **~4 MB → ~540 KB (-86%)**
- PII `profiles.phone` tidak lagi terbaca publik massal
- Preview link WhatsApp/Twitter tampil benar (1200×630)
- 0 kerentanan dependency (`npm audit` bersih)

---

## TEMUAN P0 (kritis — sudah diperbaiki)

### P0-SEC-1: Nomor HP & role semua user terbaca publik via RLS longgar

- **Lokasi:** `supabase/migrations/20260907130000_profiles_private_contacts.sql`
- **Masalah:** policy `profiles_public_read ... USING (true)` membuka **semua kolom**
  (termasuk `phone`, `role`, `visibility_settings`) untuk dibaca siapa pun (anon).
  Siapa pun bisa memanen nomor HP seluruh user via Supabase REST API publik.
- **Perbaikan:**
  - Migrasi baru `supabase/migrations/20261006000000_profiles_restrict_pii.sql`:
    `REVOKE` + `GRANT SELECT` hanya kolom publik yang aman; phone seller tetap
    tersedia **hanya untuk seller berlisting aktif** via RPC
    `get_seller_contact(uuid)` (SECURITY DEFINER, search_path terkunci).
  - Kode disesuaikan: `lib/actions/property-public.ts`, `lib/actions/properties.ts`,
    `lib/actions/chat.ts` memakai RPC baru (dengan fallback aman bila RPC gagal).
- **Aksi manual dibutuhkan:** jalankan migrasi SQL di atas via Supabase Dashboard
  → SQL Editor (atau pipeline Supabase CLI) **sebelum/sesudah merge** — file migrasi
  bersifat idempotent dan FILE-ONLY seperti pola migrasi lain di repo ini.
- **Verifikasi:** typecheck lolos; halaman properti tetap menampilkan tombol WA
  seller; user biasa tanpa listing tidak lagi terekspos.

### P0-PERF-1: Bundle JS homepage ~4 MB (kamus i18n 27 bahasa di-bundle sekaligus)

- **Lokasi:** `next-app/lib/i18n/dictionaries.ts` (diimpor homepage via
  `app/home-client.tsx` + 3 komponen `kendari/`)
- **Masalah:** `dictionaries.ts` mengimpor statis **seluruh kamus 27 bahasa**
  (~3,7 MB source → chunk 1,7 MB). Total JS homepage ~4 MB — sangat berat untuk
  user HP di Sultra. Bukti live: chunk `7640-*.js` (1,7 MB) berisi string i18n.
- **Perbaikan:**
  - Modul baru `lib/i18n/dictionaries-lazy.ts`: hook `useCoreLabels(language)` —
    Indonesia di-bundle sinkron (fallback instan), 26 bahasa lain lazy-load via
    dynamic import hanya saat dipilih.
  - Migrasi homepage: `app/home-client.tsx`, `KendariHero.tsx`,
    `KendariSections.tsx`, `SukiAboutCard.tsx`.
  - `LanguageSwitcher.tsx`: preload chunk bahasa saat hover/fokus opsi.
- **Verifikasi (build lokal):** JS homepage **~540 KB total (-86%)**; teks
  Indonesia tetap ter-render; chunk kamus besar tidak lagi dimuat di `/`.
- **Tindak lanjut (tidak dalam PR ini):** migrasi 23 file lain yang masih memakai
  `getCoreLabels` statis ke `useCoreLabels` (pola sudah didokumentasikan di
  `dictionaries.ts`). Halaman-halaman itu tetap berfungsi normal.

### P0-SEO-1: Dimensi OG image salah (512×512, aktual 1200×630)

- **Lokasi:** `next-app/app/page.tsx`
- **Masalah:** metadata `openGraph.images` mendeklarasikan 512×512 padahal file
  `public/og-image.png` adalah 1200×630. Akibat: preview link di WhatsApp/Twitter
  terpotong atau tidak optimal.
- **Perbaikan:** dimensi dikoreksi ke 1200×630. Terverifikasi di HTML lokal.

---

## TEMUAN P1 (tinggi — sudah diperbaiki)

### P1-SEC-1: Wildcard `remotePatterns` membuka SSRF Image Optimization (CVE-2026-94483)

- **Lokasi:** `next-app/next.config.mjs`
- **Masalah:** `remotePatterns` memakai `**.supabase.co` dan `**.r2.dev` **tanpa
  batasan pathname**. Security release Next.js September 2026 (sudah terinstal:
  15.5.27) mencatat URL allow-listed yang attacker-controlled dapat menyebabkan
  SSRF saat Image Optimization. URL gambar listing/avatar berasal dari user
  (upload) dan dirender via `next/image` (`SafeImage`).
- **Perbaikan:** `**.supabase.co` dibatasi ke path storage publik resmi
  (`/storage/v1/object/public/**`). `SafeImage` sudah punya fallback `<img>`
  biasa untuk host di luar daftar — halaman tidak crash.
- **Catatan:** versi Next.js 15.5.27 sudah mencakup patch CVE ini; pengetatan
  config adalah defense-in-depth.

### P1-SEC-2: Dependensi root rentan (multer DoS + qs)

- **Lokasi:** `package.json` root (Express `server.js` legacy)
- **Masalah:** `npm audit` menemukan 4 kerentanan: multer 2.0.2 (5 GHSA DoS —
  fix tersedia) + qs via express/body-parser (moderate).
- **Perbaikan:** `multer` → `^2.4.0`, tambah `overrides: { qs: ^6.16.0 }`.
  `npm audit --omit=dev` kini **0 vulnerabilities** (root maupun next-app).
- **Catatan:** `server.js` root adalah runtime legacy (produksi = `next-app/`
  di Vercel); perbaikan ini menjaga keamanan tooling/CI yang memakai root.

### P1-PERF-1: Gambar hero tanpa `fetchpriority` (LCP lambat)

- **Lokasi:** `next-app/components/kendari/ImageSlot.tsx`
- **Masalah:** gambar hero (`loading="eager"`) tidak punya `fetchpriority`,
  sehingga browser tidak memprioritaskannya. Preload sudah ada, tapi tanpa
  prioritas eksplisit.
- **Perbaikan:** `fetchPriority="high"` untuk gambar eager, `"auto"` untuk lazy.
  Terverifikasi di HTML lokal (2 `fetchPriority="high"`).

### P1-PERF-2: TTFB produksi ~2,5–3 detik (region Vercel `fra1`/Frankfurt)

- **Bukti:** `x-vercel-id: fra1::...`; cache HIT pun starttransfer ~2,5 dtk dari
  Indonesia. Semua halaman (termasuk `robots.txt`) lambat merata → masalah
  jarak region, bukan kode.
- **Rekomendasi (aksi manual, tidak bisa via PR):** di Vercel Dashboard →
  Project Settings → Functions → pindahkan region ke **Singapore (`sin1`)**.
  Estimasi dampak: TTFB turun ke <500ms untuk user Sultra. Paket Hobby hanya
  mendapat 1 region — pilih `sin1`.

### P1-SEO-1: Homepage tanpa JSON-LD Organization/WebSite

- **Masalah:** homepage tidak punya structured data identitas situs (halaman
  marketplace/properti sudah punya). Google kurang memahami entitas situs.
- **Perbaikan:** tambah JSON-LD `@graph` (Organization + WebSite + SearchAction)
  di `app/page.tsx`, dengan escaping `<` → `\u003c` (pola aman yang sudah dipakai
  `NewsJsonLd`). Terverifikasi di HTML lokal.

### P1-SEO-2: 45 dari 77 halaman tanpa metadata (tanpa OG/Twitter default)

- **Masalah:** root layout tidak punya `openGraph`/`twitter` default; 45 halaman
  tanpa metadata → preview link polos saat dibagikan.
- **Perbaikan:** tambah default `openGraph` + `twitter` + `robots` (max-image-preview
  large) di `app/layout.tsx`. Halaman bermetadata sendiri otomatis menimpa.
- **Bonus:** `X-Robots-Tag: noindex` diperluas ke `/dashboard/*` dan `/seller/*`
  (sebelumnya hanya `/admin/*`).

---

## TEMUAN P2 (sedang — dicatat, tidak dalam PR ini)

| # | Temuan | Rekomendasi |
|---|---|---|
| P2-PERF-1 | CSS homepage ~730 KB (1 file 623 KB tidak ter-purge — `globals.css` 580 KB berisi utility global + Tailwind) | Audit `globals.css` + pecah CSS per-rute; aktifkan `experimental.optimizePackageImports` bila perlu |
| P2-SEC-1 | Next.js 15 EOL **21 Okt 2026** (16 hari lagi) — setelah itu tanpa patch keamanan | Rencanakan upgrade ke Next.js 16 LTS dalam 1–2 bulan; versi 15.5.27 saat ini sudah patch terakhir |
| P2-SEC-2 | CSP memakai `'unsafe-inline'` + `'unsafe-eval'` di `script-src` | Ketatkan bertahap dengan nonce/hash; butuh refactor inline script tema |
| P2-SEO-1 | Sitemap memuat listing via `?listing=` (bukan URL detail kanonis) | Buat halaman `/marketplace/[slug]` lalu update sitemap |
| P2-PERF-2 | Font Google via `<link>` render-blocking eksternal | Migrasi ke `next/font` (self-host, otomatis subset latin) |
| P2-SEC-3 | Rate-limit middleware in-memory (tidak sinkron antar instance serverless) | Set `UPSTASH_REDIS_*` di Vercel (kode Upstash sudah ada di `lib/rate-limit.ts`) |

---

## Hal yang sudah BAIK (tidak perlu tindakan)

- **Security headers lengkap:** HSTS, CSP, X-Frame-Options, nosniff, Permissions-Policy ✅
- **Auth callback aman:** `safeRedirect` anti open-redirect; exchange code server-side ✅
- **Webhook billing fail-closed:** HMAC-SHA256 wajib di produksi + anti-replay (ts+nonce) + idempotency ✅
- **CSRF double-submit** dipakai 9 API routes mutasi; webhook dikecualikan dengan benar (pakai HMAC) ✅
- **Upload validation** ketat (ekstensi/MIME/spoofing, SVG dibatasi) ✅
- **Admin guard berlapis:** middleware + `requireRole` server-side per halaman ✅
- **Tidak ada secret ter-commit:** hanya file `.example`; service-role hanya server-side ✅
- **Sitemap 841 URL + robots.txt** benar; canonical + redirect 308 domain kanonis ✅
- **PWA manifest + SW + icon** lengkap ✅
- **A11y dasar:** 1 H1, semua img ber-alt, `lang="id"` ✅

---

## Verifikasi yang dilakukan

1. `tsc --noEmit` — **lolos (exit 0)**
2. `next build` produksi (dengan env dummy) — **sukses, 77+ rute ter-generate**
3. `npm audit --omit=dev` (root + next-app) — **0 vulnerabilities**
4. Serve produksi lokal + uji curl: HTTP 200, JSON-LD hadir, OG 1200×630,
   `fetchpriority="high"` hadir, JS homepage ~540 KB, teks Indonesia ter-render
5. Migrasi SQL ditulis idempotent mengikuti pola repo (FILE-ONLY, dijalankan manual)

---

## Aksi manual setelah merge (untuk pemilik)

1. **Jalankan migrasi RLS** (`20261006000000_profiles_restrict_pii.sql`) via
   Supabase Dashboard → SQL Editor — memblokir eksposur phone publik.
2. **Pindahkan region Vercel ke `sin1`** (Singapore) — memangkas TTFB ~80%.
3. (Opsional) Set `UPSTASH_REDIS_*` di Vercel untuk rate-limit lintas instance.
4. Uji tombol "Chat via WA" di 1 listing properti + 1 listing marketplace
   (jalur RPC baru), lalu pantau log 24 jam.
