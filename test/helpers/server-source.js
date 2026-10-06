'use strict';

// Helper test kontrak: menggabungkan sumber server (server.js + routes/ + lib/)
// menjadi satu string agar kontrak keamanan/perilaku yang sebelumnya membaca
// monolit server.js tetap memverifikasi kode produksi yang sama pasca-refactor.
// Tanpa DB, tanpa jaringan — analisis statis murni.
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..', '..');

const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');

const listJs = dir => {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return [];
  return fs.readdirSync(abs).filter(f => f.endsWith('.js')).sort().map(f => `${dir}/${f}`);
};

// Sumber gabungan: server.js (wiring) + routes/ + lib/ + fondasi yang relevan.
const serverSource = [
  'server.js',
  ...listJs('routes'),
  ...listJs('lib'),
  'auth.js',
  'rbac.js',
  'authorization.js',
  'database.js',
].map(rel => `\n// ===== ${rel} =====\n${read(rel)}`).join('\n');

// Sumber per berkas untuk asersi yang spesifik lokasi.
const fileSource = rel => read(rel);

module.exports = { serverSource, fileSource, root };
