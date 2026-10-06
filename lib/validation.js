'use strict';

// Validator & sanitizer bersama — diekstrak dari server.js tanpa perubahan perilaku.

const positiveInt = value => Number.isInteger(Number(value)) && Number(value) > 0;

const safeText = (value, max) => String(value ?? '').trim().slice(0, max);

const boundedText = (value, max) => safeText(value, max);

const normalizeEmail = value => {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : null;
};

const maskEmail = email => {
  const [local, domain] = String(email || '').split('@');
  return local && domain ? `${local.slice(0, 2)}***@${domain}` : 'email tersamarkan';
};

const parseJsonValue = value => {
  try { return typeof value === 'string' ? JSON.parse(value) : value; } catch { return null; }
};

const parseJsonObject = value => {
  const parsed = parseJsonValue(value);
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
};

const parseJsonArray = value => {
  const parsed = parseJsonValue(value);
  return Array.isArray(parsed) ? parsed : [];
};

const parseCookies = header =>
  Object.fromEntries(
    String(header || '').split(';').map(part => part.trim().split('=').map(decodeURIComponent)).filter(pair => pair.length === 2)
  );

const escapeXml = value =>
  String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));

module.exports = {
  positiveInt, safeText, boundedText, normalizeEmail, maskEmail,
  parseJsonValue, parseJsonObject, parseJsonArray, parseCookies, escapeXml,
};
