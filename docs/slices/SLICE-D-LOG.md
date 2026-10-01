# SLICE-D LOG — Analytics, SEO suplemen, halaman error, launch docs, performance

Pemilik: SLICE-D. Branch: `upgrade/worldclass-execution`.
Worktree: `/home/hatch/workspace/worktrees/sultrakita-worldclass`.

## 2026-10-01 ~13:05 WITA — Implementasi awal (semua file milik slice)

### File dibuat
| File | Deskripsi |
|---|---|
| `supabase/migrations/20261001140004_analytics_events.sql` | Tabel `public.analytics_events` + 3 index + RLS (INSERT publik; SELECT/UPDATE/DELETE admin). Komentar kebijakan privasi: tanpa PII di `props`, retensi 180 hari |
| `next-app/lib/analytics/events.ts` | **KONTRAK BERSAMA**: `EVENT_NAMES` final (12 event), `EventPayloads` per event, `trackEvent(supabase, …)` server-side yang tidak pernah throw, `newSessionId()`, sanitasi props (potong query string dari path, batasi panjang string). Asumsi privasi didokumentasikan di komentar |
| `next-app/lib/seo/jsonld.ts` | Builder JSON-LD murni: `productJsonLd`, `jobPostingJsonLd`, `realEstateJsonLd`, `localBusinessJsonLd`, `breadcrumbJsonLd`, `postalAddressJsonLd`, `serializeJsonLd` (escape `<`). Hanya dari data nyata; field opsional tanpa data dihilangkan |
| `next-app/components/seo/Breadcrumbs.tsx` | Breadcrumb aksesibel (nav aria-label, ol/li, aria-current) + JSON-LD BreadcrumbList via helper |
| `next-app/components/seo/ErrorShell.tsx` | Cangkang ber-branding untuk halaman error (file milik slice ini; dipakai 4 halaman) |
| `next-app/app/not-found.tsx` | 404, copy Indonesia, noindex |
| `next-app/app/error.tsx` | 500 per-segmen, client component, tombol "Coba lagi" → `reset()`, tanpa stack trace |
| `next-app/app/global-error.tsx` | Global boundary mandiri (html/body sendiri, styling inline, tanpa next/link) |
| `next-app/app/maintenance/page.tsx` | 503 ber-branding, noindex; mode perawatan milik SLICE-A/B |
| `docs/SEO_CHECKLIST.md` | Checklist 11 seksi, status jujur (DONE / Fase 1 (paralel) / TODO) |
| `docs/RELEASE_CHECKLIST.md` | Tabel PASS/FAIL/BLOCKED/TODO 16 item + kriteria rilis |
| `docs/OPERATIONS_RUNBOOK.md` | Deploy, rollback, backup/restore, health check, incident (severity+langkah), moderasi, support, tugas rutin |

### Verifikasi
- `npx tsc --noEmit` (next-app): **0 error di file SLICE-D**. 4 error lain berasal dari file slice paralel (SLICE-A: `lib/security/rate-limit.ts` ×3; SLICE-B: `lib/admin/guards.ts`, `app/admin/users/[id]/page.tsx`) — bukan milikku, tidak disentuh.
- `npx next lint` (8 file milikku): **No ESLint warnings or errors**.
- Uji builder JSON-LD (tsc → /tmp + node assert, 7 grup): **ALL PASSED** — `@type` Product/JobPosting/RealEstateListing/LocalBusiness/BreadcrumbList benar; currency default IDR; field opsional tanpa data dihilangkan (tidak jadi null); tidak ada klaim palsu (rating/alamat/stok); `serializeJsonLd` escape `<` (aman dari `</script>` breakout).
- Migrasi SQL: tidak ada psql/pg di environment — review manual; sintaks DDL + policy standar mengikuti pola migrasi existing (`TO anon, authenticated`, `exists (select 1 from public.profiles …)`).

### Keputusan
1. Error pages memakai **inline styles penuh** (bukan Tailwind/globals.css) agar tetap tampil bila CSS global gagal dimuat — kritis untuk `global-error.tsx`.
2. `trackEvent` mengembalikan `{ ok, error? }` dan tidak pernah throw — analytics tidak boleh merusak alur utama.
3. `path` dipotong pada query string; `search.query` dipotong 120 char dan didokumentasikan sebagai sensitif.
4. RLS INSERT dibuka untuk `anon, authenticated` (event anonim disengaja tercatat); keamanan dijaga lewat larangan PII + tidak ada kolom sensitif.
5. Checklist memakai status jujur: item Fase 1 ditandai "Fase 1 (paralel)" tanpa klaim; `/admin/*` noindex terverifikasi BELUM ada → TODO milik SLICE-B.
6. Tidak ada perbaikan performance di file orang lain — audit menemukan tidak ada yang perlu diperbaiki (lihat bawah).

### Audit performance cepat (10–15 mnt)
- `next/image` tanpa `sizes`: **tidak ada**. Semua pemakaian `next/image` (MarketplaceBanner, EcosystemSlider, PropertyCard) sudah memakai `sizes`; PropertyCard + MarketplaceBanner juga `loading="lazy"`/`priority` + blur placeholder. (`app/properti/[id]/page.tsx` file terlarang — tidak diaudit/diubah.)
- Font: Google Fonts `@import` di `globals.css` sudah `display=swap` — OK. (File terlarang; hanya dicatat.)
- Aset besar di `public/`: total **184K**, tidak ada file >200K — OK.
- File milikku: halaman error memakai `<img>` SVG logo 52px fixed — tidak ada masalah LCP/CLS.
- **Kesimpulan: tidak ada quick-win aman yang tersisa di cakupan slice; temuan dicatat, nol perubahan.**

### Blocker
- Tidak ada blocker untuk cakupan slice ini.
- Ketergantungan luar (dicatat, bukan blockerku): instrumentasi `trackEvent` di halaman (tim halaman); integrasi JSON-LD/breadcrumb per-halaman (tim halaman); `robots: noindex` di `/admin` (SLICE-B); mode maintenance middleware+flag (SLICE-A/B); apply migrasi ke DB (koordinator).

### Aturan git dipatuhi
- `git add` hanya path milik slice (eksplisit, tanpa `-A`).
- Commit prefix `[slice-d]`. Tidak push / merge / rebase / checkout.
- Tidak menyentuh file terlarang Fase 1, docs slice lain, LAUNCH_AUDIT.md, IMPLEMENTATION_PLAN.md, WORK_LOG.md.
