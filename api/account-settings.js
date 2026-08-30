const express = require('express');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');

const router = express.Router();
const safeText = (value, max) => String(value ?? '').trim().replace(/[<>]/g, '').slice(0, max);
const normalizeEmail = value => {
  const email = String(value || '').trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 254 ? email : null;
};
const defaults = {
  preferences: { dark_mode: false, language: 'id', app_icon: 'default', notifications_enabled: true },
  privacy: { profile_visibility: 'public', show_activity_status: true, allow_tagging: true, data_sharing_consent: false },
  notifications: { email_notifications: true, push_notifications: true, sms_notifications: false },
};
const selectSettings = `SELECT u.id, u.name, u.email, u.phone, u.district, u.bio, u.avatar_url, u.created_at, u.deleted_at, u.deletion_scheduled_at,
  us.dark_mode, us.language, us.app_icon, us.notifications_enabled,
  ps.profile_visibility, ps.show_activity_status, ps.allow_tagging, ps.data_sharing_consent,
  ns.email_notifications, ns.push_notifications, ns.sms_notifications
  FROM users u LEFT JOIN user_settings us ON us.user_id = u.id
  LEFT JOIN privacy_settings ps ON ps.user_id = u.id
  LEFT JOIN notification_settings ns ON ns.user_id = u.id
  WHERE u.id = ? LIMIT 1`;
const serialize = row => ({
  account: { id: row.id, name: row.name, email: row.email, phone: row.phone, district: row.district, bio: row.bio, avatar_url: row.avatar_url, created_at: row.created_at, deleted_at: row.deleted_at, deletion_scheduled_at: row.deletion_scheduled_at },
  preferences: { dark_mode: row.dark_mode ?? defaults.preferences.dark_mode, language: row.language || 'id', app_icon: row.app_icon || 'default', notifications_enabled: row.notifications_enabled ?? true },
  privacy: { profile_visibility: row.profile_visibility || 'public', show_activity_status: row.show_activity_status ?? true, allow_tagging: row.allow_tagging ?? true, data_sharing_consent: row.data_sharing_consent ?? false },
  notifications: { email_notifications: row.email_notifications ?? true, push_notifications: row.push_notifications ?? true, sms_notifications: row.sms_notifications ?? false },
});
const ok = (res, data) => res.json({ success: true, data });
const fail = (res, status, error) => res.status(status).json({ success: false, error });

router.get('/settings', requireAuth, async (req, res, next) => {
  try {
    const [row] = await query(selectSettings, [req.user.id]);
    if (!row) return fail(res, 404, 'Akun tidak ditemukan');
    return ok(res, serialize(row));
  } catch (error) { return next(error); }
});

router.patch('/settings', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = req.body?.profile || {};
    const preferences = req.body?.preferences || {};
    const privacy = req.body?.privacy || {};
    const notifications = req.body?.notifications || {};
    if (Object.keys(profile).length) {
      const name = safeText(profile.name, 120);
      const district = safeText(profile.district, 80);
      const bio = safeText(profile.bio, 500);
      const email = profile.email ? normalizeEmail(profile.email) : null;
      if (name.length < 2 || !district) return fail(res, 422, 'Profil belum valid');
      if (profile.email && !email) return fail(res, 422, 'Format email belum valid');
      await run('UPDATE users SET name = ?, district = ?, bio = ?, email = COALESCE(?, email) WHERE id = ?', [name, district, bio || null, email, userId]);
    }
    if (Object.keys(preferences).length) {
      const language = /^[a-z]{2}(-[A-Z]{2})?$/.test(String(preferences.language || '')) ? String(preferences.language) : 'id';
      await run(`INSERT INTO user_settings (user_id, dark_mode, language, app_icon, notifications_enabled) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (user_id) DO UPDATE SET dark_mode = EXCLUDED.dark_mode, language = EXCLUDED.language, app_icon = EXCLUDED.app_icon, notifications_enabled = EXCLUDED.notifications_enabled, updated_at = CURRENT_TIMESTAMP`, [userId, Boolean(preferences.dark_mode), language, safeText(preferences.app_icon || 'default', 40) || 'default', preferences.notifications_enabled !== false]);
    }
    if (Object.keys(privacy).length) {
      const visibility = ['public', 'friends', 'private'].includes(String(privacy.profile_visibility)) ? String(privacy.profile_visibility) : null;
      if (!visibility) return fail(res, 422, 'Visibilitas profil tidak valid');
      await run(`INSERT INTO privacy_settings (user_id, profile_visibility, show_activity_status, allow_tagging, data_sharing_consent) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (user_id) DO UPDATE SET profile_visibility = EXCLUDED.profile_visibility, show_activity_status = EXCLUDED.show_activity_status, allow_tagging = EXCLUDED.allow_tagging, data_sharing_consent = EXCLUDED.data_sharing_consent, updated_at = CURRENT_TIMESTAMP`, [userId, visibility, privacy.show_activity_status !== false, privacy.allow_tagging !== false, Boolean(privacy.data_sharing_consent)]);
    }
    if (Object.keys(notifications).length) await run(`INSERT INTO notification_settings (user_id, email_notifications, push_notifications, sms_notifications) VALUES (?, ?, ?, ?)
      ON CONFLICT (user_id) DO UPDATE SET email_notifications = EXCLUDED.email_notifications, push_notifications = EXCLUDED.push_notifications, sms_notifications = EXCLUDED.sms_notifications, updated_at = CURRENT_TIMESTAMP`, [userId, notifications.email_notifications !== false, notifications.push_notifications !== false, Boolean(notifications.sms_notifications)]);
    const [row] = await query(selectSettings, [userId]);
    return ok(res, serialize(row));
  } catch (error) { return next(error); }
});

