# OPERATIONS RUNBOOK — SukiApps (sukiapps.web.id)

Pemilik: SLICE-D. Terakhir diperbarui: 2026-10-01.
Dokumen hidup: perbarui setiap ada perubahan arsitektur, penyedia layanan,
atau kontak. Bahasa: Indonesia.

Stack: Next.js 15.5.25 (App Router) di Vercel · Supabase (Postgres + Auth +
Storage) · Repo: `saripkdi01-boop/sultrakita-platform`.

---

## 1. Deploy

### 1.1 Alur normal (Vercel, dari branch)
1. Pastikan branch kerja sudah lolos gerbang `docs/RELEASE_CHECKLIST.md`
   (minimal: tsc, lint, build, migrasi).
2. Push branch ke origin (butuh PAT sekali pakai dari Sarip; subagent TIDAK
   memegang token — push dilakukan parent/koordinator).
3. Buat Pull Request ke `main`; minta review Sarip. JANGAN merge sendiri.
4. Setelah merge ke `main`, Vercel otomatis deploy production
   (project `sultrakita-platform`; domain: sukiapps.web.id,
   www.sukiapps.web.id, sultrakita-platform.vercel.app).
5. Verifikasi pasca-deploy (±10 menit):
   - `https://sukiapps.web.id/api/health` → `ok: true`, `db: up`.
   - Buka beranda + satu halaman tiap modul (marketplace, properti, jobs, groups).
   - Cek halaman 404 (URL ngawur) tampil ber-branding.

### 1.2 Preview deploy
Setiap push branch non-main menghasilkan Preview Deployment Vercel
dengan URL unik — pakai untuk QA sebelum merge. Jangan bagikan URL preview
ke publik sebagai "rilis".

### 1.3 Environment variables (nama saja — TANPA nilai)
Kelola di Vercel Dashboard → Project → Settings → Environment Variables.
Jangan commit nilai ke repo.

