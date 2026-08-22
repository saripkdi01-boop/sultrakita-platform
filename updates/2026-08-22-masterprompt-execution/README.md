# Master Prompt Execution — CI and Security Checkpoint

## Tujuan

Checkpoint ini mengeksekusi bagian awal master prompt terbaru: automated dependency/security scanning, matrix test lint/syntax/test verification, dan dokumentasi hasil verifikasi.

## Perubahan

| File | Perubahan |
|---|---|
| `.github/workflows/ci.yml` | CI untuk Node.js 18/20/22, install reproducible, syntax checks, local verification, whitespace check, npm audit, dan CodeQL JavaScript analysis |
| `.github/dependabot.yml` | Dependabot mingguan untuk npm dan GitHub Actions dengan grouping minor/patch |
| `scripts/api-smoke.js` | Smoke test API yang self-contained untuk local/staging dan read-only untuk production |
| `scripts/security-regression.js` | Regression test admin boundary, invalid input, OTP lockout, dan disclosure checks |
| `package.json` | Command `test:security`, `smoke:api`, dan `verify:local` |

## Verifikasi

```bash
npm run verify:local
npm audit --omit=dev --audit-level=moderate
node --check server.js
node --check worker.js
```

Local verification harus lulus sebelum merge. Production-safe smoke test tetap strict terhadap API contract; bila Worker tidak mengembalikan pagination metadata, workflow harus menandai contract drift, bukan melonggarkan assertion.

## Batasan dan tindak lanjut

Workflow ini belum melakukan deploy otomatis ke Cloudflare. Publish action memerlukan keputusan eksplisit mengenai environment, nama Worker, secret GitHub, migration strategy, approval gate, dan rollback. Tahap berikutnya harus memperbaiki parity response Worker/Express, lalu menambahkan deploy-preview atau production publish setelah approval manual.
