# Runtime Evidence — 2026-09-03

## FACT

- Production health endpoint `https://sultrakita-platform.vercel.app/api/health` returned HTTP 200 with `success:true`, `api:"up"`, `db:"up"`, `db_driver:"postgres"`, `storage:"configured"`, and build `5bc154f3ea908de0ec0e749e42036c643cdceb20` at `2026-09-03T12:13:46.958Z`.
- Production homepage `https://sultrakita-platform.vercel.app/` loaded successfully and exposed the marketplace UI without a fatal frontend error in the rendered page.
- Production `GET /api/listings?limit=8` returned HTTP 200 with backend data. Returned records included titles prefixed `DEMO-SEED-2026-09`, `seller_id:null`, placeholder image URLs, and `provenance:"demo_seed_20260902"`.
- The demo-seed records are therefore confirmed as API/database response data, not merely a frontend offline fallback. No deletion or production data mutation was performed.

## INTERPRETATION

- API, PostgreSQL connectivity, and storage configuration are live-verified for the deployed build.
- Marketplace data provenance is explicitly demo seed. Whether these records are acceptable for current production launch is a product/operations decision; cleanup would be destructive and requires approval plus backup/recovery plan.

## LOCAL TEST EVIDENCE

- `npm run lint` PASS.
- `npm test` PASS: 67 passed, 7 skipped, 0 failed.
- `npm run build` PASS.
- `node --test test/mcp-readonly.test.js test/mcp-write.test.js` PASS: 11 passed.
- `npm run test:security` BLOCKED in sandbox because no `DATABASE_URL`/`SUPABASE_DB_URL`; the application correctly refused the database dependency before OTP provider behavior could be exercised.
- `npm run audit:production` completed with HTTP success samples for configured targets; the live endpoint evidence above is the authoritative runtime check.

## PROVENANCE

- Repository: `saripkdi01-boop/sultrakita-platform`
- Branch: `main`
- HEAD: `5bc154f3ea908de0ec0e749e42036c643cdceb20`
- Working tree was clean before this evidence file was added. This evidence file is currently uncommitted and must not be treated as a source change.
