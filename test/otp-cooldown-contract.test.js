const test = require('node:test');
const assert = require('node:assert/strict');

// Pasca-refactor: kode server tersebar di server.js + routes/ + lib/.
const { serverSource: server } = require('./helpers/server-source');

test('OTP request enforces a bounded per-destination cooldown after validation', () => {
  assert.match(server, /otpDestinationCooldownSeconds = \(\) =>/);
  assert.match(server, /Math\.min\(300, Math\.max\(30, Number\(process\.env\.OTP_DESTINATION_COOLDOWN_SECONDS/);
  assert.match(server, /FROM auth_otp_challenges WHERE channel = \? AND destination_hash = \?/);
  assert.match(server, /consumed_at IS NULL AND created_at > now\(\) - \(\? \* interval \\'1 second\\'\)/);
  assert.match(server, /OTP_COOLDOWN/);
});

test('OTP cooldown returns Retry-After without exposing destination secrets', () => {
  assert.match(server, /res\.setHeader\('Retry-After', String\(cooldown\)\)/);
  assert.doesNotMatch(server, /OTP_COOLDOWN[^\n]*destination/);
});