| Nama | Wajib | Kegunaan |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Ya | Canonical URL (`https://sukiapps.web.id`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon key (RLS berlaku) |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya (server) | Hanya di server; JANGAN expose ke klien |
| `R2_ENDPOINT` / `R2_ACCOUNT_ID` | Opsional | Storage R2 (cek `/api/health`) |
| `R2_BUCKET` / `R2_BUCKET_NAME` | Opsional | Nama bucket R2 |
| `R2_ACCESS_KEY_ID` | Opsional | Kredensial R2 |
| `R2_SECRET_ACCESS_KEY` | Opsional | Kredensial R2 (secret) |
| `R2_REGION` | Opsional | Default `auto` |
| `SUKI_BILLING_*` | Bila dipakai | Kunci billing sandbox (milik SLICE-C; sandbox saja) |

Rotasi: bila ada kredensial bocor, rotasi di penyedia → update di Vercel →
redeploy. Catat insiden (bagian 5).

---

## 2. Rollback

### 2.1 Rollback aplikasi (Vercel)
1. Vercel Dashboard → Deployments → pilih deployment terakhir yang sehat
   (status READY sebelum rilis bermasalah).
2. ⋯ → **Promote to Production** (instant rollback; tanpa redeploy).
3. Verifikasi `/api/health` + halaman utama.

### 2.2 Rollback via git (bila perlu)
1. `git revert <merge-commit-rilis>` di branch baru → PR → review → merge.
   Pilih `revert`, BUKAN `reset --hard` pada `main` yang sudah shared.
2. Vercel deploy otomatis dari `main` hasil revert.

### 2.3 Rollback migrasi database
- Migrasi bersifat additive (`create table if not exists`, `add column if
  exists`); rollback = migrasi korektif baru, bukan drop manual.
- Untuk tabel baru yang belum dipakai (mis. `analytics_events`,
  `audit_events`): aman dibiarkan; hapus hanya bila disepakati via migrasi
  baru + review.
- JANGAN jalankan `DROP TABLE` langsung di production tanpa backup
  (bagian 3) dan persetujuan Sarip.

---

## 3. Backup & restore Supabase

### 3.1 Backup
- **Dashboard (termudah):** Supabase Dashboard → Project → Database →
  Backups. Pastikan *Point-in-Time Recovery (PITR)* aktif untuk production.
  Unduh logical backup sebelum migrasi berisiko.
- **CLI (sebelum perubahan skema besar):**
  ```bash
  supabase db dump --db-url "$SUPABASE_DB_URL" -f backup-YYYYMMDD.sql
  ```
  (`SUPABASE_DB_URL` = connection string Postgres; simpan di vault, bukan repo.)
- Jadwal: andalkan backup otomatis harian Supabase + backup manual sebelum
  rilis yang menyentuh skema.

### 3.2 Restore
1. Jangan restore ke production langsung. Buat project/staging baru dulu.
2. `supabase db reset` / restore dump di staging → verifikasi aplikasi.
3. Untuk production: gunakan PITR Dashboard ke titik waktu sebelum insiden,
   atau hubungi support Supabase bila PITR tidak tersedia di paket berjalan.
4. Setelah restore: jalankan ulang migrasi yang lebih baru dari titik
   restore bila diperlukan; verifikasi `/api/health` (`db: up`).

---

## 4. Health check

- **Endpoint:** `GET /api/health` → JSON `{ ok, data: { api, db, storage, build, checkedAt } }`.
- **Monitoring yang disarankan:** uptime monitor eksternal (mis. cron 1 menit)
  ke `/api/health`; alert bila `ok: false` atau `db: down` 2x berturut-turut.
- **Halaman status manual:** `/maintenance` dipakai saat mode perawatan aktif
  (flag `site_settings.maintenance_mode`, milik SLICE-B; penegakan di
  middleware, milik SLICE-A).

---

## 5. Incident response

### 5.1 Kontak
| Peran | Kontak |
|---|---|
| Penanggung jawab produk | Sarip (pemilik SukiApps) |
| Tim teknis | Koordinator world-class execution + pemilik slice terkait |
| Eskalasi akun/infra | Dashboard Vercel / Supabase (akun pemilik) |

### 5.2 Severity
| Level | Contoh | Target respons |
|---|---|---|
| **SEV-1** | Production down, kebocoran data, pembayaran nyata tak disengaja | Segera; rollback dulu, investigasi kemudian |
| **SEV-2** | Modul utama rusak (checkout sandbox, auth), RLS bocor | < 4 jam |
| **SEV-3** | Bug non-kritis, degradasi parsial | < 2 hari kerja |

### 5.3 Langkah baku
1. **Kenali:** alert health check / laporan pengguna. Tentukan severity.
2. **Stabilkan:** SEV-1 → rollback Vercel (bagian 2.1) atau aktifkan
   maintenance mode bila perlu. Jangan debug di production.
3. **Komunikasikan:** beri tahu Sarip + catat waktu mulai, gejala, tindakan.
4. **Investigasi:** log Vercel (Deployments → Function Logs), log Supabase
   (Dashboard → Logs), `analytics_events` (pola error), `audit_events`
   (aksi admin terakhir).
5. **Perbaiki:** di branch, bukan di production. Ikuti release checklist.
6. **Pasca-insiden:** tulis 5 baris (apa, dampak, akar masalah, perbaikan,
   pencegahan) di log slice terkait; perbarui runbook bila ada pelajaran.

### 5.4 Larangan saat insiden
- Jangan menonaktifkan RLS untuk "mempercepat perbaikan".
- Jangan menempel kredensial/secret di chat, log, atau issue publik.
- Jangan menjalankan pembayaran nyata untuk "tes" (sandbox saja).

---

## 6. Moderasi konten

Alur (UI admin di `/admin/moderation`, milik SLICE-B):
1. **Laporan masuk:** pengguna memakai fitur lapor (event analytics
   `report_content` tercatat; antrean di tabel `marketplace_reports`).
2. **Triage moderator:** buka antrean → periksa konten + riwayat pelapor.
3. **Tindakan:** takedown / restore / tolak laporan — wajib isi **alasan**.
4. **Audit:** setiap aksi moderasi menulis `audit_events`
   (actor, waktu, target, alasan) via `logAuditEvent` (milik SLICE-A).
5. **Banding:** pengguna menghubungi `/support`; keputusan banding dicatat
   sebagai aksi moderasi baru (bukan edit riwayat).

SLA yang disarankan: laporan SEV-2 (konten berbahaya/ilegal) < 24 jam;
lainnya < 3 hari kerja.

---

## 7. Support tickets

- Kanal pengguna: halaman `/support` (+ `/support/tickets` bila tersedia).
- Modul admin: `/admin/support-tickets` (milik repo; pastikan terhubung di
  `/admin/dashboard`).
- Alur: tiket masuk → kategorikan (teknis, konten, akun, billing-sandbox) →
  balas dari panel admin → tutup dengan ringkasan. Jangan meminta password
  atau OTP kepada pengguna.
- Tiket terkait insiden SEV-1/SEV-2: tautkan ke catatan insiden (bagian 5).

---

## 8. Tugas rutin yang disarankan

| Frekuensi | Tugas |
|---|---|
| Harian | Cek `/api/health`; triage antrean moderasi & tiket support |
| Mingguan | Review `audit_events` (aksi admin aneh); cek error Vercel |
| Bulanan | Review retensi `analytics_events` (>180 hari dihapus); rotasi cek env; uji restore backup di staging |
| Per rilis | Backup manual bila menyentuh skema; isi `docs/RELEASE_CHECKLIST.md` |

---

## 9. Batasan yang diketahui (2026-10-01)
- Pembayaran nyata BELUM ada — billing hanya sandbox (SLICE-C). Jangan
  janjikan checkout berbayar ke pengguna.
- Chat realtime dinonaktifkan (Fase 0) — halaman "segera hadir".
- Rate limiting & CSRF enforcement milik SLICE-A (paralel); runbook ini
  mengasumsikan keduanya aktif sebelum launch.
