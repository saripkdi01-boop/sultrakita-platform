# Step 6 — Conversation ID Root-Cause Analysis

**Status:** diagnosis completed; minimal remediation authorized by the Step 6 instruction.  
**Baseline:** `main` / `7923d95943acfe5458833aeb38365cafd1e9fb0a`.  
**Working branch:** `fix/security-conversation-id-validation`.  
**Scope:** conversation ID validation only. No migration, schema change, deployment, Vercel/Cloudflare/DNS/configuration change, storage change, Supabase RLS change, or production request was performed.

## Expected contract

Conversation identifiers are canonical positive numeric database identifiers. Evidence:

| Evidence | Finding |
|---|---|
| `database/migrations/001_initial.sql:175-187` | `conversations.id BIGSERIAL PRIMARY KEY`; buyer/seller foreign keys are BIGINT. |
| `database/migrations/001_initial.sql:188-198` | `messages.conversation_id BIGINT NOT NULL` references `conversations(id)` and has a conversation index. |
| `server.js:273-275` | Conversation history, message creation, and SSE routes convert the path ID to `Number(...)` and query by numeric ID. |
| `scripts/security-regression.js:35-37` | Existing security contract explicitly requires a malformed conversation path to return HTTP 400 with the normal failure envelope. |
| `public/app.js` / `public/chat.html` | Frontend callers use conversation IDs returned by the API in URL paths; no UUID generation or string conversation-ID contract is present. |

**Canonical expected behavior:** reject malformed, negative, zero, fractional, unsafe, or otherwise non-positive/non-safe-integer conversation path IDs with a bounded 400 response and no database query. For valid numeric IDs, preserve authentication and membership authorization. A valid but nonexistent ID may return 403/404 according to the existing authorization contract; that is distinct from malformed syntax.

## Actual behavior before patch

Route registration in `server.js:271` applies `requireConversationMember()` before the message-route handler. `authorization.js:19-25` calls `Number(req.params.id)` and returns `null` for malformed/negative IDs. `requireOwnership()` at `authorization.js:8-16` then treats a null owner as an ownership failure. For the anonymous request used by the CI test:

```text
GET /api/conversations/not-an-id/messages
```

the request reaches the membership middleware before the route-level `positiveInt()` guard at `server.js:271` or `server.js:273`. Because `req.user` is absent, `requireOwnership()` returns HTTP 401 immediately. The intended malformed-ID response of HTTP 400 is therefore unreachable for this route chain.

The CI evidence confirms the symptom:

```text
npm run test:security
FAIL: conversation endpoint must reject non-numeric IDs
```

The same run reports 63 ordinary tests passed and the failure occurred in the security regression stage. The exact pre-patch response status/body was not captured by that CI log, but the route ordering and middleware control flow prove why the expected route validator cannot run for an anonymous malformed request.

The SSE route at `server.js:275` currently performs its own `positiveInt()` check before opening the stream, but it does not call `requireConversationMember()` in the shown route implementation. That is a separate authorization risk and is intentionally not folded into this narrowly scoped ID-validation fix; it requires its own evidence-backed issue/fix.

## Root cause

**Code bug: validation is placed at the wrong layer/order for the message route.** The shared conversation-membership middleware validates membership before the route can validate the path identifier. Its malformed-ID branch returns `null`, conflating “invalid identifier/nonexistent conversation” with “not an authorized member.” This causes anonymous malformed IDs to receive 401 instead of the canonical bounded 400 response and makes the route-level 400 guard ineffective for the middleware-protected route.

This is not a stale-test finding. The numeric contract is independently established by BIGSERIAL/BIGINT schema, server numeric parsing, frontend API shape, and the existing test assertion. It is not a contract conflict.

## Impact

| Component | Impact |
|---|---|
| Security regression CI | **Confirmed:** `test:security` fails and blocks later build/API smoke stages. |
| Conversation/message API | Malformed IDs can be classified as authentication/ownership failures instead of input failures. This leaks a coarse authorization state and violates stable validation semantics. |
| Authorization | Valid conversation membership logic must remain unchanged; the patch must not weaken session-bound checks. |
| Database | Current malformed path is converted to `NaN` only inside guarded membership logic; intended fix should reject before any conversation query. No schema impact. |
| Frontend | No expected impact for valid numeric IDs. Malformed client-generated paths receive a stable 400 instead of an auth-dependent response. |
| Message/SSE | Message route needs shared early validation; SSE remains separately gated for membership and should not be silently changed in this issue. |
| Production | No production behavior was probed or changed in this step. Severity is **P1 release-blocking CI**, with security semantics impact. |

## Recommended minimal fix

Introduce bounded, side-effect-free conversation ID and message-payload validators before membership lookup for the protected message route. The ID validator should use explicit `Number.isSafeInteger` plus positive-value semantics (the older `positiveInt` helper does not reject every unsafe integer), return the existing `{ success:false, error:... }` envelope with HTTP 400, and only then invoke payload validation and `requireConversationMember()`. Empty POST bodies should receive the existing HTTP 422 validation response before membership lookup; valid IDs and valid bodies must still pass through session-bound membership authorization. Do not accept UUIDs, numeric strings outside safe integer range, negative values, zero, decimals, or body-supplied identity. Do not alter schema or authorization decisions for valid requests.

Add focused regression coverage for: valid numeric ID; malformed string ID; negative/noncanonical ID; missing route ID; cross-user conversation; anonymous/unauthorized access; and authorized access. Keep sender identity session-bound and run the complete existing suite after the patch.

## Regression strategy

1. Verify the malformed request returns HTTP 400 before a membership/database lookup.
2. Verify valid numeric IDs still pass into membership authorization.
3. Verify cross-user reads/streams remain denied.
4. Verify authorized history/message access remains available.
5. Run the exact failing security script, then unit tests, lint, build, API smoke, and `git diff --check`.
6. Confirm no migration, database, production, deployment, or configuration state changed.

## Classification

- **FACT:** conversation IDs are BIGSERIAL/BIGINT in repository schema.
- **FACT:** current CI fails in `scripts/security-regression.js` on malformed conversation ID.
- **FACT:** route middleware order makes the route-level 400 guard unreachable for anonymous malformed message paths.
- **FACT:** commit `e402876` introduced `authorization.js`, conversation ownership changes, the forensic test, and the canonical verification migration.
- **INFERENCE:** the intended correction is an early shared route validator, not a test-only change.
- **UNKNOWN:** production response for this malformed request; no production probing was allowed.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform "Canonical SultraKita repository"
[2]: https://sultrakita-platform.vercel.app/ "SultraKita production deployment"

Primary evidence: `server.js:271,273-275`, `authorization.js:8-25`, `database/migrations/001_initial.sql:175-198`, `scripts/security-regression.js:35-37,117-127`, `public/app.js`, `public/chat.html`, commit `e402876`, and CI run `33403895841`.
