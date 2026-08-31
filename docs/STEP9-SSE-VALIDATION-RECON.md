# Step 9 — SSE Validation Reconnaissance

**Mode:** READ-ONLY / NO-CODE-CHANGE  
**Repository:** `saripkdi01-boop/sultrakita-platform`  
**Branch:** `fix/security-conversation-id-validation`  
**PR:** #10, open and not merged  
**Baseline main:** `7923d95943acfe5458833aeb38365cafd1e9fb0a`  
**Current HEAD:** `7fe0e322a1e55fbaf851f22eda3c122c078b248f`

## Executive summary

The SSE conversation endpoint has a real, reproducible identifier-validation inconsistency. HTTP message history and message creation use the Step 6 `validConversationId()` safe-integer contract before membership authorization. SSE still uses legacy `positiveInt()`, which accepts positive JavaScript integers outside the safe range. As a result, anonymous SSE requests for unsafe or extremely large IDs return HTTP 401 after reaching the authentication branch instead of the canonical bounded HTTP 400 input response.

This is not evidence of cross-user access: valid SSE IDs still perform explicit membership authorization before opening the stream. It is an input-validation and authorization-ordering inconsistency that should receive a **separate remediation PR**, not an expansion of Step 6 or PR #10.

## Evidence classification

| Finding | Classification | Evidence |
|---|---|---|
| `conversations.id` is numeric | **FACT** | `database/migrations/001_initial.sql:175-187`, `BIGSERIAL PRIMARY KEY`; `messages.conversation_id` is `BIGINT`. |
| HTTP message route validates safe positive integer before membership | **FACT** | `server.js:76,274`; `requireConversationId` uses `Number.isSafeInteger` and is before `requireConversationMember()`. |
| SSE uses `positiveInt()` | **FACT** | `server.js:275` in the current branch. |
| `positiveInt()` accepts unsafe positive integers | **FACT** | `server.js:76`: `Number.isInteger(Number(value)) && Number(value) > 0`; it does not call `Number.isSafeInteger`. |
| SSE unsafe ID can return 401 anonymous | **FACT** | Disposable PostgreSQL/local HTTP probe: `9007199254740992` and `999999999999999999999999` returned 401. |
| Valid SSE requests perform membership lookup before stream creation | **FACT** | `server.js:275` queries `conversations` with buyer/seller predicates before `next()`; local outsider probe returned 403 and authorized probe reached SSE. |
| Difference is intentional | **UNKNOWN** | No current code or documentation states that SSE should use a different identifier contract. |
| Difference is legacy/bug | **INFERENCE supported by evidence** | Same conversation domain, same BIGINT identifier, same expected bounded input semantics, plus reproducible inconsistent response. |
| Production has the same response | **UNKNOWN** | Production probing was prohibited. |

## Route inventory and flow

### HTTP conversation history

```text
GET /api/conversations/:id/messages
  -> authenticate (global middleware)
  -> requireConversationId
       -> Number.isSafeInteger(Number(id)) && Number(id) > 0
       -> invalid: 400 failure envelope; no membership query
  -> requireConversationMember()
       -> requireOwnership()
       -> anonymous: 401
       -> SELECT buyer_id, seller_id FROM conversations WHERE id = ?
       -> non-member: 403
  -> route handler repeats legacy positiveInt check
  -> SELECT messages by conversation_id
  -> 200 JSON
```

### HTTP message creation

```text
POST /api/conversations/:id/messages
  -> authenticate (global middleware)
  -> requireConversationId
  -> validateConversationMessage
       -> invalid body: 422 before membership lookup
  -> requireConversationMember()
       -> anonymous: 401
       -> membership query and 403 for non-member
  -> route handler
       -> sender_id = Number(req.user.id)
       -> INSERT messages
       -> 201 JSON
```

### SSE stream

```text
GET /api/conversations/:id/stream
  -> authenticate (global middleware)
  -> inline positiveInt()
       -> malformed/negative/fractional/zero: 400 failure envelope
       -> unsafe positive integer: accepted by predicate
  -> if no req.user: 401
  -> SELECT id FROM conversations WHERE id = ? AND (buyer_id = ? OR seller_id = ?)
       -> non-member: 403
       -> member: next()
  -> handler repeats positiveInt()
  -> opens text/event-stream and polls messages every 2 seconds
```

The SSE route has explicit membership lookup, unlike the earlier vulnerable shape described in historical audit material. The remaining issue is that safe-integer validation is not shared with the HTTP message route.

## Canonical identifier contract

| Property | Canonical result |
|---|---|
| Identifier type | Positive numeric database ID; repository schema uses BIGSERIAL/BIGINT. |
| Accepted format | Decimal representation of a positive JavaScript safe integer. UUIDs and arbitrary opaque strings are not evidenced by current architecture. |
| Range | `1` through `Number.MAX_SAFE_INTEGER` under the application boundary; database BIGINT may be wider, but JavaScript route parsing must not use lossy numbers. |
| Malformed/negative/fractional/zero/unsafe | HTTP 400 with `{ success:false, error:... }`. |
| Anonymous valid-format request | HTTP 401. |
| Expired/invalid session | HTTP 401. |
| Valid-format non-member | HTTP 403. |
| Valid member | HTTP 200 for history; SSE connection for stream; HTTP 201 for message creation. |
| Missing route segment | HTTP 404 because the route pattern does not match; no identifier-specific route middleware runs. |
| UUID compatibility | Not supported by current evidence; do not add for compatibility. |

HTTP and SSE should have the same malformed-ID contract because they operate on the same `conversations.id`, use the same session model, and expose the same resource boundary. The current difference is not documented as intentional.

## Disposable reproduction matrix

