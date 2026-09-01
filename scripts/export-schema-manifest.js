'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { Client } = require('pg');

const outputDir = path.resolve(process.argv[2] || 'artifacts/step28');
const databaseUrl = process.env.DATABASE_URL;
const expectedDatabase = 'sultrakita_test';
const expectedHosts = new Set(['localhost', '127.0.0.1', '::1']);

function fail(message) {
  throw new Error(`schema export refused: ${message}`);
}

if (!databaseUrl) fail('DATABASE_URL is required');
if (process.env.DATABASE_SSL !== 'false') fail('DATABASE_SSL must be exactly false');
const target = new URL(databaseUrl);
if (!expectedHosts.has(target.hostname) || target.port !== '5432' || decodeURIComponent(target.pathname.slice(1)) !== expectedDatabase) {
  fail('target must be PostgreSQL localhost:5432 database sultrakita_test');
}

const client = new Client({ connectionString: databaseUrl, ssl: false, connectionTimeoutMillis: 10_000, application_name: 'sultrakita-step28-schema-export' });
const stable = (items, keys) => items.sort((a, b) => keys.map((key) => String(a[key] ?? '').localeCompare(String(b[key] ?? ''))).find((comparison) => comparison !== 0) || 0);
const rows = async (sql, values = []) => (await client.query(sql, values)).rows;

