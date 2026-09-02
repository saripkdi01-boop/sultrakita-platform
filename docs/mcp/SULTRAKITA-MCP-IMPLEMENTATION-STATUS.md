# SultraKita MCP — Implementation Status

## Status

**MCP SERVER = CONTROLLED CRUD/WRITE ADAPTER.** A standalone Node.js JSON-RPC/MCP-shaped stdio server exposes six bounded public read tools and four listing CRUD tools behind an explicit write-mode and runtime-token gate. It does not connect directly to PostgreSQL and it delegates authentication, ownership, and role authorization to the existing SultraKita API.

Implemented files: `mcp/readonly-server.js`, `test/mcp-readonly.test.js`, `test/mcp-write.test.js`. The historical read-only baseline was restored from commit `bb3616eb9575bad4afcab5733c9ec25825a0d22d` and extended in the current branch.

## Enabled tools

| Tool | Backend | Status |
|---|---|---|
| `get_mcp_usage_stats` | In-process bounded counters | implemented, metadata-only |
| `search_listings` | `GET /api/listings` | implemented, read-only contract |
| `search_products` | `GET /api/listings` | implemented, read-only alias |
| `list_categories` | `GET /api/categories` | implemented |
| `get_business` | `GET /api/sellers/:id` | implemented, public projection |
| `get_platform_statistics` | `GET /api/stats` | implemented, aggregate projection |
| `create_listing` | `POST /api/listings` | gated write, authenticated seller boundary |
| `update_listing` | `PUT /api/listings/:id` | gated write, ownership/admin boundary |
| `archive_listing` | `DELETE /api/listings/:id` | gated archive/delete semantic |
| `set_listing_status` | `PATCH /api/listings/:id/status` | gated write, ownership/admin boundary |

Write tools are omitted from `tools/list` unless `SULTRAKITA_MCP_WRITE_ENABLED=true`. All write requests require `SULTRAKITA_API_TOKEN` and use the existing API's Bearer-session authorization. No hard-delete operation is exposed.

## Session exchange

`POST /api/mcp/exchange` accepts an existing valid SultraKita session through the Bearer header or `session_token` request field, validates it against the existing sessions table, and issues a separate 15-minute session token. The endpoint is a temporary application-session bridge; an MCP-specific OAuth authorization server and OAuth discovery/session protocol are not claimed or implemented.

## Developer experience

The protected-by-default playground is available at `/dev/mcp-playground.html` only when `MCP_PLAYGROUND_BASIC_AUTH` is configured. It renders a versioned schema catalog and exports a request manifest; browser-side writes are intentionally not executed. The schema catalog foundation is in `public/dev/mcp-schema-ui.js`.

## Security properties

Inputs are bounded and validated; IDs require positive safe integers; outputs are recursively redacted for sensitive keys; the HTTP adapter uses GET for reads, explicit HTTP methods for gated writes, timeouts, JSON-only payloads, host allowlisting, and stable redacted error codes. No arbitrary SQL, database URL, storage credential, session secret, or permission override is accepted as tool input. Migration `database/migrations/024_mcp_audit_events.sql` prepares a non-destructive structured audit-event table for persistent observability; the current usage tool reports in-process counters only.

## Validation

- `node --test test/mcp-readonly.test.js test/mcp-write.test.js`: **PASS, 11/11**.
- Syntax checks for server, MCP, playground, and schema files: **PASS**.
- `git diff --check`: **PASS**.
- Secret-pattern scan across MCP/test files: no hardcoded credential patterns found.
- Production `GET /api/categories`: HTTP 200 after deployment of the prior MCP commit.

## Remaining release constraints

Write mode must not be enabled on a public deployment without a short-lived, least-privileged runtime token provisioned through Vercel secret management and verified against staging data. The existing API token/session remains the authorization boundary. Persistent audit-event insertion, automated staging write tests, and full MCP OAuth require a further implementation cycle and operational credentials/configuration.
