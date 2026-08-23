const { Pool } = require('pg');

const postgresUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
let postgresPool;

function getPostgresPool() {
  if (!postgresUrl) {
    throw new Error('DATABASE_URL wajib dikonfigurasi; SQLite/penyimpanan ephemeral tidak didukung.');
  }
  if (!postgresPool) {
    postgresPool = new Pool({
      connectionString: postgresUrl,
      ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: Number(process.env.DATABASE_POOL_MAX || 5),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      application_name: 'sultrakita-api',
    });
    postgresPool.on('error', error => console.error('[postgres-pool]', error.message));
  }
  return postgresPool;
}

function pgSql(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

async function getDb() {
  return getPostgresPool();
}

async function query(sql, params = []) {
  const result = await getPostgresPool().query(pgSql(sql), params);
  return result.rows;
}

async function run(sql, params = []) {
  const normalized = sql.trim().replace(/;\s*$/, '');
  const isInsert = /^INSERT\s+INTO\s+/i.test(normalized);
  const statement = isInsert && !/\bRETURNING\b/i.test(normalized) && !/INSERT\s+INTO\s+sessions\b/i.test(normalized)
    ? `${normalized} RETURNING id`
    : normalized;
  const result = await getPostgresPool().query(pgSql(statement), params);
  return { id: result.rows[0]?.id || null, rowCount: result.rowCount };
}

async function withTransaction(callback) {
  const client = await getPostgresPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback({
      query: (sql, params = []) => client.query(pgSql(sql), params).then(response => response.rows),
      run: async (sql, params = []) => {
        const normalized = sql.trim().replace(/;\s*$/, '');
        const statement = /^INSERT\s+INTO\s+/i.test(normalized) && !/\bRETURNING\b/i.test(normalized) && !/INSERT\s+INTO\s+sessions\b/i.test(normalized) ? `${normalized} RETURNING id` : normalized;
        const response = await client.query(pgSql(statement), params);
        return { id: response.rows[0]?.id || null, rowCount: response.rowCount };
      },
    });
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function closeDb() {
  if (postgresPool) await postgresPool.end();
  postgresPool = undefined;
}

module.exports = { getDb, query, run, withTransaction, closeDb, pgSql };
