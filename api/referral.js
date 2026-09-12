'use strict';
const express = require('express');
const crypto = require('node:crypto');
const { query, run, withTransaction } = require('../database');
const { requireAuth } = require('../auth');
const router = express.Router();
const ok = (res, data, meta) => res.json({ success: true, data, ...(meta ? { meta } : {}) });
const fail = (res, status, error) => res.status(status).json({ success: false, error });
const positiveInt = value => Number.isSafeInteger(Number(value)) && Number(value) > 0;
const clean = (value, max) => String(value ?? '').trim().slice(0, max);
const campaign = { name: 'Ajak Teman, Tumbuh Bersama', pointsPerQualifiedInvite: 100, pointsPerRupiah: 10, minimumRedemption: 1000, endDate: '2026-12-31', terms: ['Poin diberikan setelah teman menyelesaikan pendaftaran dan satu aktivitas bermakna.', 'Satu orang hanya dapat dihitung sekali sebagai referral.', 'Penukaran diverifikasi manual dan mengikuti ketersediaan program.'] };
const codeFor = user => `SULTRA-${crypto.createHash('sha256').update(`sultra-referral:${user}`).digest('hex').slice(0, 8).toUpperCase()}`;
const userId = req => Number(req.user?.id || 0);
async function ensureProfile(id) {
  const existing = await query('SELECT user_id, referral_code, referred_by FROM referral_profiles WHERE user_id = ?', [id]);
  if (existing[0]) return existing[0];
  const code = codeFor(id);
  await run('INSERT INTO referral_profiles (user_id, referral_code) VALUES (?, ?) ON CONFLICT (user_id) DO NOTHING', [id, code]);
  const [profile] = await query('SELECT user_id, referral_code, referred_by FROM referral_profiles WHERE user_id = ?', [id]);
  return profile;
}
router.get('/campaign', async (_req, res) => ok(res, campaign));
router.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const id = userId(req); const profile = await ensureProfile(id);
    const [points] = await query('SELECT COALESCE(total_points, 0) AS total_points, COALESCE(lifetime_points, 0) AS lifetime_points FROM user_points WHERE user_id = ?', [id]);
    const [referrals] = await query("SELECT COUNT(*) AS total FROM referral_events WHERE referrer_id = ? AND event_type = 'qualified'", [id]);
    const events = await query('SELECT event_type, source_channel, created_at FROM referral_events WHERE referrer_id = ? ORDER BY id DESC LIMIT 10', [id]);
    ok(res, { campaign, referral_code: profile.referral_code, total_points: Number(points?.total_points || 0), lifetime_points: Number(points?.lifetime_points || 0), qualified_referrals: Number(referrals?.total || 0), recent_activity: events });
  } catch (error) { if (['42P01','42P07'].includes(error.code)) return ok(res, { campaign, referral_code: codeFor(userId(req)), total_points: 0, lifetime_points: 0, qualified_referrals: 0, recent_activity: [], setup_pending: true }); next(error); }
});
router.get('/leaderboard', async (_req, res, next) => {
  try {
    const rows = await query("SELECT u.id, CONCAT('Affiliator ', substring(md5(u.id::text) from 1 for 4)) AS name, COUNT(*)::int AS qualified_referrals, COALESCE(up.total_points, 0)::int AS total_points FROM referral_events re JOIN users u ON u.id = re.referrer_id LEFT JOIN user_points up ON up.user_id = u.id WHERE re.event_type = 'qualified' GROUP BY u.id, up.total_points ORDER BY qualified_referrals DESC, total_points DESC, u.id ASC LIMIT 50");
    return ok(res, rows.map((row, index) => ({ rank: index + 1, name: row.name, qualified_referrals: Number(row.qualified_referrals || 0), total_points: Number(row.total_points || 0) })));
  } catch (error) { if (['42P01','42P07'].includes(error.code)) return ok(res, []); next(error); }
});
router.get('/redemptions', requireAuth, async (req, res, next) => {
  try {
    const rows = await query('SELECT id, points, rupiah_amount, status, created_at FROM point_redemptions WHERE user_id = ? ORDER BY id DESC LIMIT 20', [userId(req)]);
    return ok(res, rows);
  } catch (error) { if (['42P01','42P07'].includes(error.code)) return ok(res, []); next(error); }
});
router.post('/visit', async (req, res, next) => {
  try {
    const code = clean(req.body?.referral_code, 40).toUpperCase(); const source = clean(req.body?.source_channel || 'direct', 30).toLowerCase();
    if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return fail(res, 422, 'Kode referral belum valid');
    const [profile] = await query('SELECT user_id FROM referral_profiles WHERE referral_code = ?', [code]);
    if (!profile) return fail(res, 404, 'Kode referral tidak ditemukan');
    const eventKey = crypto.createHash('sha256').update(`${code}:${source}:${String(req.ip || '').slice(0, 80)}`).digest('hex');
    await run("INSERT INTO referral_events (referrer_id, referral_code, event_type, source_channel, event_key) VALUES (?, ?, 'link_visit', ?, ?) ON CONFLICT (event_key) DO NOTHING", [profile.user_id, code, source, eventKey]);
    ok(res, { tracked: true, redirect: '/?ref=' + encodeURIComponent(code) });
  } catch (error) { if (error.code === '42P01') return ok(res, { tracked: false, setup_pending: true }); next(error); }
});
router.post('/redemptions', requireAuth, async (req, res, next) => {
  try {
    const id = userId(req); const points = Number(req.body?.points); const method = clean(req.body?.payout_method, 30); const account = clean(req.body?.payout_account, 80);
    if (!Number.isSafeInteger(points) || points < campaign.minimumRedemption || points % campaign.pointsPerRupiah !== 0 || !method || account.length < 4) return fail(res, '422', 'Minimal penukaran 1.000 poin dan data pencairan wajib lengkap');
    const [balance] = await query('SELECT COALESCE(total_points, 0) AS total_points FROM user_points WHERE user_id = ?', [id]);
    if (Number(balance?.total_points || 0) < points) return fail(res, 409, 'Saldo poin belum mencukupi');
    const [pending] = await query("SELECT id FROM point_redemptions WHERE user_id = ? AND status = 'pending' LIMIT 1", [id]);
    if (pending) return fail(res, 409, 'Masih ada pengajuan penukaran yang sedang diverifikasi');
    const result = await withTransaction(async db => {
      const redemption = await db.run('INSERT INTO point_redemptions (user_id, points, rupiah_amount, payout_method, payout_account_masked) VALUES (?, ?, ?, ?, ?) RETURNING id', [id, points, Math.floor(points / campaign.pointsPerRupiah), method, `${account.slice(0, 2)}••••${account.slice(-2)}`]);
      return redemption.id;
    });
    ok(res, { id: result, status: 'pending', rupiah_amount: Math.floor(points / campaign.pointsPerRupiah), message: 'Pengajuan diterima untuk verifikasi.' });
  } catch (error) { if (error.code === '42P01') return fail(res, 503, 'Fitur penukaran sedang disiapkan'); next(error); }
});
module.exports = { router };
