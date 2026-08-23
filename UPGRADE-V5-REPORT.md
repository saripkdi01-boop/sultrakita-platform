# Laporan Upgrade SultraKita V5

**Status:** selesai dan dipublikasikan ke branch `main`.

**Commit:** `3e5a9a84bd6e30c4ebfcd76ee6211464b35465b1` (`feat: restore V5 degraded API and discovery UX`)

## Ringkasan

Upgrade V5 memulihkan API publik ketika database berada pada kondisi terdegradasi, menyatukan taxonomy kategori dan wilayah antara server dan browser, memperbaiki kontrak health check, meningkatkan alur discovery, menambahkan progressive web app shell offline, serta menyelaraskan smoke test dengan runtime Postgres-only.

## Perubahan implementasi

| Area | Hasil |
|---|---|
| Health API | `/api/health` selalu mengembalikan HTTP 200 dengan `api`, `db`, `storage`, `build`, dan timestamp. Kondisi database tetap dilaporkan jujur sebagai `up` atau `down`. |
| Degraded mode | Middleware autentikasi dan rate limit tidak menjatuhkan seluruh API ketika Postgres tidak tersedia. Endpoint publik kategori, wilayah, dan listing mengembalikan fallback atau empty state yang diberi metadata. |
| Taxonomy | `shared/taxonomy.js` menjadi sumber taxonomy server; `public/taxonomy.js` menjadi fallback browser. Wilayah kini memiliki struktur provinsi → kabupaten/kota → kecamatan untuk pilihan listing. |
| Discovery | Filter dapat disinkronkan ke URL, infinite scroll ditambahkan dengan IntersectionObserver, dan error feed eksternal tidak lagi ditelan tanpa logging. |
| PWA | Manifest dipasang di homepage dan `public/sw.js` menyediakan offline shell cache-first tanpa menyimpan transaksi atau upload pengguna. |
| Quality gate | Lint menolak empty catch block; assertion test dan smoke API diperbarui mengikuti kontrak health V5. Skrip Worker dan patch sekali-pakai yang obsolete dibersihkan dari runtime/CI surface. |

## Bukti validasi

Validasi lokal berhasil untuk `node --check` backend/frontend/service worker, `npm run lint`, `npm run build`, `git diff --check`, dan smoke request tanpa `DATABASE_URL`:

| Endpoint | Kondisi tanpa DB | Hasil |
|---|---:|---|
| `/api/health` | degraded | HTTP 200 |
| `/api/categories` | fallback | HTTP 200 |
| `/api/locations` | static taxonomy | HTTP 200 |
| `/api/listings` | empty degraded state | HTTP 200 |

`npm test` selesai tanpa kegagalan; enam integration test dilewati secara eksplisit ketika `DATABASE_URL` tidak tersedia. CI dengan PostgreSQL akan menjalankan test tersebut setelah migration.

Deployment production Vercel untuk commit V5 berstatus `READY`, menggunakan alias `https://sultrakita-platform.vercel.app`. Smoke test production menghasilkan `/api/health` HTTP 200 dengan `api=up`, `db=up`, dan build SHA `3e5a9a84bd6e30c4ebfcd76ee6211464b35465b1`. Endpoint `/api/categories` dan `/api/locations` juga mengembalikan HTTP 200; kategori bersumber dari database dan wilayah dari taxonomy statis yang konsisten.

## Batasan dan tindak lanjut

Storage production masih dilaporkan `down` karena variabel `R2_UPLOAD_URL`, `R2_UPLOAD_TOKEN`, dan `R2_PUBLIC_BASE_URL` belum tersedia pada runtime yang diverifikasi. Upload persisten harus diuji setelah object storage dikonfigurasi. Integrasi OTP, WhatsApp, payment gateway, Sentry, IndexNow, dan observability berbayar tetap membutuhkan kredensial/provider resmi; kode tidak mengarang data atau mengaktifkan fallback palsu untuk layanan tersebut.

## Referensi

1. [SultraKita repository](https://github.com/saripkdi01-boop/sultrakita-platform)
2. [Vercel production deployment](https://sultrakita-platform.vercel.app)
3. [V5 specification supplied by user](file:///home/ubuntu/upload/PROMPT-MANUS-SULTRAKITA-V5.md)
