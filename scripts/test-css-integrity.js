#!/usr/bin/env node
/**
 * Regression guard: next-app/app/globals.css integrity.
 *
 * Precedent: 2026-10-05, PR #89 — a 4-byte "test" push overwrote the
 * ~580KB globals.css on main, broke production styling, and burned 3
 * failed Vercel deployments before revert (PR #91) + clean re-apply (PR #92).
 *
 * This guard fails `npm test` (via the scripts/test-*.js glob) if globals.css
 * is suspiciously small, catching destructive overwrites before merge.
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'next-app', 'app', 'globals.css');
// Production globals.css is ~580KB (2026-10-05). Anything under 100KB is
// certainly a destructive overwrite, not a legitimate refactor.
const MIN_BYTES = 100 * 1024;

let stat;
try {
  stat = fs.statSync(file);
} catch (e) {
  console.error(`CSS integrity guard failed: cannot stat ${file}: ${e.message}`);
  process.exit(1);
}

if (stat.size < MIN_BYTES) {
  console.error(
    `CSS integrity guard FAILED: globals.css is ${stat.size} bytes ` +
    `(minimum expected ${MIN_BYTES}). Possible destructive overwrite — ` +
    `do NOT merge. See PR #89 incident (2026-10-05).`
  );
  process.exit(1);
}

console.log(`CSS integrity guard passed (globals.css = ${stat.size} bytes).`);
