# SultraKita Step 27 — PR #12 MCP Source/Security Review

## Review scope

PR #12 was reviewed source-level on branch `feat/mcp-readonly-v0`. The review covered authentication posture, authorization boundary, API-only access, input schema, pagination, timeout, error normalization, sensitive-field redaction, SSRF/URL handling, upstream response handling, rate limiting, audit strategy, naming, deterministic output, and side effects.

## Findings and remediation

| Area | Finding | Resolution | Status |
|---|---|---|---|
| Authentication | No fake auth; public deployment must remain blocked | Preserved; explicit in docs | PASS as non-production skeleton |
| Authorization | Adapter reuses existing API boundary; no direct SQL | Preserved | PASS |
| API-only | Adapter uses GET only and injected service boundary | Preserved | PASS |
| Input validation | Bounded strings, pages, limits, IDs | Tests cover malformed input | PASS |
| Pagination | Limit capped at 50 | Preserved | PASS |
| Timeout | AbortController default 8 seconds | Preserved | PASS |
| Error handling | Stable redacted error codes | Preserved | PASS |
| Redaction | Recursive sensitive-key filter | Tests cover nested fields | PASS |
| SSRF | Original host validation accepted arbitrary HTTP(S) host | Added allowlist defaulting to `127.0.0.1,localhost`; configurable only through explicit host allowlist | REMEDIATED |
| Rate limiting | No default limiter in original implementation | Added per-tool in-memory limiter, 60 calls/minute default | REMEDIATED |
| Audit | No persistence; metadata callback seam added | No payload/secret logging; production audit integration still required | PARTIAL |
| Side effects | `GET /api/listings/:id` writes view data | Tool intentionally not exposed | PASS |
| Determinism | Fixed tool registry and bounded JSON output | Preserved | PASS |
| Upstream validation | HTTP status and JSON parse boundary | Preserved; schema validation remains future work | PARTIAL |

## Tests

- `node --test test/mcp-readonly.test.js`: **PASS, 7/7**.
- `npm run lint`: **PASS**.
- `git diff --check`: **PASS**.
- Existing `npm test`: previously **PASS, 63 passed, 7 skipped** before this review; targeted tests cover the remediation.
- `npm run test:security`: local environment remains blocked by missing `DATABASE_URL` and OTP provider configuration; fail-closed behavior was not weakened.

## Decision

**PR #12 remains reviewable but not production-ready.** The implementation is a safe local/test skeleton for five read-only tools. Authentication integration, persistent audit logging, schema-level upstream validation, and production deployment controls remain required before release.

## Safety state

Production mutation: NONE. Production deployment: NONE. Database migration: NONE. Supabase/Vercel/Cloudflare/R2/DNS: unchanged. PR #10 and #11: OPEN and unmerged.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform/pull/12 "SultraKita MCP PR #12"
[2]: ../../mcp/readonly-server.js "MCP read-only server implementation"
[3]: ../../test/mcp-readonly.test.js "MCP security and contract tests"
