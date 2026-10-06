# Laporan Verifikasi SUKI Apps

Tanggal: 2026-10-06
Branch: `kerja/full-build-test-refactor-upgrade`

## Ringkasan hasil

| Area | Hasil |
|---|---|
| Root unit/contract test | **120 pass, 7 skipped, 0 fail** dari 127 |
| Root lint/build check | **Pass** |
| Next typecheck | **Pass** (`tsc --noEmit`) |
| Next production build | **Pass** pada Next 16.3.8 |
| ESLint 9 | **0 error, 146 warning**; warning berasal dari pola legacy dan aturan React Compiler/Next baru |
| Playwright Chromium | **22 pass, 2 skipped, 0 fail** |
| Theme visual suite | **17 pass, 0 fail**; baseline Chromium diperbarui untuk UI saat ini |
| Lighthouse lokal | Selesai pada `/`, `/marketplace`, `/login` |
| Refactor server | `server.js`: 703 baris / 184 KB menjadi 161 baris / 7.9 KB wiring tipis |

## Lighthouse lokal

| Route | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| `/` | 58 | 94 | 100 | 100 |
| `/marketplace` | 43 | 88 | 96 | 92 |
| `/login` | 50 | 96 | 96 | 58 |

Performance masih dipengaruhi mode sandbox dan resource eksternal. Detail JSON tersimpan di `artifacts/lighthouse/`.

## Load/stress test lokal

- Uji awal: 1.000 request konkuren ke `/api/health`, concurrency 100.
- Hasil: seluruh respons `503`, latency sekitar 7 detik per request.
- Diagnosis: endpoint health menunggu koneksi database yang memang belum dikonfigurasi (`db: down`), bukan crash aplikasi.
- Uji beban homepage 100 request / concurrency 20 sempat mendorong CPU Next server sampai sekitar 103% dan dihentikan agar tidak membebani sandbox.
- Setelah beban dihentikan, request tunggal homepage kembali **HTTP 200 dalam 17,6 ms**.

Rekomendasi operasional: pasang timeout/circuit-breaker DB yang lebih pendek pada health check, dan ulangi stress test dengan database staging lokal aktif sebelum menetapkan kapasitas produksi.

## Refactor server.js

Modul yang diekstrak mencakup `lib/` (auth/session/OTP/storage/validation/payment/onboarding dan lainnya) serta `routes/` (auth, listings, admin, conversations, uploads, donations, commerce, public, SEO, onboarding). Kontrak statis diarahkan ke helper `test/helpers/server-source.js`, sehingga tetap memeriksa seluruh sumber produksi setelah monolit dipecah.

Perbandingan HTTP terhadap server asli: **13/13 status dan 7/7 body cocok** pada smoke comparison yang sudah dijalankan.

## Upgrade dependency mayor

- Next.js `15.5.27` → `16.3.8`
- React `18.3.1` → `19.3.0`
- React DOM `18.3.1` → `19.3.0`
- `@types/react`, `@types/react-dom` → `19.3.0`
- `eslint-config-next` → `16.3.8`
- ESLint `8.57.1` → `9.39.5`

Breaking changes yang ditangani:

1. `JSX.Element`/`JSX.IntrinsicElements` pada `Reveal` dimigrasikan ke tipe React 19.
2. Ref nullable pada overlay diselaraskan dengan `RefObject<T | null>` React 19.
3. `next lint` yang dihapus Next 16 diganti ESLint flat config.
4. Dua marker patch literal `+@media` di CSS diperbaiki.
5. Snapshot visual Chromium diperbarui dan diverifikasi ulang.

Warning Next 16 yang tersisa: konvensi `middleware` deprecated dan disarankan migrasi ke `proxy`; tidak memblokir build/E2E dan sengaja tidak diubah otomatis karena menyentuh boundary routing.

## Artefak

- Lighthouse JSON: `artifacts/lighthouse/`
- Load test awal: `artifacts/load-test/health-1000.json`
- Playwright report: `next-app/playwright-report/`
