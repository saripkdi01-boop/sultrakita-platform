# SUKI Marketplace Automation — Setup Guide

## 1. Import and configure

In n8n, import the eleven JSON files in numeric order. All workflows are intentionally **inactive**. Create environment variables from `.env.example`, then replace the guarded placeholder Code/HTTP nodes with authenticated connector nodes for Supabase, Cloudflare R2, Resend, Customer.io, Midtrans, Canva, Google Sheets, GitHub, and Vercel. Do not put production secrets inside workflow JSON.

Create separate sandbox and production credentials. Begin with Supabase, Resend, and Customer.io in a test workspace; add Midtrans sandbox only after order creation and callback fixtures pass. Keep workflows 2, 3, and 4 inactive until the financial test checklist is complete.

## 2. Webhook URLs

Each webhook path is relative to the n8n base URL:

| Workflow | Path | Expected source |
|---|---|---|
| Listing publish | `/webhook/suki/webhooks/listing_published` | Supabase listing INSERT trigger |
| Checkout | `/webhook/suki/webhooks/checkout` | Next.js checkout endpoint |
| Midtrans | `/webhook/suki/webhooks/midtrans` | Midtrans notification URL |
| Seller verification | `/webhook/suki/webhooks/seller_verification_submitted` | Supabase storage/document event |
| Fraud review | `/webhook/suki/webhooks/fraud_review_created` | Supabase anomaly event |
| Review advocate | `/webhook/suki/webhooks/review_advocate_created` | Supabase review event |

Use a shared secret header for application webhooks. Verify the secret before reading or writing any payload. For Midtrans, verify `SHA512(order_id + status_code + gross_amount + server_key)` and reject mismatches without mutating an order.

## 3. Financial idempotency

Persist an idempotency key before any financial side effect. Recommended values are `midtrans:<order_id>:<transaction_id>:<transaction_status>` for callbacks and `checkout:<order_id>` for checkout creation. Enforce a unique index in Supabase. If the key already exists, return a successful no-op response; never decrement stock, send duplicate invoices, or release escrow twice.

Financial workflows use a stop-on-error policy. If payment verification, stock mutation, or payout fails, write a redacted incident record and alert an administrator. Only notification and analytics branches may continue after a recorded failure.

## 4. Canva template brief

Prepare templates with named placeholders `listing_title`, `price`, `seller_name`, `district`, `product_image`, `review_text`, `rating`, `report_period`, `total_orders`, `revenue`, and `brand_mark`. Use a 1080×1350 social template and a printable A4 report template. Define fallback text for missing images and truncate user-generated text to prevent layout overflow.

## 5. Credential and privacy rules

Never log service keys, KTP/NIB images, full shipping addresses, phone numbers, raw payment payloads, or complete customer profiles. Store only redacted identifiers and hashes in Google Sheets and GitHub issues. Keep identity documents in a private R2 bucket with short-lived signed URLs. GitHub backup repositories must be private.

## 6. Activation order

Activate in this order after fixture tests: 9 (health monitoring), 11 (backup), 6 (recovery), 7 (reports), 10 (review amplification), 1 (listing publish), 5 (seller verification), 8 (fraud review), 2 (checkout), 3 (Midtrans truth), and finally 4 (escrow payout). Workflows 2–4 require explicit business and payment-provider approval before production activation.
