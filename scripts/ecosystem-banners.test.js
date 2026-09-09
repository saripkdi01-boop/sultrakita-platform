const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const slider = fs.readFileSync(path.join(root, 'next-app/components/marketing/EcosystemSlider.tsx'), 'utf8');
const actions = fs.readFileSync(path.join(root, 'next-app/lib/actions/ecosystem-banners.ts'), 'utf8');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260914000000_ecosystem_banners.sql'), 'utf8');
const admin = fs.readFileSync(path.join(root, 'next-app/app/admin/ecosystem-banners/page.tsx'), 'utf8');

for (const appSlug of ['marketplace', 'jobs', 'suits']) {
  test(`slider contract supports ${appSlug}`, () => {
    assert.match(slider, /appSlug: BannerAppSlug/);
    assert.match(actions, new RegExp(`'${appSlug}'`));
  });
}

test('slider contract includes autoplay controls and reduced motion support', () => {
  assert.match(slider, /setInterval/);
  assert.match(slider, /5000/);
  assert.match(slider, /Slide sebelumnya/);
  assert.match(slider, /Slide berikutnya/);
  assert.match(slider, /Jeda rotasi banner/);
  assert.match(slider, /prefers-reduced-motion/);
  assert.match(slider, /aria-roledescription="carousel"/);
});

test('slider contract sends all privacy-safe analytics events', () => {
  for (const event of ['banner_view', 'banner_cta_click', 'banner_next', 'banner_pause']) assert.match(slider, new RegExp(event));
});

test('migration limits apps, schedules public visibility, and protects writes with admin RLS', () => {
  assert.match(migration, /check \(app_slug in \('marketplace', 'jobs', 'suits'\)\)/);
  assert.match(migration, /starts_at is null or starts_at <= now\(\)/);
  assert.match(migration, /ends_at is null or ends_at > now\(\)/);
  assert.match(migration, /p\.role = 'admin'/);
  assert.match(migration, /ecosystem_banner_events/);
});

test('server action has five-banner limit and fallback', () => {
  assert.match(actions, /limit\(5\)/);
  assert.match(actions, /fallbackBanners/);
  assert.match(actions, /requireAdmin/);
});

test('admin UI supports CRUD, scheduling, priority, active state, and preview', () => {
  for (const token of ['createEcosystemBanner', 'updateEcosystemBanner', 'deleteEcosystemBanner', 'priority', 'starts_at', 'ends_at', 'is_active', 'EcosystemSlider', 'Preview']) assert.match(admin, new RegExp(token));
});
