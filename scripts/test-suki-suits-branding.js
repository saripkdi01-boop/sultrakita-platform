const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('property navigation uses the canonical SUKI Properti label and iconic mark', () => {
  const navigation = read('next-app/config/navigation.ts');
  const quickNav = read('next-app/components/layout/QuickNavBar.tsx');
  const navDict = read('next-app/lib/i18n/dict-navigation.ts');
  // Keputusan kanonis Sarip: nama vertikal properti = 'SUKI Properti'
  // (bukan 'SUKI Suits'). Sidebar sudah selaras; BrandLogo menyusul (Fase 1
  // visual 2026-10-07). QuickNavBar + dict-navigation masih memakai kunci
  // 'sukiSuits' — sweep penuh menunggu workstream rebrand terpisah.
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
  // Kanonis Sarip: header rute properti memakai 'SUKI Properti'.
  assert.match(brandLogo, /SUKI Properti/);
  assert.doesNotMatch(brandLogo, /SUKI Suits/);
});

test('database registry migration normalizes SUKI Suits metadata and icon', () => {
  const migration = read('supabase/migrations/20260913010000_suki_suits_branding.sql');
  for (const marker of ["name = 'SUKI Suits'", "short_name = 'Suits'", "route = '/properti'", "icon = 'building-2'", "where slug = 'suki-suits'"]) {
    assert.match(migration, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
