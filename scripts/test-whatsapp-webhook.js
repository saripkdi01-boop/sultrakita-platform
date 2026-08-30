const express = require('express');
const http = require('node:http');
const assert = require('node:assert/strict');
const { createWhatsAppWebhookRouter } = require('../api/whatsapp-webhook');

process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN = 'test-verify-token';
delete process.env.META_APP_SECRET;

const calls = [];
const app = express();
app.use(express.json({ limit: '3mb', verify: (req, _res, buffer) => { req.rawBody = Buffer.from(buffer); } }));
app.use('/api/webhooks', createWhatsAppWebhookRouter({
  query: async () => [],
  run: async (sql, params) => { calls.push({ sql, params }); return { id: 101 }; },
}));

const request = (method, path, body) => new Promise((resolve, reject) => {
  const payload = body == null ? null : JSON.stringify(body);
  const server = app.listen(0, () => {
    const port = server.address().port;
    const req = http.request({ hostname: '127.0.0.1', port, path, method, headers: { ...(payload ? { 'content-type': 'application/json', 'content-length': Buffer.byteLength(payload) } : {}) } }, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => { server.close(); resolve({ status: res.statusCode, data }); });
    });
    req.on('error', error => { server.close(); reject(error); });
    if (payload) req.write(payload);
    req.end();
  });
});

(async () => {
  const verification = await request('GET', '/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=test-verify-token&hub.challenge=challenge-123');
  assert.equal(verification.status, 200);
  assert.equal(verification.data, 'challenge-123');
  const webhook = await request('POST', '/api/webhooks/whatsapp', {
    object: 'whatsapp_business_account',
    entry: [{ changes: [{ field: 'messages', value: { contacts: [{ profile: { name: 'Test Warga' } }], messages: [{ id: 'wamid.TEST.001', from: '6281993532722', type: 'text', text: { body: 'Saya ingin cari motor di Kendari' } }] } }] }],
  });
  assert.equal(webhook.status, 200);
  const parsed = JSON.parse(webhook.data);
  assert.equal(parsed.received, true);
  assert.equal(parsed.processed_messages, 1);
  assert.ok(calls.some(call => call.sql.includes('whatsapp_events')));
  assert.ok(calls.some(call => call.sql.includes('whatsapp_contacts')));
  assert.ok(calls.some(call => call.sql.includes('whatsapp_messages')));
  assert.ok(calls.some(call => call.sql.includes('whatsapp_leads')));
  console.log('PASS: WhatsApp webhook smoke test');
})().catch(error => { console.error(error); process.exitCode = 1; });
