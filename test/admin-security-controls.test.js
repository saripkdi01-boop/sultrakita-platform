'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const rbac = fs.readFileSync(path.join(root, 'rbac.js'), 'utf8');
const auth = fs.readFileSync(path.join(root, 'auth.js'), 'utf8');

test('admin security controls mempertahankan rate limit dan session timeout', () => {
  assert.match(server, /app\.use\('\/api', rateLimit\(\)\)/);
  assert.match(server, /const rateLimit = \(windowMs = 60_000, max = 60\)/);
  assert.match(rbac, /ADMIN_SESSION_MAX_MS/);
  assert.match(rbac, /ADMIN_SESSION_HOURS \|\| 8/);
  assert.match(rbac, /ADMIN_SESSION_EXPIRED/);
  assert.match(auth, /session_created_at/);
});

test('security boundary tidak menggunakan Supabase service role pada browser', () => {
  const adminFrontend = fs.readFileSync(path.join(root, 'public', 'admin', 'js', 'api.js'), 'utf8');
  assert.doesNotMatch(adminFrontend, /SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY|createClient/);
  assert.match(server, /fileSize: 5 \* 1024 \* 1024/);
  assert.match(server, /image\/jpeg.*image\/png.*image\/webp/);
});
