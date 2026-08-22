#!/usr/bin/env node
'use strict';
const crypto = require('node:crypto');
const webhookUrl = process.env.WEBHOOK_URL;
const provider = String(process.env.WEBHOOK_PROVIDER || 'midtrans').toLowerCase();
const transactionId = process.env.TRANSACTION_ID;
const amount = Number(process.env.AMOUNT || 25000);
if (!webhookUrl || !transactionId || !Number.isSafeInteger(amount)) {
  console.error('Usage: WEBHOOK_URL=... TRANSACTION_ID=... AMOUNT=25000 [WEBHOOK_PROVIDER=midtrans|xendit] [MIDTRANS_SERVER_KEY=...] [XENDIT_CALLBACK_TOKEN=...] node scripts/test-donation-webhook.js');
  process.exit(1);
}
const headers = { 'content-type': 'application/json' };
let payload;
if (provider === 'midtrans') {
  if (!process.env.MIDTRANS_SERVER_KEY) throw new Error('MIDTRANS_SERVER_KEY wajib untuk simulasi Midtrans');
  payload = { order_id: transactionId, status_code: '200', gross_amount: String(amount), transaction_status: process.env.TRANSACTION_STATUS || 'settlement', fraud_status: 'accept' };
  payload.signature_key = crypto.createHash('sha512').update(`${payload.order_id}${payload.status_code}${payload.gross_amount}${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
} else if (provider === 'xendit') {
  if (!process.env.XENDIT_CALLBACK_TOKEN) throw new Error('XENDIT_CALLBACK_TOKEN wajib untuk simulasi Xendit');
  payload = { external_id: transactionId, status: process.env.TRANSACTION_STATUS || 'PAID', amount, payment_id: `local-${Date.now()}` };
  headers['x-callback-token'] = process.env.XENDIT_CALLBACK_TOKEN;
} else throw new Error('WEBHOOK_PROVIDER harus midtrans atau xendit');
fetch(webhookUrl, { method: 'POST', headers, body: JSON.stringify(payload) }).then(async response => { console.log(`HTTP ${response.status}`); console.log(await response.text()); if (!response.ok) process.exitCode = 1; }).catch(error => { console.error(error.message); process.exitCode = 1; });
