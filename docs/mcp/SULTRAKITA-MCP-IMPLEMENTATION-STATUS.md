# SultraKita MCP V0.1 — Implementation Status

## Status

**MCP SERVER = SKELETON.** A standalone Node.js JSON-RPC/MCP-shaped stdio server now exposes five bounded read-only tools through an HTTP adapter. It does not connect directly to PostgreSQL and does not expose write tools.

Implemented file: `mcp/readonly-server.js`. Test file: `test/mcp-readonly.test.js`.

## Enabled tools

| Tool | Backend | Status |
|---|---|---|
| `search_listings` | `GET /api/listings` | implemented, read-only contract |
| `search_products` | `GET /api/listings` | implemented, read-only alias |
| `list_categories` | `GET /api/categories` | implemented |
| `get_business` | `GET /api/sellers/:id` | implemented, public projection |
| `get_platform_statistics` | `GET /api/stats` | implemented, aggregate projection |

`get_listing`, `get_public_profile`, and `get_public_content` are not enabled: exact safe service contracts are not yet established. In particular, `GET /api/listings/:id` increments views and inserts `listing_views`, so it is not a safe read-only dependency.

## Security properties

Inputs are bounded and validated; IDs require positive safe integers; output is recursively redacted for sensitive keys; HTTP adapter uses GET only, timeout, JSON acceptance, and stable redacted error codes. No arbitrary SQL, database URL, storage credential, session secret, or production credential is accepted.

## Validation

- MCP targeted tests: **PASS**, 5/5.
- `npm run lint`: **PASS**.
- `npm test`: **PASS**, 63 pass, 7 skipped.
- `npm run build`: **PASS**.
- `npm run smoke:api`: **PASS**.
- `npm run test:security`: **BLOCKED/FAIL in local environment** because `DATABASE_URL` and OTP provider configuration are absent; the existing fail-closed test reports provider configuration failure. No production credentials were supplied.

## Not production-ready

MCP authentication/session exchange is not implemented; the skeleton must not be exposed publicly. No write-capable tool, upload, storage commit/delete, message send, admin operation, or direct database access exists.
