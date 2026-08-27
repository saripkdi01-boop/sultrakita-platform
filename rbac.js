'use strict';

// Section 2 RBAC: canonical role names preserve buyer/admin legacy values while exposing the new hierarchy.
const ROLE_LEVELS = Object.freeze({ user: 1, seller: 2, moderator: 3, support: 3, analyst: 3, admin: 4, super_admin: 5 });
const ROLE_ALIASES = Object.freeze({ buyer: 'user', user: 'user', seller: 'seller', moderator: 'moderator', support: 'support', analyst: 'analyst', admin: 'admin', superadmin: 'super_admin', 'super-admin': 'super_admin', super_admin: 'super_admin' });
const ROLE_PERMISSIONS = Object.freeze({
  super_admin: ['view_dashboard', 'manage_users', 'manage_admins', 'manage_roles', 'manage_listings', 'approve_listings', 'feature_listings', 'delete_any_listing', 'manage_categories', 'moderate_reports', 'verify_sellers', 'manage_donations', 'manage_content', 'view_analytics', 'export_data', 'view_audit_log', 'manage_settings', 'manage_payment_config', 'send_notifications', 'ban_users', 'view_user_pii'],
  admin: ['view_dashboard', 'manage_users', 'manage_listings', 'approve_listings', 'feature_listings', 'delete_any_listing', 'manage_categories', 'moderate_reports', 'verify_sellers', 'manage_donations', 'manage_content', 'view_analytics', 'export_data', 'view_audit_log', 'send_notifications', 'ban_users', 'view_user_pii'],
  moderator: ['view_dashboard', 'manage_listings', 'approve_listings', 'moderate_reports', 'verify_sellers', 'send_notifications', 'view_user_pii'],
  support: ['view_dashboard', 'send_notifications'],
  analyst: ['view_dashboard', 'view_analytics', 'export_data'],
  seller: ['manage_listings_own'],
  user: []
});

function normalizeRole(role) { return ROLE_ALIASES[String(role || '').trim().toLowerCase()] || 'user'; }
function hasPermission(role, permission) { return Boolean(ROLE_PERMISSIONS[normalizeRole(role)]?.includes(permission)); }
function permissionList(role) { return [...(ROLE_PERMISSIONS[normalizeRole(role)] || [])]; }
function roleSummary() { return Object.keys(ROLE_LEVELS).map(role => ({ role, level: ROLE_LEVELS[role], permissions: permissionList(role) })); }
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
    const role = normalizeRole(req.user.role);
    if (!hasPermission(role, permission)) return res.status(403).json({ success: false, error: 'Permission tidak mencukupi', code: 'RBAC_FORBIDDEN', permission });
    req.rbac = { role, permission };
    return next();
  };
}

module.exports = { ROLE_LEVELS, ROLE_ALIASES, ROLE_PERMISSIONS, normalizeRole, hasPermission, permissionList, roleSummary, requirePermission };
