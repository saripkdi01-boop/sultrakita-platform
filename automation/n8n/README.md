# SUKI Marketplace n8n automation pack

Eleven importable, inactive draft workflows are included. They deliberately do not run until credentials, webhook secrets, and connector nodes are configured. The generic HTTP/Code nodes are safe placeholders and must be replaced with the corresponding Supabase, Midtrans, R2, Resend, Customer.io, Canva, Google Sheets, GitHub, and Vercel credentials.

## Import order

Import workflows 1–11 into n8n, create environment variables from `.env.example`, then configure credentials and test each workflow with a fixture. Keep financial workflows 2–4 inactive until Midtrans sandbox signature verification and idempotency tests pass.

## Idempotency

Use `idempotency_key = provider:event_id` for Midtrans callbacks and checkout creation. Persist it in a unique database column or a dedicated `automation_events` table. The first successful insert wins; duplicate callbacks return HTTP 200 without repeating stock changes, emails, or disbursements. Financial workflows must stop on connector errors; notification/reporting branches may continue after recording an error.

## Canva template brief

Prepare templates with named placeholders: `listing_title`, `price`, `seller_name`, `district`, `product_image`, `review_text`, `rating`, `report_period`, `total_orders`, `revenue`, and `brand_mark`. Keep text safe-area within 1080x1350 and provide fallback text for missing images.

## Production safety

Do not log payment keys, KTP/NIB images, complete shipping addresses, phone numbers, or raw Midtrans payloads. Store only hashed/idempotency identifiers in operational logs. Configure error workflows and alert recipients before activation.
