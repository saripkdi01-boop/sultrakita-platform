const { WebSocket } = require('ws');

const socket = new WebSocket(process.env.REALTIME_URL || 'ws://127.0.0.1:8090/chat');
const seen = [];
const timeout = setTimeout(() => { console.error('smoke timeout', seen); process.exit(1); }, 5000);

socket.on('open', () => {
  socket.send(JSON.stringify({ type: 'subscribe', conversationId: 'wa-ode', userId: 'demo-user' }));
});

socket.on('message', (raw) => {
  const event = JSON.parse(raw.toString());
  seen.push(event.type);
  if (event.type === 'subscription.ready') {
    socket.send(JSON.stringify({ type: 'message.send', conversationId: 'wa-ode', clientMessageId: 'smoke-client-1', content: 'Realtime smoke message' }));
  }
  if (event.type === 'message.read') {
    clearTimeout(timeout);
    if (!seen.includes('connection.ready') || !seen.includes('message.created')) process.exit(1);
    console.log(JSON.stringify({ ok: true, events: seen }));
    socket.close();
  }
});

socket.on('error', (error) => { clearTimeout(timeout); console.error(error.message); process.exit(1); });
