# SultraKita Reconstructed Schema Manifest

## Status

**NOT GENERATED.** Step 25 CI run `33447712592` proved disposable PostgreSQL reconstruction execution and idempotency, but the existing workflow did not export the reconstructed catalog or `schema_migrations` rows. Step 26 does not invent structural schema evidence.

## Proven reconstruction evidence

- PostgreSQL 16 disposable service.
- Database `sultrakita_test`.
- 22/22 repository migrations applied first run.
- 22/22 migrations skipped second run.
- No production target.

## Required artifact contents

A future disposable-only CI export must include deterministic records for tables, columns, data types, nullability, defaults, primary/foreign/unique/check constraints, indexes, sequences, functions, triggers, RLS flags/policies, views, extensions, `schema_migrations`, migration order, and checksums. Sort collections and normalize definitions before hashing.

## Classification

**FACT:** CI run and idempotency pass. **UNKNOWN:** reconstructed catalog details. **BLOCKED:** repository-vs-production structural comparison and database authority finalization.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform/actions/runs/33447712592 "Disposable CI reconstruction run"
[2]: ../../../step25-ci-reconstruction/SULTRAKITA-STEP25-RECONSTRUCTED-SCHEMA-MANIFEST.md "Step 25 manifest gap"
