'use strict';

// Utilitas kriptografi bersama — diekstrak dari server.js tanpa perubahan perilaku.
const crypto = require('node:crypto');

// Perbandingan string timing-safe (mencegah timing attack pada secret/token).
const safeEqual = (expected, actual) => {
  const expectedBuffer = Buffer.from(String(expected));
  const actualBuffer = Buffer.from(String(actual || ''));
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

const sha256Hex = value => crypto.createHash('sha256').update(String(value)).digest('hex');

const randomHex = bytes => crypto.randomBytes(bytes).toString('hex');

module.exports = { safeEqual, sha256Hex, randomHex };
