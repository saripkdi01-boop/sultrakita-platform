(() => {
  'use strict';
  const has = permission => Boolean(window.AdminState?.me?.permissions?.includes('*') || window.AdminState?.me?.permissions?.includes(permission));
  function apply() {
    document.querySelectorAll('[data-permission]').forEach(node => { node.hidden = !has(node.dataset.permission); });
    document.querySelectorAll('[data-role]').forEach(node => { node.hidden = window.AdminState?.me?.role !== node.dataset.role; });
  }
  document.addEventListener('admin:ready', apply);
  window.AdminRbac = { has, apply };
})();
