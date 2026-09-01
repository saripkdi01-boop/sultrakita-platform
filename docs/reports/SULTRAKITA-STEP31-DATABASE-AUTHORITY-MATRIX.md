# SultraKita Step 31 — Database Authority Matrix

## Current Result

**DATABASE AUTHORITY = UNKNOWN / BLOCKED.** Matrix ini mendukung human decision; bukan approval otomatis.

| Dimension | Option A — Repository migrations | Option B — Supabase ledger | Option C — Production schema + future baseline |
|---|---|---|---|
| Provenance | Strong for 22 repository files; weak against 30 production entries | Strong for existence of 30 ledger entries; weak for source provenance | Strong for current observed state; weak for historical origin |
| Reproducibility | **PROVEN** via PostgreSQL 16 disposable CI | Not proven as independently reconstructible from accessible evidence | Not proven without verified backup/export |
| Recoverability | Partial; reconstructs repository stream only | Unknown; ledger alone is not a backup | Unknown until verified backup/restore exists |
| Migration determinism | **PROVEN**: 22/22 APPLY then 22/22 SKIP | Unknown | Unknown |
| Checksum integrity | **PROVEN** for repository files and disposable ledger | Production checksum correspondence not available | Production object history not available |
| Operational history | Partial Git/CI history | Partial timestamped ledger | Current catalog only |
| Application compatibility | Existing source and tests are aligned to some objects | Additional domains may be active in production | Current application likely depends on subset; runtime parity not proven |
| Rollback capability | Script exists for disposable migration stream | Not established | Not established |
| Security implications | Safe as reconstruction source, not production mutation authority | Direct use could conceal unreviewed history | Treating current schema as canonical without backup/provenance risks unsafe future migrations |
| Disposable reconstruction | **PROVEN** | Not proven | Blocked without backup artifact |
| Future MCP compatibility | Good for deterministic diagnostics | Requires provenance boundary | Requires explicit controlled service boundary |
| Recommendation | **CONDITIONALLY ACCEPTABLE** as reconstruction input only | **CONDITIONALLY ACCEPTABLE** as historical evidence only | **CONDITIONALLY ACCEPTABLE** as current-state protection baseline only |
| Authority lock | Reject automatic lock | Reject automatic lock | Reject automatic lock |

## Candidate Object Counts

| Evidence | Count |
|---|---:|
| Repository migrations | 22 |
| Reconstructed tables | 69 |
| Supabase ledger entries | 30 |
| Production public tables | 97 |
| Production-only candidates | 36 |
| Manifest-only candidates | 8 |

## Recommendation

Maintain an explicit split: the repository stream is the reproducible reconstruction source; Supabase ledger and production catalog are observed historical/current-state evidence; production remains protected as-is until provenance, backup, restore, ownership, and rollback gates are satisfied.

This is **not** a canonical architecture lock. A future lock requires human approval based on stronger evidence. No production migration or schema mutation is authorized by this matrix.
