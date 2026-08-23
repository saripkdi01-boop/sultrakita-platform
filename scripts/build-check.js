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
  'shared/taxonomy.js',
  'database/migrations/002_normalize_postgres_types.sql',
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
