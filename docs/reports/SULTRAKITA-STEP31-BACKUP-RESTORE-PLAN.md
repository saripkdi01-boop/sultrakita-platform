# SultraKita Step 31 — Backup and Restore Completion Plan

## Current Status

**BACKUP = PARTIALLY PROVEN. RESTORE = BLOCKED. G-15 = BLOCKED.** Workflow dan script existing membuktikan mekanisme yang direncanakan, bukan keberadaan backup artifact yang tervalidasi.

## Safe Disposable Drill

Drill hanya boleh menggunakan verified backup artifact pada target PostgreSQL disposable. Production URL, production Supabase credentials, production storage, dan production database tidak boleh digunakan.

```text
Verified backup artifact + checksum
        ↓
Disposable PostgreSQL
        ↓
Checksum verification
        ↓
Restore with explicit target guard
        ↓
Schema manifest
        ↓
Structural checksum comparison
        ↓
Application compatibility checks
        ↓
Read-only validation
        ↓
Rollback/recovery record
```

## Acceptance Criteria

| Criterion | Required evidence | Current status |
|---|---|---|
| `BACKUP_VALID` | Artifact exists, custom-format header valid, sidecar SHA-256 matches | BLOCKED — artifact not available |
| `RESTORE_VALID` | `pg_restore` succeeds on isolated target | BLOCKED |
| `SCHEMA_VALID` | Tables, keys, constraints, indexes, functions, triggers, RLS load and compare | BLOCKED |
| `DATA_INTEGRITY_VALID` | Safe row-count/integrity checks with sensitive data minimization | BLOCKED |
| `APPLICATION_COMPATIBLE` | Read-only API smoke and migration/idempotency checks against disposable target | BLOCKED |
| `ROLLBACK_SAFE` | Recovery/rollback procedure tested and recorded | BLOCKED |

## Existing Script Safety Notes

The backup script requires `DATABASE_URL` and, in CI, `BACKUP_S3_URI` plus AWS credentials. The restore script requires an explicit `CONFIRM_RESTORE=YES`, validates the checksum sidecar, and invokes a potentially destructive restore against its target. It was not executed in Step 31 because no verified artifact and no approved disposable target were supplied.

## Required Human Inputs

A human must provide or approve the verified backup artifact, isolated target, retention/storage evidence, operator and timestamp recording, data exposure limits, and rollback acceptance criteria. Only after those are available may an isolated drill be executed.

**NEXT SAFE ACTION = obtain and review a verified backup artifact; do not create or modify production backup configuration.**
