const test = require('node:test');
const assert = require('node:assert/strict');
const {
  TOOL_DEFINITIONS,
  createMcpServer,
  createApiAdapter,
  createRateLimiter,
  createToolHandler,
  redact,
  safeListingSearch,
} = require('../mcp/readonly-server');

test('exposes only allowlisted read-only tools', () => {
  assert.deepEqual(TOOL_DEFINITIONS.map((tool) => tool.name), [
    'get_mcp_usage_stats', 'search_listings', 'search_products', 'list_categories', 'get_business', 'get_platform_statistics',
  ]);
  assert.equal(TOOL_DEFINITIONS.some((tool) => /write|delete|upload|message/i.test(tool.name)), false);
});

test('rejects malformed and unsafe listing input', () => {
  assert.equal(safeListingSearch({ limit: 51 }).limit, 50);
  assert.throws(() => safeListingSearch({ page: 0 }), /page/);
  assert.throws(() => safeListingSearch({ query: 'x'.repeat(121) }), /query/);
  assert.throws(() => safeListingSearch([]), /arguments/);
  assert.doesNotThrow(() => safeListingSearch({ query: "' OR 1=1 --" }));
});

test('redacts sensitive fields recursively', () => {
  const output = redact({ id: 1, email: 'hidden', nested: { token: 'hidden', name: 'public' } });
  assert.deepEqual(output, { id: 1, nested: { name: 'public' } });
});

test('rejects non-allowlisted API hosts to prevent SSRF', () => {
  assert.throws(() => createApiAdapter({ baseUrl: 'https://example.com', fetchImpl: async () => ({}) }), /allowlisted/);
});

test('enforces a bounded per-tool rate limit', () => {
  let now = 1000;
  const rateLimit = createRateLimiter({ limit: 2, windowMs: 100, clock: () => now });
  rateLimit('search_listings');
  rateLimit('search_listings');
  assert.throws(() => rateLimit('search_listings'), /rate limit/);
  now += 101;
  assert.doesNotThrow(() => rateLimit('search_listings'));
});

test('routes tools through GET-only adapter and returns bounded public data', async () => {
  const calls = [];
  const handler = createToolHandler({
    get: async (path, params) => {
      calls.push({ path, params });
      if (path === '/api/listings') return { items: [{ id: 1, title: 'Public' }] };
      if (path === '/api/categories') return [{ id: 1, name: 'Food' }];
      if (path === '/api/sellers/7') return { seller: { id: 7, name: 'Seller', email: 'private' } };
      return { summary: { active_listings: 1 } };
    },
  });
  const listings = await handler('search_listings', { query: 'food', limit: 50 });
  const categories = await handler('list_categories', {});
  const business = await handler('get_business', { id: 7 });
  const stats = await handler('get_platform_statistics', {});
  assert.equal(calls.length, 4);
  assert.ok(calls.every(({ path }) => path.startsWith('/api/')));
  assert.deepEqual(calls.map(({ path }) => path), ['/api/listings', '/api/categories', '/api/sellers/7', '/api/stats']);
  assert.match(listings.content[0].text, /Public/);
  assert.doesNotMatch(business.content[0].text, /private/);
  assert.match(stats.content[0].text, /active_listings/);
});

test('supports MCP initialize, tools/list, and tools/call', async () => {
  const server = createMcpServer({ handler: async () => ({ content: [{ type: 'text', text: '{}' }] }) });
  const initialized = await server({ jsonrpc: '2.0', id: 1, method: 'initialize' });
  const listed = await server({ jsonrpc: '2.0', id: 2, method: 'tools/list' });
  const called = await server({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'list_categories', arguments: {} } });
  assert.equal(initialized.result.serverInfo.name, 'sultrakita-readonly');
  assert.equal(listed.result.tools.length, 6);
  assert.equal(called.result.content[0].text, '{}');
});
