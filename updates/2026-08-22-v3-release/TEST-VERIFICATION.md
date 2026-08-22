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

Smoke test production berjalan dalam read-only mode tetapi **gagal pada pemeriksaan `listings.meta`**: deployment saat ini mengembalikan data listing tanpa metadata pagination yang diwajibkan oleh contract Express/repository terbaru. Ini adalah temuan runtime parity/contract drift, bukan alasan untuk melonggarkan test.

Tindakan yang benar adalah menyamakan response Worker dengan contract terbaru, lalu mengulang smoke test. Jangan menandai production sehat hanya karena `/api/health` merespons sukses.

## Safety Notes

Script production tidak melakukan create listing, OTP request, report, upload, favorite, comment, atau message mutation. Negative mutation checks hanya dijalankan pada local/staging ketika `BASE_URL` tidak memakai HTTPS atau `PRODUCTION_SMOKE` tidak diaktifkan.