async function buildManifest() {
  const tables = await rows(`SELECT n.nspname AS schema, c.relname AS table, pg_get_userbyid(c.relowner) AS owner
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('r','p') AND n.nspname NOT IN ('pg_catalog','information_schema')`);
  const columns = await rows(`SELECT table_schema AS schema, table_name AS table, column_name AS column, ordinal_position,
    data_type, udt_name, is_nullable = 'YES' AS nullable, column_default AS default
    FROM information_schema.columns WHERE table_schema NOT IN ('pg_catalog','information_schema')`);
  const primaryKeys = await rows(`SELECT n.nspname AS schema, t.relname AS table, c.conname AS constraint,
    array_agg(a.attname ORDER BY k.ord) AS columns
    FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    JOIN unnest(c.conkey) WITH ORDINALITY k(attnum,ord) ON true JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=k.attnum
    WHERE c.contype='p' GROUP BY n.nspname,t.relname,c.conname`);
  const foreignKeys = await rows(`SELECT n.nspname AS schema, t.relname AS table, c.conname AS constraint,
    array_agg(a.attname ORDER BY k.ord) AS columns, rn.nspname AS referenced_schema, rt.relname AS referenced_table,
    array_agg(ra.attname ORDER BY k.ord) AS referenced_columns
    FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    JOIN pg_class rt ON rt.oid=c.confrelid JOIN pg_namespace rn ON rn.oid=rt.relnamespace
    JOIN unnest(c.conkey) WITH ORDINALITY k(attnum,ord) ON true JOIN unnest(c.confkey) WITH ORDINALITY fk(attnum,ord) ON fk.ord=k.ord
    JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=k.attnum JOIN pg_attribute ra ON ra.attrelid=rt.oid AND ra.attnum=fk.attnum
    WHERE c.contype='f' GROUP BY n.nspname,t.relname,c.conname,rn.nspname,rt.relname`);
  const uniqueConstraints = await rows(`SELECT n.nspname AS schema, t.relname AS table, c.conname AS constraint,
    array_agg(a.attname ORDER BY k.ord) AS columns FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
    JOIN pg_namespace n ON n.oid=t.relnamespace JOIN unnest(c.conkey) WITH ORDINALITY k(attnum,ord) ON true
    JOIN pg_attribute a ON a.attrelid=t.oid AND a.attnum=k.attnum WHERE c.contype='u'
    GROUP BY n.nspname,t.relname,c.conname`);
  const checks = await rows(`SELECT n.nspname AS schema, t.relname AS table, c.conname AS constraint, pg_get_constraintdef(c.oid, true) AS definition
    FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace WHERE c.contype='c'`);
  const indexes = await rows(`SELECT n.nspname AS schema, t.relname AS table, i.relname AS index,
    ix.indisunique AS unique, ix.indisprimary AS primary, pg_get_indexdef(ix.indexrelid) AS definition
    FROM pg_index ix JOIN pg_class i ON i.oid=ix.indexrelid JOIN pg_class t ON t.oid=ix.indrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    WHERE n.nspname NOT IN ('pg_catalog','information_schema')`);
  const sequences = await rows(`SELECT sequence_schema AS schema, sequence_name AS sequence
    FROM information_schema.sequences WHERE sequence_schema NOT IN ('pg_catalog','information_schema')`);
  const functions = await rows(`SELECT n.nspname AS schema, p.proname AS function,
    pg_get_function_identity_arguments(p.oid) AS argument_signature, pg_get_function_result(p.oid) AS return_type,
    l.lanname AS language, p.provolatile AS volatility, p.prosecdef AS security_definer
    FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace JOIN pg_language l ON l.oid=p.prolang
    WHERE n.nspname NOT IN ('pg_catalog','information_schema')`);
  const triggers = await rows(`SELECT n.nspname AS schema, t.relname AS table, tr.tgname AS trigger,
    CASE WHEN (tr.tgtype & 2) <> 0 THEN 'BEFORE' WHEN (tr.tgtype & 64) <> 0 THEN 'INSTEAD OF' ELSE 'AFTER' END AS timing,
    pg_get_triggerdef(tr.oid, true) AS event, p.proname AS function
    FROM pg_trigger tr JOIN pg_class t ON t.oid=tr.tgrelid JOIN pg_namespace n ON n.oid=t.relnamespace
    JOIN pg_proc p ON p.oid=tr.tgfoid WHERE NOT tr.tgisinternal`);
  const rls = await rows(`SELECT n.nspname AS schema, c.relname AS table, c.relrowsecurity AS rls_enabled
    FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind IN ('r','p') AND n.nspname NOT IN ('pg_catalog','information_schema')`);
  const policies = await rows(`SELECT schemaname AS schema, tablename AS table, policyname AS policy, cmd AS command,
    roles, qual AS using_expression, with_check AS check_expression FROM pg_policies
    WHERE schemaname NOT IN ('pg_catalog','information_schema')`);
  const views = await rows(`SELECT table_schema AS schema, table_name AS view FROM information_schema.views
    WHERE table_schema NOT IN ('pg_catalog','information_schema')`);
  const extensions = await rows(`SELECT extname AS extension, extversion AS version FROM pg_extension ORDER BY extname`);
  const ledger = await rows(`SELECT version, checksum, 'APPLIED' AS status FROM schema_migrations ORDER BY version`);
  const normalized = {
    format: 'sultrakita.schema-manifest.v1', source: 'ci-disposable-reconstruction',
    tables: stable(tables, ['schema','table']), columns: stable(columns, ['schema','table','ordinal_position','column']),
    primary_keys: stable(primaryKeys, ['schema','table','constraint']), foreign_keys: stable(foreignKeys, ['schema','table','constraint']),
    unique_constraints: stable(uniqueConstraints, ['schema','table','constraint']), check_constraints: stable(checks, ['schema','table','constraint']),
    indexes: stable(indexes, ['schema','table','index']), sequences: stable(sequences, ['schema','sequence']),
    functions: stable(functions, ['schema','function','argument_signature']), triggers: stable(triggers, ['schema','table','trigger']),
    rls: stable(rls, ['schema','table']), rls_policies: stable(policies, ['schema','table','policy']),
    views: stable(views, ['schema','view']), extensions: stable(extensions, ['extension']),
    migration_ledger: stable(ledger, ['version']),
  };
  return normalized;
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  await client.connect();
  const manifest = await buildManifest();
  const json = `${JSON.stringify(manifest, null, 2)}\n`;
  const hash = crypto.createHash('sha256').update(json).digest('hex');
  fs.writeFileSync(path.join(outputDir, 'step28-schema-manifest.json'), json);
  fs.writeFileSync(path.join(outputDir, 'step28-schema-manifest.sha256'), `${hash}  step28-schema-manifest.json\n`);
  fs.writeFileSync(path.join(outputDir, 'step28-migration-ledger.json'), `${JSON.stringify(manifest.migration_ledger, null, 2)}\n`);
  console.log(`schema manifest exported: ${manifest.tables.length} tables, ${manifest.columns.length} columns, sha256=${hash}`);
})().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => { await client.end().catch(() => {}); });
