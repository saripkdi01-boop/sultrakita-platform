# SultraKita v3 — Production Execution and Verification Runbook

## Prinsip Release

Gunakan **staged release**, bukan perubahan langsung tanpa checkpoint. Jalankan semua perintah dari clone repository canonical. Nilai secret tidak boleh ditulis di shell history, commit, log, screenshot, atau chat. Untuk deployment Cloudflare, gunakan secret manager/Wrangler dan lakukan rotasi jika ada indikasi token pernah terekspos.

Runbook ini mengasumsikan deployment target adalah Cloudflare Worker dengan konfigurasi repository yang tersedia. Jika target sebenarnya Vercel/Express, gunakan adapter yang sesuai dan jangan mencampur prosedur runtime.

## Tahap 1 — Freeze dan Baseline

```bash
git fetch origin
git status --short --branch
git log -5 --oneline
npm ci --no-audit --no-fund
npm test
git diff --check
```

Expected result: working tree dipahami, branch release berasal dari commit yang ditinjau, seluruh test baseline lulus, dan tidak ada whitespace error. Buat branch release hanya setelah baseline bersih.

```bash
git switch -c release/sultrakita-v3-YYYYMMDD
```

## Tahap 2 — Konfigurasi Aman

Buat daftar environment variable yang diperlukan dari `.env.example`, `wrangler.toml`, dan `wrangler-short.toml`. Bedakan tiga kelompok: wajib untuk boot, wajib untuk fitur production, dan optional. Set secret menggunakan mekanisme secret manager; jangan memakai `wrangler.toml` untuk nilai rahasia.

Verifikasi keberadaan nama secret tanpa mencetak nilainya. Pastikan `OTP_DEV_MODE=false` atau tidak diset pada production, simulation webhook tidak aktif, CORS tidak wildcard untuk production, dan URL public object storage hanya menggunakan HTTPS.

## Tahap 3 — Migration dan Backup

Sebelum migration, ekspor atau snapshot database sesuai runtime. Catat timestamp, commit SHA, ukuran backup, dan lokasi penyimpanan. Jalankan migration pada staging atau database clone terlebih dahulu. Verifikasi bahwa migration idempotent dengan menjalankannya dua kali dan pastikan row count serta foreign key tetap valid.

Jangan melakukan destructive migration dalam release yang sama dengan redesign UI. Jika perubahan schema diperlukan, siapkan rollback note yang menjelaskan apakah rollback berupa down migration, restore snapshot, atau forward-fix.

## Tahap 4 — Pre-deployment Verification

```bash
npm test
node --check server.js
node --check worker.js
git diff --check
```

Smoke-test minimal secara lokal atau staging:

```bash
npm start
curl -fsS http://localhost:3000/api/health
curl -fsS 'http://localhost:3000/api/categories'
curl -fsS 'http://localhost:3000/api/locations'
curl -fsS 'http://localhost:3000/api/listings?limit=3'
```

Uji juga error contract: ID listing invalid, payload listing tidak lengkap, endpoint admin tanpa token, OTP code salah, conversation ID tidak valid, dan route yang tidak ditemukan. Expected result adalah HTTP status yang sesuai, envelope `success:false`, pesan aman untuk user, dan tanpa stack trace.

## Tahap 5 — Deploy Canary/Staging

Deploy ke environment non-production terlebih dahulu. Setelah deployment, jalankan health check dan smoke test memakai base URL staging. Periksa log runtime untuk exception, migration failure, CORS error, asset 404, dan storage failure. Uji homepage, search, filter lokasi, detail listing, auth OTP dengan provider test, create listing, upload, favorite, comment, report, conversation membership, dan admin authorization.

## Tahap 6 — Production Deploy

Pastikan commit SHA yang dideploy telah direview dan working tree bersih. Deploy hanya melalui pipeline resmi repository atau perintah deployment yang telah disepakati di konfigurasi project. Jangan menambahkan `--force`, jangan mengganti database binding, dan jangan menghapus binding lama dalam release yang sama.

Catat: commit SHA, waktu deployment, actor, target environment, migration version, perubahan secret name, dan rollback command. Setelah deploy, jangan langsung melakukan perubahan kedua sebelum smoke test production selesai.

## Tahap 7 — Production Smoke Test

```bash
export BASE_URL='https://sultrakita.aplikasi-cerdasku.workers.dev'
curl -fsS "$BASE_URL/api/health"
curl -fsS "$BASE_URL/api/categories"
curl -fsS "$BASE_URL/api/locations"
curl -fsS "$BASE_URL/api/listings?limit=3"
curl -i "$BASE_URL/api/admin/overview"
```

Expected result: health `success:true`; categories dan locations mengembalikan data; listings memiliki `meta.page`, `meta.limit`, `meta.total`, dan `meta.total_pages`; admin overview tanpa credential tidak memberikan data admin dan tidak mengembalikan secret atau stack trace.

Lakukan verifikasi browser pada viewport 390px, 430px, 1440px, dan 1920px. Periksa tidak ada horizontal overflow, asset 404, broken CTA, console error kritis, search yang tidak merespons, atau sticky navigation yang menutup konten.

## Tahap 8 — Observability Window

Amati error rate, latency, Worker exceptions, database errors, upload failures, OTP delivery failures, dan peningkatan 4xx/5xx selama minimal satu release window operasional. Bandingkan dengan baseline sebelum release. Jangan menganggap release berhasil hanya karena `/api/health` hijau.

## Tahap 9 — Rollback

Rollback dipicu bila health gagal, data migration rusak, auth bypass terdeteksi, critical journey gagal, atau error rate meningkat signifikan. Hentikan rollout, simpan log, identifikasi commit aktif, rollback deployment ke versi terakhir yang sehat, dan pulihkan database hanya jika diperlukan setelah memastikan dampak data.

Setelah rollback, jalankan ulang health, listing read, auth boundary, dan browser smoke test. Buat incident note yang berisi timeline, dampak, root cause, tindakan pemulihan, dan pencegahan.

## Release Sign-off

Release hanya boleh ditandatangani setelah owner teknis menyetujui test result, owner data menyetujui migration/backup, owner security menyetujui secret/auth boundary, dan owner produk menyetujui critical user journeys. Fitur yang belum memiliki provider atau policy resmi harus tetap berstatus disabled atau clearly marked as not production-ready.
