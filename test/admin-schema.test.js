'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const migration = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', '016_admin_system_schema.sql'), 'utf8');

for (const table of ['admin_roles', 'admin_users', 'admin_sessions', 'admin_audit_logs', 'listing_moderation', 'platform_settings', 'admin_content', 'admin_notifications', 'report_management', 'platform_status']) {
  test(`migration Section 3 membuat tabel ${table}`, () => {
    assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}\\b`));
  });
}

test('migration menggunakan RLS deny-by-default dan seed idempotent', () => {
  assert.match(migration, /ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY/);
  assert.match(migration, /USING \(FALSE\) WITH CHECK \(FALSE\)/);
  assert.match(migration, /ON CONFLICT \(role_key\) DO NOTHING/);
  assert.match(migration, /ON CONFLICT \(setting_key\) DO NOTHING/);
});

test('migration tidak menyimpan password contoh dari prompt', () => {
  assert.doesNotMatch(migration, /SultraKita!SuperAdmin2026#/);
  assert.doesNotMatch(migration, /superadmin@sultrakita\.id/);
});
