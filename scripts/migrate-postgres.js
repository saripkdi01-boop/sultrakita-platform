'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Client } = require('pg');

const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('DATABASE_URL atau SUPABASE_DB_URL wajib diisi.');
  process.exit(1);
}

const migrationDir = path.join(__dirname, '..', 'database', 'migrations');
const migrations = fs.readdirSync(migrationDir).filter(file => /^\d+_.+\.sql$/.test(file)).sort();
const client = new Client({
  connectionString: url,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
  application_name: 'sultrakita-migrator',
});

(async () => {
  let locked = false;
  try {
    await client.connect();
    await client.query('SELECT pg_advisory_lock(hashtext($1))', ['sultrakita:schema-migrations']);
    locked = true;
    await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, checksum text NOT NULL, executed_at timestamptz NOT NULL DEFAULT now())');

    for (const file of migrations) {
      const version = file.replace(/\.sql$/, '');
      const sql = fs.readFileSync(path.join(migrationDir, file), 'utf8');
      const checksum = crypto.createHash('sha256').update(sql).digest('hex');
      const result = await client.query('SELECT version, checksum FROM schema_migrations WHERE version = $1', [version]);
      if (result.rows[0]) {
        if (result.rows[0].checksum !== checksum) throw new Error(`Checksum migration berubah: ${version}`);
        console.log(`SKIP ${version} (already applied)`);
        continue;
      }
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations(version, checksum) VALUES($1, $2)', [version, checksum]);
        await client.query('COMMIT');
        console.log(`APPLY ${version}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw new Error(`${version}: ${error.message}`);
      }
    }
    console.log(`PostgreSQL migrations complete (${migrations.length} files checked)`);
  } catch (error) {
    console.error(`PostgreSQL migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (locked) await client.query('SELECT pg_advisory_unlock(hashtext($1))', ['sultrakita:schema-migrations']).catch(error => console.error(`[migration-unlock] ${error.message}`));
    await client.end().catch(error => console.error(`[migration-close] ${error.message}`));
  }
})();
