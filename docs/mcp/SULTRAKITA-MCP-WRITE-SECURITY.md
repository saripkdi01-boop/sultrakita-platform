# SultraKita MCP CRUD/Write Security Model

## Scope

The MCP server now supports a controlled listing CRUD subset in addition to its five public read tools. The write surface is deliberately limited to `create_listing`, `update_listing`, `archive_listing`, and `set_listing_status`. Archive is the delete semantic exposed by the existing API; no hard-delete operation is added.

## Access gates

Write tools are hidden from `tools/list` unless `SULTRAKITA_MCP_WRITE_ENABLED=true`. Even when enabled, every write requires `SULTRAKITA_API_TOKEN` at runtime. The token is passed only as a Bearer header to the allowlisted SultraKita API host and is never accepted as an MCP tool argument.

The existing API remains the final authorization boundary. Its `authenticate` middleware resolves the Bearer session, and the listing routes enforce seller ownership or existing admin/super-admin policy. The MCP adapter does not accept a user ID, role, SQL statement, database URL, storage credential, or permission override from tool input.

## Network and input controls

The adapter allows only HTTP(S) URLs whose hostname is present in `SULTRAKITA_API_ALLOWED_HOSTS`. Requests use bounded timeouts, per-tool rate limits, JSON-only payloads, and stable error codes. Listing inputs enforce length, numeric, enum, and district bounds before an upstream request. Output is recursively redacted for sensitive keys.

## OAuth/session status

The current repository has an application session-token model and admin Google SSO routes, but it does not contain an MCP-specific OAuth authorization server or session exchange. Therefore this release does not claim to implement MCP OAuth. Runtime token injection is the only active service-to-service credential mechanism, and write mode must remain disabled unless the deployment operator provisions a short-lived, least-privileged token through the secret manager.

## Deployment rule

Do not enable write mode on an unauthenticated public MCP endpoint. Production configuration must set `SULTRAKITA_MCP_WRITE_ENABLED=true` only when `SULTRAKITA_API_TOKEN` is present, scoped to the intended account, rotated, monitored, and stored outside source control. If the token is absent, the adapter fails closed with `WRITE_UNAUTHENTICATED`.

## Verification

The read-only regression suite and CRUD/write unit suite pass locally with 11 tests. The tests use mocked upstream responses for write routing; they do not claim to perform real production mutations. A real write smoke test requires an explicitly approved staging account and must never run against production data without a separate change window.
