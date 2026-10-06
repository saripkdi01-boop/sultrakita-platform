'use strict';

// Modul respons HTTP terpusat — diekstrak dari server.js tanpa perubahan perilaku.
// Kontrak: { success: true, data, meta? } | { success: false, error, code?, details? }

const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });

const fail = (res, status, message, details) =>
  res.status(status).json({ success: false, error: message, ...(details ? { details } : {}) });

const failCode = (res, status, code, message, details) =>
  res.status(status).json({ success: false, code, error: message, ...(details ? { details } : {}) });

const sessionCookie = token =>
  `sultra_session=${token}; Max-Age=${30 * 24 * 60 * 60}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

const clearSessionCookie = [
  'sultra_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax' + (process.env.NODE_ENV === 'production' ? '; Secure' : ''),
  'sultra_admin_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax' + (process.env.NODE_ENV === 'production' ? '; Secure' : ''),
];

const setSessionResponse = (res, token) => {
  res.setHeader('Set-Cookie', sessionCookie(token));
  res.setHeader('Cache-Control', 'no-store');
};

const notFoundHandler = (_req, res) => fail(res, 404, 'Endpoint tidak ditemukan');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, _req, res, _next) => {
  console.error(JSON.stringify({ event: 'request_error', message: error.message, code: error.code || null }));
  if (res.headersSent) return;
  const status = Number(error.statusCode || error.status) >= 400 ? Number(error.statusCode || error.status) : 500;
  return fail(res, status, status === 500 ? 'Terjadi kesalahan pada server' : error.message);
};

module.exports = { ok, fail, failCode, sessionCookie, clearSessionCookie, setSessionResponse, notFoundHandler, errorHandler };
