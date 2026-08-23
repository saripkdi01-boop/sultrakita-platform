#!/usr/bin/env node
'use strict';

let baseUrl = (process.env.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const timeoutMs = Number(process.env.SMOKE_TIMEOUT_MS || 8000);
const isProduction = /^https:\/\//i.test(baseUrl) || process.env.PRODUCTION_SMOKE === 'true';
let localServer;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${baseUrl}${path}`, { ...options, signal: controller.signal });
    const text = await response.text();
    let body;
    try { body = JSON.parse(text); } catch { body = null; }
    return { response, body, text };
  } finally {
    clearTimeout(timer);
  }
}

async function expectJson(path, expectedStatus = 200) {
  const result = await request(path);
  assert(result.response.status === expectedStatus, `${path}: expected HTTP ${expectedStatus}, received ${result.response.status}`);
  assert(result.body && typeof result.body === 'object', `${path}: response is not JSON`);
  assert(result.body.success === true, `${path}: success envelope is false`);
  return result.body;
}

async function main() {
  if (!process.env.BASE_URL) {
    const app = require('../server');
    localServer = app.listen(0);
    await new Promise(resolve => localServer.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${localServer.address().port}`;
  }
  console.log(`API smoke test: ${baseUrl}${isProduction ? ' [production-safe read-only mode]' : ''}`);
  const health = await expectJson('/api/health');
  assert(health.data?.api === 'up', 'health api is not up');
  assert(['up', 'down'].includes(health.data?.db), 'health db state is missing');

  const categories = await expectJson('/api/categories');
  assert(Array.isArray(categories.data), 'categories.data is not an array');

  const locations = await expectJson('/api/locations');
  assert(locations.data?.province === 'Sulawesi Tenggara', 'unexpected province');
  assert(locations.data?.city === 'Kendari', 'unexpected city');

  const external = await expectJson('/api/external-listings');
  assert(Array.isArray(external.data), 'external listings data is not an array');
  assert(external.meta?.live_sync === false, 'external demo feed must explicitly declare live_sync=false');
  assert(external.data.every(item => item.is_demo === true && item.provenance), 'external records must be labeled demo with provenance');

  const listings = await expectJson('/api/listings?limit=3');
  assert(Array.isArray(listings.data), 'listings.data is not an array');
  assert(Number.isInteger(listings.meta?.page), 'listings pagination metadata missing');
  assert(Number.isInteger(listings.meta?.total_pages), 'listings total_pages missing');

  const invalidListing = await request('/api/listings/not-an-id');
  assert(invalidListing.response.status === 400, `invalid listing ID expected 400, received ${invalidListing.response.status}`);
  assert(invalidListing.body?.success === false, 'invalid listing ID must use failure envelope');

  let invalidCreate = { text: '' };
  if (!isProduction) {
    invalidCreate = await request('/api/listings', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'x', price: -1 })
    });
    assert(invalidCreate.response.status === 422, `invalid listing payload expected 422, received ${invalidCreate.response.status}`);
    assert(invalidCreate.body?.success === false, 'invalid listing payload must use failure envelope');
  }

  const adminBoundary = await request('/api/admin/overview');
  assert(adminBoundary.response.status === 401, `admin boundary expected 401, received ${adminBoundary.response.status}`);
  assert(adminBoundary.body?.success === false, 'admin boundary must use failure envelope');

  const source = `${invalidListing.text}${invalidCreate.text}${adminBoundary.text}`.toLowerCase();
  for (const forbidden of ['stack trace', 'node_modules', 'secret', 'token']) {
    assert(!source.includes(forbidden), `smoke response appears to disclose forbidden detail: ${forbidden}`);
  }

  console.log(`PASS: health, categories, locations, external provenance, listing pagination, validation${isProduction ? ' (read-only production subset)' : ''}, admin boundary, and safe error envelope`);
}

main().catch(error => {
  console.error(`FAIL: ${error.message}`);
  process.exitCode = 1;
}).finally(() => {
  if (localServer) localServer.close();
});
