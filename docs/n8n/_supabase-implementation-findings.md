# Supabase n8n implementation findings

The live project is `ibvcfdfsjpytwpnxgylm` (`sultrakita-platform`) and is `ACTIVE_HEALTHY`. Migration `n8n_orchestration_foundation_v2` was applied successfully with version `20260904230807`.

The migration was revised because the live project already contained a legacy `public.otp_challenges` table with bigint `id`, `phone`, `code_hash`, `attempts`, bigint `expires_at`, bigint `consumed_at`, `email`, and `channel`. The applied migration added `destination_hash`, `purpose`, `status`, `max_attempts`, `provider_message_id`, and `n8n_execution_id` without replacing the legacy columns.

The live project already contained a legacy `public.seller_verifications` table with bigint `id`, bigint `user_id`, `document_type`, `document_reference`, `status`, `note`, `created_at`, and `reviewed_at`. The applied migration added `document_key`, `document_sha256`, `workflow_status`, `rejection_reason`, `reviewed_by`, `n8n_execution_id`, and `updated_at`.

Verified new tables and important types:

- `public.workflow_events`: UUID id, event envelope, status, attempt count, n8n execution ID, request ID, timestamps.
- `public.listing_media`: UUID id, bigint listing ID, R2 object key, content type, byte size, processing status, variants JSONB, n8n execution ID.
- `public.notification_outbox`: UUID id, event/channel/destination/template, payload JSONB, status, retries, provider message ID, n8n execution ID.
- `public.otp_challenges`: legacy bigint table plus orchestration columns.
- `public.seller_verifications`: legacy bigint table plus orchestration columns.

Supabase security advisors still report existing INFO-level `rls_enabled_no_policy` findings on multiple legacy tables, including `ad_postbacks`, `ad_reward_intents`, `admin_listing_import_drafts`, `analytics_events`, `auth_login_exchanges`, and others. These findings predate the new migration and require a separate policy audit; no unrelated legacy policies were changed during this implementation.
