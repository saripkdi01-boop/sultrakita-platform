# SultraKita MCP API Mapping

## Read-only mapping

| MCP tool | Existing route/service | Authorization | Side-effect review | Status |
|---|---|---|---|---|
| `search_listings` | `GET /api/listings` → existing `query` layer | public active-listing filtering | route has fallback/read queries; no intentional write observed | enabled |
| `search_products` | same listing search route | public | same | enabled |
| `list_categories` | `GET /api/categories` → existing query/fallback | public | read/fallback behavior | enabled |
| `get_business` | `GET /api/sellers/:id` → seller projection + active listings | public projection | read queries only in inspected route | enabled |
| `get_platform_statistics` | `GET /api/stats` → aggregate listing/category queries | public aggregate | read queries only in inspected route | enabled |
| `get_listing` | `GET /api/listings/:id` | public | **writes** listing views and `listing_views` | blocked |
| `get_public_profile` | `GET /api/users/:id` candidate | exact projection/authorization requires further review | unknown | not enabled |
| `get_public_content` | no single proven route | unknown | unknown | not enabled |

## Adapter boundary

`mcp/readonly-server.js` calls an injected GET-only adapter. The adapter can target a local/test Express service through `SULTRAKITA_API_BASE_URL`; it has no database client. Production authentication is not faked: until MCP identity/session integration exists, the skeleton is not a public deployment.

## Data contract

The MCP output is bounded JSON text, recursively redacted, and does not promise raw database shape. Search caps `limit` at 50. Errors are converted to stable codes such as `INVALID_INPUT`, `NOT_FOUND`, `UPSTREAM_TIMEOUT`, and `UPSTREAM_UNAVAILABLE`.

## Security mapping

Existing route authorization remains the source of truth. MCP must not reimplement business permissions or call the database directly. Any future authenticated tool must pass identity and membership through the existing auth/session boundary, especially for conversation resources.

## References

[1]: ../../server.js "SultraKita Express route implementation"
[2]: ../../mcp/readonly-server.js "MCP read-only adapter implementation"
