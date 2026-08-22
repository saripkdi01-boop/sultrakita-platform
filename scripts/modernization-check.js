#!/usr/bin/env node
'use strict';

const fs = require('node:fs');

const required = [
  'modernization/php/database/001_marketplace_schema.sql',
  'modernization/php/public/get_listings.php',
  'modernization/php/public/.htaccess',
  'modernization/react/src/components/ListingCard.jsx',
  'modernization/react/package.json',
  'updates/2026-08-22-modernization/README.md',
];

for (const path of required) {
  if (!fs.existsSync(path)) throw new Error(`missing modernization artifact: ${path}`);
}

const php = fs.readFileSync('modernization/php/public/get_listings.php', 'utf8');
for (const marker of ['PDO::ATTR_EMULATE_PREPARES', 'prepare(', 'JSON_UNESCAPED_UNICODE', 'LIMIT :limit OFFSET :offset']) {
  if (!php.includes(marker)) throw new Error(`PHP endpoint missing security/contract marker: ${marker}`);
}

const schema = fs.readFileSync('modernization/php/database/001_marketplace_schema.sql', 'utf8');
for (const table of ['CREATE TABLE users', 'CREATE TABLE listings', 'CREATE TABLE videos', 'CREATE TABLE social_links']) {
  if (!schema.includes(table)) throw new Error(`schema missing table: ${table}`);
}

const component = fs.readFileSync('modernization/react/src/components/ListingCard.jsx', 'utf8');
for (const marker of ['dark:bg-', 'dark:text-', 'thumbnail_url', 'aria-label', 'onToggleFavorite']) {
  if (!component.includes(marker)) throw new Error(`ListingCard missing requirement: ${marker}`);
}

console.log(`PASS: ${required.length} modernization artifacts and required security/UI markers verified`);
