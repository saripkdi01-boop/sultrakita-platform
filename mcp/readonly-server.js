const readline = require('node:readline');

const MAX_LIMIT = 50;
const DEFAULT_TIMEOUT_MS = 8000;
const DEFAULT_RATE_LIMIT = 60;
const DEFAULT_RATE_WINDOW_MS = 60000;
const WRITE_ENABLED = String(process.env.SULTRAKITA_MCP_WRITE_ENABLED || '').toLowerCase() === 'true';
const SENSITIVE_KEYS = new Set([
  'password', 'password_hash', 'session_secret', 'token', 'access_token',
  'refresh_token', 'supabase_service_role_key', 'r2_credentials',
  'database_url', 'private_key', 'otp', 'otp_code', 'phone', 'email',
  'ip_address', 'user_agent', 'metadata', 'security_metadata',
]);

function fail(code, message) { const error = new Error(message); error.code = code; throw error; }
function objectInput(input) { if (input === undefined) return {}; if (!input || typeof input !== 'object' || Array.isArray(input)) fail('INVALID_INPUT', 'arguments must be an object'); return input; }
function boundedString(value, field, max = 120) { if (value === undefined || value === null) return undefined; if (typeof value !== 'string' || value.length > max) fail('INVALID_INPUT', `${field} must be a string <= ${max} characters`); return value.trim(); }
function positiveInteger(value, field, fallback) { if (value === undefined) return fallback; if (!Number.isSafeInteger(value) || value < 1) fail('INVALID_INPUT', `${field} must be a positive safe integer`); return value; }
function safeListingSearch(input) { const args = objectInput(input); return { q: boundedString(args.q ?? args.query, 'query'), category: boundedString(args.category, 'category', 80), district: boundedString(args.district, 'district', 80), page: positiveInteger(args.page, 'page', 1), limit: Math.min(MAX_LIMIT, positiveInteger(args.limit, 'limit', 12)) }; }
function safeBusinessId(input) { const args = objectInput(input); const id = args.id; if (!Number.isSafeInteger(id) || id < 1) fail('INVALID_INPUT', 'id must be a positive safe integer'); return { id }; }
function safeStats(input) { const args = objectInput(input); if (Object.keys(args).length > 0) fail('INVALID_INPUT', 'get_platform_statistics accepts no arguments'); return {}; }
function safeListingWrite(input) {
  const args = objectInput(input);
  const title = boundedString(args.title, 'title', 120);
  const description = boundedString(args.description, 'description', 2000);
  const district = args.district === undefined ? 'Kendari' : boundedString(args.district, 'district', 80);
  const condition = args.condition === undefined ? 'new' : args.condition;
  if (!title || title.length < 5 || !description || description.length < 10) fail('INVALID_INPUT', 'title and description are required');
  if (!Number.isSafeInteger(args.category_id) || args.category_id < 1) fail('INVALID_INPUT', 'category_id must be a positive safe integer');
  if (!Number.isSafeInteger(args.price) || args.price < 0) fail('INVALID_INPUT', 'price must be a non-negative safe integer');
  if (!['new', 'second'].includes(condition)) fail('INVALID_INPUT', 'condition must be new or second');
  return { title, description, category_id: args.category_id, price: args.price, condition, district };
}
function safeListingId(input) { return safeBusinessId(input); }
function safeListingStatus(input) { const args = objectInput(input); const { id } = safeListingId(args); if (!['active', 'sold', 'archived'].includes(args.status)) fail('INVALID_INPUT', 'status must be active, sold, or archived'); return { id, status: args.status }; }
function redact(value) { if (Array.isArray(value)) return value.map(redact); if (!value || typeof value !== 'object') return value; return Object.fromEntries(Object.entries(value).filter(([key]) => !SENSITIVE_KEYS.has(key.toLowerCase())).map(([key, child]) => [key, redact(child)])); }
function jsonResult(data) { return { content: [{ type: 'text', text: JSON.stringify(redact(data)) }] }; }
function apiUrl(baseUrl, path, params) { const url = new URL(path, baseUrl); for (const [key, value] of Object.entries(params || {})) if (value !== undefined && value !== '') url.searchParams.set(key, String(value)); return url; }
function createRateLimiter({ limit = DEFAULT_RATE_LIMIT, windowMs = DEFAULT_RATE_WINDOW_MS, clock = Date.now } = {}) { const buckets = new Map(); return function rateLimit(key = 'anonymous') { const now = clock(); const current = buckets.get(key); if (!current || now - current.startedAt >= windowMs) { buckets.set(key, { startedAt: now, count: 1 }); return; } if (current.count >= limit) fail('RATE_LIMITED', 'MCP tool rate limit exceeded'); current.count += 1; }; }
function configuredAllowedHosts() { return String(process.env.SULTRAKITA_API_ALLOWED_HOSTS || '127.0.0.1,localhost').split(',').map((host) => host.trim().toLowerCase()).filter(Boolean); }
function validateBaseUrl(baseUrl, allowedHosts) { const parsed = new URL(baseUrl); if (!['http:', 'https:'].includes(parsed.protocol)) fail('INVALID_CONFIG', 'API base URL must use HTTP(S)'); if (!allowedHosts.includes(parsed.hostname.toLowerCase())) fail('INVALID_CONFIG', 'API host is not allowlisted'); return parsed; }
function createApiAdapter({ baseUrl = process.env.SULTRAKITA_API_BASE_URL || 'http://127.0.0.1:3000', fetchImpl = globalThis.fetch, timeoutMs = DEFAULT_TIMEOUT_MS, allowedHosts = configuredAllowedHosts() } = {}) {
  if (!fetchImpl) fail('UPSTREAM_UNAVAILABLE', 'fetch is unavailable'); const parsed = validateBaseUrl(baseUrl, allowedHosts);
  return async function get(path, params) { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs); try { const response = await fetchImpl(apiUrl(parsed, path, params), { method: 'GET', headers: { accept: 'application/json' }, signal: controller.signal }); const body = await response.json().catch(() => null); if (!response.ok) fail(response.status === 404 ? 'NOT_FOUND' : 'UPSTREAM_UNAVAILABLE', `SultraKita API returned ${response.status}`); return body?.data ?? body; } catch (error) { if (error.code) throw error; fail(error.name === 'AbortError' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE', 'SultraKita API unavailable'); } finally { clearTimeout(timer); } };
}
function createWriteAdapter({ baseUrl = process.env.SULTRAKITA_API_BASE_URL || 'http://127.0.0.1:3000', fetchImpl = globalThis.fetch, token = process.env.SULTRAKITA_API_TOKEN, timeoutMs = DEFAULT_TIMEOUT_MS, allowedHosts = configuredAllowedHosts() } = {}) {
  if (!WRITE_ENABLED) return async () => fail('WRITE_DISABLED', 'MCP write tools are disabled');
  if (!token) return async () => fail('WRITE_UNAUTHENTICATED', 'SULTRAKITA_API_TOKEN is required for MCP write tools');
  if (!fetchImpl) fail('UPSTREAM_UNAVAILABLE', 'fetch is unavailable'); const parsed = validateBaseUrl(baseUrl, allowedHosts);
  return async function write(method, path, body) { const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), timeoutMs); try { const response = await fetchImpl(new URL(path, parsed), { method, headers: { authorization: `Bearer ${token}`, accept: 'application/json', ...(body === undefined ? {} : { 'content-type': 'application/json' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), signal: controller.signal }); const payload = await response.json().catch(() => null); if (!response.ok) fail(response.status === 401 ? 'UNAUTHENTICATED' : response.status === 403 ? 'FORBIDDEN' : response.status === 404 ? 'NOT_FOUND' : 'UPSTREAM_WRITE_FAILED', `SultraKita API returned ${response.status}`); return payload?.data ?? payload; } catch (error) { if (error.code) throw error; fail(error.name === 'AbortError' ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_WRITE_FAILED', 'SultraKita API write unavailable'); } finally { clearTimeout(timer); } };
}
const READ_TOOL_DEFINITIONS = [
  { name: 'search_listings', description: 'Search public active listings.', inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, category: { type: 'string', maxLength: 80 }, district: { type: 'string', maxLength: 80 }, page: { type: 'integer', minimum: 1 }, limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT } }, additionalProperties: false } },
  { name: 'search_products', description: 'Search public products using the listing search service.', inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, category: { type: 'string', maxLength: 80 }, district: { type: 'string', maxLength: 80 }, page: { type: 'integer', minimum: 1 }, limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT } }, additionalProperties: false } },
  { name: 'list_categories', description: 'List public categories.', inputSchema: { type: 'object', properties: { district: { type: 'string', maxLength: 80 } }, additionalProperties: false } },
  { name: 'get_business', description: 'Get a public seller/business projection by numeric ID.', inputSchema: { type: 'object', properties: { id: { type: 'integer', minimum: 1 } }, required: ['id'], additionalProperties: false } },
  { name: 'get_platform_statistics', description: 'Get aggregate public platform statistics.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } },
];
const WRITE_TOOL_DEFINITIONS = [
  { name: 'create_listing', description: 'Create a listing for the authenticated seller.', inputSchema: { type: 'object', required: ['title', 'description', 'category_id', 'price'], properties: { title: { type: 'string', minLength: 5, maxLength: 120 }, description: { type: 'string', minLength: 10, maxLength: 2000 }, category_id: { type: 'integer', minimum: 1 }, price: { type: 'integer', minimum: 0 }, condition: { type: 'string', enum: ['new', 'second'] }, district: { type: 'string', maxLength: 80 } }, additionalProperties: false } },
  { name: 'update_listing', description: 'Update an owned listing for the authenticated seller.', inputSchema: { type: 'object', required: ['id', 'title', 'description', 'category_id', 'price'], properties: { id: { type: 'integer', minimum: 1 }, title: { type: 'string', minLength: 5, maxLength: 120 }, description: { type: 'string', minLength: 10, maxLength: 2000 }, category_id: { type: 'integer', minimum: 1 }, price: { type: 'integer', minimum: 0 }, condition: { type: 'string', enum: ['new', 'second'] }, district: { type: 'string', maxLength: 80 } }, additionalProperties: false } },
  { name: 'archive_listing', description: 'Archive an owned listing; this is the delete semantic exposed by the API.', inputSchema: { type: 'object', required: ['id'], properties: { id: { type: 'integer', minimum: 1 } }, additionalProperties: false } },
  { name: 'set_listing_status', description: 'Set an owned listing status.', inputSchema: { type: 'object', required: ['id', 'status'], properties: { id: { type: 'integer', minimum: 1 }, status: { type: 'string', enum: ['active', 'sold', 'archived'] } }, additionalProperties: false } },
];
const TOOL_DEFINITIONS = READ_TOOL_DEFINITIONS;
function availableToolDefinitions() { return WRITE_ENABLED ? [...READ_TOOL_DEFINITIONS, ...WRITE_TOOL_DEFINITIONS] : READ_TOOL_DEFINITIONS; }
function createToolHandler({ get, write = createWriteAdapter(), rateLimit = createRateLimiter(), audit = () => {} } = {}) { return async function call(name, input) { rateLimit(name); audit({ tool: name, outcome: 'started' }); switch (name) {
  case 'search_listings': case 'search_products': return jsonResult(await get('/api/listings', safeListingSearch(input)));
  case 'list_categories': { const args = objectInput(input); return jsonResult(await get('/api/categories', { district: boundedString(args.district, 'district', 80) })); }
  case 'get_business': return jsonResult(await get(`/api/sellers/${safeBusinessId(input).id}`));
  case 'get_platform_statistics': return jsonResult(await get('/api/stats', safeStats(input)));
  case 'create_listing': return jsonResult(await write('POST', '/api/listings', safeListingWrite(input)));
  case 'update_listing': { const args = objectInput(input); const { id } = safeListingId(args); return jsonResult(await write('PUT', `/api/listings/${id}`, safeListingWrite(args))); }
  case 'archive_listing': return jsonResult(await write('DELETE', `/api/listings/${safeListingId(input).id}`));
  case 'set_listing_status': { const args = safeListingStatus(input); return jsonResult(await write('PATCH', `/api/listings/${args.id}/status`, { status: args.status })); }
  default: fail('NOT_FOUND', `unknown tool: ${name}`);
} }; }
function createMcpServer({ handler = createToolHandler({ get: createApiAdapter() }) } = {}) { return async function handle(message) { const id = message?.id ?? null; try { if (message?.method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2025-03-26', capabilities: { tools: {} }, serverInfo: { name: WRITE_ENABLED ? 'sultrakita' : 'sultrakita-readonly', version: '0.2.0' } } }; if (message?.method === 'notifications/initialized') return null; if (message?.method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools: availableToolDefinitions() } }; if (message?.method === 'tools/call') { const params = message.params || {}; return { jsonrpc: '2.0', id, result: await handler(params.name, params.arguments || {}) }; } fail('METHOD_NOT_FOUND', `unsupported method: ${message?.method}`); } catch (error) { return { jsonrpc: '2.0', id, error: { code: -32000, message: error.code || 'MCP_ERROR', data: { detail: error.message } } }; } }; }
if (require.main === module) { const handle = createMcpServer(); const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity }); rl.on('line', async (line) => { if (!line.trim()) return; const response = await handle(JSON.parse(line)); if (response) process.stdout.write(`${JSON.stringify(response)}\n`); }); }
module.exports = { MAX_LIMIT, TOOL_DEFINITIONS, READ_TOOL_DEFINITIONS, WRITE_TOOL_DEFINITIONS, WRITE_ENABLED, createApiAdapter, createWriteAdapter, createMcpServer, createRateLimiter, createToolHandler, redact, safeBusinessId, safeListingSearch, safeListingWrite, safeListingStatus };
