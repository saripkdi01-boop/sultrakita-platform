'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const adminRoot = path.join(__dirname, '..', 'public', 'admin');

test('admin auth memakai bearer-session existing dan server check', () => {
  const auth = fs.readFileSync(path.join(adminRoot, 'js', 'auth.js'), 'utf8');
  const api = fs.readFileSync(path.join(adminRoot, 'js', 'api.js'), 'utf8');
  assert.match(auth, /checkAdminAuth/);
  assert.match(auth, /\/api\/admin\/v2\//);
  assert.match(auth, /\/api\/auth\/logout/);
  assert.match(api, /authorization: `Bearer/);
  assert.doesNotMatch(auth, /SUPABASE_ANON_KEY|signInWithPassword|createClient|jsonwebtoken/);
});

test('admin app fail-closed sebelum layout dan page data dimuat', () => {
  const app = fs.readFileSync(path.join(adminRoot, 'js', 'app.js'), 'utf8');
  assert.match(app, /const auth = await window\.AdminAuth\.checkAdminAuth\(\)/);
  assert.match(app, /if \(!auth\) return/);
  assert.match(app, /data-permission/);
  assert.match(app, /admin-name/);
  assert.match(app, /admin-role/);
});

test('permission resource:action dipetakan ke permission matrix server', () => {
  const rbac = fs.readFileSync(path.join(adminRoot, 'js', 'rbac.js'), 'utf8');
  assert.match(rbac, /dashboard:view/);
  assert.match(rbac, /settings:manage/);
  assert.match(rbac, /element\.hidden = !hasPermission/);
});
