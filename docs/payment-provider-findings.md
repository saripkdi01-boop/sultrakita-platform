# Payment provider findings

## Midtrans
Source: https://docs.midtrans.com/docs/https-notification-webhooks

Midtrans sends HTTP(S) POST notifications when a customer completes payment or the transaction status changes. The Payment Notification URL is configured in Midtrans MAP under Settings > Configuration. HTTPS is recommended. The existing project verifies Midtrans notifications with the documented signature pattern and processes settlement/capture statuses server-side.

## Xendit
Source: https://docs.xendit.co/docs/handling-webhooks

Xendit signs webhook events with the `x-callback-token` header; the token is retrieved from Dashboard Webhook settings and must remain secret. Webhooks can be duplicated and may arrive out of sequence, so processing must be idempotent. Webhooks must be handled server-side, acknowledged with a 2xx response promptly, and resilient to retries. The existing project compares `x-callback-token` server-side and avoids double-counting successful donations.
