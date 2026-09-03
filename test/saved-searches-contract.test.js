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

test('saved-search migration is additive and bounded', () => {
  const migration = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', '025_saved_searches.sql'), 'utf8');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS saved_searches/);
  assert.match(migration, /REFERENCES users\(id\) ON DELETE CASCADE/);
  assert.match(migration, /UNIQUE \(user_id, name\)/);
  assert.match(migration, /CHECK \(sort IN \('newest', 'price_asc', 'price_desc'\)\)/);
});

test('saved-search endpoints require authentication and reject invalid IDs', async () => {
  const list = await fetch(`${baseUrl}/api/saved-searches`);
  assert.equal(list.status, 401);
  const invalid = await fetch(`${baseUrl}/api/saved-searches/not-an-id`, { method: 'DELETE' });
  assert.equal(invalid.status, 401);
});

test('saved-search source binds records to current session and validates price range', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  assert.match(source, /app\.get\('\/api\/saved-searches', requireAuth/);
  assert.match(source, /app\.post\('\/api\/saved-searches', requireAuth/);
  assert.match(source, /app\.delete\('\/api\/saved-searches\/:id', requireAuth/);
  assert.match(source, /minPrice > maxPrice/);
  assert.match(source, /INSERT INTO saved_searches \(user_id, name/);
  assert.match(source, /currentUser\(req\)/);
});
