'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const feedRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'feed', 'route.ts'), 'utf8');
const listingsRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'listings', 'route.ts'), 'utf8');
const postsAction = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'actions', 'posts.ts'), 'utf8');
const composer = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'CreatePostModal.tsx'), 'utf8');
const mediaActionIcon = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'MediaActionIcon.tsx'), 'utf8');
const tagToolRow = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'TagToolRow.tsx'), 'utf8');

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
  assert.match(listingsRoute, /image_url/);
  assert.doesNotMatch(listingsRoute, /select\('[^']*\bimages\b/);
  assert.match(listingsRoute, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(listingsRoute, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(listingsRoute, /is_demo\.is\.null,is_demo\.eq\.false/);
  assert.match(listingsRoute, /curated_demo/);
  assert.match(listingsRoute, /DEMO-SEED-/);
});

test('Create Post binds identity server-side and supports safe idempotent publish', () => {
  assert.match(postsAction, /requireServerUser/);
  assert.match(postsAction, /user_id: user\.id/);
  assert.match(postsAction, /idempotency_key/);
  assert.match(postsAction, /MAX_CONTENT = 2000/);
  assert.match(postsAction, /status: 'published'/);
  assert.match(composer, /Simpan Draft/);
  assert.match(composer, /Bagikan/);
  assert.match(composer, /localStorage/);
  assert.match(composer, /isInstagramActive/);
  assert.match(composer, /Musik/);
});

test('MediaActionIcon exposes reusable active and default variants', () => {
  assert.match(mediaActionIcon, /icon: ReactNode/);
  assert.match(mediaActionIcon, /label: string/);
  assert.match(mediaActionIcon, /onClick: \(\) => void/);
  assert.match(mediaActionIcon, /'default' \| 'active'/);
  assert.match(mediaActionIcon, /min-w-\[88px\]/);
  assert.match(mediaActionIcon, /h-\[72px\]/);
  assert.match(mediaActionIcon, /ring-2 ring-teal-200/);
  assert.match(composer, /MediaActionIcon/);
});

test('TagToolRow manages selected metadata chips and supports controlled state', () => {
  assert.match(tagToolRow, /id: string/);
  assert.match(tagToolRow, /icon: ReactNode/);
  assert.match(tagToolRow, /selectedTags\?: string\[\]/);
  assert.match(tagToolRow, /onSelectedTagsChange\?/);
  assert.match(tagToolRow, /aria-pressed/);
  assert.match(tagToolRow, /Metadata terpilih/);
  assert.match(tagToolRow, /overflow-x-auto/);
  assert.match(composer, /TagToolRow/);
  assert.match(composer, /selectedTags/);
});
