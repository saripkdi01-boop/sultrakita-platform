#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const baseUrl = (process.env.BASE_URL || 'https://sultrakita.aplikasi-cerdasku.workers.dev').replace(/\/$/, '');
const allowMutation = process.env.WORKER_E2E_ALLOW_MUTATION === 'true';
const isProductionLike = /^https:\/\//i.test(baseUrl);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, signal: AbortSignal.timeout(Number(process.env.WORKER_E2E_TIMEOUT_MS || 10000)) });
  const text = await response.text();
  let body = null;
  try { body = JSON.parse(text); } catch {}
  return { response, body, text };
}

function jsonOptions(method, body, token) {
  return {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body)
  };
}

async function expectStatus(path, status, options, label) {
  const result = await request(path, options);
  assert(result.response.status === status, `${label}: expected ${status}, received ${result.response.status}: ${result.text}`);
  assert(result.body?.success === false || status < 300, `${label}: invalid success envelope`);
  return result;
}

async function safeSuite() {
  const health = await expectStatus('/api/health', 200, undefined, 'health');
  assert(health.body?.data?.status === 'healthy', 'health: status is not healthy');

  const categories = await expectStatus('/api/categories', 200, undefined, 'categories');
  assert(Array.isArray(categories.body?.data), 'categories: data is not an array');

  const listings = await expectStatus('/api/listings?page=1&limit=2', 200, undefined, 'public listings');
  assert(Array.isArray(listings.body?.data), 'public listings: data is not an array');
  assert(Number.isInteger(listings.body?.meta?.page), 'public listings: missing pagination page');
  assert(Number.isInteger(listings.body?.meta?.total_pages), 'public listings: missing total_pages');

  await expectStatus('/api/listings/not-an-id', 400, undefined, 'invalid listing identifier');
  const firstListingId = Number(listings.body?.data?.[0]?.id);
  if (Number.isInteger(firstListingId) && firstListingId > 0) await expectStatus(`/api/listings/${firstListingId}`, 200, undefined, 'public listing detail');
  await expectStatus('/api/admin/overview', 401, undefined, 'admin boundary');
  await expectStatus('/api/auth/logout', 401, { method: 'POST' }, 'logout without session');

  const validListing = { category_id: 1, title: 'Unauthorized Worker listing', description: 'This request must be rejected before mutation.', price: 100000, district: 'Kendari' };
  await expectStatus('/api/listings', 401, jsonOptions('POST', validListing), 'anonymous listing mutation');
  await expectStatus('/api/favorites', 401, jsonOptions('POST', { user_id: 1, listing_id: 1 }), 'anonymous favorite mutation');
  await expectStatus('/api/comments', 401, jsonOptions('POST', { listing_id: 1, body: 'Unauthorized comment' }), 'anonymous comment mutation');
  await expectStatus('/api/reports', 401, jsonOptions('POST', { listing_id: 1, reason: 'Unauthorized report' }), 'anonymous report mutation');
  await expectStatus('/api/conversations', 401, jsonOptions('POST', { listing_id: 1, buyer_id: 1, seller_id: 1 }), 'anonymous conversation mutation');
  await expectStatus('/api/conversations/1/messages', 401, undefined, 'anonymous conversation read');

  for (const result of [health, categories, listings]) {
    const lower = result.text.toLowerCase();
    for (const forbidden of ['stack trace', 'node_modules', 'database password', 'authorization: bearer']) {
      assert(!lower.includes(forbidden), `safe response discloses forbidden detail: ${forbidden}`);
    }
  }
}