router.post('/data-export', requireAuth, async (req, res, next) => {
  try {
    const format = ['json', 'csv'].includes(String(req.body?.format)) ? String(req.body.format) : 'json';
    const created = await query("INSERT INTO data_exports (user_id, format, status) VALUES (?, ?, 'ready') RETURNING id, format, status, expires_at", [req.user.id, format]);
    return ok(res, { ...created[0], download_url: `/api/account/data-export/${created[0].id}/download` });
  } catch (error) { return next(error); }
});

router.get('/data-export/:id/download', requireAuth, async (req, res, next) => {
  try {
    const [exportRow] = await query("SELECT id, format, status FROM data_exports WHERE id = ? AND user_id = ? AND status IN ('ready', 'queued') LIMIT 1", [Number(req.params.id), req.user.id]);
    if (!exportRow) return fail(res, 404, 'Ekspor data tidak ditemukan atau sudah kedaluwarsa');
    const [account] = await query('SELECT id, name, email, phone, district, bio, avatar_url, created_at FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    const [preferences] = await query('SELECT dark_mode, language, app_icon, notifications_enabled, created_at, updated_at FROM user_settings WHERE user_id = ? LIMIT 1', [req.user.id]);
    const [privacy] = await query('SELECT profile_visibility, show_activity_status, allow_tagging, data_sharing_consent, created_at, updated_at FROM privacy_settings WHERE user_id = ? LIMIT 1', [req.user.id]);
    const [notifications] = await query('SELECT email_notifications, push_notifications, sms_notifications, created_at, updated_at FROM notification_settings WHERE user_id = ? LIMIT 1', [req.user.id]);
    const payload = { exported_at: new Date().toISOString(), account, preferences: preferences || defaults.preferences, privacy: privacy || defaults.privacy, notifications: notifications || defaults.notifications };
    await run("UPDATE data_exports SET status = 'ready', completed_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?", [exportRow.id, req.user.id]);
    res.setHeader('Content-Disposition', `attachment; filename=sultrakita-data-${req.user.id}.${exportRow.format}`);
    if (exportRow.format === 'csv') {
      const lines = ['section,key,value'];
      for (const [section, values] of Object.entries(payload)) for (const [key, value] of Object.entries(values || {})) lines.push(`${section},${key},${JSON.stringify(value ?? '')}`);
      return res.type('text/csv').send(lines.join('\n'));
    }
    return res.type('application/json').send(JSON.stringify(payload, null, 2));
  } catch (error) { return next(error); }
});

router.post('/deletion-request', requireAuth, async (req, res, next) => {
  try {
    const [existing] = await query('SELECT id, scheduled_for FROM account_deletion_requests WHERE user_id = ? AND cancelled_at IS NULL AND completed_at IS NULL ORDER BY requested_at DESC LIMIT 1', [req.user.id]);
    if (existing) return ok(res, { ...existing, already_requested: true });
    const [created] = await query("INSERT INTO account_deletion_requests (user_id, scheduled_for) VALUES (?, CURRENT_TIMESTAMP + INTERVAL '7 days') RETURNING id, scheduled_for", [req.user.id]);
    await run("UPDATE users SET deletion_scheduled_at = ? WHERE id = ?", [created.scheduled_for, req.user.id]);
    await run("INSERT INTO security_events (user_id, event_type, outcome, resource_type, metadata, ip_address, user_agent) VALUES (?, 'account_deletion_requested', 'success', 'account', '{}'::jsonb, ?, ?)", [req.user.id, req.ip || null, safeText(req.get('user-agent'), 300) || null]);
    return ok(res, { ...created, already_requested: false });
  } catch (error) { return next(error); }
});

router.post('/deletion-request/cancel', requireAuth, async (req, res, next) => {
  try {
    await run('UPDATE account_deletion_requests SET cancelled_at = CURRENT_TIMESTAMP WHERE user_id = ? AND cancelled_at IS NULL AND completed_at IS NULL', [req.user.id]);
    await run('UPDATE users SET deletion_scheduled_at = NULL WHERE id = ?', [req.user.id]);
    return ok(res, { cancelled: true });
  } catch (error) { return next(error); }
});

module.exports = { createAccountSettingsRouter: () => router };
