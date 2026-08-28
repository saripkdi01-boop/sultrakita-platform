'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const routerSource = fs.readFileSync(path.join(__dirname, '..', 'api', 'admin', 'index.js'), 'utf8');
const serverSource = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

test('Section 4 router dipasang additive pada Express existing', () => {
  assert.match(serverSource, /app\.use\('\/api\/admin\/v2', adminApiV2\)/);
  assert.match(routerSource, /require\('\.\.\/\.\.\/auth'\)/);
  assert.match(routerSource, /require\('\.\.\/\.\.\/database'\)/);
  assert.match(routerSource, /requirePermission\(/);
});

test('Section 4 tidak membuat authentication stack JWT/Supabase client kedua', () => {
  assert.doesNotMatch(routerSource, /@supabase\/supabase-js/);
  assert.doesNotMatch(routerSource, /jsonwebtoken|jwt\.sign|jwt\.verify/);
  assert.doesNotMatch(routerSource, /SUPABASE_SERVICE_ROLE_KEY/);
});

test('Section 4 mendefinisikan route admin inti', () => {
  for (const pattern of [
    /router\.get\('\/dashboard\/overview'/,
    /router\.get\('\/users'/,
    /router\.get\('\/listings'/,
    /router\.get\('\/reports'/,
    /router\.get\('\/verifications'/,
    /router\.get\('\/analytics'/,
    /router\.get\('\/audit-logs'/,
    /router\.get\('\/settings'/,
  ]) assert.match(routerSource, pattern);
});
