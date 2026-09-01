# SultraKita Production Schema Comparison

## Three-state comparison

| Object class | Repository/CI reconstruction | Supabase production | Current classification |
|---|---|---|---|
| Tables | 22 migrations applied; structural export absent | 97 public tables | PARTIAL / UNKNOWN |
| Columns/types/defaults | Not exported | Read-only catalog observed | UNKNOWN |
| Keys/constraints/indexes | Not exported | Read-only catalog observed | UNKNOWN |
| Sequences | Not exported | 48 public sequences | UNKNOWN |
| Functions | Not exported | 13 public functions | UNKNOWN |
| Triggers | Not exported | 2 non-internal triggers | UNKNOWN |
| RLS/policies | Not exported | 97/97 RLS enabled; 36 policies | UNKNOWN |
| Views | Not exported | No public views observed | UNKNOWN |
| Extensions | Not exported | Installed extensions include `pgcrypto`, `uuid-ossp` | UNKNOWN |

## Table-level evidence

Repository static declarations contain 68 unique table candidates; production contains 97. Repository-only candidates include `feature_flags` and six `promo_*` names. There are 43 production-only candidates from privacy/settings/activity, security, GameQuest, QuestMind, rewards/economy, Telegram/Stars, and verification domains. These are not classified as obsolete or drift.

## Result

**Comparison = INCOMPLETE.** CI proves the repository migrations can execute and re-run idempotently in a disposable database, but the missing structural export prevents objective parity comparison. Production remains unchanged and was used only as previously captured/read-only catalog evidence.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform/actions/runs/33447712592 "CI reconstruction evidence"
[2]: ../../../step21-database-authority/SULTRAKITA-STEP21-SCHEMA-DIFF.md "Read-only production schema evidence"
