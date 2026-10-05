const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('property navigation uses the canonical SUKI Suits label and iconic building mark', () => {
  const navigation = read('next-app/config/navigation.ts');
  const quickNav = read('next-app/components/layout/QuickNavBar.tsx');
  const navDict = read('next-app/lib/i18n/dict-navigation.ts');
  // Audit realita 2026-10-03 (lihat komentar di navigation.ts): /properti adalah
  // direktori real estate sehingga sidebar memakai label 'SUKI Properti' + ikon khas
  // SUKI. TODO(owner): BrandLogo + registry + dict-navigation masih memakai 'SUKI
  // Suits' — putuskan SATU nama kanonis lalu selaraskan semua permukaan + test ini.
  assert.match(navigation, /label: 'SUKI Properti'/);
  assert.match(navigation, /icon: suki\(SukiIconProperti\)/);
  // QuickNavBar memakai label i18n (kunci t.sukiSuits) + ikon Building2.
  assert.match(quickNav, /label: t\.sukiSuits, Icon: Building2/);
  assert.match(navDict, /"sukiSuits": "SUKI Suits"/);
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
