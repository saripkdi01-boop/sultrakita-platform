# SultraKita Step 28 — CI Change Notes

## Why changed

Step 25 proved that existing CI can run migrations on disposable PostgreSQL but did not retain structural schema or ledger artifacts. A separate workflow is needed so existing CI behavior remains unchanged while Step 28 produces evidence for Step 29.

## What changed

- Added `.github/workflows/schema-export.yml` as an independent pull-request/manual workflow.
- Added `scripts/export-schema-manifest.js` for structural catalog export and SHA-256 manifest hashing.
- Added `docs/database/SULTRAKITA-STEP28-SCHEMA-EXPORT.md`.

No existing `.github/workflows/ci.yml`, migration, server, MCP, or production configuration was changed.

## Why production cannot be targeted

The workflow contains no production credentials and sets `DATABASE_URL` to `postgresql://postgres:postgres@127.0.0.1:5432/sultrakita_test`. A preflight step verifies host, port, database name, and `DATABASE_SSL=false`. The export script independently refuses any target except localhost/loopback PostgreSQL database `sultrakita_test`. Only catalog SELECTs are issued by the export script. There are no deployment or Supabase steps.

## Review status

Workflow has not been dispatched from this sandbox. The script passes Node syntax checks, rejects a production-like host in a guard test, and MCP regression tests remain green. CI execution is required to generate the actual artifact.

## Rollback

Revert the Step 28 workflow/script/docs commits. This does not require production rollback because no production resource is touched.

## References

[1]: ../../.github/workflows/schema-export.yml "Step 28 disposable CI workflow"
[2]: ../../scripts/export-schema-manifest.js "Step 28 target-guarded export script"
