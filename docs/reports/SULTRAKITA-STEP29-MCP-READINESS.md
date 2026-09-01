# SultraKita Step 29 — MCP Readiness

## Status

**MCP V0.2 = NOT AUTHORIZED.** Step 29 menghasilkan desain readiness dan guardrails, bukan implementasi write access atau perluasan tool production.

## Current V0.1 Boundary

MCP V0.1 tetap berada pada branch `feat/mcp-readonly-v0` dan PR #12 tetap `OPEN`. Lima capability yang ada adalah `search_listings`, `search_products`, `list_categories`, `get_business`, dan `get_platform_statistics`.

Security properties yang dipertahankan adalah GET-only adapter, bounded pagination, safe integer validation, recursive sensitive-field redaction, timeout, upstream error normalization, SSRF host allowlist, per-tool rate limiting, no direct PostgreSQL access, dan no write-capable tools. `get_listing` tetap tidak diekspos karena endpoint existing memiliki side effect berupa view counter.

## Step 29 Readiness Decision

Database authority tetap blocked. Storage provider canonical tetap unknown. Backup/restore gate G-15 tetap blocked. Karena dependency foundation belum selesai, tidak ada sufficient evidence untuk mengotorisasi MCP V0.2.

| Capability proposal | Decision | Reason |
|---|---|---|
| Health diagnostics | DESIGN ONLY | Dapat dirancang sebagai read-only, tetapi belum diimplementasikan pada Step 29. |
| Schema diagnostics | DESIGN ONLY | Harus membaca evidence yang versioned dan tidak membuka direct SQL production. |
| Migration status | DESIGN ONLY | Tidak boleh menyimpulkan authority dari ledger tanpa provenance map. |
| Environment parity checks | DESIGN ONLY | Harus menghindari secret values dan membatasi output pada status metadata. |
| API route health | DESIGN ONLY | Harus memiliki timeout, redaction, dan error normalization. |
| Storage configuration diagnostics | DESIGN ONLY | Tidak boleh membuat atau mengubah provider, bucket, token, DNS, atau custom domain. |
| CI evidence inspection | DESIGN ONLY | Aman jika hanya membaca workflow/run/artifact metadata yang diizinkan. |
| Deployment status inspection | DESIGN ONLY | Read-only status; tidak boleh trigger deploy atau mutation. |
| Security posture inspection | DESIGN ONLY | Memerlukan definisi sumber evidence dan redaction yang eksplisit. |
| SQL execution / migration / write tools | PROHIBITED | Bertentangan dengan database authority blocked dan production safety boundary. |

## Proposed V0.2 Control Model

Jika kelak diotorisasi, setiap tool harus mendeklarasikan `READ ONLY`, tidak memiliki hidden write, tidak memiliki side effect, dan tidak melakukan production mutation. Tool router harus berada di belakang policy/guard layer dan tidak boleh menyediakan arbitrary SQL, shell, DNS, deployment, storage deletion, database migration, atau credential rotation.

Capability yang aman untuk prototyping berikutnya adalah diagnostics terhadap evidence yang sudah dihasilkan CI, bukan direct production mutation. Setiap capability harus memiliki input validation, timeout, bounded output, redaction, negative tests, audit metadata, dan human review sebelum masuk ke PR.

## Required Gates Before Any V0.2 Implementation

Diperlukan database authority decision yang didukung provenance, storage identity yang terbukti, backup/restore evidence, runtime security regression, API contract tests, explicit authorization model, dan human-approved design. Write-capable tools memerlukan RBAC, ownership checks, dry-run, explicit confirmation, idempotency, audit logging, rollback/recovery, dan post-operation verification.

## Decision

**STOPPED SAFELY.** MCP V0.1 dipertahankan tanpa perubahan. MCP V0.2 hanya didokumentasikan sebagai desain readiness dan belum diotorisasi.

## References

[1]: https://github.com/saripkdi01-boop/sultrakita-platform/pull/12 "SultraKita MCP read-only V0.1"
[2]: ../mcp/SULTRAKITA-MCP-ROADMAP.md "Existing MCP roadmap and dependency matrix"
