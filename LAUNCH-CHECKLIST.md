# LAUNCH CHECKLIST — SUKI Apps siap launching

**Branch:** `release/launch-ready` (base `origin/main` @ `775acbb`)
**Disusun:** 2026-10-02 (assembly T7 program 7-jam)
**Status:** branch terverifikasi lokal — **BELUM merge ke main, BELUM deploy production** (menunggu go/no-go owner)

> Setiap item di bawah mencantumkan BUKTI, bukan klaim. Item bertanda ⏳ butuh tindakan owner/parent sebelum/saat launch. Checklist lama (era SultraKita) digantikan dokumen ini; poin yang masih relevan (backup drill, Search Console, onboarding 50 listing nyata) dipertahankan di §7.

---

## 1. Verifikasi build & kualitas (branch release/launch-ready)

| Item | Status | Bukti |
|---|---|---|
| `npx tsc --noEmit` | ✅ lolos | 0 error (worktree assembly, pasca-merge 9 branch) |
| `npm run lint` (next-app) | ✅ lolos | exit 0, tanpa error (hanya warning `<img>` pre-existing di file lama) |
| `npm run build` (next-app) | ✅ lolos | exit 0; semua rute baru ter-generate: `/launch`, `/kendari` + 10 slug, `/admin/monitoring`, `/admin/launch`, `/admin/ads`, `/legal/syarat-ketentuan`, `/legal/kebijakan-privasi`, `/bantuan/faq`, `/kontak`, `/api/ads/slot`, `/ads.txt` |
| `npm test` (root) | ⚠️ 75 pass / 4 fail | 4 fail = pre-existing, terverifikasi identik di checkout murni `775acbb` (test legacy era Express: whatsapp-webhook, api, promo-p0-contract, v2-api-contract). 0 regresi dari track launch |
| Tidak ada marker konflik tersisa | ✅ lolos | `grep -rn "<<<<<<< HEAD"` di ts/tsx/mjs/js/json/yml/css/sql → nihil |
| Playwright critical path | ⚠️ belum | belum dijalankan di assembly (butuh browser + DB live); contract test T1 lolos |

## 2. Keamanan — 5 celah kritis audit 20-check DITUTUP (T1)

| Item | Status | Bukti |
|---|---|---|
| Webhook billing fail-closed + anti-replay | ✅ | `app/api/billing/webhook/route.ts`: production + secret kosong → 401 semua; `x-sandbox` hanya non-prod; skema zod wajib `ts` (±5 mnt) + `nonce` unik via `webhook_events` |
| CSRF semua route mutasi | ✅ | `billing/checkout`, `referral`, `profile/avatar` dibungkus `csrfProtected`; semua inline `===` → `verifyCsrfToken` waktu-konstan |
| Audit log benar-benar menulis | ✅ | `getAuditWriterClient()` service-role server-only; gagal → `console.error` keras. ⏳ **Butuh `SUPABASE_SERVICE_ROLE_KEY` di env Vercel production** |
| `visibility_settings` tidak bocor | ✅ | respons saved/feed/comments hanya allowlist `{display_name, username, avatar_url}`; masking server-side |
| HSTS | ✅ | `Strict-Transport-Security: max-age=31536000; includeSubDomains` (tanpa preload) |
| Zod merata | ✅ | interactions, referral, profile/avatar pakai skema + `parseOr400` |
| Security regression CI | ✅ | `scripts/security-regression.js` ditulis ulang target route live next-app; 8 assertion dibuktikan via curl (admin 307, CSRF 403, zod 400, rate-limit 83× 429/100 req, 6/6 headers, error hygiene, fail-loud). ⏳ **CI verify MERAH sampai secrets `SUPABASE_TEST_URL` + `SUPABASE_TEST_ANON_KEY` diisi** (by design) |
| `npm audit` di CI | ✅ | step `npm audit --audit-level=high` di `ci.yml` job verify (run lokal terblokir egress sandbox; jalan di runner GitHub) |
| Preview "Resource provisioning failed" | ℹ️ | root cause SISI PLATFORM Vercel, bukan repo (vercel.json minimal; production sukses dgn config identik). Butuh cek dashboard bila persisten |

## 3. Skema database — rekonsiliasi production vs kode

| Item | Status | Bukti |
|---|---|---|
| `saved_posts` live | ✅ | terverifikasi via REST 2026-10-02 (GATE 1) |
| `comments` rebuild (legacy bigint, 0 baris → uuid) | ⏳ **butuh eksekusi parent** | migrasi `20261002080000_launch_schema_reconciliation.sql` Bagian 1 (guard: ABORT bila tidak kosong). Deviasi sadar: `user_id → public.profiles(id)` agar embed `profiles(...)` di `/api/comments` berfungsi (didokumentasikan di migrasi) |
| `follows` create (PGRST205 di production) | ⏳ **butuh eksekusi parent** | migrasi Bagian 2, definisi persis `20260829100000_social_beta.sql` |
| `20261001210000_saved_posts.sql` jujur | ✅ | Bagian 1 = teraplikasi; Bagian 2/3 SUPERSEDED (dikomen sebagai arsip) |
| `likes`, `posts`, `profiles`, `notifications` | ✅ | probe REST per kolom: cocok dengan kode, tidak diubah |
| Migrasi UTM (`20261002070000`) | ⏳ **butuh eksekusi parent** | kolom utm_source/medium/campaign di profiles (T5) |
| Migrasi house_ads (`20261002081000`) | ⏳ **butuh eksekusi parent** | tabel house_ads + ad_placements (T-ADS); tanpa ini semua placement iklan `off` (aman) |
| Seed feature flag (`20261002082000`) | ⏳ **butuh eksekusi parent** | `facebook_login_enabled=false` di site_settings (T-ADMIN) |
| `scripts/verify-db-schema.js` | ✅ | probe 7 tabel via REST; sintaks OK (belum run end-to-end — butuh env key) |

