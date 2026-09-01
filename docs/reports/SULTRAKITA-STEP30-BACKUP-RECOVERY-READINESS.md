# SultraKita Step 30 — Backup and Recovery Readiness

## Status

**BACKUP STATUS = PARTIALLY PROVEN.** **RESTORE STATUS = BLOCKED.** Audit hanya membaca workflow, scripts, dokumentasi, dan riwayat GitHub Actions. Tidak ada backup configuration production yang dibuat atau diubah.

## Existing Evidence

| Area | Result | Classification |
|---|---|---|
| Backup workflow exists | `.github/workflows/postgres-backup.yml` | FACT |
| Backup trigger | Scheduled daily workflow plus manual dispatch | FACT |
| Required backup inputs | `DATABASE_URL`, `BACKUP_S3_URI`, AWS credentials, AWS region | FACT |
| Backup format | PostgreSQL custom-format dump plus `.sha256` sidecar | FACT |
| Retention | 30 days in script configuration | FACT |
| Secret preflight | Workflow skips backup when required secrets are absent | FACT |
| Verified backup artifact available | Not found in inspected evidence | UNKNOWN |
| Last verified checksum | Not evidenced | UNKNOWN |
| Restore drill completed | Not evidenced | UNKNOWN |
| Restore integrity validation | Not evidenced | UNKNOWN |
| Rollback test | Not evidenced | UNKNOWN |

The workflow is designed to run `scripts/backup-postgres.sh`, which calls `pg_dump`, writes a custom-format dump, calculates a checksum, optionally uploads both files to an S3-compatible URI, and applies retention. The preflight step requires repository secrets and otherwise emits a warning and skips the backup job.

The restore script requires an explicit `CONFIRM_RESTORE=YES`, verifies the sidecar checksum, and then invokes `pg_restore --clean --if-exists --no-owner`. The script is potentially destructive to its target database, so it was not executed during this read-only Step 30.

## G-15 Assessment

**G-15 = BLOCKED.** A workflow and restore script are implementation evidence, not proof that a usable backup exists or that a restore has been tested. No verified backup artifact, storage location with accessible checksum, restore timestamp, disposable target, integrity result, or rollback result was available in the inspected evidence.

## Safe Restore Design

If a valid backup artifact is later provided and policy permits its use, restore must occur only into disposable PostgreSQL infrastructure with no production credentials. The procedure must verify checksum, load schema and required structural objects, run migration/idempotency checks, perform integrity validation, and record target, operator, timestamp, and outcome. Production restore and production schema mutation remain prohibited.

## Required Evidence Before Unblocking

Provide a verified backup artifact and checksum, documented storage location, last verification timestamp, isolated restore target, successful restore log, schema/object validation, row-count handling decision that avoids unnecessary sensitive data exposure, and rollback/recovery drill evidence.
