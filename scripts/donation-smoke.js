#!/usr/bin/env node
'use strict';
const crypto = require('node:crypto');
process.env.MIDTRANS_SERVER_KEY = 'local-test-server-key';
const app = require('../server');
const { query, run } = require('../database');
let server;
async function request(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, options);
  return { response, body: await response.json() };
}
async function main() {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const campaign = await run('INSERT INTO donation_campaigns (title, description, target_amount) VALUES (?, ?, ?)', [`Smoke campaign ${Date.now()}`, 'Fixture pengujian otomatis.', 1000000]);
  const initial = await request(`/api/donation/stats?campaign_id=${campaign.id}`);
  if (!initial.body.success) throw new Error('campaign stats failed');
  const created = await request('/api/donations', { method: 'POST', headers: {'content-type':'application/json'}, body: JSON.stringify({campaign_id: campaign.id, amount: 25000, name: 'Smoke Donor'}) });
  if (created.response.status !== 201) throw new Error(`donation creation failed: ${JSON.stringify(created.body)}`);
  const orderId = created.body.data.transaction_id;
  const invalid = await request('/api/donation/webhook', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({order_id:orderId, status_code:'200', gross_amount:'25000', signature_key:'bad', transaction_status:'settlement'}) });
  if (invalid.response.status !== 401) throw new Error('malformed signature was not rejected');
  const signature = crypto.createHash('sha512').update(`${orderId}20025000${process.env.MIDTRANS_SERVER_KEY}`).digest('hex');
  const settledPayload = {order_id:orderId, status_code:'200', gross_amount:'25000', signature_key:signature, transaction_status:'settlement', fraud_status:'accept'};
  const settled = await request('/api/donation/webhook', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(settledPayload) });
  const replay = await request('/api/donation/webhook', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(settledPayload) });
  const [campaignRow] = await query('SELECT current_amount FROM donation_campaigns WHERE id = ?', [campaign.id]);
  if (settled.response.status !== 200 || replay.response.status !== 200 || Number(campaignRow.current_amount) !== 25000) throw new Error('settlement or idempotency failed');
  console.log('PASS: donation stats, creation, signature rejection, settlement, and idempotent webhook replay');
}
main().catch(error => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }).finally(() => { if (server) server.close(); });
