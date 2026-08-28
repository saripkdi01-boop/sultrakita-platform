(() => {
  'use strict';
  const aliases = Object.freeze({
    'dashboard:view':'view_dashboard','users:view':'manage_users','users:manage':'manage_users','users:ban':'ban_users','users:pii':'view_user_pii','admins:manage':'manage_admins','roles:manage':'manage_roles','listings:view':'manage_listings','listings:manage':'manage_listings','listings:approve':'approve_listings','listings:feature':'feature_listings','listings:delete':'delete_any_listing','categories:manage':'manage_categories','reports:moderate':'moderate_reports','verifications:manage':'verify_sellers','donations:manage':'manage_donations','content:manage':'manage_content','analytics:view':'view_analytics','analytics:export':'export_data','audit:view':'view_audit_log','settings:manage':'manage_settings','payments:manage':'manage_payment_config','notifications:send':'send_notifications'
  });
  const key = (resource, action) => action === undefined ? String(resource || '') : (aliases[`${String(resource).toLowerCase()}:${String(action).toLowerCase()}`] || `${String(resource).toLowerCase()}_${String(action).toLowerCase()}`);
  const hasPermission = (resource, action) => Boolean(window.AdminState?.me?.permissions?.includes('*') || window.AdminState?.me?.permissions?.includes(key(resource, action)));
  function apply() { document.querySelectorAll('[data-permission]').forEach(element => { const [resource, action] = String(element.dataset.permission || '').split(':'); element.hidden = !hasPermission(resource, action); }); }
  document.addEventListener('admin:ready', apply);
  window.AdminRbac = { key, hasPermission, apply };
})();
