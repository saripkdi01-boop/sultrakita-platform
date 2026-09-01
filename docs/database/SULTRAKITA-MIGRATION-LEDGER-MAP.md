# SultraKita Migration Ledger Map

## Current evidence

Repository has 22 migration files and source SHA-256 values. CI run `33447712592` applied all 22 in lexical runner order and skipped all 22 on its second run. Supabase has 30 timestamped entries. The CI artifact does not include Supabase ledger rows or checksum correspondence.

| Stream | Evidence | Classification |
|---|---|---|
| Repository 001/002 marketplace | CI applied; names overlap initial/upgrade ledger | LIKELY MATCH |
| Repository 004–011 auth/catalog/link/Telegram | CI applied; no deterministic ledger checksum map | UNKNOWN |
| Repository 012–019 phase4/RBAC/admin/WhatsApp | Names/numbers overlap ledger entries | LIKELY MATCH |
| Repository 020 discovery/gamification | Name overlaps v2 ledger entry | LIKELY MATCH |
| Repository 021 seller verification | Name overlaps seller verification entry | LIKELY MATCH |
| Repository 022 promo hub | CI applied; no deterministic production/ledger match | REPOSITORY ONLY candidate |
| Additional GameQuest/QuestMind/economy ledger entries | Production domains exist, repository mapping absent | POSSIBLE IMPORT / LEDGER ONLY |
| Additional settings/privacy/security/audit entries | Production domains/policies exist, repository mapping absent | POSSIBLE IMPORT / UNKNOWN |

No migration ledger has been changed. Names are not checksum proof. Final authority remains BLOCKED.

## References

[1]: ../../../step25-ci-reconstruction/SULTRAKITA-STEP25-MIGRATION-LEDGER-MAPPING.md "Step 25 ledger mapping"
[2]: ../../../step23-postgres-reconstruction/SULTRAKITA-STEP23-MIGRATION-CHECKSUM-MATRIX.md "Repository source checksums"
