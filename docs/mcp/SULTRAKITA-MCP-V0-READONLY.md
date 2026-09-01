# SultraKita MCP V0 — Read-Only Contract

## Purpose

V0 is a small, testable MCP-shaped server skeleton for public read operations. It is intentionally not a production integration: transport is stdio JSON-RPC, authentication is not yet wired to a public identity provider, and the adapter targets an explicitly configured HTTP API base URL.

## Tools

`search_listings`, `search_products`, `list_categories`, `get_business`, and `get_platform_statistics` are enabled. All accept JSON input, reject unexpected structures, bound strings/IDs/page sizes, call existing GET routes, and return redacted JSON results.

## Explicit exclusions

There are no `create_*`, `update_*`, `delete_*`, `upload_*`, `commit_*`, `send_message`, webhook, checkout, donation, admin, RBAC, raw SQL, or storage-provider tools. `get_listing` is excluded because the current route records a view and therefore violates a strict read-only interpretation.

## Authentication posture

No fake authentication is used. The skeleton is for local/test integration only until an MCP authentication adapter can verify caller identity and map it to existing SultraKita authorization. Public deployment is blocked until authentication, authorization, audit, rate limiting, and secret management are reviewed.

## Storage posture

Storage provider remains UNKNOWN. The MCP layer has no upload or storage implementation and does not hard-code Cloudflare R2, Supabase Storage, AWS S3, or Vercel Blob.

## Database posture

Database authority remains BLOCKED despite CI migration/idempotency evidence. MCP uses HTTP/service boundaries and has no direct PostgreSQL access.

## References

[1]: ../../mcp/readonly-server.js "Read-only MCP skeleton"
[2]: SULTRAKITA-MCP-SECURITY-MODEL.md "MCP security model"
[3]: ../../test/mcp-readonly.test.js "MCP contract and security tests"
