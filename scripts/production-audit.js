'use strict';
const fs = require('node:fs');
const { performance } = require('node:perf_hooks');

const targets = [
  { name: 'vercel', base: process.env.VERCEL_BASE_URL || 'https://sultrakita-platform.vercel.app' },
  { name: 'worker', base: process.env.WORKER_BASE_URL || 'https://sultrakita-demo.aplikasi-cerdasku.workers.dev' },
];
const paths = ['/api/health', '/api/categories', '/api/listings?limit=8', '/'];
const securityHeaders = ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'content-security-policy'];
const samples = Number(process.env.AUDIT_SAMPLES || 5);

async function sample(base, pathname) {
  const started = performance.now();
  try {
    const response = await fetch(`${base}${pathname}`, { redirect: 'manual', headers: { accept: 'application/json,text/html' } });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const headers = Object.fromEntries(securityHeaders.map(name => [name, response.headers.get(name)]).filter(([, value]) => value));
    return { status: response.status, ok: response.ok, duration_ms: Number((performance.now() - started).toFixed(2)), bytes: bytes.byteLength, content_type: response.headers.get('content-type'), headers };
  } catch (error) {
    return { status: 0, ok: false, duration_ms: Number((performance.now() - started).toFixed(2)), error: error.name === 'AbortError' ? 'timeout' : error.message };
  }
}

function summarize(rows) {
  const durations = rows.filter(row => row.status).map(row => row.duration_ms).sort((a, b) => a - b);
  const percentile = p => durations.length ? durations[Math.min(durations.length - 1, Math.floor((durations.length - 1) * p))] : null;
  return { requests: rows.length, successes: rows.filter(row => row.ok).length, http_errors: rows.filter(row => row.status >= 400).length, network_errors: rows.filter(row => !row.status).length, latency_ms: { p50: percentile(.5), p95: percentile(.95), max: durations.at(-1) ?? null, average: durations.length ? Number((durations.reduce((sum, value) => sum + value, 0) / durations.length).toFixed(2)) : null }, bytes: { min: Math.min(...rows.map(row => row.bytes || 0)), max: Math.max(...rows.map(row => row.bytes || 0)) } };
}

async function cloudflareMetrics() {
  const token = process.env.CLOUDFLARE_API_TOKEN;
  const accountTag = process.env.CLOUDFLARE_ACCOUNT_ID || '1c6fef13342a46180a2f3826f88e8000';
  const scriptName = process.env.CLOUDFLARE_WORKER_NAME || 'sultrakita-demo';
  if (!token) return { status: 'not_configured', notice: 'CLOUDFLARE_API_TOKEN tidak tersedia; gunakan token Analytics read-only untuk metrik historis.' };
  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const query = `query GetWorkersAnalytics($accountTag: string, $datetimeStart: string, $datetimeEnd: string, $scriptName: string) { viewer { accounts(filter: {accountTag: $accountTag}) { workersInvocationsAdaptive(limit: 10000, filter: { scriptName: $scriptName, datetime_geq: $datetimeStart, datetime_leq: $datetimeEnd }) { sum { subrequests requests errors } quantiles { cpuTimeP50 cpuTimeP99 } dimensions { datetime scriptName status } } } } }`;
  const response = await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers: { authorization: `Bearer ${token}`, accept: 'application/json', 'content-type': 'application/json' }, body: JSON.stringify({ query, variables: { accountTag, datetimeStart: start.toISOString(), datetimeEnd: end.toISOString(), scriptName } }) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.errors?.length) return { status: 'error', http_status: response.status, errors: (body.errors || []).map(error => error.message).slice(0, 5) };
  const rows = body.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
  const total = rows.reduce((acc, row) => ({ requests: acc.requests + Number(row.sum?.requests || 0), errors: acc.errors + Number(row.sum?.errors || 0), subrequests: acc.subrequests + Number(row.sum?.subrequests || 0) }), { requests: 0, errors: 0, subrequests: 0 });
  const cpuP50 = rows.map(row => Number(row.quantiles?.cpuTimeP50)).filter(Number.isFinite);
  const cpuP99 = rows.map(row => Number(row.quantiles?.cpuTimeP99)).filter(Number.isFinite);
  const statuses = rows.reduce((acc, row) => { const key = row.dimensions?.status || 'unknown'; acc[key] = (acc[key] || 0) + Number(row.sum?.requests || 0); return acc; }, {});
  return { status: 'ok', window: { start: start.toISOString(), end: end.toISOString() }, script: scriptName, total, error_rate_percent: total.requests ? Number((total.errors / total.requests * 100).toFixed(3)) : 0, cpu_time_ms: { p50_max: cpuP50.length ? Math.max(...cpuP50) : null, p99_max: cpuP99.length ? Math.max(...cpuP99) : null }, invocation_status_requests: statuses, data_points: rows.length };
}

(async () => {
  const result = { generated_at: new Date().toISOString(), samples_per_endpoint: samples, targets: {}, cloudflare_worker_metrics: await cloudflareMetrics() };
  for (const target of targets) {
    const rows = [];
    for (const pathname of paths) for (let index = 0; index < samples; index += 1) rows.push({ path: pathname, sample: index + 1, ...(await sample(target.base, pathname)) });
    const headerRows = rows.filter(row => row.path === '/api/health' && row.headers);
    const headerAudit = Object.fromEntries(securityHeaders.map(header => [header, { present: headerRows.filter(row => row.headers?.[header]).length, expected: samples }]));
    result.targets[target.name] = { base: target.base, summary: summarize(rows), security_headers: headerAudit, endpoints: rows };
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
})().catch(error => { console.error(error.stack || error.message); process.exitCode = 1; });
