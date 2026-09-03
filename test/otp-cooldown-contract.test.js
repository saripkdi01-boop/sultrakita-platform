const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const server = fs.readFileSync('server.js', 'utf8');

test('OTP request enforces a bounded per-destination cooldown after validation', () => {
  assert.match(server, /otpDestinationCooldownSeconds = Math\.min\(300, Math\.max\(30/);
  assert.match(server, /FROM auth_otp_challenges WHERE channel = \? AND destination_hash = \?/);
  assert.match(server, /consumed_at IS NULL AND created_at > now\(\) - \(\? \* interval \\'1 second\\'\)/);
  assert.match(server, /OTP_COOLDOWN/);
});

test('OTP cooldown returns Retry-After without exposing destination secrets', () => {
  assert.match(server, /res\.setHeader\('Retry-After', String\(otpDestinationCooldownSeconds\)\)/);
  assert.doesNotMatch(server, /OTP_COOLDOWN[^\n]*destination/);
});
