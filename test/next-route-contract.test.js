'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const feedRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'feed', 'route.ts'), 'utf8');

test('feed route selects only profile columns that exist in Supabase', () => {
  assert.match(feedRoute, /profiles\(display_name,avatar_url\)/);
  assert.doesNotMatch(feedRoute, /profiles\([^)]*\bname\b/);
});

test('feed route rejects invalid cursors and filters without leaking database errors', () => {
  assert.match(feedRoute, /invalid_cursor/);
  assert.match(feedRoute, /invalid_filter/);
  assert.match(feedRoute, /feed_query_failed/);
});
