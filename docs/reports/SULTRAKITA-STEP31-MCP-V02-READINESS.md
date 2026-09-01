# SultraKita Step 31 — MCP V0.2 Readiness Contract

## Boundary

**MCP V0.1 tetap READ ONLY. MCP V0.2 belum diimplementasikan dan belum diotorisasi.** Existing host allowlist, timeout, bounded pagination, safe integer validation, sensitive-field redaction, rate limiting, no direct PostgreSQL access, dan no write tools harus dipertahankan.

## Target Architecture

```text
AI / MCP Client
        ↓
MCP Gateway
        ↓
Tool Authorization
        ↓
Domain Service Layer
        ↓
API Adapter
        ↓
SultraKita API
        ↓
Database / Storage
```

MCP tidak boleh menjadi bypass: tidak boleh ada AI → direct PostgreSQL, AI → direct Supabase admin, AI → direct R2, atau AI → arbitrary HTTP. Semua akses harus melewati controlled domain/API layer.

## Planned V0.2 Safe Operational Reads

| Tool | Contract requirement | Readiness |
|---|---|---|
| `get_listing_safe` | Authorized, bounded, redacted listing detail tanpa counter write | DESIGN ONLY |
| `get_seller` | Ownership/privacy-safe seller summary | DESIGN ONLY |
| `get_order_status` | Scope-limited status read; no payment mutation | DESIGN ONLY |
| `get_notifications` | Session-bound bounded read | DESIGN ONLY |
| `get_dashboard_summary` | Deterministic aggregate with bounded output | DESIGN ONLY |
| `get_storage_status` | Provider-neutral diagnostic metadata only | DESIGN ONLY |
| `get_system_health` | Distinguish configured/reachable/authenticated/operational/degraded/unavailable | DESIGN ONLY |

Each tool must be side-effect-free, authorized, bounded, auditable, deterministic, and redacted. Tool schemas must include timeout behavior, error normalization, correlation ID, and explicit denial behavior.

## Future Mutation Gate

V0.3 mutation remains blocked until database authority is locked, backup and restore are verified, storage is verified, runtime security and audit logging are verified, and authorization is explicitly approved. Future write flow must be `PLAN → VALIDATE → DRY RUN → HUMAN APPROVAL → EXECUTE → VERIFY → AUDIT`.

## Security Contract

The future gateway should carry tool identity, request correlation ID, authorization decision, audit event, dry-run mode, and approval-required mode. Default deny, least privilege, allowlisted upstreams, timeouts, rate limits, redaction, and deterministic responses remain mandatory.

**Decision: MCP V0.2 = READINESS CONTRACT ONLY. No source or tool implementation change is authorized by Step 31.**
