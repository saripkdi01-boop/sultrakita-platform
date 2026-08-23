'use strict';

const crypto = require('node:crypto');
const { query, run } = require('./database');

const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');

async function authenticate(req, _res, next) {
  try {
    const header = req.get('authorization') || '';
    const match = header.match(/^Bearer\s+([A-Za-z0-9_-]{40,})$/);
    if (!match) return next();

    const [user] = await query(
      `SELECT u.id, u.name, u.phone, u.email, u.role, u.district,
              u.phone_verified, u.email_verified, u.verification_status
       FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND s.expires_at > ?`,
      [hashToken(match[1]), Date.now()]
    );
    if (user) req.user = user;
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
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, error: 'Akses tidak diizinkan' });
    return next();
  };
}

async function revokeToken(token) {
  if (!token) return;
  await run('DELETE FROM sessions WHERE token_hash = ?', [hashToken(token)]);
}

module.exports = { authenticate, requireAuth, requireRole, hashToken, revokeToken };
