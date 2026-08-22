'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const dbFile = path.join(__dirname, '..', 'data', 'sultrakita.sqlite');
fs.rmSync(dbFile, { force: true });
process.env.ADMIN_TOKEN = 'sandbox-admin-token';
process.env.MIDTRANS_SERVER_KEY = 'sandbox-midtrans-key';
process.env.XENDIT_SECRET_KEY = 'sandbox-xendit-key';
process.env.XENDIT_CALLBACK_TOKEN = 'sandbox-xendit-callback';
const originalFetch = global.fetch;
const providerCalls = [];
global.fetch = async (url, options = {}) => {
  const text = String(url);
  if (!text.includes('midtrans') && !text.includes('xendit')) return originalFetch(url, options);
  const body = options.body ? JSON.parse(options.body) : {};
  providerCalls.push({ url:text, body });
  if (text.includes('/snap/v1/transactions')) return new Response(JSON.stringify({ token:'snap-token', redirect_url:'https://sandbox.example/midtrans/snap-token' }), { status:201, headers:{'content-type':'application/json'} });
  if (text.includes('/v2/') && (text.endsWith('/cancel') || text.endsWith('/refund'))) return new Response(JSON.stringify({ status_code:'200', order_id:'sandbox-order', refund_chargeback_id:'sandbox-refund' }), { status:200, headers:{'content-type':'application/json'} });
  if (text.includes('/v2/invoices')) return new Response(JSON.stringify({ id:'xendit-invoice-id', invoice_url:'https://sandbox.example/xendit/invoice' }), { status:201, headers:{'content-type':'application/json'} });
  if (text.includes('/expire!')) return new Response(JSON.stringify({ id:'xendit-invoice-id', status:'EXPIRED' }), { status:200, headers:{'content-type':'application/json'} });
  if (text.endsWith('/refunds')) return new Response(JSON.stringify({ id:'xendit-refund-id', status:'SUCCEEDED' }), { status:200, headers:{'content-type':'application/json'} });
  throw new Error(`Unhandled fake provider URL: ${text}`);
};
const app = require('../server');
const { getDb, run } = require('../database');
async function json(response) { return { status:response.status, body:await response.json() }; }
async function createAdminSession() { await getDb(); const phone = `08${Date.now().toString().slice(-10)}`; const user = await run("INSERT INTO users(name,phone,role,phone_verified) VALUES('Sandbox Admin',?,'admin',1)", [phone]); const token = `sandbox-session-${crypto.randomBytes(32).toString('hex')}`; const hash = crypto.createHash('sha256').update(token).digest('hex'); await run('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)', [hash,user.id,Date.now()+3600000]); return token; }
async function donation(baseUrl, method) { return json(await fetch(`${baseUrl}/api/donations`, { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ campaign_id:1, amount:25000, name:`Sandbox ${method}`, payment_method:method }) })); }
async function runProvider(baseUrl, provider, adminSession) {
  process.env.PAYMENT_PROVIDER = provider; providerCalls.length = 0;
  const created = await donation(baseUrl, 'qris'); assert.equal(created.status, 201); assert.equal(created.body.data.provider, provider); assert.match(created.body.data.payment_url, /sandbox\.example/); assert.equal(providerCalls[0].body.payment_methods?.[0] || providerCalls[0].body.enabled_payments?.includes('qris'), provider === 'xendit' ? 'QRIS' : true);
  const transaction = created.body.data.transaction_id;
  const webhook = provider === 'midtrans' ? { order_id:transaction, status_code:'200', gross_amount:'25000', transaction_status:'settlement', fraud_status:'accept', signature_key:crypto.createHash('sha512').update(`${transaction}20025000${process.env.MIDTRANS_SERVER_KEY}`).digest('hex') } : { external_id:transaction, status:'PAID', amount:25000 };
  const webhookHeaders = { 'content-type':'application/json', ...(provider === 'xendit' ? { 'x-callback-token':process.env.XENDIT_CALLBACK_TOKEN } : {}) };
  const settled = await json(await fetch(`${baseUrl}/api/donation/webhook`, { method:'POST', headers:webhookHeaders, body:JSON.stringify(webhook) })); assert.equal(settled.status, 200); assert.equal(settled.body.data.payment_status, 'success');
  const refunded = await json(await fetch(`${baseUrl}/api/admin/donations/${transaction}/refund`, { method:'POST', headers:{ authorization:`Bearer ${adminSession}`, 'x-admin-token':process.env.ADMIN_TOKEN, 'content-type':'application/json' }, body:JSON.stringify({ reason:'sandbox e2e' }) })); assert.equal(refunded.status, 200); assert.equal(refunded.body.data.operation, 'refund');
  const pending = await donation(baseUrl, 'virtual_account'); assert.equal(pending.status, 201); const cancelled = await json(await fetch(`${baseUrl}/api/admin/donations/${pending.body.data.transaction_id}/cancel`, { method:'POST', headers:{ authorization:`Bearer ${adminSession}`, 'x-admin-token':process.env.ADMIN_TOKEN, 'content-type':'application/json' }, body:JSON.stringify({ reason:'sandbox cancel' }) })); assert.equal(cancelled.status, 200); console.log(`PASS ${provider}: QRIS -> webhook -> refund; Virtual Account -> cancel`);
}
(async () => { const server = app.listen(0, async () => { try { const baseUrl = `http://127.0.0.1:${server.address().port}`; const admin = await createAdminSession(); await runProvider(baseUrl, 'midtrans', admin); await runProvider(baseUrl, 'xendit', admin); server.close(); } catch (error) { console.error(`FAIL sandbox e2e: ${error.stack || error.message}`); server.close(); process.exitCode = 1; } }); })();
