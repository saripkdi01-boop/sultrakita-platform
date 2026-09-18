# SultraKita / Suki Apps — Homepage Redesign Handoff

Paket ini adalah snapshot source lengkap dari repositori `saripkdi01-boop/sultrakita-platform` untuk diberikan kepada AI/designer lain sebagai dasar redesign halaman utama `sukiapps.web.id`.

## Entry point halaman utama

- HTML utama: `public/index.html`
- JavaScript utama: `public/sultrakita-mvp.js`
- Shared/home interactions: `public/app.js`
- CSS utama: `public/sultrakita-mvp.css`, `public/suki-marketplace-v2.css`
- Design tokens/theme: `public/design-tokens.css`, `public/theme-contract.css`, `public/theme-modern.css`
- Policy/consent support: `public/policy-consent.js`, `public/policy-consent.css`, `public/legal.css`
- Runtime server/API: `server.js` dan file backend di root serta `api/`

## Konteks redesign

Gunakan dokumentasi berikut sebagai konteks produk, audit, dan keputusan UI/UX yang sudah ada:

- `docs/BERANDA-UX-RESEARCH-BRIEF-2026-09-12.md`
- `docs/PROMPT-AUDIT-UIUX-SUKI-2026-09-15.md`
- `docs/audit-suki-home-api-2026-09-16.md`
- `docs/REVISION-BERANDA-HEADER-2026-09-08.md`
- `docs/UI-MODERNIZATION-AUDIT.md`
- `docs/SUKI-DESIGN-SYSTEM-RESEARCH.md`
- `docs/SUKI-SUITS-HYBRID-DESIGN-SYSTEM-2026-09-04.md`
- `docs/MARKETPLACE-DESIGN-SYSTEM.md`
- `docs/responsive-test-findings-2026-09-17.md`
- `QA-REPORT-2026-09-18.md`

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env
# Isi environment yang diperlukan sesuai kebutuhan backend.
npm start
```

Aplikasi utama secara default disajikan oleh server Express dari folder `public/`. Endpoint API dipakai oleh homepage untuk listing, kategori, auth, feed, notifikasi, komentar, dan interaksi marketplace.

## Catatan untuk AI redesign

Pertahankan kontrak API dan perilaku utama kecuali redesign memang mencakup perubahan produk. Fokus visual/UX dapat diarahkan pada hierarchy, density yang lebih efisien, motion yang halus, responsive behavior, accessibility, loading/empty/error states, dan pengurangan over-spacing. Jangan memasukkan secret, kredensial, atau data produksi ke dalam hasil redesign.

## Isi yang sengaja tidak disertakan

- `.git/` dan metadata clone
- `node_modules/`
- `.env` dan file environment lokal/non-template
- `data/`, `uploads/`, cache, serta artefak runtime

Snapshot ini dibuat dari branch dan commit yang sedang aktif ketika paket dibuat.
