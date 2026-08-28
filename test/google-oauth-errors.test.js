const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const adminSso = fs.readFileSync(path.join(root, 'google-admin-sso.js'), 'utf8');

test('Google token exchange exposes bounded provider diagnostics only', () => {
  assert.match(server, /provider_error_description/);
  assert.match(server, /slice\(0, 240\)/);
  assert.match(server, /console\.error\('\[google-token-exchange\]'/);
  assert.match(adminSso, /providerDescription/);
  assert.match(adminSso, /slice\(0, 240\)/);
});

test('Google OAuth diagnostics do not log token or authorization code', () => {
  const serverDiagnostic = server.match(/console\.error\('\[google-token-exchange\]'[^;]+;/)?.[0] || '';
  const adminDiagnostic = adminSso.match(/console\.error\('\[google-admin-token-exchange\]'[^;]+;/)?.[0] || '';
  const diagnosticArea = `${serverDiagnostic}\n${adminDiagnostic}`;
  assert.doesNotMatch(diagnosticArea, /tokenPayload\.access_token/);
  assert.doesNotMatch(diagnosticArea, /client_secret/);
  assert.doesNotMatch(diagnosticArea, /req\.query\.code/);
});
