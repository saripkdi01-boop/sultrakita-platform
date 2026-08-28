const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const helper = fs.readFileSync(path.join(root, 'google-admin-sso.js'), 'utf8');
const adminLogin = fs.readFileSync(path.join(root, 'public/admin/index.html'), 'utf8');

test('Google Admin SSO memakai allowlist dan verified profile', () => {
  assert.match(helper, /GOOGLE_ADMIN_EMAIL_ALLOWLIST/);
  assert.match(helper, /profile\.email_verified !== true/);
  assert.match(server, /GOOGLE_ADMIN_NOT_ALLOWLISTED/);
  assert.match(server, /GOOGLE_ADMIN_PROVISIONING_REQUIRED/);
  assert.match(server, /admin_role_assignments/);
});

test('Google Admin SSO tidak auto-provisioning user baru', () => {
  const adminCallback = server.slice(server.indexOf("app.get('/api/auth/google/admin/callback'"), server.indexOf("app.post('/api/auth/google/admin/exchange'"));
  assert.doesNotMatch(adminCallback, /INSERT INTO users/);
  assert.match(adminCallback, /WHERE u\.google_sub = \? OR lower\(u\.email\) = lower\(\?\)/);
});

test('Google Admin SSO memakai state, one-time code, dan safe next', () => {
  assert.match(server, /google_admin_oauth_state/);
  assert.match(server, /auth_login_exchanges/);
  assert.match(server, /safeAdminNext/);
  assert.match(adminLogin, /google_admin_code/);
  assert.match(adminLogin, /admin token/);
});

test('Google Admin SSO hanya mengizinkan akun owner SultraKita', () => {
  assert.match(helper, /sultrakitaplatform@gmail\.com/);
  assert.match(helper, /new Set\(\[ADMIN_GOOGLE_EMAIL\]\)/);
  assert.match(adminLogin, /Hanya `sultrakitaplatform@gmail\.com`/);
  assert.doesNotMatch(adminLogin, /id="session"/);
  assert.doesNotMatch(adminLogin, /id="admin-token"/);
});
