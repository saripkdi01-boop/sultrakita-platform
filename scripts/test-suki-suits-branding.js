const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('property navigation uses the canonical SUKI Suits label and iconic building mark', () => {
  const navigation = read('next-app/config/navigation.ts');
  const quickNav = read('next-app/components/layout/QuickNavBar.tsx');
  assert.match(navigation, /label: 'SUKI Suits'/);
  assert.doesNotMatch(navigation, /SUKI Properti/);
  assert.match(navigation, /icon: Building2/);
  assert.match(quickNav, /label: 'SUKI Suits', Icon: Building2/);
});

test('property header branding is contextual and accessible', () => {
  const brandLogo = read('next-app/components/layout/BrandLogo.tsx');
  assert.match(brandLogo, /const isSuits/);
  assert.match(brandLogo, /<Building2/);
  assert.match(brandLogo, /SUKI Suits/);
  assert.doesNotMatch(brandLogo, /SUKI Properti/);
});

test('database registry migration normalizes SUKI Suits metadata and icon', () => {
  const migration = read('supabase/migrations/20260913010000_suki_suits_branding.sql');
  for (const marker of ["name = 'SUKI Suits'", "short_name = 'Suits'", "route = '/properti'", "icon = 'building-2'", "where slug = 'suki-suits'"]) {
    assert.match(migration, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
