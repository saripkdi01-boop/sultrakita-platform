# SultraKita MCP Data Access Matrix

## Policy

This matrix is a proposed V0.1 allowlist. It distinguishes public projections from internal tables and keeps MCP behind existing API/service authorization. Database authority remains BLOCKED, so no MCP design may depend on direct SQL schema assumptions.

| Domain/entity | Public anonymous | Authenticated user | Admin | MCP V0.1 | Prohibited fields/actions |
|---|---:|---:|---:|---:|---|
| Categories/locations | Read | Read | Read | Yes, read-only | none beyond internal metadata |
| Active listings | Read | Read | Read | Yes, public projection | seller private data, moderation internals |
| Seller public profile | Read | Read | Read | Yes, public projection | email, phone, addresses, sessions |
| Listing images | Public URL only if already public | same | Read | Conditional read | upload/presign/commit/delete |
| Public statistics | Aggregate | Aggregate | Detailed | Aggregate only | raw events and user-level analytics |
| Conversations/messages | No | Member only | Policy-specific | No in V0.1 | outsider access, private content, writes |
| Users/profiles | Limited public | Own/member policy | Admin policy | Public projection only | credentials, private settings, PII |
| Cart/orders/offers | No | Own records | Admin policy | No | all writes and private commerce data |
| Donations/payments | Public campaigns only | Own status | Permissioned admin | Campaign read only if approved | payment identifiers, refunds, mutations |
| Notifications | No | Own records | Admin policy | No | private notifications and writes |
| Admin/RBAC/audit | No | No | Permissioned | No | role/security metadata |
| Privacy/security tables | No | Own policy | Permissioned | No | all raw access |
| WhatsApp/Telegram/webhooks | No | No | Service/admin | No | tokens, payloads, mutations |
| Storage provider credentials | No | No | No via MCP | No | credentials, signed secrets |
| Database/ledger/catalog | No | No | No via MCP | No | raw SQL/direct DB |

## Backend contract

Candidate tools call `GET /api/listings`, `GET /api/categories`, public seller/listing routes, and reviewed aggregate routes. Any route with session/member/admin middleware remains excluded unless the MCP caller carries an equivalent verified identity and the tool has a separate authorization test.

## Classification

**FACT:** current source has route and entity boundaries. **INFERENCE:** public GET routes are the safest V0.1 starting point. **UNKNOWN:** exact public projection shape for every route and whether all current routes are production-compatible. **BLOCKED:** final data-access approval until implementation contract tests and runtime verification exist.

## References

[1]: ../../server.js "SultraKita Express route and data access source"
[2]: ../../../step21-database-authority/SULTRAKITA-STEP21-SCHEMA-DIFF.md "Database schema diff"
[3]: ../../../step19-cloudflare-r2/SULTRAKITA-R2-CANONICAL-STORAGE-VERIFICATION.md "Storage authority verification"
