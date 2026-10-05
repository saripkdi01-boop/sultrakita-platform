#!/usr/bin/env node
/**
 * Regression guard: marketplace photo key validation contract.
 *
 * Precedent: 2026-10-05, PR #78 → #88. PR #78 changed photo keys to
 * `<uid>/marketplace/...` (required by the Supabase Storage "owner insert"
 * policy), but the client validation regex in photoSchema was still the R2-era
 * `/^marketplace\//`. Result: EVERY listing with photos failed client
 * validation ("Kunci foto tidak valid.") and the form silently scrolled up.
 * Fixed in PR #88 by accepting both formats.
 *
 * This guard fails `npm test` (via the scripts/test-*.js glob) if the
 * photoSchema key regex regresses to the old single-format pattern.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'next-app', 'lib', 'marketplace-create.ts');
let src;
try {
  src = fs.readFileSync(file, 'utf8');
} catch (e) {
  console.error(`Photo key contract failed: cannot read ${file}: ${e.message}`);
  process.exit(1);
}

// The fixed pattern: optional "<uuid>/" prefix, then "marketplace/".
// Accepts `<uid>/marketplace/2026-10-05/x.jpg` AND legacy `marketplace/2026-10-05/x.jpg`.
const FIXED_FRAGMENT = '([0-9a-fA-F-]{36}\\/)?marketplace\\/';

if (!src.includes('photoSchema')) {
  console.error('Photo key contract failed: photoSchema not found in marketplace-create.ts.');
  process.exit(1);
}
if (!src.includes(FIXED_FRAGMENT)) {
  console.error(
    'Photo key contract FAILED: photoSchema key regex does not accept both ' +
    '`<uid>/marketplace/...` and legacy `marketplace/...` formats. ' +
    'See PR #88 incident (2026-10-05).'
  );
  process.exit(1);
}

// Functional check: the fixed pattern must accept both key formats and
// reject traversal-ish / malformed keys.
{
  const re = new RegExp('^([0-9a-fA-F-]{36}\\/)?marketplace\\/');
  const uid = '123e4567-e89b-12d3-a456-426614174000';
  const cases = [
    [`${uid}/marketplace/2026-10-05/abc.jpg`, true],
    ['marketplace/2026-10-05/abc.jpg', true],
    ['evil/../marketplace/x.jpg', false],
    ['marketplace', false],
  ];
  for (const [key, expected] of cases) {
    if (re.test(key) !== expected) {
      console.error(`Photo key contract FAILED: key "${key}" expected ${expected}.`);
      process.exit(1);
    }
  }
}

console.log('Photo key contract passed (dual-format photo keys accepted).');