**Urutan eksekusi (SQL editor dashboard, chunk kecil):** 20261002080000 Bagian 1 → Bagian 2 → 20261002070000 → 20261002081000 → 20261002082000. Lalu verifikasi via `verify-db-schema.js` (semua PASS) atau probe REST manual.

## 4. Fitur launch

| Item | Status | Bukti |
|---|---|---|
| Halaman `/launch` | ✅ | build OK; metadata + 3 JSON-LD; CTA nyata; bazar "segera diumumkan" (tanpa tanggal karangan) |
| SEO lokal 10 halaman Kendari | ✅ | SSG 10/10; data listing nyata dari DB atau empty state jujur (tervalidasi via REST) |
| Sitemap | ✅ | +16 URL (launch, kendari×11, legal×2, faq, kontak) |
| Legal UU PDP | ✅ | `/legal/syarat-ketentuan` (8 pasal, pembayaran SANDBOX tegas), `/legal/kebijakan-privasi` (10 pasal, pihak ketiga jujur dari kode); footer + auth menaut ke sana |
| FAQ & kontak | ✅ | 14 Q&A jujur; hanya kanal terverifikasi (tanpa alamat/telp palsu) |
| Lapor konten → moderasi | ✅ | tombol di marketplace QuickView + detail properti + feed; antrean `marketplace_reports` (belum uji end-to-end — butuh login+DB live) |
| Facebook login disembunyikan | ✅ | tombol FB tidak di-render (default mati); guard anti-"Unsupported provider"; kontrol via `/admin/settings` flag `facebook_login_enabled` (butuh migrasi seed). ⏳ **Tetap mati sampai provider di-enable di dashboard Supabase** |
| Infrastruktur iklan | ✅ | 7 placement IAB terintegrasi; AdSense loader hanya bila env di-set; house ads siap (butuh migrasi); consent default npa=1 |
| Admin penuh (8 seksi) | ✅ | overview (+metrik launch T5), users, moderation, **monitoring** (baru), billing, **ads** (baru), settings (+feature flags), **launch** (baru, baca JSON dinamis). Proteksi `requireRole` utuh; build OK; non-admin → 307 /login (terverifikasi via next start) |
| Monitoring operasional | ✅ | `/admin/monitoring` cek live server-side (health+latensi, DB, storage) berlabel sumber; workflow uptime-check tiap 15 mnt + issue otomatis; `docs/MONITORING.md` + runbook "production down" |
| Error tracking | ✅ | `lib/log-error.ts` (user id di-hash), `/api/log-error`, beacon error boundary |

## 5. Yang BELUM / tidak termasuk rilis ini (jujur)

- **T4 growth hooks** (referral double-sided, share WA/Telegram, onboarding seller) — **tidak dikerjakan**: worker ditolak safety policy; tidak boleh diulang/di-route ulang pada percobaan ini.
- **Skor Lighthouse mobile** — tidak terukur di VM (Chromium headless gagal); halaman baru ringan secara struktural (First Load JS 106–111 kB) tapi angka ≥90 belum terbukti. Jalankan di CI/mesin sehat.
- **DAU undercount** — `analytics_events` minim; bukan pageview penuh.
- **CAC per kanal** — belum dapat dihitung (butuh data biaya iklan eksternal); wiring penangkapan UTM saat signup belum diimplementasikan.
- **Tombol Laporkan end-to-end** — belum diuji dengan sesi login + DB live.
- **4 test fail pre-existing** (`test-whatsapp-webhook.js`, `api.test.js`, `promo-p0-contract.test.js`, `v2-api-contract.test.js`) — identik di checkout murni `775acbb`; test legacy era Express, di luar scope.
- **Restore drill backup** — belum pernah dibuktikan (runbook ada di `docs/OPERATIONS_RUNBOOK.md`, eksekusi belum).
- **Detail badan hukum PT** — belum ada di repo; kebijakan privasi menyebut "SUKI Apps / SULTRAKITA".

## 6. Gerbang sebelum merge ke main (untuk owner)

1. ⏳ Jalankan 5 migrasi ke Supabase (§3) + verifikasi `verify-db-schema.js`
2. ⏳ Tambahkan repo secrets `SUPABASE_TEST_URL` + `SUPABASE_TEST_ANON_KEY` (agar CI verify hijau)
3. ⏳ Pastikan `SUPABASE_SERVICE_ROLE_KEY` ada di env Vercel production (audit log)
4. ⏳ Keputusan: merge `release/launch-ready` → main + deploy production (satu go/no-go)
5. ⏳ Pasca-deploy: verifikasi live (smoke test + production-audit.js), lalu login sebagai admin untuk uji render penuh halaman admin

## 7. Penerimaan pasca-launch (dipertahankan dari checklist lama)

- Daftarkan domain live ke Google Search Console, kirim `/sitemap.xml`, uji URL Inspection, verifikasi canonical + `og:image` absolut.
- Buat/verifikasi Google Business Profile (identitas usaha, jam layanan, area Kendari).
- Onboarding **50 listing awal dari mitra UMKM nyata** di Kendari & sekitar — persetujuan tertulis untuk foto/nama/kontak/lokasi/harga/deskripsi. **Jangan isi DB dengan listing dummy.**
- Pastikan semua secret (payment, OTP, DB URL, storage token) hanya di secret manager Vercel, tidak di kode.
- 24 jam pertama: pantau error log, statistik homepage nyata, webhook billing, antrean moderasi.
