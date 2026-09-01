# SultraKita Step 31 — Production Object Provenance Plan

## Safety Boundary

No `DROP`, `ALTER`, `RENAME`, `DELETE`, or production migration is authorized. The 36 production-only candidates and 8 manifest-only candidates remain preserved.

## Evidence Baseline

| Set | Count | Current interpretation |
|---|---:|---|
| Production public tables | 97 | Observed current catalog |
| Reconstructed manifest tables | 69 | Reproducible repository/CI stream |
| Production-only candidates | 36 | Unknown provenance; not deletion candidates |
| Manifest-only candidates | 8 | Repository-side intended/unknown; not creation candidates |
| Exact source references among production-only candidates | 15 | Reference evidence only; not deployment proof |

## Production-only Classification Matrix

The full row-level matrix is maintained in `SULTRAKITA-STEP30-PROVENANCE-MATRIX.csv` and is carried forward as input. Step 31 adds the required decision categories below.

| Category | Assignment rule | Current assignment |
|---|---|---:|
| CONFIRMED_REQUIRED | Runtime, FK/policy/function, and provenance evidence jointly prove active necessity | 0 |
| LIKELY_REQUIRED | Multiple independent signals suggest active use, but provenance incomplete | 0 |
| UNKNOWN | Evidence cannot establish lifecycle, ownership, or current necessity | 36 |
| POSSIBLE_LEGACY | Historical evidence suggests legacy, but no safe retirement proof | 0 |
| POSSIBLE_IMPORTED | External/import history suggested, not proven | 0 |
| POSSIBLE_MANUAL | Manual creation suggested, not proven | 0 |
| POSSIBLE_RENAME | Rename hypothesis only | 0 |
| NOT_USED_BY_CURRENT_CODE | Absence of source reference alone is insufficient; no object assigned here | 0 |

Every candidate is therefore **UNKNOWN — HUMAN REVIEW REQUIRED**. Exact source references found for a subset do not automatically promote them to required or matched, because documentation, tests, inactive code, and source declarations do not establish production execution history.

## Manifest-only Reverse Analysis

| Object | Migration/source origin | Production absence | Future MCP relevance | Safe to create later? |
|---|---|---|---|---|
| `feature_flags` | Repository migration/source reference | Observed absent from production catalog | Possible diagnostics/governance use | Only after authority and approval |
| `promo_campaigns` | Repository migration/source reference | Observed absent | Possible product-domain use | Only after application compatibility review |
| `promo_channel_events` | Repository migration/source reference | Observed absent | Not required for current V0.1 | Not automatically |
| `promo_channels` | Repository migration/source reference | Observed absent | Possible future diagnostics | Not automatically |
| `promo_events` | Repository migration/source reference | Observed absent | Possible future diagnostics | Not automatically |
| `promo_exports` | Repository migration/source reference | Observed absent | Possible governance/audit use | Not automatically |
| `promo_utm_links` | Repository migration/source reference | Observed absent | Possible analytics use | Not automatically |
| `schema_migrations` | Explicit migration runner and Step 28 ledger capture | Reconstruction-side ledger | Useful only for controlled diagnostics | No production creation authorized |

These are provenance classifications, not deployment instructions. No object is created or synchronized during Step 31.

## Required Evidence Per Candidate

Before a future classification can move beyond UNKNOWN, collect structural definition, columns, keys, FKs, indexes, constraints, RLS/policies, triggers, related functions, migration references, source/runtime references, historical documentation, ownership, backup impact, and rollback implications. Human review is required for every proposed lifecycle action.
