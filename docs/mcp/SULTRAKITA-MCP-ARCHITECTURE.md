# SultraKita MCP Architecture

## Scope and readiness

This proposal defines a **read-only MCP V0.1** over existing SultraKita HTTP/service boundaries. It does not claim production readiness, database authority, or storage authority. Step 21–24 findings remain binding: database authority is **BLOCKED**, storage provider is **UNKNOWN**, and production must remain read-only.

## Logical architecture

```text
MCP Client
   ↓ protocol transport + request context
MCP Server
   ├── tool registry
   ├── resource registry
   ├── prompt registry
   ├── authentication adapter
   ├── authorization/policy guard
   ├── rate limiter
   ├── audit logger (metadata only)
   ├── error/redaction boundary
   └── SultraKita backend adapters
           ↓ existing API/service layer
      Node.js / Express
           ↓
      Supabase PostgreSQL
```

The MCP server should call existing public API/service functions rather than connect directly to PostgreSQL. Direct unrestricted database access is prohibited. A provider-neutral `StorageProvider` interface may be defined later, but no provider implementation or production write tool is part of V0.1.

## Components

| Component | Responsibility | V0.1 posture |
|---|---|---|
| Transport | MCP session and message transport | authenticated, bounded, observable |
| Tools | Curated read-only operations | enabled only after contract tests |
| Resources | Stable public documentation/config references | no secrets or private records |
| Prompts | Safe, bounded task templates | no hidden authorization escalation |
| Auth | Verify caller identity/session | reuse existing auth/session model |
| Authorization | Enforce public/user/admin boundaries | deny by default |
| Audit | Tool name, actor class, request ID, outcome | never payload secrets/PII |
| Rate limit | Per client/tool/identity budget | fail closed |
| Adapter | Calls Express endpoints or shared service functions | no unrestricted SQL |
| Errors | Stable public codes, redacted details | no stack/secret leakage |

## Existing capability map

The source exposes 113 Express routes covering health/config, listings/categories/locations, sellers, conversations/messages/SSE, auth/OTP/Google, cart/orders/offers, donations, analytics, notifications, admin/RBAC, WhatsApp/Telegram, uploads, and external catalogs. Only public, non-mutating routes are candidates for initial tools. Search/list/get operations must preserve existing membership checks, session binding, sender identity, validation, and rate limits.

## Non-goals

V0.1 does not expose admin operations, uploads, storage commit/delete, checkout, donations, webhooks, messaging writes, role changes, settings writes, feature-flag writes, raw SQL, private user data, or service credentials.

## References

[1]: ../../server.js "SultraKita Express API source"
[2]: ../../scripts/migrate-postgres.js "SultraKita database migration runner"
[3]: ../../../step24-database-authority-unblock/SULTRAKITA-STEP24-DATABASE-AUTHORITY-UNBLOCK-PLAN.md "Step 24 database authority unblock plan"
