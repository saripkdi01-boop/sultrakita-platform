# DECISIONS — World-Class Execution

Keputusan arsitektur & produk yang diambil selama program (2026-10-01).
Format: konteks → opsi → keputusan → alasan.

## D-01 — Isolasi kerja via git worktree
Konteks: branch Fase 1 (`upgrade/fase-1-ssr-seo-fondasi`) sedang dikerjakan subagent lain dengan uncommitted changes di working tree utama.
Keputusan: kerja di worktree terisolasi `~/workspace/worktrees/sultrakita-worldclass`, branch `upgrade/worldclass-execution` dari `upgrade/fase-0-stabilisasi`.
Alasan: nol risiko mengganggu pekerjaan Fase 1; merge/rebase dilakukan setelah Fase 1 commit.

## D-02 — KEEP Supabase + Server Actions (terkunci dari master prompt)
Konteks: audit Fase 0 memastikan Next.js 15 + Supabase (60+ tabel, 49 migrasi, RLS) bekerja end-to-end.
Keputusan: tidak ada migrasi ke Neon/Drizzle/tRPC.
Alasan: biaya migrasi > manfaat; risiko regresi produksi.

## D-03 — Rate limiting in-memory tanpa dependensi baru
Konteks: tidak ada rate limiting (P0-1); opsi: Upstash Redis (berbayar/butuh kredensial) vs in-memory.
Keputusan: token-bucket in-memory di middleware + per-route.
Alasan: nol biaya, nol kredensial, cukup untuk single-instance; catat keterbatasan multi-instance di KNOWN_LIMITATIONS.

## D-04 — Monetisasi berhenti di sandbox
Konteks: belum ada payment provider terkonfigurasi & belum ada approval untuk uang nyata.
Keputusan: bangun kontrak plans/entitlements/orders/webhook + adapter sandbox deterministik; UI jujur `not_configured`.
Alasan: sesuai aturan otonomi master prompt; aktivasi live butuh keputusan & kredensial Sarip.

## D-05 — Slice paralel dengan file disjoint + kontrak bersama
Konteks: 4 slice paralel di satu worktree/branch.
Keputusan: kepemilikan file eksplisit per slice; kontrak bersama (`logAuditEvent`, `getFlag`, event analytics) didefinisikan di IMPLEMENTATION_PLAN; tiap slice log di `docs/slices/SLICE-<X>-LOG.md`; larangan `git add -A`.
Alasan: hindari konflik merge & race commit tanpa mengorbankan kecepatan.

## D-06 — File Fase 1 terlarang
Konteks: Fase 1 (SSR/SEO) menyentuh robots.ts, sitemap.ts, halaman beranda/groups/jobs/marketplace/properti, dan API feed/interactions/listings/referral/avatar.
Keputusan: slice worldclass tidak menyentuh file-file itu; SEO hanya lewat helper/komponen/dokumen baru.
Alasan: merge bersih setelah Fase 1 commit.

## D-07 — Angka dashboard harus dari query nyata
Konteks: godaan menampilkan metrik placeholder agar dashboard "kelihatan jadi".
Keputusan: semua KPI admin dari query nyata; bila data kosong tampilkan empty state jujur; tidak ada angka fabrikasi.
Alasan: kepercayaan & auditability; sesuai aturan "tanpa klaim palsu".

## D-08 — Rekonsiliasi overlap Fase 1 vs slice worldclass (merge 2026-10-01)
Konteks: Fase 1 (commit 72c5679) membawa `lib/rate-limit.ts` (Upstash + fallback memori, teruji burst→429),
`lib/dal.ts` (requireUser/requireRole/canEditListing), `lib/env.ts` (validasi Zod).
Slice-A/B membangun yang sepadan: `lib/security/rate-limit.ts`, `lib/admin/guards.ts`.
Keputusan:
- Rate limit: KEDUA file dipertahankan — lapisan berbeda. `lib/rate-limit.ts` (Fase 1) kanonis untuk route handler
  (dukungan Upstash lintas instance); `lib/security/rate-limit.ts` (Slice-A) primitif edge-safe untuk middleware.
  Tidak ada konflik API (signature berbeda); double-enforcement berlapis dapat diterima.
- Otorisasi: `lib/dal.ts` kanonis app-wide; `lib/admin/guards.ts` spesialisasi area admin
  (super_admin, suspend check, maskPII, redirect). Keduanya membaca sumber kebenaran yang sama
  (profiles.role + user_roles). Tidak di-refactor ulang untuk menghindari regresi halaman admin yang sudah jadi.
- `lib/env.ts`: kunci billing `SUKI_BILLING_*` ditambahkan sebagai opsional + feature warning jujur.
- `/admin/*`: header `X-Robots-Tag: noindex, nofollow` di next.config.mjs (temuan SEO_CHECKLIST Slice-D).
