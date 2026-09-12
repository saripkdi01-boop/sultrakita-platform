const http = require('node:http');
const crypto = require('node:crypto');
const { WebSocketServer, WebSocket } = require('ws');

const PORT = Number(process.env.REALTIME_PORT || 8090);
const REDIS_URL = process.env.REDIS_URL;
const clientsByConversation = new Map();
let redisPublisher;
let redisSubscriber;

function conversationChannel(conversationId) {
  return `suki:chat:conversation:${conversationId}`;
}

function safeText(value) {
  return typeof value === 'string' ? value.trim().slice(0, 4000) : '';
}

function broadcastLocal(conversationId, payload) {
  const clients = clientsByConversation.get(conversationId) || new Set();
  const encoded = JSON.stringify(payload);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) client.send(encoded);
  }
}

async function publish(conversationId, payload) {
  if (redisPublisher) {
    await redisPublisher.publish(conversationChannel(conversationId), JSON.stringify(payload));
  } else {
    broadcastLocal(conversationId, payload);
  }
}

async function setupRedis() {
  if (!REDIS_URL) return;
  try {
    const Redis = require('ioredis');
    redisPublisher = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    redisSubscriber = new Redis(REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    await Promise.all([redisPublisher.connect(), redisSubscriber.connect()]);
    redisSubscriber.on('message', (channel, message) => {
      const prefix = 'suki:chat:conversation:';
      if (!channel.startsWith(prefix)) return;
      broadcastLocal(channel.slice(prefix.length), JSON.parse(message));
    });
    console.log('[realtime] Redis Pub/Sub connected');
  } catch (error) {
    redisPublisher?.disconnect();
    redisSubscriber?.disconnect();
    redisPublisher = undefined;
    redisSubscriber = undefined;
    console.warn(`[realtime] Redis unavailable; using in-memory fan-out (${error.message})`);
  }
}

function addClient(conversationId, client) {
  const clients = clientsByConversation.get(conversationId) || new Set();
  clients.add(client);
  clientsByConversation.set(conversationId, clients);
  if (redisSubscriber && clients.size === 1) void redisSubscriber.subscribe(conversationChannel(conversationId));
}

function removeClient(conversationId, client) {
  const clients = clientsByConversation.get(conversationId);
  if (!clients) return;
  clients.delete(client);
  if (clients.size === 0) {
    clientsByConversation.delete(conversationId);
    if (redisSubscriber) void redisSubscriber.unsubscribe(conversationChannel(conversationId));
  }
}

function makeMessage({ conversationId, senderId, content, clientMessageId }) {
  return {
    id: `msg-${crypto.randomUUID()}`,
    clientMessageId,
    conversationId,
    senderId,
    content,
    createdAt: new Date().toISOString(),
  };
}

const server = http.createServer((request, response) => {
  if (request.url === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: true, redis: Boolean(redisPublisher), conversations: clientsByConversation.size }));
    return;
  }
  response.writeHead(404);
  response.end('Not found');
});

const websocketServer = new WebSocketServer({ server, path: '/chat' });

websocketServer.on('connection', (client) => {
  let conversationId = null;
  let userId = 'demo-user';

  client.send(JSON.stringify({ type: 'connection.ready', serverTime: new Date().toISOString(), redis: Boolean(redisPublisher) }));

  client.on('message', async (raw) => {
    try {
      const input = JSON.parse(raw.toString());
      if (input.type === 'subscribe') {
        if (conversationId) removeClient(conversationId, client);
        conversationId = safeText(input.conversationId);
        userId = safeText(input.userId) || 'demo-user';
        if (!conversationId) return client.send(JSON.stringify({ type: 'error', code: 'INVALID_CONVERSATION' }));
        addClient(conversationId, client);
        client.send(JSON.stringify({ type: 'subscription.ready', conversationId }));
        return;
      }

      if (input.type === 'presence.ping') {
        if (conversationId) await publish(conversationId, { type: 'presence.updated', eventId: crypto.randomUUID(), conversationId, userId, status: 'online', updatedAt: new Date().toISOString() });
        return;
      }

      if (input.type === 'typing.updated') {
        if (!conversationId) return;
        await publish(conversationId, { type: 'typing.updated', eventId: crypto.randomUUID(), conversationId, userId, isTyping: Boolean(input.isTyping), expiresAt: new Date(Date.now() + 5000).toISOString() });
        return;
      }

      if (input.type === 'message.send') {
        const content = safeText(input.content);
        if (!conversationId || !content) return client.send(JSON.stringify({ type: 'error', code: 'INVALID_MESSAGE', clientMessageId: input.clientMessageId }));
        const message = makeMessage({ conversationId, senderId: userId, content, clientMessageId: safeText(input.clientMessageId) });
        await publish(conversationId, { type: 'message.created', eventId: crypto.randomUUID(), conversationId, message });
        setTimeout(() => publish(conversationId, { type: 'message.read', eventId: crypto.randomUUID(), conversationId, messageId: message.id, clientMessageId: message.clientMessageId, userId, readAt: new Date().toISOString() }).catch(() => undefined), 900);
      }
    } catch {
      client.send(JSON.stringify({ type: 'error', code: 'INVALID_JSON' }));
    }
  });

  client.on('close', () => {
    if (conversationId) removeClient(conversationId, client);
  });
});

setupRedis().finally(() => {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[realtime] WebSocket gateway listening on ws://0.0.0.0:${PORT}/chat`);
    console.log(`[realtime] Redis mode: ${redisPublisher ? 'enabled' : 'in-memory fallback'}`);
  });
});
