const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const auth = fs.readFileSync('auth.js', 'utf8');
const server = fs.readFileSync('server.js', 'utf8');

test('session authentication accepts bearer and canonical/legacy cookie transports through one extractor', () => {
  assert.match(auth, /const getSessionToken = req =>/);
  assert.match(auth, /name === 'sultra_session' \|\| name === 'sultra_admin_session'/);
  assert.match(auth, /const token = getSessionToken\(req\)/);
  assert.match(auth, /module\.exports = .*getSessionToken/);
});

test('issued sessions are stored as one-way hashes with bounded expiry', () => {
  assert.match(server, /crypto\.randomBytes\(32\)\.toString\('hex'\)/);
  assert.match(server, /crypto\.createHash\('sha256'\)\.update\(token\)/);
  assert.match(server, /ttlMs = 30 \* 24 \* 60 \* 60 \* 1000/);
  assert.match(server, /expires_at\) VALUES/);
});

test('login sets an HttpOnly same-site session cookie and responses are not cached', () => {
  assert.match(server, /sultra_session=\$\{token\}/);
  assert.match(server, /HttpOnly; SameSite=Lax/);
  assert.match(server, /const setSessionResponse = \(res, token\)/);
  assert.match(server, /setSessionResponse\(res, token\)/);
});

test('logout revokes the extracted token and clears the canonical cookie', () => {
  assert.match(server, /revokeToken\(getSessionToken\(req\)\)/);
  assert.match(server, /res\.setHeader\('Set-Cookie', clearSessionCookie\)/);
  assert.match(server, /app\.post\('\/api\/auth\/logout', requireAuth/);
});
