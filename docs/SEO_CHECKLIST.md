# SEO CHECKLIST — SukiApps (sukiapps.web.id)

Pemilik: SLICE-D. Terakhir diperbarui: 2026-10-01.
Status jujur per item: **DONE** (terverifikasi di branch ini) · **Fase 1 (paralel)**
(dikerjakan tim Fase 1 di branch `upgrade/fase-1-ssr-seo-fondasi`, jangan disentuh)
· **TODO** (belum dikerjakan).

## 1. Metadata unik per halaman

| Halaman | Status | Catatan |
|---|---|---|
| Root layout (judul/deskripsi dasar) | DONE | `app/layout.tsx`: metadataBase + title + description ID |
| Beranda (`/`) | Fase 1 (paralel) | metadata halaman dikerjakan Fase 1 |
| `/groups`, `/jobs`, `/marketplace`, `/properti` | Fase 1 (paralel) | metadata halaman dikerjakan Fase 1 |
| Halaman detail dinamis (listing/properti/job) | TODO | butuh `generateMetadata` per id + fallback |
| Halaman legal (`/legal/[slug]`) | TODO | verifikasi ada metadata unik per slug |
| Halaman error (404/500/maintenance) | DONE | SLICE-D: `robots: noindex` di metadata |

## 2. Canonical

| Item | Status | Catatan |
|---|---|---|
| `metadataBase` di root layout | DONE | `https://sukiapps.web.id` (fallback bila env kosong) |
| Canonical per halaman & URL dinamis | Fase 1 (paralel) | |
| Redirect www → apex | DONE | middleware (temuan audit: sudah baik) |
| Redirect 308 `/komunitas` → `/groups` | DONE | next.config.mjs (temuan audit: sudah baik) |

## 3. robots.txt

| Item | Status | Catatan |
|---|---|---|
| `app/robots.ts` | Fase 1 (paralel) | sudah ada di branch ini: allow `/`, sitemap terdaftar |
| Blokir route sensitif (`/admin/*`, `/api/*`) | TODO | verifikasi setelah Fase 1 selesai; `/admin` wajib disallow |

## 4. Sitemap

| Item | Status | Catatan |
|---|---|---|
| `app/sitemap.ts` | Fase 1 (paralel) | sudah ada: route statis + dinamis dari DB |
| URL dinamis listing aktif saja | TODO | pastikan hanya listing published/aktif masuk sitemap |
| `lastModified` realistis | TODO | jangan pakai `new Date()` untuk semua URL bila tidak berubah |

## 5. Open Graph / Twitter Card

| Item | Status | Catatan |
|---|---|---|
| OG dasar (site-wide) | Fase 1 (paralel) | |
| OG image per halaman detail (1200×630) | TODO | butuh aset/generate image |
| `twitter:card` summary_large_image | TODO | |

## 6. JSON-LD (structured data)

| Item | Status | Catatan |
|---|---|---|
| Helper builder murni | DONE | SLICE-D: `next-app/lib/seo/jsonld.ts` — Product, JobPosting, RealEstateListing, LocalBusiness, BreadcrumbList, PostalAddress. Hanya dari data nyata; tanpa klaim palsu |
| Integrasi per halaman detail | TODO | pemilik: tim halaman — panggil builder dengan data DB terverifikasi, render via `<script type="application/ld+json">` |
| Validasi Rich Results Test | TODO | setelah integrasi; nol error |

## 7. Favicon / manifest / ikon

| Item | Status | Catatan |
|---|---|---|
| Ikon via layout metadata | DONE | `icon: /icon.svg`, `apple: /suki-logo-mark.svg` |
| `public/icon.png`, `public/suki-logo-mark.png` | DONE | tersedia sebagai fallback |
| `site.webmanifest` | TODO | belum ada — tambahkan (name, short_name, icons, theme_color) |
| `favicon.ico` 32×32 | TODO | opsional; SVG sudah cukup untuk browser modern |

## 8. Breadcrumb

| Item | Status | Catatan |
|---|---|---|
| Komponen aksesibel + JSON-LD | DONE | SLICE-D: `next-app/components/seo/Breadcrumbs.tsx` (nav aria-label, ol/li, aria-current, BreadcrumbList) |
| Dipakai di halaman detail/kategori | TODO | pemilik: tim halaman |

## 9. Noindex halaman non-publik

| Item | Status | Catatan |
|---|---|---|
| `/admin/*` noindex | TODO | **terverifikasi belum ada**: `app/admin/layout.tsx` tidak memuat metadata robots. Tambahkan `robots: noindex, nofollow` di layout admin (pemilik: SLICE-B) |
| Halaman error/maintenance noindex | DONE | SLICE-D: metadata robots noindex di not-found & maintenance |
| Halaman auth (`/login`, `/signup`) | TODO | pertimbangkan noindex agar tidak bersaing di SERP |

## 10. Internal linking

| Item | Status | Catatan |
|---|---|---|
| Navigasi utama & footer | TODO | audit: tautan antar-modul (marketplace ↔ properti ↔ jobs ↔ groups) |
| Breadcrumb sebagai internal link | TODO | mengikuti integrasi breadcrumb (item 8) |
| Tautan kontekstual "listing terkait" | TODO | backlog P3 |

## 11. Hal lain

| Item | Status | Catatan |
|---|---|---|
| Verifikasi Google Search Console | DONE (situs) | `verification.google` sudah di root layout |
| `lang="id"` | DONE | `<html lang="id">` di root layout |
| Kecepatan (Core Web Vitals) | TODO | lihat temuan audit performance di `docs/slices/SLICE-D-LOG.md` |

## Definisi selesai (untuk koordinator)
Checklist ini dianggap selesai bila semua item **Fase 1 (paralel)** terkonfirmasi
di branch ini dan tidak ada item **TODO** berstatus launch-blocking tanpa pemilik
di `docs/RELEASE_CHECKLIST.md`.
