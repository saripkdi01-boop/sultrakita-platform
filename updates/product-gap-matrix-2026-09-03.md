# SultraKita Product Gap Matrix — 2026-09-03

Matrix ini disusun dari targeted inspection repository, test suite, dan runtime evidence sebelumnya. Status **EXISTING/PARTIAL/MISSING** adalah klasifikasi source-level; bukan klaim bahwa seluruh production flow telah tervalidasi.

| Feature | Existing | Partial | Missing | Reuse | New implementation | Priority |
|---|---|---|---|---|---|---|
| Marketplace listing, seller, category, location, price, condition, status | Ya | Availability dan quality ranking belum lengkap | — | Route/schema/frontend existing | — | P0 |
| Search, filter, sort, pagination, local discovery | Ya | Seller/business/reels unified search belum ada | Unified cross-entity search | `/api/listings`, existing SPA filters | Search adapter setelah kontrak jelas | P0 |
| Favorites/saved content | Favorites Ya | Saved searches belum ada; sebagian follow masih lokal | Server-side saved searches | Favorites API/auth | Migration + API + UI | P1 |
| Seller rating/reviews, comments/questions, offers | Ya | UX belum seluruhnya terhubung | — | Existing order/review/offer/comment routes | — | P1 |
| Reports, moderation status, block/safety | Reports/moderation sebagian Ya | Admin review surface dan block coverage tidak seragam | Unified content moderation workflow | Existing report/admin/RBAC | Incremental safety endpoints/UI | P1 |
| Messaging/conversations/messages | Ya | Group chat, reactions, attachments, delivery/read/typing belum lengkap | E2EE production architecture | Existing conversation/message auth | Do not claim E2EE until audited | P1 |
| Notifications | Ya | Unified event taxonomy/push architecture belum lengkap | Push delivery | Existing notification route/realtime | Event adapters | P1 |
| Video/Reels API and schema | Tidak terbukti aktif | Frontend video tab disabled; storage is available | Reels metadata, lifecycle, feed, engagement | R2/storage/auth patterns | Migration + API + tests | P1 |
| Video processing | Tidak | Pipeline abstraction belum terbukti | Production worker/transcoding | R2 metadata flow | Worker contract only, no fake transcoding | P1 |
| Social graph follow/followers | Sebagian UI/local state | Persistent follow API not proven | Server-side graph | User/seller model | Migration + API + UI | P1 |
| MCP control plane | Read/write listing tools Ya | Diagnostics coverage limited | project/db/storage/reels/message/test health tools | Existing `mcp/readonly-server.js` | Modular tools with guards/audit | P1 |
| CI/CD, observability, backup/recovery | Scripts/config sebagian Ya | Live CI/deployment evidence incomplete | Full staged rollout evidence | Existing scripts/Vercel | Operational hardening | P0/P1 |

## GAP LIST

**COMPLETED:** Marketplace core read/write contracts, auth/RBAC foundations, R2 integration, reporting/offer/notification primitives, MCP gated listing tools, and baseline test/build gates.

**BLOCKED:** Full security and write-flow verification requires PostgreSQL staging plus authorized test credentials. Production still contains explicit demo-seed records. Remote Custom SultraKita MCP endpoint is not configured or proven.

**UNKNOWN:** STEP46 baseline, production transcoding worker, unified social graph persistence, and production E2EE architecture.

## HIGHEST-VALUE NEXT TASK

Pilih satu task: **membangun fondasi persistent saved searches**. Alasannya, fitur ini langsung memperkuat marketplace discovery tanpa membuat data palsu, dapat memakai PostgreSQL/auth existing, dan memiliki scope yang lebih kecil serta lebih dapat diuji daripada membangun seluruh Reels/Messenger sekaligus. Implementasi baru hanya boleh dimulai setelah schema, route, ownership, frontend caller, tests, observability, dan rollback strategy dipetakan.
