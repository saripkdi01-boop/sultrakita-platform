#!/usr/bin/env node
'use strict';
const crypto = require('node:crypto');
const baseUrl = String(process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const total = Math.max(1, Number(process.env.REQUESTS || 100));
const concurrency = Math.max(1, Math.min(total, Number(process.env.CONCURRENCY || 10)));
const amount = Number(process.env.AMOUNT || 10000);
const webhookProvider = String(process.env.WEBHOOK_PROVIDER || 'midtrans').toLowerCase();
const midtransKey = process.env.MIDTRANS_SERVER_KEY || 'load-test-midtrans-key';
const xenditToken = process.env.XENDIT_CALLBACK_TOKEN || 'load-test-xendit-token';
if (!Number.isSafeInteger(amount) || amount < 10000) throw new Error('AMOUNT harus integer minimal 10000');
const results = [];
async function request(path, options) {
  const started = performance.now();
  try {
    const response = await fetch(`${baseUrl}${path}`, options);
    const body = await response.json().catch(() => null);
    results.push({ status: response.status, ok: response.ok, ms: performance.now() - started, path });
    return { response, body };
  } catch (error) {
    results.push({ status: 0, ok: false, ms: performance.now() - started, path, error: error.message });
    return { response: null, body: null };
  }
}
async function runPool(worker) {
  let cursor = 0;
  async function consume() { while (true) { const index = cursor++; if (index >= total) return; await worker(index); } }
  await Promise.all(Array.from({ length: concurrency }, consume));
}
async function main() {
  console.log(`Load test ${total} requests, concurrency ${concurrency}, provider ${webhookProvider}`);
  await runPool(async index => {
    const created = await request('/api/donations', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ campaign_id:1, amount, name:`Load Test ${index}`, payment_method:index % 2 ? 'qris' : 'virtual_account' }) });
    const transactionId = created.body?.data?.transaction_id;
    if (!transactionId) return;
    let payload; const headers = { 'content-type':'application/json' };
    if (webhookProvider === 'midtrans') {
      payload = { order_id:transactionId, status_code:'200', gross_amount:String(amount), transaction_status:'settlement', fraud_status:'accept' };
      payload.signature_key = crypto.createHash('sha512').update(`${transactionId}200${amount}${midtransKey}`).digest('hex');
    } else {
      payload = { external_id:transactionId, status:'PAID', amount, payment_id:`load-${index}-${Date.now()}` };
      headers['x-callback-token'] = xenditToken;
    }
    await request('/api/donation/webhook', { method:'POST', headers, body:JSON.stringify(payload) });
  });
  const successful = results.filter(item => item.ok).length;
  const failures = results.length - successful;
  const durations = results.map(item => item.ms).sort((a,b) => a-b);
  const percentile = p => durations[Math.min(durations.length - 1, Math.floor(durations.length * p))] || 0;
  console.log(JSON.stringify({ baseUrl, total, concurrency, requests:results.length, successful, failures, p50_ms:percentile(.50), p95_ms:percentile(.95), max_ms:durations.at(-1) || 0 }, null, 2));
  if (failures) process.exitCode = 1;
}
main().catch(error => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; });
