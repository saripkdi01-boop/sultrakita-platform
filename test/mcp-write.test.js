const test = require('node:test');
const assert = require('node:assert/strict');

process.env.SULTRAKITA_MCP_WRITE_ENABLED = 'true';
const { createMcpServer, createToolHandler, createWriteAdapter, WRITE_TOOL_DEFINITIONS } = require('../mcp/readonly-server');

test('exposes four CRUD tools only when write mode is explicitly enabled', async () => {
  const server = createMcpServer({ handler: async () => ({ content: [{ type: 'text', text: '{}' }] }) });
  const result = await server({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
  assert.equal(WRITE_TOOL_DEFINITIONS.length, 4);
  assert.equal(result.result.tools.length, 9);
  assert.ok(result.result.tools.some((tool) => tool.name === 'create_listing'));
});

test('routes writes with Bearer token and preserves API ownership boundary', async () => {
  const calls = [];
  const write = createWriteAdapter({
    baseUrl: 'https://sultrakita-platform.vercel.app',
    allowedHosts: ['sultrakita-platform.vercel.app'],
    token: 'A'.repeat(40),
    fetchImpl: async (url, options) => {
      calls.push({ url: String(url), options });
      return { ok: true, status: 201, json: async () => ({ success: true, data: { id: 10, status: 'active' } }) };
    },
  });
  const handler = createToolHandler({ get: async () => ({}), write });
  const result = await handler('create_listing', { title: 'Produk lokal', description: 'Deskripsi produk lokal valid', category_id: 2, price: 15000, condition: 'new', district: 'Kendari' });
  assert.equal(calls[0].options.method, 'POST');
  assert.equal(calls[0].options.headers.authorization, `Bearer ${'A'.repeat(40)}`);
  assert.match(calls[0].url, /\/api\/listings$/);
  assert.match(result.content[0].text, /"id":10/);
});

test('rejects invalid write input before making an upstream call', async () => {
  let called = false;
  const handler = createToolHandler({ get: async () => ({}), write: async () => { called = true; } });
  await assert.rejects(() => handler('update_listing', { id: 0, title: 'x', description: 'short', category_id: 1, price: 1 }), /positive safe integer|title and description/);
  assert.equal(called, false);
});

test('fails closed when write mode has no runtime token', async () => {
  const write = createWriteAdapter({ token: undefined });
  await assert.rejects(() => write('POST', '/api/listings', {}), /SULTRAKITA_API_TOKEN/);
});
