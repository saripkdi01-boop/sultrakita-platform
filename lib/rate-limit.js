'use strict';

// Rate limiter berbasis database — diekstrak dari server.js tanpa perubahan perilaku.
// Degradasi anggun: jika DB tidak tersedia, request tetap diteruskan (fail-open)
// agar satu kegagalan infra tidak melumpuhkan seluruh API.
const { query } = require('../database');
const { fail } = require('./http');

const rateLimit = (windowMs = 60_000, max = 60) => async (req, res, next) => {
  const key = `${req.ip}:${req.path}`;
  try {
    const rows = await query(
      `INSERT INTO rate_limits (key, window_started_at, hit_count) VALUES (?, now(), 1)
       ON CONFLICT (key) DO UPDATE SET
         hit_count = CASE WHEN rate_limits.window_started_at <= now() - (? * interval '1 millisecond') THEN 1 ELSE rate_limits.hit_count + 1 END,
         window_started_at = CASE WHEN rate_limits.window_started_at <= now() - (? * interval '1 millisecond') THEN now() ELSE rate_limits.window_started_at END,
         updated_at = now()
       RETURNING hit_count, window_started_at`,
      [key, windowMs, windowMs]
    );
    const hit = Number(rows[0]?.hit_count || 0);
    if (hit > max) return fail(res, 429, 'Terlalu banyak permintaan. Silakan coba lagi nanti.');
    return next();
  } catch (error) {
    console.error('[rate-limit-degraded]', error.message);
    return next();
  }
};

module.exports = { rateLimit };
