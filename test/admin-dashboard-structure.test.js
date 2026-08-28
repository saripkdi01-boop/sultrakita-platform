'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const adminRoot = path.join(__dirname, '..', 'public', 'admin');

test('Admin Dashboard memiliki seluruh halaman yang diminta', () => {
  for (const page of ['index','dashboard','users','listings','categories','donations','reports','verifications','analytics','settings','broadcasts','audit-logs','roles','webhooks','profile']) {
    assert.equal(fs.existsSync(path.join(adminRoot, `${page}.html`)), true, `${page}.html missing`);
  }
});

test('Admin Dashboard memiliki shared assets dan controllers', () => {
  for (const file of ['css/admin.css','css/admin-dark.css','js/auth.js','js/rbac.js','js/api.js','js/app.js','js/components.js','js/utils.js','assets/logo-admin.svg']) {
    assert.equal(fs.existsSync(path.join(adminRoot, file)), true, `${file} missing`);
  }
});

test('Admin page content wrapper memakai full-width grid dan asset version terbaru', () => {
  for (const page of ['dashboard','users','listings','categories','donations','reports','verifications','analytics','settings','broadcasts','audit-logs','roles','webhooks','profile']) {
    const html = fs.readFileSync(path.join(adminRoot, `${page}.html`), 'utf8');
    assert.match(html, /data-page-content class="admin-span-12"/, `${page}.html must span the admin grid`);
  }
  const dashboard = fs.readFileSync(path.join(adminRoot, 'dashboard.html'), 'utf8');
  assert.match(dashboard, /admin\.css\?v=3/);
  assert.match(dashboard, /page\.js\?v=3/);
});

test('Admin pages tidak mengganti route canonical existing', () => {
  const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
  assert.match(server, /app\.get\(\['\/admin', '\/admin\/', '\/admin\/login', '\/admin\/dashboard'\]/);
  assert.match(server, /app\.use\(express\.static\(path\.join\(__dirname, 'public'\)/);
});
