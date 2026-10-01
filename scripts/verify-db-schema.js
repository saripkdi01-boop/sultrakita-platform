#!/usr/bin/env node
/**
 * SUKI Apps — verifikasi skema database production vs ekspektasi kode.
 *
 * Untuk tiap tabel yang dipakai API routes baru, script ini mem-probe kolom
 * via Supabase REST: GET /rest/v1/<tabel>?select=<kolom>&limit=1
 *   - HTTP 200            → kolom-kolom ADA (body boleh [] bila RLS memfilter)
 *   - HTTP 400 code 42703 → ada kolom yang TIDAK ADA (drift!)
 *   - HTTP 404 PGRST205   → tabel TIDAK ADA (drift!)
 *
 * Cara pakai:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_ANPAON_KEY=eyJ... node scripts/verify-db-schema.js
 *   (SUPABASE_PUBLISHABLE_KEY juga didukung sebagai alternatif nama env)
 *
 * Catatan: memakai anon/publishable key (subjek RLS) — cukup untuk cek
 * keberadaan kolom/tabel, bukan untuk membaca isi data.
 */
const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_PUBLISHABLE_KEY } = process.env;

const EXPECTED = {
  comments: ['id', 'post_id', 'user_id', 'content', 'parent_id', 'idempotency_key', 'created_at'],
  follows: ['follower_id', 'following_id', 'created_at'],
  likes: ['post_id', 'user_id', 'created_at'],
  saved_posts: ['post_id', 'user_id', 'created_at'],
  posts: ['id', 'user_id', 'content', 'media_urls', 'type', 'privacy', 'location', 'mood', 'tagged_user_ids', 'status', 'created_at'],
  profiles: ['id', 'display_name', 'username', 'avatar_url', 'bio', 'visibility_settings', 'role', 'is_verified', 'created_at'],
  notifications: ['id', 'user_id', 'title', 'body', 'is_read', 'created_at'],
};

async function probe(base, key, table, columns) {
  const url = `${base}/rest/v1/${table}?select=${columns.join(',')}&limit=1`;
  const res = await fetch(url, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  const text = await res.text();
  let body = null;
  try { body = JSON.parse(text); } catch { /* abaikan */ }
  if (res.status === 404 && body && body.code === 'PGRST205') {
    return { ok: false, reason: `TABEL TIDAK ADA di production (${body.message})` };
  }
  if (res.status === 400 && body && body.code === '42703') {
    return { ok: false, reason: `KOLOM HILANG: ${body.message}` };
  }
  if (res.status === 200) {
    return { ok: true, reason: `semua ${columns.length} kolom ada` };
  }
  return { ok: false, reason: `HTTP ${res.status}: ${text.slice(0, 160)}` };
}

async function main() {
  const base = (SUPABASE_URL || '').replace(/\/$/, '');
  const key = SUPABASE_ANON_KEY || SUPABASE_PUBLISHABLE_KEY || '';
  if (!base || !key) {
    console.error('ERROR: set env SUPABASE_URL dan SUPABASE_ANON_KEY (atau SUPABASE_PUBLISHABLE_KEY) dulu.');
    process.exit(2);
  }
  console.log(`Memverifikasi skema terhadap ${base} ...\n`);
  let failed = 0;
  for (const [table, columns] of Object.entries(EXPECTED)) {
    let result;
    try {
      result = await probe(base, key, table, columns);
    } catch (e) {
      result = { ok: false, reason: `gagal fetch: ${e.message}` };
    }
    const mark = result.ok ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark}  ${table}: ${result.reason}`);
    if (!result.ok) failed++;
  }
  console.log(failed === 0 ? '\nSemua tabel cocok dengan ekspektasi kode.' : `\n${failed} tabel DRIFT — perbaiki via migrasi sebelum launch.`);
  process.exit(failed === 0 ? 0 : 1);
}

main();
