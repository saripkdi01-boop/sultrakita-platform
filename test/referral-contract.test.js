'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
test('launch referral campaign contract is present', () => {
  const migration = fs.readFileSync(path.join(root, 'database/migrations/026_referral_launch_campaign.sql'), 'utf8');
  const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
  const page = fs.readFileSync(path.join(root, 'public/referral/index.html'), 'utf8');
  assert.match(migration, /CREATE TABLE IF NOT EXISTS referral_profiles/);
  assert.match(migration, /CREATE TABLE IF NOT EXISTS point_redemptions/);
  assert.match(server, /app\.use\('\/api\/referral', referralApi\)/);
  assert.match(server, /ajak-teman/);
  assert.match(page, /Ajak Teman, Tumbuh Bersama/);
  assert.match(page, /navigator\.share/);
});
