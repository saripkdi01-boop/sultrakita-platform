#!/usr/bin/env node
'use strict';

/**
 * check-cron-config.js — pemeriksa konsistensi konfigurasi cron/job terjadwal.
 *
 * Memeriksa silang tiga sumber kebenaran:
 *   1. Route cron:            next-app/app/api/cron/<nama>/route.ts
 *   2. Workflow terjadwal:    .github/workflows/*.yml  (blok `on.schedule`)
 *   3. Panggilan HTTP:        workflow yang memanggil https://.../api/cron/<nama>
 *
 * Aturan:
 *   - ERROR: workflow terjadwal memanggil /api/cron/<nama> yang TIDAK ADA
 *            route-nya (panggilan akan 404 selamanya).
 *   - PERINGATAN: route cron ADA tapi tidak dipanggil oleh workflow terjadwal
 *            mana pun (kemungkinan jadwal terhapus / belum dibuat).
 *   - PERINGATAN: workflow terjadwal TIDAK memanggil endpoint cron sama sekali
 *            dan tidak terdokumentasi (mungkin jadwal yatim).
 *
 * Read-only & idempoten. Tidak butuh secret / network.
 * Keluar 0 bila tidak ada ERROR, 1 bila ada ERROR. Peringatan tidak
 * menggagalkan (supaya bisa dipakai sebagai cek informatif).
 *
 * Pakai: node scripts/check-cron-config.js
 */

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '..');
const CRON_DIR = path.join(REPO_ROOT, 'next-app', 'app', 'api', 'cron');
const WORKFLOWS_DIR = path.join(REPO_ROOT, '.github', 'workflows');

function listCronRoutes() {
  if (!fs.existsSync(CRON_DIR)) return [];
  return fs.readdirSync(CRON_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(CRON_DIR, d.name, 'route.ts')))
    .map((d) => d.name);
}

function readWorkflows() {
  if (!fs.existsSync(WORKFLOWS_DIR)) return [];
  return fs.readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map((f) => ({ file: f, text: fs.readFileSync(path.join(WORKFLOWS_DIR, f), 'utf8') }));
}

// Ambil ekspresi `cron:` yang AKTIF (bukan komentar) di dalam blok on.schedule.
function activeSchedules(text) {
  const schedules = [];
  const stack = []; // tumpukan {indent, key} kunci mapping YAML yang sedang aktif
  for (const raw of text.split('\n')) {
    const line = raw.replace(/#.*$/, ''); // buang komentar
    if (!line.trim()) continue;
    const indent = line.search(/\S/);
    while (stack.length && stack[stack.length - 1].indent >= indent) stack.pop();
    const keyMatch = line.match(/^\s*([A-Za-z0-9_-]+)\s*:/);
    if (keyMatch) {
      stack.push({ indent, key: keyMatch[1] });
      continue;
    }
    const cronMatch = line.match(/^\s*-\s*cron\s*:\s*['"]?([^'"]+?)['"]?\s*$/);
    if (cronMatch) {
      const keys = stack.map((s) => s.key);
      if (keys.includes('on') && keys.includes('schedule')) {
        schedules.push(cronMatch[1].trim());
      }
    }
  }
  return schedules;
}

function calledCronRoutes(text) {
  const out = [];
  const re = /\/api\/cron\/([a-z0-9-]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return [...new Set(out)];
}

function main() {
  const routes = listCronRoutes();
  const workflows = readWorkflows();

  const errors = [];
  const warnings = [];
  const scheduledWorkflows = [];

  for (const wf of workflows) {
    const schedules = activeSchedules(wf.text);
    const calls = calledCronRoutes(wf.text);
    if (schedules.length > 0) scheduledWorkflows.push({ file: wf.file, schedules, calls });

    for (const name of calls) {
      if (!routes.includes(name)) {
        errors.push(`${wf.file}: memanggil /api/cron/${name} tetapi route next-app/app/api/cron/${name}/route.ts TIDAK ADA.`);
      }
    }
  }

  const called = new Set();
  for (const wf of scheduledWorkflows) for (const c of wf.calls) called.add(c);
  for (const r of routes) {
    if (!called.has(r)) {
      warnings.push(`Route /api/cron/${r} ADA tetapi tidak dipanggil workflow terjadwal mana pun (jadwal hilang/belum dibuat?).`);
    }
  }

  console.log('=== Route cron (next-app/app/api/cron/*) ===');
  console.log(routes.length ? routes.map((r) => `  - ${r}`).join('\n') : '  (tidak ada)');
  console.log('\n=== Workflow terjadwal AKTIF (.github/workflows) ===');
  if (scheduledWorkflows.length) {
    for (const wf of scheduledWorkflows) {
      console.log(`  - ${wf.file}: ${wf.schedules.join(', ')}  → memanggil: ${wf.calls.join(', ') || '(tidak ada endpoint cron)'}`);
    }
  } else {
    console.log('  (tidak ada)');
  }

  console.log('\n=== Hasil ===');
  for (const w of warnings) console.log(`PERINGATAN: ${w}`);
  for (const e of errors) console.log(`ERROR: ${e}`);
  if (!warnings.length && !errors.length) console.log('OK: konfigurasi cron konsisten.');
  console.log(`\nRingkasan: ${routes.length} route, ${scheduledWorkflows.length} workflow terjadwal aktif, ${errors.length} error, ${warnings.length} peringatan.`);
  process.exit(errors.length ? 1 : 0);
}

main();