Environment: local PostgreSQL 16.15 database `sultrakita_test`, repository numeric migrations applied locally, Node 22, `DATABASE_SSL=false`. Fixtures used only local users/conversation/session records: conversation `1`, buyer fixture user `2`, seller fixture user `1`, outsider fixture user `3`. No production user, token, conversation, or database was used.

| Input / scenario | HTTP history | SSE stream | Membership DB lookup expected | Stream created | Classification |
|---|---:|---:|---|---|---|
| valid numeric `1`, anonymous | 401 | 401 | No for anonymous after auth branch; valid ID can reach auth | No | **FACT; expected unauthorized** |
| malformed `not-an-id` | 400 JSON | 400 JSON | No | No | **FACT; consistent** |
| missing ID `/conversations//...` | 404 JSON | 404 JSON | No | No | **FACT; route not matched** |
| negative `-1` | 400 JSON | 400 JSON | No | No | **FACT; consistent** |
| fractional `1.5` | 400 JSON | 400 JSON | No | No | **FACT; consistent** |
| zero `0` | 400 JSON | 400 JSON | No | No | **FACT; consistent** |
| unsafe `9007199254740992` | 400 JSON | **401 JSON anonymous** | HTTP: no; SSE: auth branch before membership | No | **FACT; inconsistency** |
| extremely large numeric string | 400 JSON | **401 JSON anonymous** | HTTP: no; SSE: auth branch before membership | No | **FACT; inconsistency** |
| valid numeric, expired session | 401 | 401 | No membership after failed auth | No | **FACT; expected unauthorized** |
| valid numeric, outsider session | 403 | 403 | Yes, membership query | No | **FACT; expected cross-user denial** |
| valid numeric, authorized session | 200 JSON | 200 SSE, `: connected` observed | Yes, membership query | Yes | **FACT; expected authorized access** |

The authorized SSE curl naturally timed out after receiving the initial `: connected` event because the probe used a bounded two-second timeout; this is expected for a long-lived SSE connection, not a failure.

## Security review

The recommended change must preserve the following properties:

1. Reject malformed, negative, fractional, zero, unsafe, and excessively large IDs before authentication/membership database lookup.
2. Keep session-bound identity from `req.user`; no body-supplied buyer, seller, or sender identity is involved in SSE.
3. Keep the existing buyer/seller membership SQL unchanged.
4. Do not accept UUIDs or add a second identifier model.
5. Return the existing bounded failure envelope without database error details.
6. Open the SSE stream only after membership authorization succeeds.
7. Preserve the existing stream close and polling lifecycle.

## CI and test coverage gap

The current `scripts/security-regression.js` covers SSE cross-user denial at lines 139–142 and HTTP conversation behavior, but it does not currently cover malformed, unsafe, missing, negative, fractional, zero, or authorized SSE connection behavior as a dedicated matrix. The Step 7 static forensic test checks HTTP message-route ordering but not SSE. Therefore current CI would not catch a regression where SSE accepts an unsafe integer, even though the real GitHub CI run for PR #10 passes.

No tests were changed in Step 9. A future separate PR should add focused SSE regression coverage for every row in the matrix, including a bounded assertion that unsafe SSE IDs return 400 before auth/membership lookup.

## Decision

**Decision: B — REMEDIATION REQUIRED.**

The inconsistency is reproducible in disposable infrastructure, tied to a clear code path, and not documented as intentional. It is not a production access bypass demonstrated by current evidence, but it violates the canonical input-validation contract and can cause unsafe numeric values to reach an authorization branch.

## Recommended minimal remediation

In a separate PR, add a shared/route-level SSE validator using the existing `validConversationId` safe-positive-integer semantics before the current authentication and membership checks. The smallest safe implementation is to replace the SSE middleware’s `positiveInt(req.params.id)` predicate with the already defined `validConversationId(req.params.id)` predicate and retain the current 400 failure envelope. Then add SSE-only regression assertions for all malformed/unsafe cases, anonymous/expired/outsider/member outcomes, and initial stream creation.

Do not change the database schema, migrations, session model, membership SQL, SSE polling design, frontend contract, or PR #10 source. Do not refactor unrelated uses of `positiveInt()` in this follow-up.

## Dependencies and rollback

**Dependencies:** PR #10 may remain open and untouched. The separate PR depends on the current `validConversationId` definition remaining available in the same runtime file, and on disposable PostgreSQL fixtures for membership/stream tests. It does not depend on a production migration or Supabase configuration.

**Rollback:** revert the separate validator/test commit. Because the recommended change is route-local and additive to tests, rollback does not require database restoration or migration reversal. Verify the separate PR’s CI and ensure PR #10 is not silently modified.

## Exact next step

Create a separate branch and PR, for example `fix/security-sse-id-validation`, containing only: (1) the SSE safe-integer validator substitution, (2) focused SSE regression tests, and (3) documentation of the reproduced matrix. Run disposable PostgreSQL migrations, exact security suite, unit tests, lint, build, API smoke, and real GitHub CI. Do not merge either PR until review confirms the combined merge strategy.

## Final state verification

```text
repository source=unchanged
working_tree=clean after documentation commit
main=unchanged
production=unchanged
database=unchanged
migration=not executed against production
 deployment=not performed
PR #10=not merged
source-code patch in Step 9=none
```

The only Step 9 output is this reconnaissance report. The report itself should be committed as documentation so the branch returns to a clean state.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform "Canonical SultraKita repository"
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger "Number.isSafeInteger"
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events "Server-sent events"

Primary evidence: `server.js:76,274-278`, `authorization.js:8-25`, `database/migrations/001_initial.sql:175-198`, `scripts/security-regression.js:124-142`, `test/forensic-security-regression.test.js`, commit `483b9d1`, PR #10, and the disposable PostgreSQL reproduction matrix recorded above.
