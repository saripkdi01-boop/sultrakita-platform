'use strict';

// Manajemen sesi & guard autentikasi — diekstrak dari server.js tanpa perubahan perilaku.
const crypto = require('node:crypto');
const { run } = require('../database');
const { fail } = require('./http');
const { adminEmailAllowlist } = require('../google-admin-sso');

const currentUser = req => Number(req.user?.id || 0);

const issueSession = async (userId, ttlMs = 30 * 24 * 60 * 60 * 1000) => {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  await run('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [tokenHash, userId, Date.now() + ttlMs]);
  return token;
};

// Guard: hanya akun Google owner yang ada di allowlist yang boleh akses admin.
const adminOnly = (req, res, next) => {
  const sessionEmail = String(req.user?.email || '').trim().toLowerCase();
  if (!adminEmailAllowlist().has(sessionEmail)) return fail(res, 401, 'Akses admin hanya tersedia untuk akun Google owner yang diizinkan');
  next();
};

const auditAdminAction = async (db, req, action, entityType, entityId, metadata = {}) =>
  db.run(
    'INSERT INTO audit_logs (actor_id, action, entity_type, entity_id, metadata, ip_address, user_agent) VALUES (?, ?, ?, ?, ?::jsonb, ?, ?)',
    [req.user?.id || null, action, entityType, entityId == null ? null : String(entityId), JSON.stringify(metadata), req.ip || null, String(req.get('user-agent') || '').slice(0, 300) || null]
  );

module.exports = { currentUser, issueSession, adminOnly, auditAdminAction };
