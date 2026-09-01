# SultraKita Step 30 — Database Provenance

## Status

**STEP 30 STATUS = STOPPED SAFELY.** Tujuan Step 30 adalah mengurangi ketidakpastian database authority tanpa menyentuh production. Evidence baru memperkaya provenance analysis, tetapi belum cukup untuk memilih satu sumber canonical.

## Verified Baseline

| Item | Value | Classification |
|---|---|---|
| Recovery branch | `recovery/step28` | FACT |
| Latest Step 29 commit | `d45d551` | FACT / historical handoff |
| Step 30 working HEAD | `d45d551` before this documentation commit | FACT |
| Repository migrations | 22 files | FACT |
| Step 28 reconstructed schema | 69 tables | FACT |
| Supabase public catalog | 97 tables | FACT |
| Supabase migration ledger | 30 entries | FACT |
| Supabase project | `ibvcfdfsjpytwpnxgylm` | FACT |
| Supabase status | `ACTIVE_HEALTHY` | FACT |
| Storage | DOWN / UNRESOLVED | DOCUMENTED CLAIM |

## Method

The analysis consumed the Step 28 structural manifest and ledger artifacts, listed repository migration files, queried the Supabase project catalog through read-only project operations, and searched repository source, tests, migrations, documentation, CI, and MCP files for exact object-name references. No application rows, credentials, tokens, or production mutations were used.

## Structural Result

The Step 28 manifest contains 69 tables. The current Supabase catalog returns 97 public tables. Deterministic set comparison produces 36 production-only candidates and 8 manifest-only candidates. The result is evidence of discrepancy, not evidence of corruption, drift, obsolete objects, or deletion candidates.

The production-only search found exact repository references for 15 of 36 candidates. That result must be treated as provenance evidence only: a source reference can be a historical declaration, documentation mention, test fixture, or inactive code path. It does not prove deployment provenance or authority.

All 8 manifest-only candidates were classified as `INTENDED` at the repository reconstruction level because each is present in the structural manifest and tied to the repository/CI stream. This does not authorize deletion from production or repository migrations. `schema_migrations` is explicitly referenced by the migration runner and ledger capture.

## Provenance Classification Rules

| Classification | Meaning used in this report |
|---|---|
| MATCHED | Structural and content evidence connect the object to both streams. Not assigned without checksum/provenance proof. |
| IMPORTED | Production object may originate from an external import; no evidence sufficient to assign this label. |
| LEGACY | Historical or unused object; no deletion inference is allowed. |
| MANUAL | Object may have been created outside repository migrations; not proven. |
| RENAME_CANDIDATE | Name similarity suggests a possible rename; no rename classification assigned without migration/history proof. |
| MISSING_FROM_REPO | Production object has no exact repository counterpart; classified as UNKNOWN until provenance is established. |
| MISSING_FROM_PRODUCTION | Manifest object has no production counterpart; classified as repository-side intended/unknown, not a deletion candidate. |
| UNKNOWN | Evidence insufficient to establish provenance or authority. |

## Decision

**PRODUCTION PROVENANCE = PARTIALLY PROVEN.** The existence, structural metadata, and repository reference status of candidates are evidenced. Their origin, deployment order, ownership, and canonical authority remain unresolved.

**DATABASE AUTHORITY = UNKNOWN / BLOCKED.** The correct next action is a human-reviewed provenance and backup/restore decision, not a schema mutation or migration repair.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform/actions/runs/33472193758 "Step 28 CI artifact evidence"
[2]: https://github.com/saripkdi01-boop/sultrakita-platform/tree/recovery/step28/database/migrations "Repository migration stream"
[3]: ../database/SULTRAKITA-MIGRATION-LEDGER-MAP.md "Historical ledger mapping"
