'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { Client } = require('pg');
const url = process.env.DATABASE_URL;
if (!url) { console.error('DATABASE_URL wajib diisi'); process.exit(1); }
const client = new Client({ connectionString:url, ssl:process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized:false }, connectionTimeoutMillis:10000 });
(async () => { try { await client.connect(); await client.query('BEGIN'); const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'postgres-schema.sql'), 'utf8'); await client.query(sql); await client.query("INSERT INTO donation_campaigns(title,description,target_amount) SELECT 'Dukung SultraKita','Bantu biaya operasional dan pengembangan marketplace lokal Sulawesi Tenggara.',50000000 WHERE NOT EXISTS (SELECT 1 FROM donation_campaigns)"); await client.query('COMMIT'); console.log('PostgreSQL migration completed'); } catch (error) { await client.query('ROLLBACK').catch(() => {}); console.error(`PostgreSQL migration failed: ${error.message}`); process.exitCode=1; } finally { await client.end().catch(() => {}); } })();
