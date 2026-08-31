#!/usr/bin/env node
'use strict';

const crypto = require('node:crypto');
const app = require('../server');
const { run } = require('../database');
const { hashToken } = require('../auth');

let server;
let baseUrl;
let originalOtpDevMode;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();
  let body;
  try { body = JSON.parse(text); } catch { body = null; }
  return { response, body, text };
}

async function main() {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  console.log(`Security regression test: ${baseUrl}`);

  const unauthenticatedAdmin = await request('/api/admin/overview');
  assert(unauthenticatedAdmin.response.status === 401, 'admin endpoint must reject missing admin credential');
  assert(unauthenticatedAdmin.body?.success === false, 'admin rejection must use failure envelope');

  const invalidConversation = await request('/api/conversations/not-an-id/messages');
  assert(invalidConversation.response.status === 400, 'conversation endpoint must reject non-numeric IDs');
  assert(invalidConversation.body?.success === false, 'invalid conversation ID must use failure envelope');

  const invalidMessage = await request('/api/conversations/1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ sender_id: 1, body: '' })
  });
  assert(invalidMessage.response.status === 422, 'message endpoint must reject empty message bodies');
  assert(invalidMessage.body?.success === false, 'invalid message must use failure envelope');

  originalOtpDevMode = process.env.OTP_DEV_MODE;
  process.env.OTP_DEV_MODE = 'false';
  const unconfiguredOtpPhone = `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`;
  const unconfiguredOtp = await request('/api/auth/request-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: unconfiguredOtpPhone })
  });
  assert(unconfiguredOtp.response.status === 503, 'OTP request must fail closed when provider is not configured');
  assert(unconfiguredOtp.body?.code === 'OTP_NOT_CONFIGURED', 'unconfigured OTP must use a stable error code');

  process.env.OTP_DEV_MODE = 'true';
  const otpPhone = `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`;
  const otpRequest = await request('/api/auth/request-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: otpPhone })
  });
  assert(otpRequest.response.status === 200, 'OTP request should create a challenge in explicit demo mode');
  assert(typeof otpRequest.body?.data?.dev_code === 'string', 'dev_code should be returned only in explicit demo mode');

  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const wrongOtp = await request('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ phone: otpPhone, code: '000000' })
    });
    assert(wrongOtp.response.status === 401, `wrong OTP attempt ${attempt} must return 401`);
  }
  const lockedOtp = await request('/api/auth/verify-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: otpPhone, code: '000000' })
  });
  assert(lockedOtp.response.status === 401, 'OTP challenge must remain unavailable after five failed attempts');

  const fixtureSeller = await run('INSERT INTO users (name, phone, role, district, phone_verified) VALUES (?, ?, ?, ?, true)', ['Fixture Seller', `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`, 'seller', 'Kendari']);
  const fixtureListing = await run('INSERT INTO listings (seller_id, category_id, title, description, price, condition, district, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [fixtureSeller.id, 1, 'Fixture ownership listing', 'Listing fixture untuk pengujian batas kepemilikan.', 100000, 'new', 'Kendari', 'Kendari']);

  const authPhone = `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`;
  const authOtpRequest = await request('/api/auth/request-otp', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: authPhone })
  });
  const authLogin = await request('/api/auth/verify-otp', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone: authPhone, code: authOtpRequest.body?.data?.dev_code, name: 'Regression Seller', role: 'seller', district: 'Kendari' })
  });
  assert(authLogin.response.status === 200 && authLogin.body?.data?.token, 'valid OTP must issue a session token');
  const token = authLogin.body.data.token;
  const authHeaders = { 'content-type': 'application/json', authorization: `Bearer ${token}` };

  const spoofedListing = await request('/api/listings', {
    method: 'POST', headers: authHeaders,
    body: JSON.stringify({ seller_id: 999999, category_id: 1, title: 'Regression ownership listing', description: 'Listing dibuat untuk menguji identity binding.', price: 100000, condition: 'new', district: 'Kendari', city: 'Kendari' })
  });
  assert(spoofedListing.response.status === 201, 'authenticated seller should be able to create a valid listing');
  assert(Number(spoofedListing.body?.data?.seller_id) === Number(authLogin.body.data.user.id), 'listing seller_id must come from session, not request body');

  const otherSellerListing = await request(`/api/listings/${fixtureListing.id}`, {
    method: 'PUT', headers: authHeaders,
    body: JSON.stringify({ category_id: 1, title: 'Unauthorized edit attempt', description: 'This should be rejected by ownership checks.', price: 100000, condition: 'new', district: 'Kendari', city: 'Kendari' })
  });
  assert(otherSellerListing.response.status === 403, `seller must not edit another seller listing; received ${otherSellerListing.response.status}: ${otherSellerListing.text}`);

  const publicProfile = await request(`/api/users/${authLogin.body.data.user.id}`);
  assert(publicProfile.response.status === 200 && publicProfile.body?.data?.phone === undefined, 'public user profile must redact phone number');
  const publicListing = await request(`/api/listings/${fixtureListing.id}`);
  assert(publicListing.response.status === 200 && publicListing.body?.data?.seller_phone === undefined, 'public listing detail must redact seller phone');

  const conversation = await request('/api/conversations', { method: 'POST', headers: authHeaders, body: JSON.stringify({ listing_id: fixtureListing.id, buyer_id: authLogin.body.data.user.id, seller_id: fixtureSeller.id }) });
  assert(conversation.response.status === 201 || conversation.response.status === 200, 'authenticated buyer should create or reuse a conversation');
  const conversationId = conversation.body?.data?.id;
  const outsider = await run('INSERT INTO users (name, phone, role, district, phone_verified) VALUES (?, ?, ?, ?, true)', ['Outsider', `08${crypto.randomInt(100000000, 999999999)}${crypto.randomInt(10, 99)}`, 'buyer', 'Kendari']);
  const outsiderToken = crypto.randomBytes(32).toString('hex');
  await run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [hashToken(outsiderToken), outsider.id, Date.now() + 60 * 60 * 1000]);
  const outsiderHeaders = { 'content-type': 'application/json', authorization: `Bearer ${outsiderToken}` };
  const outsiderRead = await request(`/api/conversations/${conversationId}/messages`, { headers: outsiderHeaders });
  assert(outsiderRead.response.status === 403, 'conversation history must require membership');
  const outsiderStream = await request(`/api/conversations/${conversationId}/stream`, { headers: outsiderHeaders });
  assert(outsiderStream.response.status === 403, 'conversation stream must require membership');
  const spoofedSuggestion = await request('/api/suggestions', { method: 'POST', headers: outsiderHeaders, body: JSON.stringify({ user_id: authLogin.body.data.user.id, name: 'Outsider', body: 'Percobaan identity spoofing' }) });
  assert(spoofedSuggestion.response.status === 403, 'suggestion user identity must come from session');
  const anonymousUpload = await request(`/api/listings/${fixtureListing.id}/images`, { method: 'POST' });
  assert(anonymousUpload.response.status === 401, 'image upload must reject anonymous requests before file processing');
  const fakeImage = new FormData();
  fakeImage.append('images', new Blob(['not-a-real-jpeg'], { type: 'image/jpeg' }), 'listing.jpg');
  const invalidSignatureUpload = await request(`/api/listings/${fixtureListing.id}/images`, { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: fakeImage });
  assert(invalidSignatureUpload.response.status === 422, 'upload must reject a fake image signature');

  const logout = await request('/api/auth/logout', { method: 'POST', headers: authHeaders });
  assert(logout.response.status === 200, 'logout should revoke the active session');
  const revoked = await request('/api/listings', { method: 'POST', headers: authHeaders, body: JSON.stringify({ category_id: 1, title: 'Revoked session listing', description: 'This must be rejected after logout.', price: 100000, condition: 'new', district: 'Kendari' }) });
  assert(revoked.response.status === 401, 'revoked session must not create listings');

  const invalidReport = await request('/api/reports', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ listing_id: 0, reporter_name: 'Test', reason: 'x' })
  });
  assert(invalidReport.response.status === 422, 'report endpoint must reject invalid payloads');

  for (const result of [unauthenticatedAdmin, invalidConversation, invalidMessage, otpRequest, lockedOtp, authLogin, spoofedListing, otherSellerListing, publicProfile, publicListing, conversation, outsiderRead, outsiderStream, spoofedSuggestion, anonymousUpload, logout, revoked, invalidReport]) {
    const lower = result.text.toLowerCase();
    for (const forbidden of ['stack trace', 'node_modules', 'database password', 'authorization: bearer']) {
      assert(!lower.includes(forbidden), `response appears to disclose forbidden detail: ${forbidden}`);
    }
  }

  console.log('PASS: admin boundary, identifier validation, message validation, OTP lockout, session identity binding, ownership denial, conversation membership, PII redaction, upload boundary, logout revocation, report validation, and disclosure checks');
}

main().catch(error => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}).finally(() => {
  if (originalOtpDevMode === undefined) delete process.env.OTP_DEV_MODE;
  else process.env.OTP_DEV_MODE = originalOtpDevMode;
  if (server) server.close();
});
