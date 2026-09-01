# SultraKita Step 31 — Storage Provider Decision

## Decision

**STORAGE STATUS = UNKNOWN / UNRESOLVED.** Tidak ada provider yang dipilih sebagai canonical. Cloudflare R2 tetap kandidat potensial, bukan fakta arsitektur production.

Production health sebelumnya menunjukkan API dan database UP, storage DOWN/UNRESOLVED. Health signal tersebut tidak membuktikan provider mati; provider identity dan configuration contract belum terbukti.

## Provider-neutral Contract

```text
StorageProvider
├── presign(input, actor, scope) -> upload intent
├── commit(input, actor, checksum) -> committed object metadata
├── delete(input, actor, confirmation) -> deletion result
├── exists(input, actor) -> bounded status
└── publicUrl(input, actor) -> validated URL or none
```

All implementations must enforce ownership, URL validation, expiry validation, checksum where supported, bounded payloads, idempotent commit semantics, orphan prevention, and audit metadata. The contract must not expose provider credentials or direct unrestricted object operations to MCP.

## Candidate Assessment

| Provider | Current evidence | Decision |
|---|---|---|
| Cloudflare R2 | Identity, account, bucket, endpoint, and canonical linkage not proven | HOLD |
| Supabase Storage | No canonical production evidence established in current handoff | HOLD |
| Vercel Blob | No canonical production evidence established | HOLD |
| AWS S3 | Existing backup script references S3-compatible upload semantics, not application storage authority | HOLD; do not infer |
| Other S3-compatible provider | No evidence | HOLD |

## Activation Gate

A provider may be activated only after account/resource identity, endpoint, bucket/container, ownership, credentials scope, health semantics, backup impact, migration/reconnect plan, and disposable integration evidence are reviewed and approved. No bucket, Worker, DNS record, token, credential, environment variable, upload, or deletion is created during Step 31.

**NEXT SAFE ACTION = prove provider identity through read-only evidence or explicitly approve a bounded provider discovery task.**
