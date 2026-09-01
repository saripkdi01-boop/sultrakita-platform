# SultraKita MCP Tool Catalog V0.1

All tools below are **read-only** and must use existing API/service contracts. Schemas are proposed contracts, not implemented tools. Unknown fields must be rejected; pagination is bounded.

| Tool | Input schema | Output schema | Auth/sensitivity | Existing backend | Errors / limit |
|---|---|---|---|---|---|
| `search_listings` | `{query?: string, category?: string, district?: string, page?: integer, limit?: integer<=50}` | `{items: ListingSummary[], page, limit, total?: integer}` | Public; public listing data | `GET /api/listings` | 400 invalid filters; 429; 30 req/min |
| `get_listing` | `{id: positive integer}` | `{listing: ListingDetail}` | Public; redact seller private fields | `GET /api/listings/:id` | 404/422; 60/min |
| `list_categories` | `{district?: string}` | `{categories: Category[]}` | Public | `GET /api/categories` | 429; 60/min |
| `search_businesses` | `{query?: string, district?: string, page?: integer, limit?: integer<=50}` | `{items: SellerSummary[], page, limit}` | Public; public seller fields only | `GET /api/sellers/:id` or existing discovery service | 400/404; 30/min |
| `get_business` | `{id: positive integer}` | `{seller: PublicSeller}` | Public; no contact/session secrets | `GET /api/sellers/:id` | 404/422; 60/min |
| `search_products` | `{query?: string, category?: string, page?: integer, limit?: integer<=50}` | `{items: ListingSummary[]}` | Public | `GET /api/listings` | 400/429; 30/min |
| `get_public_profile` | `{user_id: positive integer}` | `{profile: PublicProfile}` | Public projection only | `GET /api/users/:id` | 404/422; 30/min |
| `get_public_content` | `{kind: enum, page?: integer, limit?: integer<=50}` | `{items: ContentItem[]}` | Public content only | Existing public content route/service; exact mapping TBD | 400/404; 30/min |
| `get_platform_statistics` | `{scope?: enum(public_summary), period?: enum}` | `{statistics: PublicStatistics}` | Public aggregate only; no raw events | `GET /api/stats` or `/api/analytics/summary` after review | 403/429; 10/min |
| `get_health_summary` | `{}` | `{api: string, database: string, storage: string}` | Operationally restricted; no detailed config | `GET /api/health` | 403/429; 5/min |

## Tool contract rules

Outputs must be JSON, bounded, and versioned. IDs are validated before authorization-sensitive lookup. `limit` is capped server-side. Search results must not expose email, phone, session tokens, IPs, internal audit metadata, unpublished listings, private addresses, or moderation/security fields. Errors use stable codes such as `INVALID_INPUT`, `NOT_FOUND`, `FORBIDDEN`, `RATE_LIMITED`, and `UPSTREAM_UNAVAILABLE` with redacted messages.

No V0.1 tool is write-capable. Future write tools require a separate version, explicit authorization, confirmation semantics, idempotency, audit records, and security review.

## References

[1]: ../../server.js "SultraKita Express API source and route contracts"
[2]: ../../public "SultraKita public client assets"
[3]: ../../../step20-blueprint/SULTRAKITA-STEP20-SECURITY-REMEDIATION-PLAN.md "Security remediation plan"
