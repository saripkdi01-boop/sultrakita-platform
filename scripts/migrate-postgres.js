const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');

const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('DATABASE_URL atau SUPABASE_DB_URL wajib diisi.');
  process.exit(1);
}

const client = new Client({
  connectionString: url,
  ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
  connectionTimeoutMillis: 10_000,
  application_name: 'sultrakita-migrator',
});

(async () => {
  try {
    await client.connect();
    await client.query('BEGIN');
    const migration = fs.readFileSync(path.join(__dirname, '..', 'database', 'migrations', '001_initial.sql'), 'utf8');
    await client.query(migration);
    await client.query('COMMIT');
    console.log('PostgreSQL migration 001_initial.sql completed');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(`PostgreSQL migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await client.end().catch(() => {});
  }
})();
