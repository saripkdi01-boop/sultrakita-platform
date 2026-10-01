# IMPLEMENTATION PLAN — World-Class Execution (branch `upgrade/worldclass-execution`)

Koordinator: subagent otonom. Baseline: `docs/LAUNCH_AUDIT.md` (2026-10-01).
Aturan keras: JANGAN push ke main, JANGAN merge ke main, JANGAN deploy production.
Commit lokal saja; push menunggu PAT sekali pakai dari Sarip.

## Slice eksekusi (paralel, file disjoint)

### SLICE-A — Security & reliability hardening (P0)
Pemilik file:
- `next-app/lib/security/rate-limit.ts` (baru): in-memory token bucket; konfigurasi per-route.
- `next-app/lib/security/csrf.ts` (baru): verifikasi double-submit `suki_csrf` cookie vs header `x-csrf-token`.
- `next-app/lib/security/audit.ts` (baru, KONTRAK BERSAMA): `logAuditEvent(client, {actorId, action, targetType, targetId, reason, metadata})`.
- `next-app/lib/security/validation.ts` (baru): helper zod `parseOr400`.
- `next-app/lib/security/uploads.ts` (baru): validasi MIME/ekstensi/ukuran.
- `next-app/middleware.ts` (edit): terapkan rate limit global ringan + maintenance mode (baca `site_settings` bila ada; gagal-buka = normal).
- `next-app/app/api/security/*` (baru): contoh route mutasi yang menegakkan CSRF+rate limit (referensi).
- `supabase/migrations/20261001140001_security_audit_events.sql` (baru): tabel `audit_events` + RLS (hanya admin baca).
- `docs/slices/SLICE-A-LOG.md` (baru): log kerja slice ini. JANGAN edit docs lain.
Acceptance: `tsc`+`lint` lolos; skrip node membuktikan rate limit menolak setelah N request; CSRF menolak tanpa token; migrasi SQL valid (`psql --dry-run` sintaks via `node --check`? minimal review manual + `pg` parse bila tersedia).

### SLICE-B — Admin control plane (P1)
Pemilik file:
- `next-app/lib/settings/flags.ts` (baru, KONTRAK BERSAMA): `getFlag(key, fallback)` baca tabel `site_settings`.
- `next-app/lib/admin/*` (baru): guard peran `requireRole('super_admin'|'admin'|'moderator'|'support')`, helper PII masking.
- `next-app/app/admin/overview/page.tsx` (baru): KPI jujur (users, listings aktif/pending, laporan terbuka, orders sandbox) + empty states.
- `next-app/app/admin/users/**` (baru): list+search/filter, detail, suspend/restore, ubah role (super_admin saja), notes internal. Wajib pakai `logAuditEvent` dari `@/lib/security/audit`.
- `next-app/app/admin/moderation/**` (baru): antrean `marketplace_reports` (tabel sudah ada), takedown/restore, alasan, riwayat.
- `next-app/app/admin/settings/**` (baru): CRUD `site_settings` (feature flags, maintenance_mode), validasi + audit log.
- `next-app/app/admin/dashboard/page.tsx` (edit): tautkan modul baru; navigasi admin konsisten.
- `supabase/migrations/20261001140002_admin_site_settings.sql` (baru): tabel `site_settings` + RLS.
- `docs/slices/SLICE-B-LOG.md` (baru).
Acceptance: `tsc`+`lint` lolos; halaman render tanpa error (cek via `next build` atau Playwright smoke bila sempat); non-admin mendapat 403/redirect; setiap mutasi menulis audit_events.

### SLICE-C — Monetisasi sandbox (P2, jujur)
Pemilik file:
- `next-app/lib/billing/*` (baru): `plans.ts` (definisi paket), `entitlements.ts` (cek server-side), `sandbox.ts` (adapter sandbox deterministik).
- `next-app/app/api/billing/**` (baru): `checkout` (sandbox), `webhook` (verifikasi signature bila provider dikonfigurasi + idempotency key).
- `next-app/app/admin/billing/**` (baru): daftar plans (CRUD config, bukan hardcode), orders sandbox, status webhook, state jujur `not_configured`.
- `supabase/migrations/20261001140003_billing_sandbox.sql` (baru): `billing_plans`, `entitlements`, `billing_orders`, `webhook_events` + RLS.
- `docs/MONETIZATION_PLAN.md` (baru, satu pemilik).
- `docs/slices/SLICE-C-LOG.md` (baru).
- Boleh append ke `next-app/.env.example` HANYA kunci billing (SUKI_BILLING_*). Jika konflik, catat di log.
Acceptance: `tsc`+`lint` lolos; alur sandbox checkout→webhook→entitlement terverifikasi via skrip; tidak ada klaim pembayaran nyata di UI/copy.

