(() => {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[char]));
  const formatNumber = value => Number(value || 0).toLocaleString('id-ID');
  function setStatus(message, error = false) { const node = document.querySelector('[data-status]'); if (!node) return; node.textContent = message; node.classList.toggle('error', error); }
  function table(target, columns, rows, empty = 'Belum ada data.') { const node = typeof target === 'string' ? document.querySelector(target) : target; if (!node) return; if (!rows.length) { node.innerHTML = `<div class="admin-empty">${esc(empty)}</div>`; return; } node.innerHTML = `<div class="admin-table-wrap"><table class="admin-table"><thead><tr>${columns.map(column => `<th scope="col">${esc(column.label)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${columns.map(column => `<td>${column.render ? column.render(row) : esc(row[column.key])}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`; }
  function metric(label, value) { return `<article class="admin-card admin-metric admin-span-3"><small>${esc(label)}</small><strong>${formatNumber(value)}</strong></article>`; }
  function badge(label, tone = '') { return `<span class="admin-badge ${tone}">${esc(label)}</span>`; }
  window.AdminUi = { esc, formatNumber, setStatus, table, metric, badge };
})();
