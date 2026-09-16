const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const contract = fs.readFileSync(path.join(root, 'next-app/lib/feed-contract.ts'), 'utf8');
const route = fs.readFileSync(path.join(root, 'next-app/app/api/feed/route.ts'), 'utf8');
const hook = fs.readFileSync(path.join(root, 'next-app/hooks/useInfiniteFeed.ts'), 'utf8');

 test('Feed Suki mendefinisikan kontrak item dan page bersama', () => {
  for (const marker of ['FeedItemType', 'FeedAuthor', 'FeedEngagement', 'FeedViewerState', 'FeedPage', "contractVersion: 'suki-feed-v1'"]) {
    assert.match(contract + route, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('Feed Suki menormalisasi actor, media, visibility, engagement, dan viewer state', () => {
  for (const marker of ['normalizeItem', 'actor:', 'media:', 'visibility:', 'engagement:', 'viewer:', 'recommendation']) {
    assert.match(route, new RegExp(marker));
  }
  assert.match(hook, /item\.engagement\.likeCount \?\? 0/);
  assert.match(hook, /item\.viewer\.liked === true/);
});

test('Feed Suki menggunakan recommendation reason deterministik tanpa lokasi atau kontak implisit', () => {
  assert.match(route, /rankingVersion: 'deterministic-v1'/);
  assert.match(route, /reason: 'following'/);
  assert.match(route, /reason: 'popular'/);
  assert.match(route, /reason: 'fresh'/);
  assert.match(route, /followingActor: context\.followingIds\.has/);
  assert.doesNotMatch(route, /navigator\.geolocation|contacts|phonebook/);
});

test('Feed Suki memakai cursor tie-breaker created_at dan id', () => {
  assert.match(route, /order\('created_at', \{ ascending: false \}\)\.order\('id', \{ ascending: false \}\)/);
  assert.match(route, /created_at\.lt\.\$\{cursor\.createdAt\},and\(created_at\.eq\.\$\{cursor\.createdAt\},id\.lt\.\$\{cursor\.id\}\)/);
  assert.match(route, /createdAt: last\.created_at, id: last\.id/);
});

test('Feed Suki tidak mengarang aggregate yang belum tersedia', () => {
  assert.match(route, /likeCount: typeof row\.likes_count === 'number' \? row\.likes_count : null/);
  assert.match(route, /commentCount: typeof row\.comments_count === 'number' \? row\.comments_count : null/);
  assert.doesNotMatch(route, /select\([^)]*likes_count/);
});
