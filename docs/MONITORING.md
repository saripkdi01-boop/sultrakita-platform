# MONITORING — SukiApps (sukiapps.web.id)

Pemilik: T5 (observability). Terakhir diperbarui: 2026-10-02.
Bahasa: Indonesia. Dokumen hidup — perbarui saat arsitektur/alert berubah.

Stack: Next.js 15.5.25 (App Router) di Vercel · Supabase (Postgres + Auth) ·
Repo: `saripkdi01-boop/sultrakita-platform`.

---

## 1. Di mana memantau

| Apa | Di mana | Cara akses |
|---|---|---|
| Error server & API | Vercel Runtime Logs | Vercel Dashboard → Project `sultrakita-platform` → Deployments → (deployment aktif) → Runtime Logs. Filter: `"service":"suki-apps"` atau `"level":"error"` |
| Error client (error boundary) | Vercel Runtime Logs | Sama — tercatat sebagai `ClientErrorBoundary` via `POST /api/log-error` |
| Metrik launch (pendaftar, listing, DAU, funnel referral, UTM) | `/admin/overview` → seksi "Metrik Launch" | Login sebagai staf (admin/super_admin/moderator/support) |
| Uptime (tiap 15 menit) | GitHub Actions → "Uptime check" | Repo → Actions → workflow "Uptime check"; issue otomatis berlabel `uptime` bila gagal |
| Alert pencarian tersimpan | GitHub Actions → "Saved search alerts" | Cron per jam ke `/api/cron/saved-search-alerts` |
| Aksi admin terakhir | `/admin/overview` → "Aktivitas admin terbaru" | Tabel `audit_events` |
| Log database | Supabase Dashboard → Logs | Akun pemilik Supabase |

Tidak ada APM pihak ketiga (Sentry/Datadog) — dipantau via Vercel + Supabase
bawaan + workflow GitHub Actions. Bila traffic tumbuh, pertimbangkan Sentry
(tier gratis) untuk agregasi error client.

---

## 2. Apa yang di-alert (otomatis)

| Alert | Pemicu | Kanal |
|---|---|---|
| Uptime gagal | `GET /api/health` atau `GET /` bukan 2xx/3xx, atau latency > 10 dtk (cek tiap 15 menit) | GitHub issue otomatis berlabel `uptime` (dedup: tidak dibuat bila sudah ada yang terbuka) |
| Saved search alerts | Cron per jam gagal (non-2xx dari endpoint) | Log run workflow "Saved search alerts" |
| Error 500 aplikasi | Error boundary / `internalError()` | Vercel Runtime Logs (belum ada alert push — cek manual atau tambah notifikasi, lihat bagian 5) |

Menambah kanal notifikasi (Telegram/Slack/PagerDuty): lihat komentar di
`.github/workflows/uptime-check.yml` — tambah step `if: failure()` dengan
secret repo (tanpa hardcode token).

---

## 3. Error tracking — `logError(context, error)`

Helper: `next-app/lib/log-error.ts`.

```ts
import { logError } from '@/lib/log-error';

try {
  // ...
} catch (e) {
  logError({ route: '/api/feed', userId: user?.id, requestId }, e);
  return internalError(request, 'Feed belum dapat dimuat.', e); // cause → otomatis di-log
}
```

Aturan (konsisten dengan audit item 15 — "Log jangan bocor"):
- **BOLEH dicatat:** timestamp, route, requestId, hash user id (sha256, 16 hex —
  bukan id mentah), nama + pesan error (maks 500 char), telemetri aman
  (`extra`: string/number/boolean/null saja).
- **DILARANG dicatat:** input/body request mentah, objek user, email, nomor
  telepon/WhatsApp, alamat persis, token/kredensial/secret, stack trace ke client.
- `logError` tidak pernah throw; output JSON satu baris via `console.error`.
- Respons API ke client tetap generik via `lib/api-error.ts` — helper ini tidak
  mengubah respons.
