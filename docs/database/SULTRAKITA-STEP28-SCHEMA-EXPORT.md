# SultraKita Step 28 — Disposable Schema Export

## Objective

Generate a machine-comparable structural schema manifest from repository migrations against a disposable PostgreSQL 16 service. Production Supabase is never a migration target and is not referenced by the workflow.

## Implementation

Added `.github/workflows/schema-export.yml` with a separate `schema-export` job triggered by pull request or manual dispatch. It provisions `postgres:16`, database `sultrakita_test`, user `postgres`, localhost port 5432, and a `pg_isready` health check. The job runs the existing migration runner twice, exports first and second manifests, compares them byte-for-byte, checks 22 APPLY and 22 SKIP lines, validates 22 unique ledger rows with SHA-256 checksums, and uploads a 14-day artifact.

Added `scripts/export-schema-manifest.js`. It refuses to run unless `DATABASE_SSL=false`, `DATABASE_URL` exists, host is `localhost`, `127.0.0.1`, or `::1`, port is 5432, and database is exactly `sultrakita_test`. It uses catalog SELECT queries only and writes structural metadata: tables/owners, columns, primary and foreign keys, unique/check constraints, indexes, sequences, functions, triggers, RLS, policies, views, extensions, and `schema_migrations`. No application rows, secrets, credentials, tokens, or environment variables are exported.

## Determinism

Manifest arrays are sorted by stable schema/object keys and serialized as canonical JSON. The workflow exports first and second manifests and runs `cmp` on both JSON and SHA-256 files. Any difference fails the job.

## Safety

The workflow has read-only repository permissions, no production secrets, no deployment steps, no Supabase target, and hard-coded disposable target validation. It cannot use a production host through the export script. No MCP expansion is included.

## Current result

The workflow and script are prepared and statically validated. They have not yet produced a real artifact in this sandbox because no local PostgreSQL service is available. Completion requires the CI job to run successfully and upload `step28-disposable-schema`.

## References

[1]: ../../.github/workflows/schema-export.yml "Disposable schema export workflow"
[2]: ../../scripts/export-schema-manifest.js "Disposable structural manifest generator"
[3]: ../../../step25-ci-reconstruction/SULTRAKITA-STEP25-CI-RECONSTRUCTION.md "Step 25 CI reconstruction evidence"