### SLICE-D — Analytics, SEO suplemen, launch docs, performance (P1/P2)
Pemilik file:
- `next-app/lib/analytics/events.ts` (baru, KONTRAK BERSAMA): taksonomi event + tipe payload; `trackEvent` server action.
- `supabase/migrations/20261001140004_analytics_events.sql` (baru): tabel `analytics_events` + RLS.
- `next-app/lib/seo/jsonld.ts` (baru): builder JSON-LD (Product, JobPosting, RealEstateListing, LocalBusiness) dari data nyata.
- `next-app/components/seo/Breadcrumbs.tsx` (baru).
- `next-app/app/not-found.tsx`, `next-app/app/global-error.tsx`, `next-app/app/error.tsx`, `next-app/app/maintenance/page.tsx` (baru).
- `docs/SEO_CHECKLIST.md`, `docs/RELEASE_CHECKLIST.md`, `docs/OPERATIONS_RUNBOOK.md` (baru, satu pemilik).
- Audit performance cepat: perbaiki yang murah & aman (loading="lazy", sizes, font display) — HANYA di file milik slice ini atau komponen baru.
- `docs/slices/SLICE-D-LOG.md` (baru).
Acceptance: `tsc`+`lint` lolos; halaman error render; SEO checklist terisi dengan status jujur.

## Kontrak bersama (jangan diubah sepihak)
1. `logAuditEvent` — milik SLICE-A. Slice lain hanya import.
2. `getFlag` / tabel `site_settings` — milik SLICE-B. Slice lain hanya baca via helper.
3. Event analytics — milik SLICE-D. Nama event: `view_listing, search, filter_apply, save_listing, contact_seller, create_listing, publish_listing, signup, login, report_content, checkout_started, purchase_sandbox_completed`.

## FILE TERLARANG (dikerjakan Fase 1 paralel — JANGAN SENTUH)
```
next-app/actions/property-document.ts
next-app/app/admin/affiliate-rewards/page.tsx
next-app/app/ajak-teman/page.tsx
next-app/app/api/feed/route.ts
next-app/app/api/interactions/route.ts
next-app/app/api/listings/route.ts
next-app/app/api/profile/avatar/route.ts
next-app/app/api/referral/route.ts
next-app/app/beranda/**  next-app/app/groups/**  next-app/app/jobs/**
next-app/app/marketplace/**  next-app/app/properti/**
next-app/app/globals.css  next-app/app/robots.ts  next-app/app/sitemap.ts
next-app/components/profile/ProfileHub.tsx  next-app/hooks/useInfiniteFeed.ts
next-app/lib/actions/groups.ts  next-app/lib/actions/marketplace.ts
next-app/lib/actions/property.ts  next-app/lib/feed-interactions.ts
next-app/package.json  next-app/package-lock.json
```

## Aturan git per slice
- Kerja HANYA di `/home/hatch/workspace/worktrees/sultrakita-worldclass`, branch `upgrade/worldclass-execution`.
- `git add` HANYA file milikmu (path eksplisit). DILARANG `git add -A` / `git commit -a`.
- Commit message prefix: `[slice-a]`, `[slice-b]`, `[slice-c]`, `[slice-d]`.
- DILARANG: push, checkout branch lain, stash, merge, rebase, menyentuh working tree lain.
- Verifikasi: `npx tsc --noEmit` dan `npm run lint` di `next-app/` sebelum commit final.
- Catat semua blocker + keputusan di `docs/slices/SLICE-<X>-LOG.md` milikmu.

## Integrasi (koordinator, setelah semua slice)
1. `git log --oneline` review semua commit slice.
2. `npx tsc --noEmit && npm run lint && npm run build` penuh.
3. Playwright smoke (bila node_modules & browser siap).
4. Gabungkan `docs/slices/*-LOG.md` → `docs/WORK_LOG.md`; tulis `DECISIONS.md`, `KNOWN_LIMITATIONS.md`, `LAUNCH_STATUS.md`.
5. Laporan akhir 8 bagian ke parent.
