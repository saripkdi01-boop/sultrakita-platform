# Automated Verification — SultraKita v3

## Commands

```bash
npm test
npm run test:security
npm run smoke:api
npm run verify:local
```

Untuk production, gunakan mode read-only:

```bash
BASE_URL='https://sultrakita.aplikasi-cerdasku.workers.dev' \
PRODUCTION_SMOKE=true npm run smoke:api
```

## Coverage

| Script | Scope |
|---|---|
| `npm test` | Existing Node test suite: health, categories, listing validation, locations |
| `npm run test:security` | Local security regression: admin boundary, invalid identifiers, message validation, OTP lockout after five failed attempts, report validation, disclosure checks |
| `npm run smoke:api` | Health, categories, locations, paginated listing contract, invalid ID, invalid listing payload, admin boundary, safe error envelope |
| `PRODUCTION_SMOKE=true` | Same API smoke flow without mutation requests; still fails on contract drift |

## Local Result

`npm run verify:local` lulus: 4 baseline tests, security regression pass, API smoke pass, dan `git diff --check` bersih.

## Production Result

Versi Worker sebelum parity patch gagal pada pemeriksaan `listings.meta`, sehingga terdeteksi contract drift. Worker kemudian diselaraskan untuk mengembalikan metadata pagination, memvalidasi ID listing detail, menyediakan admin boundary response, dan menyembunyikan error internal.

Setelah deploy Worker version `ca17b3e7-cf25-47ab-8bb9-640b5ab007f4`, production-safe smoke test **lulus** untuk health, categories, locations, listing pagination, invalid-ID contract, admin boundary, dan safe error envelope. Test tetap read-only untuk production.

Catatan: hasil ini memverifikasi contract/API surface yang diuji. Full authorization/ownership untuk seluruh mutation endpoint masih merupakan pekerjaan P0 lanjutan dan belum boleh dianggap selesai.

## Safety Notes

Script production tidak melakukan create listing, OTP request, report, upload, favorite, comment, atau message mutation. Negative mutation checks hanya dijalankan pada local/staging ketika `BASE_URL` tidak memakai HTTPS atau `PRODUCTION_SMOKE` tidak diaktifkan.
