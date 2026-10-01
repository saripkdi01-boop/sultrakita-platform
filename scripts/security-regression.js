#!/usr/bin/env node
'use strict';

/**
 * Security regression untuk aplikasi yang LIVE di production (Vercel):
 * next-app/ (Next.js 15 + Supabase) — BUKAN server Express legacy.
 *
 * Alur:
 *   1. Build next-app (`npm run build` di next-app/).
 *   2. Jalankan `next start` di port test lokal.
 *   3. Tunggu server siap (polling /api/health).
 *   4. Preflight database: /api/health WAJIB melaporkan db:'up'.
 *   5. Assert perilaku security nyata terhadap route yang live.
 *
 * DILARANG SKIP DIAM-DIAM: bila env DB belum dikonfigurasi, build gagal,
 * server gagal start, target tak terjangkau, atau DB tak tersedia → proses
 * keluar dengan kode non-zero dan pesan yang jelas (menggagalkan CI).
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — WAJIB,
 *     menunjuk project Supabase test/staging yang reachable.
 *   SECURITY_TEST_PORT            — port lokal next start (default 3101).
 *   SECURITY_TEST_READY_TIMEOUT_MS — batas tunggu server siap (default 120000).
 *   SECURITY_TEST_BURST           — jumlah request uji rate-limit (default 150).
 *   SECURITY_TEST_SKIP_BUILD=1    — lewati `npm run build` bila .next sudah ada
 *     (eksplisit; untuk iterasi lokal. Default: selalu build ulang).
 *
 * Dipanggil dari:
 *   - next-app/package.json → "test:security": "node ../scripts/security-regression.js"
 *   - root package.json     → "test:security": "node scripts/security-regression.js"
 *   - .github/workflows/ci.yml job `verify`
 */

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const NEXT_APP_DIR = path.resolve(__dirname, '..', 'next-app');
const PORT = Number(process.env.SECURITY_TEST_PORT || 3101);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const READY_TIMEOUT_MS = Number(process.env.SECURITY_TEST_READY_TIMEOUT_MS || 120000);
const BURST = Number(process.env.SECURITY_TEST_BURST || 150);
const SKIP_BUILD = process.env.SECURITY_TEST_SKIP_BUILD === '1';
const REQUEST_TIMEOUT_MS = 15000;

let server = null;
const passed = [];
let alreadyReported = false;

function pass(name, detail) {
  passed.push(name);
  console.log(`  [PASS] ${name}${detail ? ` — ${detail}` : ''}`);
}

function fail(message) {
  // Selalu non-zero + pesan jelas. Tidak ada jalur SKIP dalam skrip ini.
  console.error(`\nFAIL: ${message}`);
  alreadyReported = true;
  process.exitCode = 1;
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

async function request(pathname, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}${pathname}`, {
      redirect: 'manual',
      ...options,
      signal: controller.signal,
    });
    const text = await res.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = null;
    }
    return { res, body, text };
  } finally {
    clearTimeout(timer);
  }
}

function checkEnv() {
  const missing = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'].filter(
    (key) => !process.env[key],
  );
  if (missing.length > 0) {
    fail(
      `Konfigurasi database belum tersedia (missing: ${missing.join(', ')}). ` +
        'Security regression membutuhkan project Supabase test/staging yang reachable. ' +
        'Di CI, isi secrets SUPABASE_TEST_URL / SUPABASE_TEST_ANON_KEY. ' +
        'Lokal: export NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sebelum menjalankan.',
    );
  }
  console.log('Env database: terkonfigurasi.');
}

function buildApp() {
  if (SKIP_BUILD) {
    const nextDir = path.join(NEXT_APP_DIR, '.next');
    assert(
      fs.existsSync(nextDir),
      'SECURITY_TEST_SKIP_BUILD=1 diminta tetapi next-app/.next tidak ada. Jalankan tanpa SKIP_BUILD dulu.',
    );
    console.log('Build dilewati (SECURITY_TEST_SKIP_BUILD=1, memakai .next yang ada).');
    return;
  }
  console.log('Membangun next-app …');
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: NEXT_APP_DIR,
    stdio: 'inherit',
    env: process.env,
  });
  if (result.status !== 0) {
    fail(`\`npm run build\` di next-app/ gagal (exit ${result.status}). Perbaiki build sebelum uji security.`);
  }
  console.log('Build sukses.');
}

