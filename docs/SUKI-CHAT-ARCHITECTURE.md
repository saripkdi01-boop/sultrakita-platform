# SUKI Chat Architecture

The `/chat` experience currently runs as a safe frontend mock backed by a typed Zustand store. It demonstrates optimistic message delivery, simulated acknowledgement transitions (`sending` → `sent` → `read`), typing state, reactions, command palette actions, and a virtualized message list. No production database, authentication policy, or external service is mutated by this upgrade.

## API contract

The future Next.js route boundary should expose `POST /api/chat/messages` for authenticated message creation, `GET /api/chat/conversations` for the inbox, and `GET /api/chat/conversations/:id/messages?cursor=` for cursor-paginated history. The API should validate conversation membership, cap content at 4,000 characters, return a stable message envelope, and emit an event identifier for observability.

| Concern | Source of truth | Runtime role |
|---|---|---|
| Users and conversation membership | Postgres | Authentication, authorization, profiles, and membership checks |
| Presence and typing | Redis | Short-lived presence keys and WebSocket fan-out |
| Message history | ScyllaDB | Append-heavy message log, ordered by conversation and timestamp |
| Delivery/read events | Redis stream or WebSocket broker | Acknowledgement and read receipts |
| Client state | Zustand | Optimistic UI, active conversation, theme, and transient UI state |

## Realtime flow

The browser opens an authenticated WebSocket after the conversation shell loads. A message is appended locally with `sending` status, then submitted to the API. The API authorizes membership, writes the message to ScyllaDB, and publishes `message.created` and `message.acknowledged` events. The sender transitions to `sent`; a recipient read event transitions it to `read`. Presence and typing updates are ephemeral Redis events and should be removed when the socket closes.

## Release considerations

Backend wiring should be introduced as a separate additive change. It requires rate limiting, request IDs, event IDs, redaction of message content from logs, membership authorization tests, cursor pagination tests, reconnect handling, and a browser E2E journey for send, read receipt, typing, mobile layout, and offline/error states.
