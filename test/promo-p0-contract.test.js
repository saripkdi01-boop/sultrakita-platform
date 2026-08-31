'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const app = require('../server');
const { buildUtm, buildExportPackage, normalizeChannels } = require('../api/promo');

const root = path.join(__dirname, '..');
let server;
let baseUrl;

test.before(() => {
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('P0 migration is additive, idempotent, and deny-by-default', () => {
  const migration = fs.readFileSync(path.join(root, 'database/migrations/022_suki_promo_hub_p0.sql'), 'utf8');
  const apiSource = fs.readFileSync(path.join(root, 'api/promo.js'), 'utf8');
  for (const table of ['promo_campaigns', 'promo_channels', 'promo_channel_events', 'promo_utm_links', 'promo_exports', 'promo_events']) {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`));
    assert.match(migration, new RegExp(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`));
    assert.match(migration, new RegExp(`${table}_no_client_access`));
  }
  assert.match(migration, /UNIQUE\(campaign_id, channel_id\)/);
  assert.match(apiSource, /ON CONFLICT \(event_key\) DO NOTHING/);
  assert.match(migration, /P0 campaign drafts bound to an existing seller-owned listing/);
});

test('UTM builder creates deterministic channel-specific attribution links', () => {
  const campaign = { id: 17, name: 'Kopi Tolaki Kendari', location: 'Kota Kendari' };
  const channel = { channel: 'instagram' };
  const first = buildUtm(campaign, channel, 'https://sultrakita-platform.vercel.app/listing/kopi-tolaki-99');
  const second = buildUtm(campaign, channel, 'https://sultrakita-platform.vercel.app/listing/kopi-tolaki-99');
  assert.equal(first.destination_url, second.destination_url);
  assert.match(first.destination_url, /utm_source=instagram/);
  assert.match(first.destination_url, /utm_medium=manual_export/);
  assert.match(first.destination_url, /utm_campaign=kopi-tolaki-kendari/);
  assert.match(first.destination_url, /utm_content=campaign-17-instagram/);
  assert.match(first.destination_url, /utm_term=kota-kendari/);
});

test('P0 channel normalization never invents unsupported providers', () => {
  assert.deepEqual(normalizeChannels(['sultrakita', 'facebook', 'linkedin', 'facebook']), ['sultrakita', 'facebook']);
  assert.deepEqual(normalizeChannels([]), ['sultrakita']);
});

test('manual export package explicitly declares manual action and verified listing facts', () => {
  const packageData = buildExportPackage(
    { id: 4, name: 'Kampanye Lokal', objective: 'traffic', cta: 'Lihat listing', location: 'Kendari' },
    { id: 8, title: 'Kopi Tolaki', description: 'Kopi lokal dari petani Sulawesi Tenggara.', price: 45000, district: 'Kendari', city: 'Kendari', image_url: null },
    { channel: 'tiktok' },
    { destination_url: 'https://example.test/?utm_source=tiktok', utm_source: 'tiktok', utm_medium: 'manual_export', utm_campaign: 'kampanye-lokal', utm_content: 'campaign-4-tiktok', utm_term: 'kendari' },
  );
  assert.equal(packageData.channel.state, 'MANUAL_ACTION_REQUIRED');
  assert.match(packageData.disclaimer, /manual/i);
  assert.equal(packageData.listing.price, 45000);
  assert.equal(packageData.content.headline, 'Kopi Tolaki');
});

test('P0 health exposes only real capabilities and protected endpoints reject anonymous access', async () => {
  const healthResponse = await fetch(`${baseUrl}/api/v2/promo/health`);
  assert.equal(healthResponse.status, 200);
  const health = await healthResponse.json();
  assert.equal(health.success, true);
  assert.equal(health.data.phase, 'P0');
  assert.equal(health.data.capabilities.external_provider_publish, false);
  assert.equal(health.data.capabilities.native_sultrakita_marketplace, true);
  for (const endpoint of ['/listings', '/campaigns', '/connections']) {
    const response = await fetch(`${baseUrl}/api/v2/promo${endpoint}`);
    assert.equal(response.status, 401, endpoint);
    const body = await response.json();
    assert.equal(body.success, false);
    assert.equal(body.error, 'Autentikasi diperlukan');
  }
});

test('server binds campaign owner and listing seller to session identity', () => {
  const source = fs.readFileSync(path.join(root, 'api/promo.js'), 'utf8');
  assert.match(source, /owner_id, seller_id, listing_id/);
  assert.match(source, /Number\(listing\.seller_id\) !== userId\(req\)/);
  assert.match(source, /promo_campaigns.*owner_id = \?/s);
  assert.match(source, /campaign hanya dapat dibuat untuk listing milik session/i);
  assert.match(source, /state = 'PUBLISHED'/);
  assert.match(source, /provider_reference/);
  assert.doesNotMatch(source, /success:\s*true[^\n]+published/);
});

test('P0 UI includes explicit loading, empty, error, and manual fallback states', () => {
  const html = fs.readFileSync(path.join(root, 'public/promo/index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'public/promo/promo.js'), 'utf8');
  assert.match(html, /Memuat campaign/);
  assert.match(js, /Belum ada campaign/);
  assert.match(html, /MANUAL_ACTION_REQUIRED/);
  assert.match(html, /Provider eksternal/);
  assert.match(js, /status === 401/);
  assert.match(js, /MANUAL_ACTION_REQUIRED/);
  assert.match(js, /Salin package JSON/);
});
