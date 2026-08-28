'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const router = fs.readFileSync(path.join(__dirname, '..', 'api', 'admin', 'index.js'), 'utf8');
const migration = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', '017_admin_product_imports.sql'), 'utf8');
const page = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'js', 'page.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'public', 'admin', 'css', 'admin.css'), 'utf8');

test('admin product import hanya membuka host marketplace yang ditentukan', () => {
  for (const host of ['facebook.com', 'tokopedia.com', 'shopee.co.id', 'olx.co.id']) assert.match(router, new RegExp(host.replace('.', '\\.'), 'i'));
  assert.match(router, /PRODUCT_URL_NOT_ALLOWED/);
  assert.match(router, /redirect: 'manual'/);
  assert.match(router, /parsed\.protocol !== 'https:'/);
});

test('admin product import memiliki draft review dan provenance native listing', () => {
  assert.match(migration, /CREATE TABLE IF NOT EXISTS admin_listing_import_drafts/);
  assert.match(migration, /source_url TEXT/);
  assert.match(migration, /image_urls JSONB/);
  assert.match(router, /listing-imports\/preview/);
  assert.match(router, /listing-imports\/:id\/publish/);
  assert.match(router, /admin_imported_reviewed/);
  assert.match(router, /listing_import_published/);
});

test('admin listings menampilkan editor AI lokal, pemilihan foto, dan pratinjau card', () => {
  assert.match(page, /Ambil metadata &amp; buat draft/);
  assert.match(page, /Deskripsi hasil AI lokal/);
  assert.match(page, /name="image_urls"/);
  assert.match(page, /listing-card-preview/);
  assert.match(page, /approve_listings/);
  assert.match(css, /listing-import-layout/);
  assert.match(css, /aspect-ratio: 4 \/ 3/);
});
