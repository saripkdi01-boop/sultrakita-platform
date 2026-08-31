'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('v2 health endpoint exposes the MVP capability contract', async () => {
  const response = await fetch(`${baseUrl}/api/v2/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.success, true);
  assert.equal(body.data.api, 'v2');
  assert.deepEqual(body.data.capabilities, ['discovery', 'collections', 'gamification', 'safety-reports']);
});

test('v2 protected collection and gamification endpoints require existing authentication', async () => {
  for (const url of ['/api/v2/collections', '/api/v2/gamification/me']) {
    const response = await fetch(`${baseUrl}${url}`);
    assert.equal(response.status, 401, url);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.error, 'Autentikasi diperlukan');
  }
});

test('v2 discovery endpoints are registered and parameterized', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'api', 'v2.js'), 'utf8');
  for (const endpoint of ["router.get('/discovery/search'", "router.get('/discovery/recommendations'", "router.get('/discovery/price-insights'", "router.post('/collections'", "router.post('/safety/reports'"]) assert.match(source, new RegExp(endpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(source, /plainto_tsquery\('simple'/);
  assert.match(source, /LIMIT \?/);
});

test('v2 migration is additive and uses deny-by-default RLS for server-owned tables', () => {
  const migration = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', '020_v2_discovery_collections_gamification.sql'), 'utf8');
  for (const table of ['collections', 'collection_items', 'collection_item_votes', 'user_points', 'point_transactions', 'badges', 'user_badges']) assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
  assert.match(migration, /USING \(false\) WITH CHECK \(false\)/);
  assert.match(migration, /CREATE OR REPLACE FUNCTION award_sultrakita_points/);
});
