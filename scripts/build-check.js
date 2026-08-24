#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const required = [
  'public/index.html',
  'public/app.js',
  'public/styles.css',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/site.webmanifest',
  'public/sw.js',
  'public/taxonomy.js',
  'public/marketplace-bridge.js',
  'public/theme.js',
  'shared/taxonomy.js',
  'database/migrations/002_normalize_postgres_types.sql',
  'database/migrations/004_email_otp.sql',
  'database/migrations/005_auth_channels_google.sql',
  'database/migrations/006_seller_onboarding.sql',
  'database/migrations/007_external_catalogs.sql',
  'database/migrations/008_external_job_image.sql',
  'database/migrations/009_seed_kendari_job_url_cards.sql',
  'database/migrations/010_universal_link_cards.sql',
  'database/migrations/011_telegram_admin_audit.sql',
  'docs/SELLER-ONBOARDING-AUDIT.md',
  'docs/SELLER-ONBOARDING-IMPLEMENTATION.md',
  'docs/EXTERNAL-DATA-INTEGRATION-RESEARCH.md',
  'docs/EXTERNAL-CATALOG-INTEGRATION.md',
  'docs/UNIVERSAL-LINK-CARDS.md',
  'docs/TELEGRAM-AULAA-SETUP.md',
  'OTP-EMAIL-SETUP.md',
  'GOOGLE-OAUTH-SETUP.md',
  'scripts/migrate-postgres.js',
  'scripts/seed-demo.js',
  'server.js',
];

for (const file of required) {
  const absolute = path.join(process.cwd(), file);
  if (!fs.existsSync(absolute)) throw new Error(`required build artifact missing: ${file}`);
  if (fs.statSync(absolute).size === 0) throw new Error(`required build artifact is empty: ${file}`);
}

const html = fs.readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf8');
for (const marker of ['<html', '<head', '<body', '</html>']) {
  if (!html.toLowerCase().includes(marker)) throw new Error(`index.html missing marker: ${marker}`);
}

console.log(`PASS: ${required.length} required application artifacts and HTML markers verified`);
