# SultraKita Step 31 — Canonical Architecture Decision Record

## Decision Status

**PROVISIONAL ARCHITECTURE — HUMAN APPROVAL REQUIRED.** Step 31 tidak mengunci production authority karena evidence provenance dan recovery belum memenuhi gate.

## Architecture Boundary

```text
Developer / AI Agent
        ↓
MCP Control Plane (read-only governance and diagnostics)
        ↓
Policy / Tool Authorization Layer
        ↓
Controlled Domain Service / API Adapter
        ↓
SultraKita API
        ├── PostgreSQL
        ├── Provider-neutral Storage
        └── External Providers
```

The repository migration stream is the **reproducible reconstruction source**. The Supabase migration ledger and production catalog are **observed operational evidence**. None is declared canonical production authority yet. Production schema is preserved as current state, not treated as a source to mutate or blindly replicate.

## Architectural Principles

| Principle | Decision |
|---|---|
| Safety | Production mutation is prohibited until authority, provenance, backup, restore, and rollback are approved. |
| Reproducibility | Repository migrations must remain deterministic and disposable-environment testable. |
| Recoverability | Backup artifact and restore drill are hard gates before schema change. |
| Maintainability | Provider-neutral storage and explicit domain/API boundaries are preferred. |
| MCP governance | MCP is a controlled management interface, never a security bypass. |
| Observability | Health states must distinguish configured, reachable, authenticated, operational, degraded, and unavailable. |

## Canonical Lock Criteria

A future canonical lock requires object-level provenance, migration/checksum correspondence, application compatibility, production-only classification, verified backup, disposable restore, rollback test, storage identity, runtime/security evidence, and explicit human approval. Until then, the architecture remains intentionally multi-evidence with explicit boundaries.

## Rejected Shortcuts

Do not select the source with the larger object count. Do not delete production-only objects because they are absent from repository migrations. Do not create manifest-only objects in production. Do not choose Cloudflare R2 solely from historical references. Do not add MCP write tools. Do not alter health semantics without backward-compatibility tests.

## Outcome

**ARCHITECTURE DECISION = PROVISIONAL / HUMAN REVIEW REQUIRED.** The next safe architecture work is evidence completion, not feature expansion.
