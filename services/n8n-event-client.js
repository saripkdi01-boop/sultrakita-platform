'use strict';

const crypto = require('node:crypto');

const getN8nBaseUrl = () => String(process.env.N8N_BASE_URL || '').replace(/\/$/, '');

const signPayload = (body, timestamp, secret) => {
  const raw = `${timestamp}.${body}`;
  return `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
};

const publishN8nEvent = async ({ path, event, requestId, timeoutMs = 8000 }) => {
  const baseUrl = getN8nBaseUrl();
  const secret = String(process.env.N8N_WEBHOOK_HMAC_SECRET || '');
  if (!baseUrl || !secret) {
    return { queued: false, skipped: true, reason: 'N8N_NOT_CONFIGURED' };
  }

  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${baseUrl}/${String(path).replace(/^\//, '')}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-sultra-timestamp': timestamp,
        'x-sultra-signature': signPayload(body, timestamp, secret),
        'x-request-id': requestId || event.request_id || event.event_id,
      },
      body,
      signal: controller.signal,
    });
    const responseBody = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(`n8n webhook returned HTTP ${response.status}`);
      error.status = response.status;
      error.responseBody = responseBody;
      throw error;
    }
    return { queued: true, status: response.status, response: responseBody };
  } finally {
    clearTimeout(timer);
  }
};

module.exports = { publishN8nEvent, signPayload };