- Error client: `app/error.tsx` + `app/global-error.tsx` mengirim beacon
  fire-and-forget ke `POST /api/log-error` (rate-limited, payload divalidasi zod,
  tanpa PII) → dicatat server-side via `logError`.

---

## 4. Metrik Launch — sumber data & keterbatasan

Seksi "Metrik Launch" di `/admin/overview` (30 hari terakhir, query server-side
nyata, proteksi `requireRole` tidak dilemahkan):

| Metrik | Sumber | Keterbatasan jujur |
|---|---|---|
| Pendaftar/hari | `profiles.created_at` | — |
| Listing marketplace baru/hari | `listings.created_at` | — |
| Properti baru/hari | `properties.created_at` | — |
| DAU | `analytics_events` (distinct `session_id` per hari) | **Undercount**: tabel hanya terisi dari alur yang memanggil `trackEvent()` server-side (saat ini minim). Bukan pageview penuh. |
| Funnel referral (undangan → pendaftar → terverifikasi) | `referral_account_events` (`link_visit`/`signup`/`qualified` + `source_channel`) | Dibaca via service-role di server (RLS tabel `USING(false)`); hanya setelah guard admin lolos |
| Pendaftar per kanal UTM | `profiles.utm_source` (30 hari) | **Butuh migrasi** `20261002070000_signup_utm_attribution.sql` (file-only, belum dijalankan) + wiring penangkapan UTM saat signup (belum diimplementasikan) |
| CAC per kanal | — | **Belum dapat dihitung**: butuh data biaya iklan per kanal dari luar database. Tabel UTM memberi pembaginya (jumlah pendaftar); lengkapi biaya manual: CAC = biaya ÷ pendaftar |

Semua metrik menampilkan empty state jujur bila data kosong / sumber belum
tersedia — tidak ada angka palsu.

---

## 5. Migrasi yang BUTUH DIJALANKAN ke Supabase

| File | Isi | Status |
|---|---|---|
| `supabase/migrations/20261002070000_signup_utm_attribution.sql` | Kolom `utm_source`/`utm_medium`/`utm_campaign` di `public.profiles` + indeks | ⏳ FILE-ONLY — belum dijalankan |

Cara menjalankan: Supabase Dashboard → SQL Editor → tempel isi file → jalankan →
verifikasi kolom ada. Sampai dijalankan, kartu "Pendaftar per kanal UTM"
menampilkan status "belum tersedia" (bukan angka palsu).

---

## 6. Runbook singkat — "production down"

1. **Kenali (1 menit):** buka https://sukiapps.web.id/api/health — catat field
   `ok`, `db`, `storage`. Cek issue berlabel `uptime` / run workflow terakhir.
2. **Tentukan severity:** SEV-1 (down total / kebocoran data) → langsung ke
   langkah 3. SEV-2/3 → investigasi dulu (langkah 4).
3. **Stabilkan (SEV-1):** Vercel Dashboard → Deployments → pilih deployment
   READY terakhir yang sehat → ⋯ → **Promote to Production** (rollback instan,
   tanpa redeploy). Bila perlu, aktifkan maintenance mode
   (`site_settings.maintenance_mode`).
4. **Investigasi:** Vercel Runtime Logs (filter `"level":"error"`),
   Supabase Dashboard → Logs, `audit_events` (aksi admin terakhir).
5. **Komunikasikan:** beri tahu Sarip + catat waktu mulai, gejala, tindakan di
   issue `uptime`.
6. **Perbaiki:** di branch kerja, bukan di production. Ikuti
   `docs/RELEASE_CHECKLIST.md`; butuh review Sarip sebelum merge ke `main`.
7. **Pasca-insiden:** tulis 5 baris (apa, dampak, akar masalah, perbaikan,
   pencegahan); perbarui runbook ini bila ada pelajaran.

**Larangan saat insiden** (dari OPERATIONS_RUNBOOK.md):
- Jangan menonaktifkan RLS untuk "mempercepat perbaikan".
- Jangan menempel kredensial/secret di chat, log, atau issue publik.
- Jangan menjalankan pembayaran nyata untuk "tes" (sandbox saja).
