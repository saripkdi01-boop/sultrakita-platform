# OTOMATISASI — SUKI Apps

> **Aturan keras:** semua otomatisasi di bawah ini default **NON-AKTIF** kecuali
> yang dinyatakan AKTIF. Mengaktifkan / mengubah jadwal / mengubah isi cron
> yang sudah live **wajib persetujuan eksplisit pemilik (Sarip) per kejadian**.
> Dokumen ini adalah satu-satunya rujukan status otomatisasi.

Terakhir diperbarui: 2026-10-03 (Program Otonom 4 Jam — Paket D: Otomatisasi).

---

## 1. Inventarisasi cron / job terjadwal

| # | Nama | Pemicu | Status | Keterangan |
|---|------|--------|--------|------------|
| 1 | Saved search alerts | `.github/workflows/saved-search-alerts.yml` — cron `5 * * * *` (per jam, UTC) → `GET /api/cron/saved-search-alerts` | **AKTIF (live)** | Butuh secret `CRON_SECRET` yang sama di Vercel & GitHub Actions. Endpoint: `next-app/app/api/cron/saved-search-alerts/route.ts`. Smoke test live terakhir: sehat. |
| 2 | Uptime check | `.github/workflows/uptime-check.yml` — cron `*/15 * * * *` → probe `/api/health` + `/` | **AKTIF (live)** | Gagal → buat GitHub issue label `uptime` (dedup: tidak duplikat bila masih terbuka). |
| 3 | PostgreSQL backup | `.github/workflows/postgres-backup.yml` — cron `30 2 * * *` (harian 02:30 UTC) | **NON-AKTIF (by design)** | Preflight: jalan hanya bila 5 secret terisi (`DATABASE_URL`, `BACKUP_S3_URI`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`). Bila secret kosong → skip dengan warning, tanpa error. |
| 4 | CI (`SultraKita CI`) | `.github/workflows/ci.yml` — `push` ke `main` & `pull_request` | **SEBAGIAN RUSAK** | Job `verify`: lint, test, security-regression, build, smoke. **Merah** karena secret `SUPABASE_TEST_URL` / `SUPABASE_TEST_ANON_KEY` belum diisi (butuh pemilik). Job `visual-regression` memakai nilai dummy (sengaja). |
| 5 | Staging integration | `.github/workflows/staging-integration.yml` — `workflow_dispatch` saja | **NON-AKTIF (manual)** | Butuh GitHub Environment `staging` + secret `STAGING_DATABASE_URL` (fail-closed bila kosong). |
| 6 | Cron watchdog *(baru, Paket D)* | `.github/workflows/cron-watchdog.yml` — `workflow_dispatch` saja | **NON-AKTIF (skeleton)** | Lihat bagian 2. |

Catatan:
- `vercel.json` hanya berisi `{"version": 2}` — **tidak ada Vercel Cron**.
  Semua cron produksi berjalan via GitHub Actions (paket Vercel Hobby hanya
  mengizinkan cron harian).
- Satu-satunya route cron di kode: `next-app/app/api/cron/saved-search-alerts/route.ts`.

---

## 2. Otomatisasi baru (Paket D — 2026-10-03)

Semuanya **siap pakai, default NON-AKTIF**, idempoten, tanpa secret baru,
tanpa menyentuh production.

### 2a. Cron watchdog — `.github/workflows/cron-watchdog.yml`

Mengawasi workflow terjadwal (`saved-search-alerts`, `uptime-check`):
bila **3 run terakhir gagal beruntun**, membuat GitHub issue berlabel
`cron-watchdog` (dedup otomatis).

- Status: **NON-AKTIF** — hanya `workflow_dispatch`. Blok `schedule` ada di
  file tetapi **dikomentari**.
- Secret: tidak ada yang baru — hanya `GITHUB_TOKEN` bawaan runner.
- Aksi tulis satu-satunya: membuat issue. Tidak me-restart / me-retry apa pun.
- Cara pakai manual: Actions → "Cron watchdog" → Run workflow.
- Cara mengaktifkan (butuh persetujuan pemilik):
  1. Pemilik memberi persetujuan eksplisit (catat tanggal di sini).
  2. Hapus komentar pada blok `schedule:` di file tersebut.
  3. Merge ke `main` (butuh persetujuan merge tersendiri).
- Monitoring: issue berlabel `cron-watchdog` di GitHub; log run di tab Actions.

### 2b. Pemindai secret — `scripts/scan-secrets.sh`

Memindai pola secret yang ter-commit (private key, AWS key, `ghp_`,
`sk_live_`, dsb). Read-only, idempoten.

```bash
./scripts/scan-secrets.sh --staged   # sebelum commit: pindai file yang di-stage
./scripts/scan-secrets.sh --all      # audit penuh repo
./scripts/scan-secrets.sh            # pindai perubahan vs HEAD (default)
```

- Keluar `0` bila bersih, `1` bila ada temuan (nilai tidak dicetak penuh).
- Status: **NON-AKTIF sebagai gate otomatis** — skrip manual. Tidak di-wire ke
  CI agar tidak mengubah perilaku build yang sudah ada.
- Terakhir dijalankan: 2026-10-03 → `./scripts/scan-secrets.sh --all`
  **BERSIH** (0,8 dtk, exit 0). Uji positif/negatif lolos (private key,
  AKIA, AWS secret, `CLIENT_SECRET` terdeteksi; `your-secret-here`,
  `changeme`, `ContohSaja123`, skema zod, password dummy `postgres` CI
  tidak memicu).
- Cara mengaktifkan sebagai pre-commit lokal (opsional, per mesin):
  `cp scripts/scan-secrets.sh .git/hooks/pre-commit` lalu `chmod +x`.
  Tidak butuh persetujuan pemilik (lokal saja, tidak menyentuh repo/CI).

### 2c. Pemeriksa konsistensi cron — `scripts/check-cron-config.js`

Memeriksa silang: route `next-app/app/api/cron/*` ↔ workflow terjadwal ↔
endpoint yang dipanggil. Mendeteksi jadwal yatim / panggilan ke route yang
tidak ada.

```bash
node scripts/check-cron-config.js
```

- Keluar `0` bila konsisten; `1` bila ada ERROR (workflow memanggil route
  yang tidak ada). Peringatan tidak menggagalkan.
- Status: **NON-AKTIF sebagai gate otomatis** — skrip manual/informatif.
- Terakhir dijalankan: 2026-10-03 → **konsisten** (1 route, 3 workflow aktif,
  0 error, 0 peringatan).

---

## 3. Perbaikan kecil (Paket D — tanpa mengubah perilaku production)

1. `next-app/app/api/cron/saved-search-alerts/route.ts` — komentar usang
   "Dijadwalkan di vercel.json" dikoreksi → jadwal sebenarnya di
   `.github/workflows/saved-search-alerts.yml` (GitHub Actions).
2. `package.json` — menghapus script mati `test:supabase-community-rls`
   (target `scripts/test-supabase-community-rls.js` tidak ada di repo;
   tidak direferensikan workflow/CI mana pun).

---

## 4. Cara mengaktifkan otomatisasi non-aktif (prosedur baku)

1. Ajukan ke pemilik: nama otomatisasi + alasan + risiko.
2. Pemilik memberi persetujuan **eksplisit** (tertulis di chat).
3. Lakukan perubahan (hapus komentar schedule / tambah secret / wire ke CI).
4. Update tabel status di dokumen ini (kolom Status + tanggal aktivasi).
5. Merge ke `main` **hanya** atas persetujuan merge tersendiri.
6. Verifikasi satu siklus penuh berjalan, lalu catat di tabel.

Daftar secret yang masih kosong (butuh pemilik bila ingin mengaktifkan):
- `SUPABASE_TEST_URL`, `SUPABASE_TEST_ANON_KEY` (perbaiki CI merah)
- `DATABASE_URL`, `BACKUP_S3_URI`, `AWS_ACCESS_KEY_ID`,
  `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (aktifkan backup PostgreSQL)
- `STAGING_DATABASE_URL` + Environment `staging` (aktifkan staging integration)

## 5. Monitoring

| Sinyal | Cara cek |
|--------|----------|
| Cron saved-search-alerts jalan? | Actions → "Saved search alerts" → run terakhir hijau; atau `curl -I https://sukiapps.web.id/api/cron/saved-search-alerts` → harus `401` tanpa auth (endpoint hidup) |
| Uptime | Actions → "Uptime check"; issue label `uptime` bila ada insiden |
| Backup jalan? | Actions → "PostgreSQL backup" → run `backup` ter-skip = secret belum diisi |
| CI merah? | Actions → "SultraKita CI" pada PR / push ke main |
| Konsistensi cron | `node scripts/check-cron-config.js` (manual) |
| Secret bocor? | `./scripts/scan-secrets.sh --all` (manual, periodik) |

---

## 6. Kandidat otomatisasi yang TIDAK diimplementasikan

| Kandidat | Alasan tidak dibuat |
|----------|---------------------|
| Auto-retry / auto-heal cron yang gagal | Berisiko efek samping di production (notifikasi ganda ke user); butuh keputusan desain + persetujuan pemilik |
| Backup database otomatis aktif | Butuh 5 secret + S3 bucket milik pemilik; preflight sudah ada — aktivasi = keputusan pemilik |
| Laporan dependensi usang otomatis (PR) | Nilai rendah vs noise PR; `npm audit` sudah ada di CI |
| Auto-merge dependabot / PR hijau | Melanggar batas "no merge tanpa persetujuan" |
| Seeding / sinkronisasi data otomatis | Dilarang: no data palsu/demo, no aksi destruktif |
| Notifikasi Telegram/Slack untuk uptime | Butuh token/chat-id baru dari pemilik; pola sudah didokumentasikan di header `uptime-check.yml` — tinggal aktivasi |
