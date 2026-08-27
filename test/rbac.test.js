'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { ROLE_LEVELS, normalizeRole, hasPermission, permissionList } = require('../rbac');

test('RBAC menormalisasi role legacy tanpa mengubah users.role', () => {
  assert.equal(normalizeRole('buyer'), 'user');
  assert.equal(normalizeRole('admin'), 'admin');
  assert.equal(normalizeRole('super-admin'), 'super_admin');
  assert.equal(normalizeRole('unknown'), 'user');
});

test('RBAC mempertahankan level hierarki Section 2', () => {
  assert.deepEqual(ROLE_LEVELS, { user: 1, seller: 2, moderator: 3, support: 3, analyst: 3, admin: 4, super_admin: 5 });
});

test('RBAC menerapkan least privilege untuk role operasional', () => {
  assert.equal(hasPermission('super_admin', 'manage_roles'), true);
  assert.equal(hasPermission('admin', 'manage_roles'), false);
  assert.equal(hasPermission('admin', 'manage_settings'), false);
  assert.equal(hasPermission('moderator', 'moderate_reports'), true);
  assert.equal(hasPermission('moderator', 'delete_any_listing'), false);
  assert.equal(hasPermission('support', 'view_dashboard'), true);
  assert.equal(hasPermission('support', 'view_analytics'), false);
  assert.equal(hasPermission('analyst', 'view_analytics'), true);
  assert.equal(hasPermission('analyst', 'manage_users'), false);
  assert.equal(hasPermission('seller', 'manage_listings_own'), true);
  assert.equal(hasPermission('seller', 'manage_listings'), false);
  assert.equal(hasPermission('user', 'view_dashboard'), false);
});

test('permissionList tidak membocorkan permission role lain', () => {
  assert.deepEqual(permissionList('admin').includes('manage_roles'), false);
  assert.deepEqual(permissionList('analyst').includes('send_notifications'), false);
});
