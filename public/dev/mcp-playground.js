(() => {
  const tools = window.SULTRAKITA_MCP_TOOLS || [];
  const select = document.querySelector('#tool-select');
  const summary = document.querySelector('#tool-summary');
  const schemaOutput = document.querySelector('#schema-output');
  const feedback = document.querySelector('#feedback');
  const exportButton = document.querySelector('#export-button');

  function render() {
    const tool = tools.find(item => item.name === select.value) || tools[0];
    if (!tool) { summary.textContent = 'Belum ada tool contract yang dimuat.'; schemaOutput.textContent = '{}'; return; }
    summary.textContent = tool.description || 'No description';
    schemaOutput.textContent = JSON.stringify(tool.inputSchema || {}, null, 2);
  }

  tools.forEach(tool => { const option = document.createElement('option'); option.value = tool.name; option.textContent = tool.name; select.append(option); });
  select.addEventListener('change', render);
  exportButton.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ name: 'sultrakita-mcp', tools }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'sultrakita-mcp-request-manifest.json'; link.click(); URL.revokeObjectURL(link.href);
    feedback.textContent = 'Manifest request berhasil diekspor.';
  });
  render();
})();
