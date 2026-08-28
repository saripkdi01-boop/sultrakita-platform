'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const router = fs.readFileSync(path.join(__dirname, '..', 'api', 'admin', 'index.js'), 'utf8');
const server = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');

const contract = {
  'admin-get-users': "router.get('/users'",
  'admin-get-listings': "router.get('/listings'",
  'admin-get-stats': "router.get('/stats'",
  'admin-update-user': "router.put('/users/:id'",
  'admin-ban-user': "router.patch('/users/:id/ban'",
  'admin-approve-listing': "router.patch('/listings/:id/status'",
  'admin-delete-listing': "router.delete('/listings/:id'",
  'admin-manage-categories': "router.get('/categories'",
  'admin-get-analytics': "router.get('/analytics'",
  'admin-update-settings': "router.patch('/settings/:key'",
  'admin-get-audit-logs': "router.get('/audit-logs'",
  'admin-create-broadcast': "router.post('/content'",
  'admin-get-reports': "router.get('/reports'",
  'admin-resolve-report': "router.patch('/reports/:id'",
  'admin-get-verifications': "router.get('/verifications'",
  'admin-review-verification': "router.patch('/verifications/:id'",
  'admin-get-donations': "router.get('/donations'",
  'admin-export-data': "router.get('/analytics/export'",
};

test('Part 8 function contract dipetakan ke Express admin v2', () => {
  for (const [name, marker] of Object.entries(contract)) assert.match(router, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), name);
  assert.match(server, /app\.use\('\/api\/admin\/v2', adminApiV2\)/);
});

test('Part 8 tidak menambahkan Supabase browser/service-role auth ke runtime API', () => {
  assert.doesNotMatch(router, /createClient|SUPABASE_SERVICE_ROLE_KEY|jsonwebtoken/);
  assert.doesNotMatch(server, /SUPABASE_SERVICE_ROLE_KEY|jsonwebtoken/);
});
