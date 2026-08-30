# SultraKita WhatsApp Operations

## Endpoint produksi

- Verification: `GET /api/webhooks/whatsapp`
- Event receiver: `POST /api/webhooks/whatsapp`
- Simulation remains isolated at `POST /api/dev/whatsapp-webhook` and is unavailable in production.

Set `WHATSAPP_WEBHOOK_VERIFY_TOKEN` for the Meta webhook verification challenge. Set `META_APP_SECRET` to enforce `X-Hub-Signature-256` validation. The receiver accepts only `object=whatsapp_business_account`, persists a unique provider event ID, upserts the contact, stores a unique message ID, and creates an initial lead for text messages.

## Required secrets

`WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_API_VERSION`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `META_APP_SECRET`, `WHATSAPP_TEMPLATE_NAME`, and `WHATSAPP_TEMPLATE_LANGUAGE` must be configured only in the deployment secret manager. Never commit values, send them through chat, or expose them through `/api/public-config`.

## Rollout gate

1. Apply migration `019_whatsapp_operating_system.sql` in staging first.
2. Configure Meta webhook URL and verify token in the Meta App Dashboard.
3. Subscribe the WABA to the `messages` field.
4. Send a test message and confirm `whatsapp_events`, `whatsapp_contacts`, `whatsapp_messages`, and `whatsapp_leads` records.
5. Keep replies in approval/shadow mode until intent quality and handoff ownership are reviewed.

## Safety and fallback

If the database is unavailable, return a non-2xx response so Meta can retry according to its delivery behavior; do not acknowledge an event that was not persisted. If the downstream AI or catalog lookup is unavailable, route to human handoff rather than inventing price, stock, or policy. Keep phone numbers masked in operational exports.

## Google Workspace mirror

The Google Sheets operating console is an operational mirror only. Database records remain canonical. Sync jobs must upsert by `lead_id`, `provider_message_id`, `listing_id`, and `order_id`, and should use retry with backoff. The prepared folder is `SultraKita WhatsApp OS`.
