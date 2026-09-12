'use client';

export type ChatSocketEvent =
  | { type: 'connection.ready'; serverTime: string; redis: boolean }
  | { type: 'subscription.ready'; conversationId: string }
  | { type: 'message.created'; conversationId: string; message: { id: string; clientMessageId?: string; senderId: string; content: string; createdAt: string } }
  | { type: 'message.read'; conversationId: string; messageId: string; clientMessageId?: string; userId: string; readAt: string }
  | { type: 'typing.updated'; conversationId: string; userId: string; isTyping: boolean; expiresAt: string }
  | { type: 'presence.updated'; conversationId: string; userId: string; status: string; updatedAt: string }
  | { type: 'error'; code: string; clientMessageId?: string };

type Handlers = {
  onEvent: (event: ChatSocketEvent) => void;
  onStatus?: (status: 'connecting' | 'connected' | 'disconnected') => void;
};

export function createChatSocket(conversationId: string, handlers: Handlers) {
  const configuredUrl = process.env.NEXT_PUBLIC_CHAT_WS_URL;
  if (!configuredUrl || typeof window === 'undefined') return null;

  let socket: WebSocket | null = null;
  let stopped = false;
  let retry = 0;
  let retryTimer: number | undefined;

  const connect = () => {
    if (stopped) return;
    handlers.onStatus?.('connecting');
    socket = new WebSocket(`${configuredUrl.replace(/\/$/, '')}/chat`);
    socket.addEventListener('open', () => {
      retry = 0;
      handlers.onStatus?.('connected');
      socket?.send(JSON.stringify({ type: 'subscribe', conversationId, userId: 'demo-user' }));
    });
    socket.addEventListener('message', (event) => {
      try { handlers.onEvent(JSON.parse(event.data) as ChatSocketEvent); } catch { /* ignore malformed events */ }
    });
    socket.addEventListener('close', () => {
      handlers.onStatus?.('disconnected');
      if (stopped) return;
      const delay = Math.min(10000, 500 * 2 ** retry++);
      retryTimer = window.setTimeout(connect, delay);
    });
    socket.addEventListener('error', () => socket?.close());
  };

  connect();

  return {
    send(payload: Record<string, unknown>) {
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(payload));
      else return false;
      return true;
    },
    close() {
      stopped = true;
      if (retryTimer) window.clearTimeout(retryTimer);
      socket?.close();
    },
  };
}
