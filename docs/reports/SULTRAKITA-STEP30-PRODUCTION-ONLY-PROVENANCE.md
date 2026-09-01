# SultraKita Step 30 — Production-only and Manifest-only Provenance

## Status

**PRODUCTION PROVENANCE = PARTIALLY PROVEN; remaining objects = UNKNOWN.** Analisis ini bersifat read-only. Tidak ada object yang dihapus, diubah, atau direkonsiliasi melalui migration production.

## Production-only Candidates

| Metric | Result |
|---|---:|
| Production public table candidates not present in Step 28 manifest | 36 |
| Candidates with exact repository/source references | 15 |
| Candidates without exact repository/source reference | 21 |
| Automatic classifications as obsolete/drift/delete | 0 |

The generated companion matrix `SULTRAKITA-STEP30-PROVENANCE-MATRIX.csv` contains one row per candidate, including object name, structural metadata available from the read-only catalog, repository references, classification, and confidence. The full JSON analysis is retained as working evidence outside the repository artifact set.

### Classification Outcome

All 36 production-only candidates remain **UNKNOWN** for provenance. Fifteen have repository/source references, but the references are not sufficient to prove that the production object came from the repository migration stream. Twenty-one have no exact repository reference found in the searched source tree, but absence of a reference does not prove that the object is unused, manual, imported, or legacy.

The following domains appear among the candidates and must remain protected from deletion inference: account activity and deletion, ads and postbacks, GameQuest, QuestMind, daily login and player statistics, data exports and usage logs, device sessions, economy and rewards, Telegram/Stars, settings/privacy, security, audit, user blocks, and verification.

## Manifest-only Candidates

| Candidate | Classification | Confidence | Evidence basis |
|---|---|---|---|
| `public.feature_flags` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_campaigns` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_channel_events` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_channels` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_events` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_exports` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.promo_utm_links` | INTENDED | MEDIUM | Present in repository reconstruction and migration/source search. |
| `public.schema_migrations` | INTENDED | HIGH | Explicitly referenced by `scripts/migrate-postgres.js` and Step 28 ledger capture. |

`INTENDED` describes repository-side provenance only. It does not authorize deletion, renaming, or production synchronization.

## Source Search Questions

| Question | Result |
|---|---|
| Referenced by running application code? | Mixed; exact references exist for a subset, but runtime reachability was not asserted. |
| Referenced by tests? | Mixed; references are recorded in the companion matrix where found. |
| Referenced by repository migrations? | Yes for repository-intended objects; production-only candidates are not thereby explained. |
| Referenced by documentation? | Mixed; documentation references are evidence of claims, not production provenance. |
| Referenced only in production? | Possible for 21 candidates with no exact repository reference; remains UNKNOWN. |

## Decision

No candidate meets the evidence threshold for `MATCHED`, `IMPORTED`, `LEGACY`, `MANUAL`, or `RENAME_CANDIDATE` as a definitive provenance classification. The safe result is to preserve all objects and require human-reviewed provenance evidence before any database authority decision or schema change.
