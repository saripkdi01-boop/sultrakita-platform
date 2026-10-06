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
// Fase 1: page.tsx area menjadi Server Component; logika client (baca query param,
// composer, dsb.) pindah ke page-client.tsx. Contract test membaca keduanya.
const berandaClient = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'beranda', 'page-client.tsx'), 'utf8');
const groupsClient = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'app', 'groups', 'page-client.tsx'), 'utf8');
// i18n (PR #81): literal UI pindah ke dictionary; contract test menegaskan kunci
// dipakai komponen DAN literal ada di dictionary.
const berandaDict = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'i18n', 'dict-beranda.ts'), 'utf8');

test('feed route selects only profile columns that exist in Supabase', () => {
  assert.match(feedRoute, /profiles\(display_name,username,avatar_url,visibility_settings\)/);
  assert.match(feedRoute, /visibility_settings\?\.avatar !== 'public'/);
  assert.match(feedRoute, /eq\('status', 'published'\)/);
  assert.match(postsAction, /privacy/);
  assert.match(composer, /b\.brPublishNow/);
  assert.match(berandaDict, /brPublishNow: "Publikasikan sekarang"/);
  assert.match(composer, /post-location/);
  assert.doesNotMatch(feedRoute, /profiles\([^)]*\bname\b/);
});

test('feed route rejects invalid cursors and filters without leaking database errors', () => {
  assert.match(feedRoute, /invalid_cursor/);
  // Fase 1.4: error code lama diganti helper error terpusat (format { error: { code, message, requestId } }).
  // Invarian tetap: kursor/filter tidak valid ditolak (400), error DB tidak bocor (pesan generik, 500).
  assert.match(feedRoute, /Filter feed tidak valid/);
  assert.match(feedRoute, /Kursor feed tidak valid/);
  assert.match(feedRoute, /internalError\(request, 'Feed belum dapat dimuat\.'\)/);
});

test('marketplace demo data is never used in production', () => {
  // Fase 1.1: query listing publik terpusat di lib/listings-query.ts (satu sumber
  // kebenaran untuk API route dan SSR halaman). Contract dibaca dari kedua berkas.
  const listingsQuery = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'listings-query.ts'), 'utf8');
  const apiErrorLib = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'api-error.ts'), 'utf8');
  assert.match(listingsRoute, /ALLOW_DEMO_DATA.*NODE_ENV !== 'production'/);
  assert.match(listingsRoute, /source: 'unavailable'/);
  assert.match(listingsRoute, /SERVICE_UNAVAILABLE/);
  // SERVICE_UNAVAILABLE dipetakan ke HTTP 503 oleh helper error terpusat.
  assert.match(apiErrorLib, /'SERVICE_UNAVAILABLE', message, 503/);
  assert.match(listingsRoute, /Filter harga minimum\/maksimum tidak valid/);
  assert.match(listingsRoute, /Harga minimum tidak boleh lebih besar dari maksimum/);
  assert.match(listingsQuery, /image_url/);
  // Kolom `images` (array foto) adalah bagian sah dari skema sejak Fase 2
  // (galeri multi-foto); guard lama yang melarang select `images` sudah usang.
  assert.match(listingsQuery, /SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(listingsQuery, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.doesNotMatch(listingsRoute, /NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY/);
  assert.match(listingsQuery, /is_demo\.is\.null,is_demo\.eq\.false/);
  assert.match(listingsQuery, /curated_demo/);
  assert.match(listingsQuery, /DEMO-SEED-/);
});

