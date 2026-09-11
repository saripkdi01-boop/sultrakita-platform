'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const feedRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'feed', 'route.ts'), 'utf8');
const listingsRoute = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'api', 'listings', 'route.ts'), 'utf8');
const postsAction = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'actions', 'posts.ts'), 'utf8');
const composer = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'CreatePostModal.tsx'), 'utf8');
const uploadAction = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'actions', 'upload.ts'), 'utf8');
const groupsPage = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'groups', 'page.tsx'), 'utf8');
const groupsAction = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'actions', 'groups.ts'), 'utf8');
const groupsMigration = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'migrations', '20260912060000_suki_communities.sql'), 'utf8');
const appLayout = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'layout', 'AppLayout.tsx'), 'utf8');
const createMenu = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'layout', 'CreateMenu.tsx'), 'utf8');
const berandaPage = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'beranda', 'page.tsx'), 'utf8');

test('feed route selects only profile columns that exist in Supabase', () => {
  assert.match(feedRoute, /profiles\(display_name,username,avatar_url\)/);
  assert.match(feedRoute, /eq\('status', 'published'\)/);
  assert.match(postsAction, /privacy/);
  assert.match(composer, /Publikasikan sekarang/);
  assert.match(composer, /post-location/);
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
  assert.match(postsAction, /mediaUrls/);
  assert.match(postsAction, /status: 'published'/);
  assert.match(postsAction, /profiles/);
  assert.match(composer, /Simpan Draft/);
  assert.match(composer, /Publikasikan sekarang/);
  assert.match(composer, /Mempublikasikan/);
  assert.match(composer, /localStorage/);
  assert.match(composer, /type="file"/);
  assert.match(composer, /signed URL/);
});

test('Create Post media upload is authenticated and bounded', () => {
  assert.match(uploadAction, /requireServerUser/);
  assert.match(uploadAction, /MAX_IMAGE_BYTES/);
  assert.match(uploadAction, /MAX_VIDEO_BYTES/);
  assert.match(uploadAction, /content-length-range/);
  assert.match(uploadAction, /eq', '\$Content-Type'/);
  assert.doesNotMatch(uploadAction, /NEXT_PUBLIC_R2_ACCESS/);
});

test('Create Post wiring preserves the requested content type', () => {
  const page = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'beranda', 'page.tsx'), 'utf8');
  const input = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'CreatePostInput.tsx'), 'utf8');
  assert.match(input, /onCreate\?\.\('reel'\)/);
  assert.match(page, /CreatePostInput onCreate=\{openComposer\}/);
  assert.match(composer, /postType === 'reel'/);
});


test('profile identity uses authenticated nickname and live profile columns', () => {
  const sessionHook = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'hooks', 'useSessionProfile.ts'), 'utf8');
  const profileHub = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'profile', 'ProfileHub.tsx'), 'utf8');
  const stories = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'StoriesSection.tsx'), 'utf8');
  assert.match(sessionHook, /getProfileNickname/);
  assert.match(sessionHook, /username.*display_name/);
  assert.match(sessionHook, /recipient_id/);
  assert.doesNotMatch(sessionHook, /headline|city/);
  assert.match(profileHub, /Nama panggilan \/ username/);
  assert.match(profileHub, /supabase\.from\('profiles'\)\.update/);
  assert.doesNotMatch(stories, /Aulia|UMKM Sultra|Cerita Kendari|Wakatobi/);
});

test('Groups is a real authenticated community surface, not demo content', () => {
  assert.match(groupsPage, /createGroup/);
  assert.match(groupsPage, /joinGroup/);
  assert.match(groupsPage, /createGroupPost/);
  assert.match(groupsPage, /Cari komunitas berdasarkan nama/);
  assert.match(groupsPage, /Buat komunitas baru/);
  assert.match(groupsAction, /requireServerUser/);
  assert.match(groupsAction, /create_suki_group/);
  assert.match(groupsAction, /group_posts/);
  assert.match(groupsMigration, /create table if not exists public\.groups/);
  assert.match(groupsMigration, /alter table public\.groups enable row level security/);
  assert.match(groupsMigration, /group_posts_member_insert/);
  assert.doesNotMatch(groupsPage, /125 rb|48 rb|SUKI Foodies|UMKM Sultra Naik Kelas/);
});

test('Groups quick navigation and publish entry are functional across shells', () => {
  assert.match(appLayout, /key === 'groups'.*window\.location\.href = '\/groups'/);
  assert.match(createMenu, /window\.location\.href = `\/beranda\?compose=\$\{type\}`/);
  assert.match(berandaPage, /URLSearchParams\(window\.location\.search\)/);
  assert.match(berandaPage, /get\('compose'\)/);
});
