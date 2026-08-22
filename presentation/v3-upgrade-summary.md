# SultraKita v3 — Upgrade Summary

## Slide 1 — SultraKita v3
**Dari marketplace lokal menuju social-commerce yang terpercaya**

Ringkasan Master Prompt v3, audit baseline, hardening awal, dan jalur release production.

Visual: `presentation/assets/v3/sultrakita-homepage-baseline.webp`

## Slide 2 — Apa yang Sudah Dimiliki
SultraKita bukan lagi stub awal. Repository saat ini sudah memiliki frontend static, Express API, Cloudflare Worker path, SQLite/sql.js, listing, kategori, filter lokasi, OTP/session, upload gambar, komentar, laporan, messaging/SSE, analytics, admin endpoint, manifest, sitemap, dan robots.

Pesan utama: upgrade berikutnya harus memperkuat fondasi dan parity runtime, bukan rewrite total.

## Slide 3 — Diagnosis Audit
Temuan terpenting berada pada empat lapisan: authorization/ownership belum konsisten; status verifikasi memiliki field legacy dan field baru; persistence/upload lokal belum durable untuk scale-out; dan `server.js` serta `worker.js` berpotensi mengalami feature drift.

Baseline: `npm test` lulus dengan 4 test dan 0 failure.

## Slide 4 — Master Prompt v3
Master Prompt v3 mengubah brief besar menjadi program release bertahap dengan aturan canonical repository, quality gates, migration discipline, runtime compatibility, acceptance criteria, rollback, dan pelaporan per phase.

Prinsip: audit → P0 security/data → runtime/persistence → design system → discovery → seller/listing → social/messaging → performance/SEO/PWA → analytics/AI/monetization readiness.

## Slide 5 — Perbaikan `server.js` yang Sudah Diterapkan
1. Health endpoint tidak lagi mengirim `error.message` internal ketika database gagal.
2. Verifikasi OTP hanya menerima challenge dengan `attempts < 5`.
3. Query listing dan detail memakai `CASE` yang membaca `verification_status = approved` dan tetap kompatibel dengan `is_verified = 1`.

Commit: `ec0236d`.

## Slide 6 — Yang Masih Menjadi Gap P0/P1
Full session authorization dan ownership checks belum selesai. Rate limit OTP per IP/nomor, magic-byte validation upload, cleanup upload gagal, object storage durable, runtime parity Express/Worker, conversation membership, dan regression security tests masih merupakan pekerjaan lanjutan.

Pesan utama: hardening awal tidak boleh dipresentasikan sebagai security completion.

## Slide 7 — Production Runbook
1. Freeze branch dan jalankan baseline.
2. Audit environment dan secret tanpa mencetak nilai.
3. Backup dan uji migration di staging.
4. Jalankan test, syntax check, dan smoke test.
5. Deploy canary/staging.
6. Verifikasi health, API, auth boundary, browser, dan critical journeys.
7. Deploy production, catat SHA, migration, dan rollback.
8. Amati error window dan siapkan rollback.

## Slide 8 — Definition of Done
Release candidate hanya diterima bila security, data migration, marketplace flow, trust, messaging, responsive UX, accessibility, SEO, performance, observability, testing, Git workflow, dan rollback notes telah diverifikasi.

Health hijau saja tidak cukup; critical user journeys harus lulus.

## Slide 9 — Folder Update Repository
Folder baru: `updates/2026-08-22-v3-release/`

Isinya: `README.md`, `PRODUCTION-RUNBOOK.md`, dan `SERVER-CHANGES.md`.

Pola update berikutnya: `updates/YYYY-MM-DD-nama-release/`.

Next recommended update: `p0-auth-ownership`.

## Slide 10 — Roadmap Keputusan
**Sekarang:** review runbook dan baseline.

**Berikutnya:** implementasikan session middleware, ownership matrix, OTP abuse controls, conversation membership, dan tests.

**Setelah P0 stabil:** lanjutkan design system, marketplace discovery, create listing, seller trust, lalu social/messaging.

**Gate production:** tidak ada deploy besar sebelum migration, security, browser QA, dan rollback diverifikasi.

## Slide 11 — Penutup
SultraKita diarahkan menjadi produk startup teknologi serius yang tetap lokal, cepat, ramah mobile, terpercaya, dan maintainable.

> Fokus upgrade: fondasi aman terlebih dahulu, pengalaman marketplace sesudahnya, fitur lanjutan hanya setelah operasional stabil.

Dokumen rujukan: `UPGRADE-MASTER-PROMPT-v3.md`, `AUDIT.md`, `SYSTEM-MAP.md`, dan folder release update.