async function mutationSuite() {
  if (isProductionLike && !process.env.WORKER_E2E_TARGET) throw new Error('Refusing mutation suite against HTTPS without WORKER_E2E_TARGET=staging');
  process.env.WORKER_E2E_TARGET = process.env.WORKER_E2E_TARGET || 'staging';

  const phone = `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`;
  const otp = await request('/api/auth/request-otp', { ...jsonOptions('POST', { phone }), headers: { 'content-type': 'application/json' } });
  assert(otp.response.status === 200, `OTP request failed: ${otp.text}`);
  assert(otp.body?.data?.dev_code, 'mutation suite requires OTP_DEV_MODE on the staging target');

  const login = await request('/api/auth/verify-otp', jsonOptions('POST', { phone, code: otp.body.data.dev_code, name: 'Worker E2E Seller', role: 'seller', district: 'Kendari' }));
  assert(login.response.status === 200 && login.body?.data?.token, `OTP login failed: ${login.text}`);
  const token = login.body.data.token;
  const userId = Number(login.body.data.user.id);

  const listing = await request('/api/listings', jsonOptions('POST', { seller_id: 999999, category_id: 1, title: `Worker E2E ${Date.now()}`, description: 'Listing untuk menguji binding identity Worker.', price: 100000, district: 'Kendari' }, token));
  assert(listing.response.status === 201, `authenticated listing create failed: ${listing.text}`);
  assert(Number(listing.body?.data?.seller_id) === userId, 'Worker listing seller_id was not bound to session');
  const listingId = Number(listing.body.data.id);

  const favorite = await request('/api/favorites', jsonOptions('POST', { user_id: userId, listing_id: listingId }, token));
  assert(favorite.response.status === 200, `favorite create failed: ${favorite.text}`);
  const spoofFavorite = await request('/api/favorites', jsonOptions('POST', { user_id: userId + 999, listing_id: listingId }, token));
  assert(spoofFavorite.response.status === 403, 'favorite user spoof was not rejected');

  const comment = await request('/api/comments', jsonOptions('POST', { listing_id: listingId, body: 'Komentar regression Worker.' }, token));
  assert(comment.response.status === 201, `comment create failed: ${comment.text}`);

  const report = await request('/api/reports', jsonOptions('POST', { listing_id: listingId, reason: 'Laporan regression Worker.' }, token));
  assert(report.response.status === 201, `report create failed: ${report.text}`);

  const conversation = await request('/api/conversations', jsonOptions('POST', { listing_id: listingId, buyer_id: userId, seller_id: userId }, token));
  assert([201, 200].includes(conversation.response.status), `conversation create failed: ${conversation.text}`);
  const conversationId = Number(conversation.body?.data?.id);
  const message = await request(`/api/conversations/${conversationId}/messages`, jsonOptions('POST', { sender_id: userId, body: 'Pesan regression Worker.' }, token));
  assert(message.response.status === 201, `message create failed: ${message.text}`);

  const updated = await request(`/api/listings/${listingId}`, jsonOptions('PUT', { category_id: 1, title: 'Worker E2E updated', description: 'Listing telah diubah oleh pemilik sah.', price: 110000, district: 'Kendari' }, token));
  assert(updated.response.status === 200, `listing update failed: ${updated.text}`);
  const archived = await request(`/api/listings/${listingId}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } });
  assert(archived.response.status === 200, `listing archive failed: ${archived.text}`);

  const logout = await request('/api/auth/logout', { method: 'POST', headers: { authorization: `Bearer ${token}` } });
  assert(logout.response.status === 200, `logout failed: ${logout.text}`);
  const revoked = await request('/api/listings', jsonOptions('POST', { category_id: 1, title: 'Revoked Worker listing', description: 'Must be rejected after logout.', price: 100000, district: 'Kendari' }, token));
  assert(revoked.response.status === 401, 'revoked Worker token was accepted');
}

async function main() {
  console.log(`Worker E2E security regression: ${baseUrl}${allowMutation ? ' [mutation suite enabled]' : ' [safe suite only]'}`);
  await safeSuite();
  if (allowMutation) await mutationSuite();
  console.log(`PASS: Worker safe security suite${allowMutation ? ' and authenticated mutation suite' : ''}`);
}

main().catch(error => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
});
