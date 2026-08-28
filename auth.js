'use strict';

const crypto = require('node:crypto');
const { query, run } = require('./database');
const { normalizeRole } = require('./rbac');

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');
const userSelect = `SELECT u.id, u.name, u.phone, u.email, s.created_at AS session_created_at, s.expires_at AS session_expires_at, COALESCE(ara.role, u.role) AS role, u.role AS legacy_role,
                          u.district, u.phone_verified, u.email_verified, u.verification_status
                   FROM sessions s JOIN users u ON u.id = s.user_id
                   LEFT JOIN admin_role_assignments ara ON ara.user_id = u.id
                   WHERE s.token_hash = ? AND s.expires_at > ?`;
const legacyUserSelect = `SELECT u.id, u.name, u.phone, u.email, s.created_at AS session_created_at, s.expires_at AS session_expires_at, u.role, u.role AS legacy_role,
                                 u.district, u.phone_verified, u.email_verified, u.verification_status
                          FROM sessions s JOIN users u ON u.id = s.user_id
                          WHERE s.token_hash = ? AND s.expires_at > ?`;

async function authenticate(req, _res, next) {
  try {
    const header = req.get('authorization') || '';
    const match = header.match(/^Bearer\s+([A-Za-z0-9_-]{40,})$/);
    if (!match) return next();

    const params = [hashToken(match[1]), Date.now()];
    let users;
    try {
      users = await query(userSelect, params);
    } catch (error) {
      // During a rolling deploy, retain valid legacy sessions until migration 015 is applied.
      if (error.code !== '42P01') throw error;
      users = await query(legacyUserSelect, params);
    }
    const [user] = users;
    if (user) {
      user.role = normalizeRole(user.role);
      req.user = user;
    }
    return next();
  } catch (error) {
    req.authDegraded = true;
    console.error('[auth-degraded]', error.message);
  }
  return next();
}

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, error: 'Autentikasi diperlukan' });
    const effectiveRole = normalizeRole(req.user.role);
    if (!roles.some(role => normalizeRole(role) === effectiveRole)) return res.status(403).json({ success: false, error: 'Akses tidak diizinkan' });
    return next();
  };
}

async function revokeToken(token) {
  if (!token) return;
  await run('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
}

module.exports = { authenticate, requireAuth, requireRole, hashToken, revokeToken };
