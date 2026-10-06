const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('property navigation uses the canonical SUKI Suits label and iconic building mark', () => {
  const navigation = read('next-app/config/navigation.ts');
  const quickNav = read('next-app/components/layout/QuickNavBar.tsx');
  // Audit realita 2026-10-03: /properti adalah direktori real estate
  // (tabel properties + inquiry hidup), sehingga label kanonis navigasi
  // adalah "SUKI Properti" dengan ikon khas SUKI (SukiIconProperti).
  assert.match(navigation, /label: 'SUKI Properti'/);
  assert.match(navigation, /icon: suki\(SukiIconProperti\)/);
  assert.match(navigation, /route: '\/properti'/);
  // QuickNavBar memakai kunci i18n t.sukiSuits + ikon Building2; string
  // tampil untuk pengguna tetap "SUKI Suits" di kamus navigasi.
  assert.match(quickNav, /label: t\.sukiSuits, Icon: Building2/);
  const dictNav = read('next-app/lib/i18n/dict-navigation.ts');
  assert.match(dictNav, /"sukiSuits": "SUKI Suits"/);
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
