# RELEASE CHECKLIST — SukiApps

Pemilik dokumen: SLICE-D. Terakhir diperbarui: 2026-10-01.
Cakupan: branch `upgrade/worldclass-execution` (pekerjaan slice paralel).
Aturan: JANGAN push ke main, JANGAN deploy production sebelum semua item
launch-blocking berstatus PASS.

Legenda: **PASS** · **FAIL** · **BLOCKED** · **TODO**.
"Pemilik" = slice/tim yang bertanggung jawab menuntaskan.

| # | Item | Status | Bukti / catatan | Pemilik |
|---|---|---|---|---|
| 1 | `npx tsc --noEmit` lolos | TODO | File SLICE-D lolos tsc individual; run penuh menunggu integrasi | Koordinator |
| 2 | `npm run lint` lolos | TODO | File SLICE-D lolos lint individual; run penuh menunggu integrasi | Koordinator |
| 3 | `npm run build` sukses | TODO | Belum dijalankan di branch ini | Koordinator |
| 4 | Migrasi Supabase teraplikasi & RLS terverifikasi | TODO | Migrasi `20261001140004_analytics_events.sql` ditulis, belum di-apply ke database mana pun | Koordinator / DBA |
| 5 | E2E smoke (Playwright) | TODO | Belum dijalankan | Koordinator |
| 6 | Auth & RBAC least-privilege | TODO | P0-2/P1-2 audit; di luar cakupan slice ini | SLICE-A / SLICE-B |
| 7 | Admin control plane lengkap | TODO | Di luar cakupan slice ini | SLICE-B |
| 8 | Billing sandbox end-to-end | TODO | Di luar cakupan slice ini; JANGAN aktifkan pembayaran nyata | SLICE-C |
| 9 | SEO launch-blocking | TODO | Helper JSON-LD + breadcrumb DONE (SLICE-D); metadata/robots/sitemap oleh Fase 1 (paralel); integrasi per-halaman TODO. Detail: `docs/SEO_CHECKLIST.md` | SLICE-D + Fase 1 |
| 10 | Legal pages terisi & bisa diakses | TODO | Route `app/legal/[slug]` ada; isi & metadata belum diverifikasi | Koordinator |
| 11 | Halaman 404 | PASS | `app/not-found.tsx` ber-branding, copy ID, tsc+lint lolos. Perlu smoke render | SLICE-D |
| 12 | Halaman 500 (error boundary) | PASS | `app/error.tsx` (client, tombol "Coba lagi") + `app/global-error.tsx` mandiri; tanpa stack trace ke user. Perlu smoke render | SLICE-D |
| 13 | Halaman maintenance | PASS | `app/maintenance/page.tsx` ber-branding, noindex. Mode perawatan (middleware + flag) TODO | SLICE-D (halaman); SLICE-A/B (mode) |
| 14 | Analytics platform | TODO | Tabel + kontrak `trackEvent` DONE (SLICE-D, belum di-apply); instrumentasi pemanggilan di halaman TODO | SLICE-D (kontrak); tim halaman (instrumentasi) |
| 15 | Health check `/api/health` | PASS | Sudah ada (temuan audit: baik); cakupan: api/db/storage | — |
| 16 | Runbook operasi tersedia | PASS | `docs/OPERATIONS_RUNBOOK.md` (SLICE-D) | SLICE-D |

## Kriteria rilis (diusulkan ke koordinator)
1. Item 1–5 = PASS (gerbang teknis).
2. Item 6–8 = PASS (gerbang keamanan & bisnis).
3. Item 9–14 tanpa BLOCKED; TODO sisa punya pemilik + tanggal.
4. Tidak ada data demo di production; tidak ada pembayaran nyata aktif.
5. Rollback plan di runbook sudah dibaca penanggung jawab rilis.
