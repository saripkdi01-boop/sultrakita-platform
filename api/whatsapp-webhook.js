const express = require('express');
const crypto = require('node:crypto');

const text = value => String(value ?? '').trim().slice(0, 4000);
const hash = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const safeEqual = (left, right) => {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && a.length > 0 && crypto.timingSafeEqual(a, b);
};

const inferIntent = body => {
  const value = String(body || '').toLowerCase();
  if (/jual|pasang iklan|posting/.test(value)) return 'sell_listing';
  if (/harga|berapa|bayar|ongkir|kirim/.test(value)) return 'pricing_payment';
  if (/pesan|beli|ambil|tersedia|stok/.test(value)) return 'buy_listing';
  if (/komplain|tipu|penipuan|refund|bantuan/.test(value)) return 'support';
  if (/cari|mencari|butuh|rekomendasi/.test(value)) return 'search_listing';
  return 'unknown';
};

const buildEventId = payload => {
  const ids = [];
  for (const entry of Array.isArray(payload?.entry) ? payload.entry : []) {
    for (const change of Array.isArray(entry?.changes) ? entry.changes : []) {
      for (const message of Array.isArray(change?.value?.messages) ? change.value.messages : []) {
        if (message?.id) ids.push(String(message.id));
      }
      if (change?.value?.statuses) {
        for (const status of change.value.statuses) if (status?.id) ids.push(String(status.id));
      }
    }
  }
  return ids.sort().join('|') || hash(JSON.stringify(payload));
};

const flattenMessages = payload => {
  const rows = [];
  for (const entry of Array.isArray(payload?.entry) ? payload.entry : []) {
    for (const change of Array.isArray(entry?.changes) ? entry.changes : []) {
      if (change?.field !== 'messages') continue;
      const value = change.value || {};
      for (const message of Array.isArray(value.messages) ? value.messages : []) {
        const body = message.type === 'text' ? text(message.text?.body) : '';
        rows.push({
          id: text(message.id),
          waId: text(message.from),
          type: text(message.type || 'unknown') || 'unknown',
          body,
          name: text(value.contacts?.[0]?.profile?.name),
        });
      }
    }
  }
  return rows.filter(row => row.id && row.waId);
};

const createWhatsAppWebhookRouter = ({ query, run }) => {
  const router = express.Router();

  router.get('/whatsapp', (req, res) => {
    const mode = text(req.query['hub.mode']);
    const token = text(req.query['hub.verify_token']);
    const challenge = text(req.query['hub.challenge']);
    const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    if (mode !== 'subscribe' || !expected || !safeEqual(token, expected)) return res.sendStatus(403);
    return res.status(200).type('text/plain').send(challenge);
  });

  router.post('/whatsapp', async (req, res, next) => {
    try {
      const secret = process.env.META_APP_SECRET;
      const signature = text(req.get('x-hub-signature-256'));
      if (secret) {
        const expected = `sha256=${crypto.createHmac('sha256', secret).update(req.rawBody || Buffer.from(JSON.stringify(req.body || {}))).digest('hex')}`;
        if (!safeEqual(signature, expected)) return res.sendStatus(403);
      }
      const payload = req.body && typeof req.body === 'object' ? req.body : {};
      if (payload.object !== 'whatsapp_business_account') return res.status(400).json({ success: false, error: 'Payload WhatsApp tidak valid' });
      const payloadText = JSON.stringify(payload);
      const eventId = buildEventId(payload);
      const payloadHash = hash(payloadText);
      const inserted = await run('INSERT INTO whatsapp_events (provider_event_id, event_type, payload_hash, payload_json) VALUES (?, ?, ?, ?::jsonb) ON CONFLICT (provider_event_id) DO NOTHING', [eventId, 'messages', payloadHash, payloadText]);
      if (inserted?.rowCount === 0) return res.status(200).json({ success: true, received: true, event_id: eventId, duplicate: true, processed_messages: 0 });
      const messages = flattenMessages(payload);
      let processed = 0;
      for (const message of messages) {
        await run(`INSERT INTO whatsapp_contacts (wa_id, display_name, phone_last4, last_inbound_at, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) ON CONFLICT (wa_id) DO UPDATE SET display_name = COALESCE(EXCLUDED.display_name, whatsapp_contacts.display_name), phone_last4 = EXCLUDED.phone_last4, last_inbound_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP`, [message.waId, message.name || null, message.waId.slice(-4)]);
        await run('INSERT INTO whatsapp_messages (provider_message_id, event_id, wa_id, direction, message_type, body, payload_hash) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (provider_message_id) DO NOTHING', [message.id, inserted?.id || null, message.waId, 'inbound', message.type, message.body || null, hash(JSON.stringify(message))]);
        if (message.body) {
          const intent = inferIntent(message.body);
          const score = intent === 'unknown' ? 20 : intent === 'support' ? 85 : 60;
          await run('INSERT INTO whatsapp_leads (wa_id, intent, score, source) VALUES (?, ?, ?, ?) ', [message.waId, intent, score, 'whatsapp']);
        }
        processed += 1;
      }
      return res.status(200).json({ success: true, received: true, event_id: eventId, processed_messages: processed });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};

module.exports = { createWhatsAppWebhookRouter };
