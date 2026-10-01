# SLICE-A LOG — Security & Reliability Hardening

**Slice:** A (Security & reliability hardening)
**Tanggal:** 2026-10-01 ~13:00–13:20 WITA
**Branch:** `upgrade/worldclass-execution` (worktree `~/workspace/worktrees/sultrakita-worldclass`)
**Cakupan audit:** P0-1 (rate limiting), P0-2 (CSRF), P0-3 (audit trail), P1-4 (validasi input API), P1-6 (upload validation), P2-3 (maintenance mode)

## File dibuat/diubah

| # | File | Status |
|---|------|--------|
| 1 | `next-app/lib/security/rate-limit.ts` | baru |
| 2 | `next-app/lib/security/csrf.ts` | baru |
| 3 | `next-app/lib/security/audit.ts` | baru (KONTRAK BERSAMA) |
| 4 | `next-app/lib/security/validation.ts` | baru |
| 5 | `next-app/lib/security/uploads.ts` | baru |
| 6 | `next-app/middleware.ts` | edit (tambah, tidak ubah logika lama) |
| 7 | `next-app/app/api/security/example/route.ts` | baru (contoh pola) |
| 8 | `supabase/migrations/20261001140001_security_audit_events.sql` | baru |
| 9 | `docs/slices/SLICE-A-LOG.md` | baru (file ini) |

## Hasil verifikasi

- `npx tsc --noEmit` (di `next-app/`): **LOLOS** — 0 error. (Sempat 2 error milik sendiri: iterasi `Map` dengan `for...of` tidak diizinkan pada `target: es5`; diperbaiki memakai `Map.forEach`, lalu lolos.)
- `npm run lint` (di `next-app/`): **file SLICE-A bersih (0 error, 0 warning)**. Lint global exit 1 karena error **pre-existing** `react/no-unescaped-entities` di 35 file milik slice lain (mis. `app/admin/*/page.tsx`, `app/beranda/*`, `components/*`) — tidak disentuh, tidak di-refactor.
- Uji runtime `/tmp/rate-test.cjs` (kompilasi `tsc` → node, terhadap kode asli): **SEMUA ASSERT LOLOS**
  - (a) rate limit: 5 request pertama `allowed` (`remaining` 4→0), request ke-6 `allowed:false`, `remaining:0`, `resetMs>0`, `Retry-After>=1`; kunci berbeda tidak terpengaruh; token terisi lagi setelah window (uji window 150 ms); preset `auth/contact/upload/general` = 5/10/20/60 per menit.
  - (b) `verifyCsrfToken`: `true` bila cookie `suki_csrf` == header `x-csrf-token`; `false` bila beda / header hilang / cookie hilang / token kosong.

## Keputusan penting

1. **Rate limiter in-memory token-bucket** (tanpa dependensi): best-effort per instance, cukup untuk mitigasi ringan; didokumentasikan di header file. Cleanup bucket basi otomatis (batas 10.000 bucket).
2. **CSRF double-submit**: cookie `suki_csrf` (httpOnly, diterbitkan `GET /api/csrf`) vs header `x-csrf-token` atau field body `_csrf`. Perbandingan waktu-konstan. `csrfProtected(handler)` untuk route mutasi; webhook dikecualikan otomatis via `isCsrfExemptPath` (`/api/billing/webhook`, `/api/webhooks/*`) karena memakai verifikasi signature.
3. **Kontrak `logAuditEvent` stabil** untuk slice lain: tidak pernah throw — gagal catat → `{ ok:false }`. Tulis via service-role (RLS tanpa policy INSERT publik).
4. **Middleware `/api/*`**: early-return sebelum logika auth halaman (redirect `/login` untuk API tetap dihindari, sesuai komentar lama). Rate limit 60/menit per IP + header `Retry-After` saat 429; `/api/health` selalu lolos. Matcher ditambah `/api/:path*`; pola lama disalin verbatim (kecuali `\.` yang kini benar-benar literal dot — perilaku ekuivalen, sedikit lebih tepat).
5. **Maintenance mode**: baca `site_settings[maintenance_mode]` (value jsonb boolean) via REST, pakai `SUPABASE_SERVICE_ROLE_KEY` bila ada (server-side saja) fallback anon key, cache 60 dtk, **fail-open** (tabel belum ada / RLS menolak / env tak ada → lanjut normal). Saat aktif: halaman → 503 HTML Indonesia + `Retry-After: 120`; API (kecuali `/api/health`) → 503 JSON.
6. **Migrasi `audit_events` mandiri**: tidak bergantung ke fungsi `suki_is_admin()` milik migrasi SLICE-B (nomor urut lebih besar); policy SELECT menulis ulang cek `profiles.role`/`user_roles` secara inline. `actor_id` tanpa FK agar baris audit bertahan bila akun dihapus.
7. **Upload**: ekstensi berbahaya selalu ditolak; wildcard `image/*` tidak mencakup SVG (risiko skrip inline) — SVG hanya bila didaftarkan eksplisit; cek konsistensi ekstensi-vs-MIME untuk deteksi spoofing sederhana.

## Blocker / catatan untuk koordinator

- **Tidak ada blocker.** Semua file milik SLICE-A selesai, terverifikasi, dan di-commit lokal.
- Lint global masih merah karena error pre-existing di file slice lain (35 file) — di luar wewenang SLICE-A.
- Maintenance mode via anon key tidak akan pernah terbaca (RLS `site_settings` hanya untuk admin — milik SLICE-B); middleware memakai service-role key bila tersedia, bila tidak maka fail-open. Perilaku ini disengaja dan aman.
- Selama maintenance aktif, `/admin` ikut 503 (tidak ada bypass admin di middleware) — mematikan flag tetap bisa via Supabase dashboard; penyempurnaan bypass admin diserahkan ke pemilik modul settings (SLICE-B).
- Route contoh `/api/security/example` adalah dokumentasi pola; aman dibiarkan, atau dihapus sebelum launch bila tidak diinginkan.
- **Tidak push** (sesuai aturan); commit lokal siap di-push parent.
