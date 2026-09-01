# SultraKita MCP Implementation Plan

## Proposed code change

No implementation is authorized in this documentation stage. The proposed future change is a separately deployable MCP adapter/server that calls existing Express routes or extracted shared service functions. It must not alter migration files, database authority, production storage, or existing security middleware.

## Proposed files

| File/module | Purpose | Status |
|---|---|---|
| `mcp/server.*` | MCP transport, registry, lifecycle | PROPOSED |
| `mcp/tools/read-only.*` | V0.1 tool handlers and schemas | PROPOSED |
| `mcp/adapters/sultrakita-api.*` | allowlisted API/service adapter | PROPOSED |
| `mcp/security/*` | auth, authorization, redaction, limits | PROPOSED |
| `mcp/observability/*` | metadata audit and metrics | PROPOSED |
| `mcp/schemas/*` | versioned input/output contracts | PROPOSED |

Exact language/runtime and placement remain UNKNOWN until deployment topology and MCP transport requirements are approved.

## Why

A separate adapter preserves the existing Node.js/Express authorization boundary and avoids direct unrestricted PostgreSQL access. It also keeps MCP read-only while database authority is BLOCKED and storage authority is UNKNOWN.

## Security impact

Potential impact is high if MCP can bypass membership, session binding, sender identity, admin permissions, rate limits, or redaction. The implementation must deny by default, validate IDs before lookups, use bounded queries through existing services, avoid raw errors, and never receive or emit secrets.

## Test plan

Run schema contract tests, public projection tests, malformed-input tests, unauthorized/outsider-denial tests, rate-limit tests, timeout/upstream failure tests, response-size tests, secret/PII redaction tests, and existing lint/unit/security/build/API smoke checks. Add tests for every tool in the catalog and verify no tool invokes a write route.

## Rollback plan

Keep MCP deployment isolated and disabled by default. Roll back by disabling the MCP service/route and reverting the isolated adapter release; do not modify production schema, migration history, RLS, or storage. Preserve audit logs and test evidence.

## Implementation gates

Do not implement until database/storage dependencies are documented, API projections are reviewed, transport/auth is selected, threat model is approved, and CI can run MCP tests in an isolated environment. This plan is not a production deployment authorization.

## References

[1]: ../../server.js "SultraKita Express service boundary"
[2]: ../../package.json "SultraKita package scripts and dependencies"
[3]: ../../../step24-database-authority-unblock/SULTRAKITA-STEP24-CANONICAL-MIGRATION-STRATEGY.md "Canonical migration safety strategy"
