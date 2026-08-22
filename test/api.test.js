const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('health endpoint reports healthy service', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.status, 'healthy');
});

test('categories endpoint exposes local marketplace categories', async () => {
  const response = await fetch(`${baseUrl}/api/categories`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.ok(body.data.some(category => category.slug === 'properti'));
  assert.ok(body.data.some(category => category.slug === 'elektronik'));
});

test('listing validation rejects incomplete payload', async () => {
  const response = await fetch(`${baseUrl}/api/listings`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ title: 'x', price: -1 })
  });
  const body = await response.json();
  assert.equal(response.status, 422);
  assert.equal(body.success, false);
  assert.ok(body.details.length >= 3);
});

test('locations are scoped to Kendari and Southeast Sulawesi', async () => {
  const response = await fetch(`${baseUrl}/api/locations`);
  const body = await response.json();
  assert.equal(body.data.city, 'Kendari');
  assert.equal(body.data.province, 'Sulawesi Tenggara');
  assert.ok(body.data.districts.includes('Mandonga'));
});