function tcpProbe() {
  // Cek apakah port sudah menerima koneksi TCP (server hidup), tanpa
  // memedulikan apakah handler HTTP-nya menggantung (mis. DB lambat).
  return new Promise((resolve) => {
    const socket = net.connect(PORT, '127.0.0.1');
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(2000);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

async function startServer() {
  console.log(`Menjalankan \`next start\` di ${BASE_URL} …`);
  server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
    cwd: NEXT_APP_DIR,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverOutput = '';
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  const earlyExit = new Promise((resolve) => {
    server.on('exit', (code, signal) => resolve({ code, signal }));
  });

  const deadline = Date.now() + READY_TIMEOUT_MS;
  let lastError = '';
  for (;;) {
    const exited = await Promise.race([
      earlyExit.then((info) => info),
      new Promise((resolve) => setTimeout(() => resolve(null), 250)),
    ]);
    if (exited) {
      fail(
        `\`next start\` mati sebelum siap (exit ${exited.code}, signal ${exited.signal}). Output:\n${serverOutput.slice(-3000)}`,
      );
    }
    try {
      // /api/health dikecualikan dari rate-limit middleware → aman untuk polling.
      await fetch(`${BASE_URL}/api/health`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
      console.log('Server siap (respons HTTP /api/health).');
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      // Server bisa hidup tetapi handler-nya menggantung (mis. DB tak
      // merespons): port yang menerima TCP tetap berarti "terjangkau".
      // Preflight database sesudah ini yang akan menggagalkan dengan pesan
      // "DB tak tersedia" yang tepat, bukan "server tak terjangkau".
      if (await tcpProbe()) {
        console.log('Server siap (port menerima koneksi TCP; /api/health lambat — lanjut ke preflight DB).');
        return;
      }
    }
    if (Date.now() > deadline) {
      fail(
        `Server tidak terjangkau di ${BASE_URL} setelah ${READY_TIMEOUT_MS}ms ` +
          `(terakhir: ${lastError}). Output server:\n${serverOutput.slice(-3000)}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

async function preflightDatabase() {
  let res;
  let body;
  try {
    ({ res, body } = await request('/api/health'));
  } catch (error) {
    fail(
      `DB tak tersedia: GET /api/health tidak merespons dalam ${REQUEST_TIMEOUT_MS}ms ` +
        `(${error instanceof Error ? error.message : error}). Server hidup tetapi database tidak terjangkau. ` +
        'Pastikan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY menunjuk project Supabase test/staging yang reachable.',
    );
  }
  const dbState = body?.data?.db;
  const apiState = body?.data?.api;
  assert(
    apiState === 'up' && dbState === 'up',
    `DB tak tersedia: GET /api/health → HTTP ${res.status}, api=${apiState}, db=${dbState}, storage=${body?.data?.storage}. ` +
      'Pastikan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY menunjuk project Supabase test/staging yang reachable ' +
      'dan tabel `categories` bisa dibaca anon key.',
  );
  pass('health-check', `api=up, db=up (HTTP ${res.status})`);
}

function extractCookie(setCookieHeader, name) {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function main() {
  console.log('Security regression (target: next-app/ yang live di Vercel)');
  console.log(`Target: ${BASE_URL}`);

  checkEnv();
  buildApp();
  await startServer();
  await preflightDatabase();

  // 1. Admin boundary: halaman admin tanpa sesi → redirect /login (307/308).
  {
    const { res } = await request('/admin/overview');
    const location = res.headers.get('location') || '';
    assert(
      [307, 308].includes(res.status) && location.includes('/login'),
      `GET /admin/overview tanpa sesi: ekspektasi redirect 307/308 ke /login, ` +
        `diterima HTTP ${res.status} location=${location || '(kosong)'}`,
    );
    pass('admin-guard', `GET /admin/overview → ${res.status} → ${location}`);
  }

  // 2. Penerbit token CSRF hidup.
  let csrfToken;
  let csrfCookie;
  {
    const { res, body } = await request('/api/csrf');
    const setCookie = res.headers.get('set-cookie') || '';
    csrfCookie = extractCookie(setCookie, 'suki_csrf');
    csrfToken = body?.csrfToken;
    assert(res.status === 200, `GET /api/csrf: ekspektasi 200, diterima ${res.status}`);
    assert(
      typeof csrfToken === 'string' && csrfToken.length >= 32 && csrfToken === csrfCookie,
      'GET /api/csrf: token respons harus sama dengan cookie suki_csrf',
    );
    pass('csrf-issuer', 'GET /api/csrf → 200, cookie suki_csrf terbit & cocok');
  }

  // 3. CSRF ditegakkan: POST /api/comments tanpa token → 403 (dicek SEBELUM auth).
  {
    const { res, body, text } = await request('/api/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ postId: 'abc123', content: 'uji tanpa csrf' }),
    });
    assert(res.status === 403, `POST /api/comments tanpa token CSRF: ekspektasi 403, diterima ${res.status}`);
    assert(body?.error?.code === 'FORBIDDEN', 'respons 403 harus memakai envelope error FORBIDDEN');
    assert(!/stack trace|node_modules/i.test(text), 'respons error membocorkan detail internal');
    pass('csrf-enforced', 'POST /api/comments tanpa token → 403 FORBIDDEN');
  }

  // 4. Validasi input zod: body invalid dengan CSRF valid → 400 BAD_REQUEST.
  {
    const { res, body } = await request('/api/comments', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-csrf-token': csrfToken,
        cookie: `suki_csrf=${csrfCookie}`,
      },
      body: JSON.stringify({ postId: '!!!', content: '' }),
    });
    assert(res.status === 400, `POST /api/comments body invalid: ekspektasi 400, diterima ${res.status}`);
    assert(body?.error?.code === 'BAD_REQUEST', 'respons 400 harus memakai envelope error BAD_REQUEST');
    pass('input-validation', 'POST /api/comments body invalid → 400 BAD_REQUEST (zod)');
  }

  // 5. Rate limit middleware: bombardir /api/* melebihi 60/menit → ada 429.
  {
    let count429 = 0;
    let sawRetryAfter = false;
    let sawLimitHeader = false;
    for (let i = 0; i < BURST; i += 1) {
      const { res } = await request('/api/csrf');
      if (res.status === 429) {
        count429 += 1;
        if (res.headers.get('retry-after')) sawRetryAfter = true;
        if (res.headers.get('x-ratelimit-limit') === '60') sawLimitHeader = true;
      }
    }
    assert(
      count429 >= 5,
      `Rate limit tidak terpicu: ${BURST} request cepat ke /api/csrf hanya menghasilkan ${count429} respons 429 ` +
        '(ekspektasi ≥5 setelah melewati batas 60/menit)',
    );
    assert(sawRetryAfter, 'respons 429 harus menyertakan header Retry-After');
    assert(sawLimitHeader, 'respons 429 harus menyertakan header X-RateLimit-Limit: 60');
    pass('rate-limit', `${BURST} request → ${count429}x 429 + Retry-After + X-RateLimit-*`);
  }

  // 6. Security headers di respons API.
  {
    const { res } = await request('/api/health');
    const headers = res.headers;
    const checks = [
      ['strict-transport-security', (v) => /max-age=\d+/.test(v || '')],
      ['x-content-type-options', (v) => v === 'nosniff'],
      ['x-frame-options', (v) => v === 'SAMEORIGIN'],
      ['referrer-policy', (v) => !!v],
      ['permissions-policy', (v) => !!v],
      ['content-security-policy', (v) => (v || '').includes("default-src 'self'")],
    ];
    const missing = checks.filter(([name, test]) => !test(headers.get(name))).map(([name]) => name);
    assert(missing.length === 0, `Security headers hilang: ${missing.join(', ')}`);
    pass('security-headers', 'HSTS, nosniff, SAMEORIGIN, Referrer-Policy, Permissions-Policy, CSP aktif');
  }

  // 7. Kebersihan envelope error: tidak ada stack trace / path internal.
  {
    const probes = await Promise.all([
      request('/api/comments/segala-sesuatu-yang-tidak-ada'),
      request('/api/tidak-ada-rute-ini'),
    ]);
    const combined = probes.map((p) => p.text).join('\n').toLowerCase();
    for (const forbidden of ['stack trace', 'node_modules', '/home/', 'webpack-internal']) {
      assert(!combined.includes(forbidden), `respons error membocorkan detail internal: ${forbidden}`);
    }
    pass('error-hygiene', 'tidak ada stack trace / path internal di respons error');
  }

  console.log(`\nPASS: ${passed.length} pemeriksaan security — ${passed.join(', ')}`);
}

main()
  .catch((error) => {
    process.exitCode = 1;
    if (!alreadyReported) console.error(`\nFAIL: ${error.message}`);
  })
  .finally(async () => {
    if (server) {
      await new Promise((resolve) => {
        let done = false;
        const finish = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        server.on('exit', finish);
        server.kill('SIGTERM');
        setTimeout(() => {
          if (!done) {
            try {
              server.kill('SIGKILL');
            } catch {
              /* sudah mati */
            }
          }
          setTimeout(finish, 1000);
        }, 5000);
      });
    }
  });
