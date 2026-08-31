# Step 7 — SSE Conversation ID Validation Review

**Scope:** read-only review after Step 6. No SSE source change was made in this step.  
**Runtime:** local PostgreSQL 16 disposable environment, Node 22, same migration runner assumptions as GitHub Actions.  
**Canonical IDs:** `conversations.id BIGSERIAL`; `messages.conversation_id BIGINT`.

## Endpoint comparison

| Endpoint | ID check | Membership check | Malformed ID result | Unsafe integer result | Classification |
|---|---|---|---|---|---|
| `GET /api/conversations/:id/messages` | Shared `requireConversationId` uses `Number.isSafeInteger(Number(id)) && Number(id) > 0`; then handler retains legacy `positiveInt` check | `requireConversationMember()` runs before handler | HTTP 400 failure envelope | HTTP 400 failure envelope | **FACT: consistent after Step 6** |
| `POST /api/conversations/:id/messages` | Same shared safe-integer validator | Same shared membership middleware; body validation runs before membership | HTTP 400 failure envelope | HTTP 400 failure envelope | **FACT: consistent after Step 6** |
| `GET /api/conversations/:id/stream` | Route middleware uses legacy `positiveInt()` | Explicit SQL membership check in middleware; handler opens SSE after `next()` | HTTP 400 JSON failure envelope for malformed/negative/fractional | **HTTP 401 for anonymous unsafe integer** because legacy `positiveInt()` accepts `9007199254740992`, then auth check runs | **FACT: real input-validation inconsistency** |
| `GET /api/conversations//messages` | No route parameter match | None | HTTP 404 JSON failure envelope | N/A | **FACT: missing route ID is rejected** |

## Local probe evidence

Against `http://127.0.0.1:3000` with the disposable database:

```text
400  /api/conversations/not-an-id/messages       {success:false,error:"ID percakapan tidak valid"}
400  /api/conversations/-1/messages              {success:false,error:"ID percakapan tidak valid"}
400  /api/conversations/1.5/messages             {success:false,error:"ID percakapan tidak valid"}
400  /api/conversations/9007199254740992/messages {success:false,error:"ID percakapan tidak valid"}
404  /api/conversations//messages                {success:false,error:"Endpoint tidak ditemukan"}
400  /api/conversations/not-an-id/stream         {success:false,error:"ID percakapan tidak valid"}
400  /api/conversations/-1/stream                {success:false,error:"ID percakapan tidak valid"}
400  /api/conversations/1.5/stream               {success:false,error:"ID percakapan tidak valid"}
401  /api/conversations/9007199254740992/stream  {success:false,error:"Autentikasi diperlukan"}
401  /api/conversations/1/stream                  {success:false,error:"Autentikasi diperlukan"}
```

The exact security suite also verifies, using authenticated disposable fixtures, cross-user conversation history/stream denial and authorized conversation membership. It verifies session-bound message sender identity through `Number(req.user.id)` and does not accept `sender_id` from the request body.

## Why `positiveInt()` differs

`server.js` defines `positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0`. This accepts positive integers outside JavaScript’s safe integer range. `validConversationId` added by Step 6 uses `Number.isSafeInteger`, so it rejects those values. The HTTP message route now uses the safe validator before authorization. The SSE route still uses the legacy helper at its first middleware and therefore can classify an unsafe ID as an authentication failure rather than a 400 input failure.

## Database query behavior

The message routes bind `Number(req.params.id)` only after safe validation and membership checks. The SSE middleware also converts the parameter with `Number()` for its membership query, but its unsafe value is not rejected first. PostgreSQL BIGINT is narrower than arbitrary JavaScript numeric input; relying on a lossy/unsafe JavaScript Number is not a safe identifier contract even if PostgreSQL later rejects or returns no row. No production query was made for this review.

## Security and consistency assessment

- **FACT:** HTTP message history and message creation validate safe positive IDs before membership.
- **FACT:** SSE malformed string, negative, and fractional IDs return 400.
- **FACT:** SSE unsafe positive integer returns 401 for anonymous access in the local probe because `positiveInt()` accepts it and authentication is checked next.
- **FACT:** SSE performs membership SQL before opening the stream for values that pass its legacy validator.
- **INFERENCE:** The SSE unsafe-ID response is a validation/authorization ordering inconsistency and should be remediated for contract consistency; it is not evidence of cross-user access by itself.
- **UNKNOWN:** Exact production response for SSE unsafe ID; production probing was prohibited.

## Separate remediation recommendation

Create a separate narrowly scoped issue/patch for the SSE middleware: replace its conversation-ID predicate with the same `validConversationId` semantics used by HTTP message routes, return the bounded 400 failure envelope before authentication/membership lookup, and add regression tests for malformed, negative, fractional, unsafe, missing, unauthorized, cross-user, and authorized SSE cases. Do **not** silently expand the Step 6 commit or alter SSE code in this review. Preserve the existing membership SQL and stream lifecycle.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform "Canonical SultraKita repository"
[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isSafeInteger "JavaScript Number.isSafeInteger"

Primary evidence: `server.js:76`, `server.js:274-278`, `authorization.js:19-25`, `database/migrations/001_initial.sql:175-198`, `scripts/security-regression.js`, and the disposable local probe recorded above.
