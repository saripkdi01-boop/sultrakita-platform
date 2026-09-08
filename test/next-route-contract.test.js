'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const feedRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'feed', 'route.ts'), 'utf8');
const listingsRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'listings', 'route.ts'), 'utf8');

test('feed route selects only profile columns that exist in Supabase', () => {
  assert.match(feedRoute, /profiles\(display_name,avatar_url\)/);
  assert.doesNotMatch(feedRoute, /profiles\([^)]*\bname\b/);
});

test('feed route rejects invalid cursors and filters without leaking database errors', () => {
  assert.match(feedRoute, /invalid_cursor/);
  assert.match(feedRoute, /invalid_filter/);
  assert.match(feedRoute, /feed_query_failed/);
});

test('marketplace demo data is never used in production', () => {
  assert.match(listingsRoute, /ALLOW_DEMO_DATA.*NODE_ENV !== 'production'/);
  assert.match(listingsRoute, /source: 'unavailable'/);
  assert.match(listingsRoute, /status: 503/);
  assert.match(listingsRoute, /invalid_price_filter/);
  assert.match(listingsRoute, /invalid_price_range/);
});
