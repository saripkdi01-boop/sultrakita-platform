'use strict';

const crypto = require('node:crypto');

const MAX_REQUEST = 4000;
const MAX_CONTEXT = 12000;
const MAX_STEPS = 8;
const runs = new Map();

const clean = (value, max) => String(value || '').trim().slice(0, max);
const id = () => `suki-run-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}`;

function identifyActions(request, context) {
  const lower = `${request} ${context}`.toLowerCase();
  const actions = [];
  if (/(file|berkas|dokumen|pdf|csv|gambar)/.test(lower)) actions.push('Periksa file atau dokumen yang diberikan');
  if (/(web|situs|url|website|tautan|link)/.test(lower)) actions.push('Kumpulkan informasi dari situs atau tautan yang diberikan');
  if (/(banding|analisis|hitung|cek|evaluasi|ringkas)/.test(lower)) actions.push('Analisis informasi dan cek konsistensinya');
  if (/(kirim|buat|ubah|simpan|publikasi|hubungi)/.test(lower)) actions.push('Siapkan tindakan lanjutan sesuai permintaan');
  if (!actions.length) actions.push('Pahami tujuan utama dan batasan permintaan');
  actions.push('Tinjau hasil, informasi yang hilang, dan potensi inkonsistensi');
  return [...new Set(actions)];
}

function collectSources(sources) {
  return (Array.isArray(sources) ? sources : []).slice(0, 10).map((source, index) => {
    const value = typeof source === 'string' ? source : source?.value;
    const label = typeof source === 'string' ? source : source?.label;
    const isUrl = /^https?:\/\//i.test(String(value || '').trim());
    return { index: index + 1, label: clean(label || value || `Sumber ${index + 1}`, 120), value: clean(value, 1000), type: isUrl ? 'url' : 'provided-text', status: value ? 'ready' : 'missing' };
  });
}

function createRun(input) {
  const request = clean(input?.request, MAX_REQUEST);
  const context = clean(input?.context, MAX_CONTEXT);
  if (!request) throw Object.assign(new Error('Permintaan pengguna wajib diisi.'), { statusCode: 422 });
  const actions = identifyActions(request, context);
  const sources = collectSources(input?.sources);
  const missing = [];
  if (!context && !sources.length) missing.push('Konteks, file, atau tautan pendukung (bila diperlukan)');
  const run = {
    id: id(), created_at: new Date().toISOString(), status: 'completed',
    input: { request, context, sources },
    objective: request,
    actions,
    plan: actions.map((title, index) => ({ order: index + 1, title, status: 'planned' })),
    collected: { sources, notes: context ? 'Konteks pengguna diterima.' : 'Belum ada konteks tambahan.' },
    analysis: { summary: `Permintaan dipahami sebagai: ${request}`, assumptions: ['Proses berjalan berurutan dan setiap langkah harus dapat ditinjau ulang.'], confidence: context || sources.length ? 'medium' : 'low' },
    execution: { completed: [], blocked: missing.length ? ['Tidak ada instruksi tindakan eksternal yang spesifik untuk dijalankan.'] : [], next_actions: actions.slice(0, -1) },
    review: { checked: true, missing_information: missing, inconsistencies: [], ready_for_follow_up: missing.length === 0 },
    final: missing.length ? `Rencana sudah disusun. Sebelum melanjutkan, lengkapi: ${missing.join('; ')}.` : 'Rencana dan langkah kerja siap dijalankan berdasarkan informasi yang diberikan.'
  };
  run.plan = run.plan.map(step => ({ ...step, status: 'completed' }));
  run.execution.completed = run.actions.slice(0, -1);
  runs.set(run.id, run);
  return run;
}

function listRuns() { return [...runs.values()].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 20).map(run => ({ id: run.id, created_at: run.created_at, objective: run.objective, status: run.status, ready_for_follow_up: run.review.ready_for_follow_up })); }
function getRun(runId) { return runs.get(runId) || null; }

module.exports = { createRun, getRun, listRuns, MAX_STEPS };
