# Suki Chat Realtime MVP

This service is a runnable WebSocket gateway for the Suki Chat frontend. It supports live messages, typing events, presence pings, reconnects, delivery acknowledgements, and optional Redis Pub/Sub fan-out.

## Run locally without Redis

From the repository root:

```bash
npm install
npm run realtime:start
```

The gateway listens on `ws://127.0.0.1:8090/chat` and exposes `http://127.0.0.1:8090/health`.

In another terminal, start Next.js with the WebSocket URL enabled:

```bash
cd next-app
NEXT_PUBLIC_CHAT_WS_URL=ws://127.0.0.1:8090 npm run dev
```

Open `/chat`. The context strip changes to `Realtime terhubung` when the browser has subscribed successfully. Messages sent from two browser tabs are fanned out through the gateway.

## Run with Redis

Set the server-only Redis URL before starting the gateway:

```bash
REDIS_URL=redis://127.0.0.1:6379 npm run realtime:start
```

If Redis cannot be reached, the gateway logs a warning and automatically uses its in-memory development fan-out instead.

## Current MVP boundary

The gateway uses a synthetic `demo-user` identity and keeps message history in memory only. It is intended for local integration and E2E testing. Before production, replace the identity with verified Supabase/JWT session validation, write messages to durable storage, validate conversation membership, add rate limiting, and use Redis Streams or another replayable event log for reconnect recovery.
