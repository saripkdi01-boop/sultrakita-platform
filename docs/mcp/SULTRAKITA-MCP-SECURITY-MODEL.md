# SultraKita MCP Security Model

## Security invariant

```text
MCP request
  → authentication
  → authorization
  → existing SultraKita API/service
  → database
```

The forbidden path is `MCP → direct unrestricted PostgreSQL`. MCP must not become a bypass around conversation membership, session binding, sender identity, malformed-input rejection, admin permissions, or existing rate limits.

## Trust boundaries

| Boundary | Required control | Failure posture |
|---|---|---|
| Client → MCP | authenticated transport, request ID, size/time limits | reject |
| MCP → tool | allowlisted tool and schema validation | deny by default |
| Tool → identity | verify session/token through existing auth adapter | reject unauthenticated |
| Identity → resource | existing public/member/admin policy | deny on ambiguity |
| Adapter → API | allowlisted endpoint, timeout, redaction | fail closed |
| API → DB | existing server connection and query layer | no MCP credentials |
| Logging | metadata-only audit event | never log secrets/PII |

## Data classes

Public listings, categories, public seller projections, and aggregate public statistics may be eligible for V0.1. Session secrets, passwords, OTPs, OAuth exchanges, service-role keys, R2 credentials, private addresses, private messages, IP/user-agent data, admin/security metadata, unpublished content, and raw database rows are prohibited.

## Authentication and authorization

The MCP server should accept a narrowly scoped client credential and exchange/validate it through an existing authentication boundary. It must preserve the distinction between anonymous public access, authenticated user access, seller access, and admin access. Tool authorization is independent of model intent; a prompt cannot grant permission. Admin tools are excluded from V0.1.

Conversation tools require validated conversation IDs before membership lookup, then session binding and sender identity checks. This explicitly preserves the security properties verified for PR #10 and #11.

## Abuse controls

Apply per-client, per-identity, and per-tool rate limits; bounded pagination; query length limits; timeouts; concurrency caps; circuit breakers for upstream failures; and response-size limits. Audit tool name, actor class, request ID, status, latency, and policy decision, but not raw payloads or credentials.

## Secrets and provider neutrality

Never expose password, session secret, private token, Supabase service-role key, R2 credentials, database URL, or storage signing material. Storage remains provider-neutral because canonical provider is UNKNOWN. No upload, commit, delete, storage presign, webhook, or write tool belongs in V0.1.

## Verification requirements

Before implementation: threat model, contract tests, authorization matrix, malformed-input tests, outsider-denial tests, rate-limit tests, redaction tests, dependency failure tests, and security regression integration with existing CI. Production readiness is not claimed.

## References

[1]: ../../server.js "SultraKita Express API security and authorization implementation"
[2]: ../../../step23-postgres-reconstruction/SULTRAKITA-STEP23-DATABASE-AUTHORITY-DECISION.md "Step 23 database authority decision"
[3]: ../../../step20-blueprint/SULTRAKITA-STEP20-SECURITY-REMEDIATION-PLAN.md "SultraKita security remediation plan"
