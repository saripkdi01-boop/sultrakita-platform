const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');
const integrationOptions = { skip: !process.env.DATABASE_URL, skipReason: 'DATABASE_URL tidak tersedia; integration test membutuhkan PostgreSQL staging.' };

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('health endpoint reports healthy service', integrationOptions, async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.api, 'up');
  assert.ok(['up', 'down'].includes(body.data.db));
});

test('stats endpoint returns numeric Postgres aggregates', integrationOptions, async () => {
  const response = await fetch(`${baseUrl}/api/stats`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  for (const key of ['total_listings', 'active_listings', 'covered_districts', 'weekly_new_listings']) assert.equal(typeof body.data.summary[key], 'number');
});

test('categories endpoint exposes local marketplace categories', integrationOptions, async () => {
  const response = await fetch(`${baseUrl}/api/categories`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.some(category => category.slug === 'properti'));
  assert.ok(body.data.some(category => category.slug === 'elektronik'));
});

test('listing validation rejects incomplete payload', integrationOptions, async () => {
  const response = await fetch(`${baseUrl}/api/listings`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'x', price: -1 })
  });
  const body = await response.json();
  assert.equal(response.status, 422);
  assert.equal(body.success, false);
  assert.ok(body.details.length >= 3);
});

test('locations are scoped to Kendari and Southeast Sulawesi', integrationOptions, async () => {
  const response = await fetch(`${baseUrl}/api/locations`);
  const body = await response.json();
  assert.equal(body.data.city, 'Kendari');
  assert.equal(body.data.province, 'Sulawesi Tenggara');
  assert.ok(body.data.districts.includes('Mandonga'));
});

test('upgrade endpoints enforce authentication', integrationOptions, async () => {
  for (const path of ['/api/me', '/api/cart', '/api/notifications']) {
    const response = await fetch(`${baseUrl}${path}`);
    assert.equal(response.status, 401, path);
    const body = await response.json();
    assert.equal(body.success, false);
  }
});

test('shipping quote endpoint is not exposed without a provider claim', integrationOptions, async () => {
  for (const path of ['/api/checkout', '/api/shipping/quotes']) {
    const response = await fetch(`${baseUrl}${path}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    const body = await response.json();
    assert.equal(response.status, 401, path);
    assert.equal(body.error, 'Autentikasi diperlukan');
  }
});