test('Create Post binds identity server-side and supports safe idempotent publish', () => {
  assert.match(postsAction, /requireServerUser/);
  assert.match(postsAction, /user_id: user\.id/);
  assert.match(postsAction, /idempotency_key/);
  assert.match(postsAction, /mediaUrls/);
  assert.match(postsAction, /status: 'published'/);
  assert.match(postsAction, /profiles/);
  assert.match(composer, /b\.brSaveDraft/);
  assert.match(berandaDict, /brSaveDraft: "Simpan Draft"/);
  assert.match(composer, /b\.brPublishNow/);
  assert.match(berandaDict, /brPublishNow: "Publikasikan sekarang"/);
  assert.match(composer, /b\.brPublishing/);
  assert.match(berandaDict, /brPublishing: "Mempublikasikan…"/);
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
  const input = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'CreatePostInput.tsx'), 'utf8');
  assert.match(input, /onCreate\?\.\('reel'\)/);
  // Fase 1: page.tsx menjadi Server Component yang me-render BerandaPageClient;
  // wiring composer (openComposer) kini ada di page-client.tsx.
  assert.match(berandaPage, /BerandaPageClient/);
  assert.match(berandaClient, /CreatePostInput onCreate=\{openComposer\}/);
  assert.match(composer, /postType === 'reel'/);
});


test('profile identity uses authenticated nickname and live profile columns', () => {
  const sessionHook = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'hooks', 'useSessionProfile.ts'), 'utf8');
  const profileHub = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'profile', 'ProfileHub.tsx'), 'utf8');
  const stories = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'components', 'beranda', 'StoriesSection.tsx'), 'utf8');
  const authProfileDict = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'i18n', 'dict-authprofile.ts'), 'utf8');
  assert.match(sessionHook, /getProfileNickname/);
  assert.match(sessionHook, /username.*display_name/);
  assert.match(sessionHook, /recipient_id/);
  assert.match(sessionHook, /city/);
  assert.match(sessionHook, /profile_id/);
  assert.match(profileHub, /t\.profileSetupUsername/);
  assert.match(authProfileDict, /profileSetupUsername: "Nama panggilan \/ username"/);
  assert.match(profileHub, /supabase\.from\('profiles'\)\.update/);
  assert.doesNotMatch(stories, /Aulia|UMKM Sultra|Cerita Kendari|Wakatobi/);
});

test('Groups is a real authenticated community surface, not demo content', () => {
  // Fase 1: page.tsx menjadi Server Component yang me-render GroupsPageClient;
  // interaksi (create/join/post) kini ada di page-client.tsx.
  assert.match(groupsPage, /GroupsPageClient/);
  assert.match(groupsClient, /createGroup/);
  assert.match(groupsClient, /joinGroup/);
  assert.match(groupsClient, /createGroupPost/);
  const groupsDict = fs.readFileSync(path.join(__dirname, '..', 'next-app', 'lib', 'i18n', 'dict-groups.ts'), 'utf8');
  assert.match(groupsClient, /g\.gSearchPh/);
  assert.match(groupsDict, /gSearchPh: "Cari komunitas berdasarkan nama…"/);
  assert.match(groupsClient, /g\.gCreateTitle/);
  assert.match(groupsDict, /gCreateTitle: "Buat komunitas baru"/);
  assert.match(groupsAction, /requireServerUser/);
  assert.match(groupsAction, /create_suki_group/);
  assert.match(groupsAction, /group_posts/);
  assert.match(groupsMigration, /create table if not exists public\.groups/);
  assert.match(groupsMigration, /alter table public\.groups enable row level security/);
  assert.match(groupsMigration, /group_posts_member_insert/);
  assert.doesNotMatch(groupsClient, /125 rb|48 rb|SUKI Foodies|UMKM Sultra Naik Kelas/);
});

test('Groups quick navigation and publish entry are functional across shells', () => {
  assert.match(appLayout, /key === 'groups'.*window\.location\.href = '\/groups'/);
  assert.match(createMenu, /window\.location\.href = `\/beranda\?compose=\$\{type\}`/);
  // Fase 1: baca query param ?compose= pindah ke page-client.tsx (page.tsx kini Server Component).
  assert.match(berandaClient, /URLSearchParams\(window\.location\.search\)/);
  assert.match(berandaClient, /get\('compose'\)/);
});
