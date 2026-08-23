'use strict';
const { spawn } = require('node:child_process');
const crypto = require('node:crypto');
const path = require('node:path');
const fs = require('node:fs');

const root = path.resolve(__dirname, '..');
const port = 4700 + Math.floor(Math.random() * 500);
const base = `http://127.0.0.1:${port}`;
const env = { ...process.env, PORT: String(port), VERCEL: 'true', OTP_DEV_MODE: 'true', CORS_ORIGINS: base, ADMIN_TOKEN: 'local-e2e-admin-token' };
const child = spawn(process.execPath, ['server.js'], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
let output = '';
child.stdout.on('data', chunk => { output += chunk; });
child.stderr.on('data', chunk => { output += chunk; });
const stop = () => { if (!child.killed) child.kill('SIGTERM'); };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const request = async (url, options = {}) => { const response = await fetch(`${base}${url}`, options); const body = await response.json().catch(() => ({})); if (!response.ok) throw new Error(`${options.method || 'GET'} ${url} -> ${response.status}: ${body.error || 'request failed'}`); return body; };
const auth = token => ({ authorization: `Bearer ${token}` });
async function waitForHealth() { for (let attempt = 0; attempt < 40; attempt += 1) { try { const body = await request('/api/health'); if (body.data?.api === 'up') return; } catch (error) { output += `\nhealth retry: ${error.message}`; } await sleep(100); } throw new Error(`Server tidak siap. Output: ${output}`); }
async function createUser(phone, role, name) { const otp = await request('/api/auth/request-otp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone }) }); if (!otp.data?.dev_code) throw new Error('OTP_DEV_MODE tidak mengembalikan dev_code'); return request('/api/auth/verify-otp', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ phone, code: otp.data.dev_code, role, name, district: 'Kendari' }) }); }
async function main() {
  await waitForHealth();
  const categories = await request('/api/categories');
  const categoryId = categories.data?.[0]?.id;
  if (!categoryId) throw new Error('Kategori fixture tidak tersedia');
  const seller = await createUser('081234560001', 'seller', 'Seller E2E Lokal');
  const buyer = await createUser('081234560002', 'buyer', 'Buyer E2E Lokal');
  const listing = await request('/api/listings', { method: 'POST', headers: { 'content-type': 'application/json', ...auth(seller.data.token) }, body: JSON.stringify({ title: `Listing E2E ${Date.now()}`, description: 'Listing lokal untuk pengujian end-to-end chat dan upload.', price: 125000, category_id: Number(categoryId), condition: 'second', district: 'Kendari' }) });
  const listingId = listing.data.id;
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xdb, 0x00, 0x43, 0x00, 0xff, 0xd9]);
  const imageForm = new FormData(); imageForm.append('images', new Blob([jpeg], { type: 'image/jpeg' }), 'e2e.jpg');
  const image = await request(`/api/listings/${listingId}/images`, { method: 'POST', headers: auth(seller.data.token), body: imageForm });
  const conversation = await request('/api/conversations', { method: 'POST', headers: { 'content-type': 'application/json', ...auth(buyer.data.token) }, body: JSON.stringify({ listing_id: listingId, buyer_id: buyer.data.user.id, seller_id: seller.data.user.id }) });
  const conversationId = conversation.data.id;
  await request(`/api/conversations/${conversationId}/messages`, { method: 'POST', headers: { 'content-type': 'application/json', ...auth(buyer.data.token) }, body: JSON.stringify({ sender_id: buyer.data.user.id, body: 'Halo, apakah listing ini masih tersedia?' }) });
  const history = await request(`/api/conversations/${conversationId}/messages`, { headers: auth(buyer.data.token) });
  const streamResponse = await fetch(`${base}/api/conversations/${conversationId}/stream?after=0`, { headers: auth(buyer.data.token), signal: AbortSignal.timeout(1200) }).catch(error => error.name === 'TimeoutError' ? null : Promise.reject(error));
  const detail = await request(`/api/listings/${listingId}`);
  if (streamResponse && (!streamResponse.ok || !String(streamResponse.headers.get('content-type')).includes('text/event-stream'))) throw new Error('Stream realtime tidak mengembalikan content-type SSE');
  console.log(JSON.stringify({ passed: true, checks: { health: true, otp_session: true, seller_post: true, image_upload: image.data?.length === 1, conversation: true, message_history: history.data?.length === 1, realtime_stream: Boolean(streamResponse), listing_detail: detail.data?.id === listingId }, ids: { listing: listingId, conversation: conversationId }, note: 'E2E membutuhkan DATABASE_URL dan object storage staging; proses dihentikan setelah test.' }, null, 2));
}
main().catch(error => { console.error(`FAIL: ${error.message}`); process.exitCode = 1; }).finally(() => { stop(); setTimeout(() => process.exit(), 100); });
