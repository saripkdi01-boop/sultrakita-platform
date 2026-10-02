import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { csrfProtected } from '@/lib/security/csrf';
import { parseOr400 } from '@/lib/security/validation';

const REFERRAL_CODE_RE = /^SULTRA-[A-F0-9]{8}$/;

// Kanal atribusi resmi — nilai di luar daftar dinormalisasi menjadi 'other'
// agar analytics tetap konsisten dan tidak bisa diisi string sembarang.
const REFERRAL_CHANNELS = new Set([
  'website', 'whatsapp', 'telegram', 'x', 'facebook', 'instagram', 'tiktok',
  'qr', 'community', 'email', 'oauth', 'direct', 'other',
]);
function normalizeChannel(value: unknown): string {
  const clean = String(value || '').trim().toLowerCase().slice(0, 30);
  return REFERRAL_CHANNELS.has(clean) ? clean : 'other';
}

const ReferralActionSchema = z.object({
  action: z.enum(['visit', 'payout_transition', 'claim', 'qualified', 'redeem']).default('visit'),
});

const VisitSchema = z.object({
  referral_code: z.string().trim().toUpperCase().regex(REFERRAL_CODE_RE, 'Kode referral belum valid.'),
  source_channel: z.string().trim().toLowerCase().max(30, 'Channel sumber terlalu panjang.').default('direct'),
});

const PayoutTransitionSchema = z.object({
  redemption_id: z.coerce.number().int('ID payout belum valid.').positive('ID payout belum valid.'),
  to_status: z.enum(['approved', 'paid', 'rejected'], { message: 'Status payout belum valid.' }),
  note: z.string().trim().max(500, 'Catatan maksimal 500 karakter.').default(''),
  payment_reference: z.string().trim().max(160, 'Referensi pembayaran maksimal 160 karakter.').default(''),
});

const campaign = { name: 'Ajak Teman, Tumbuh Bersama', pointsPerQualifiedInvite: 100, pointsPerRupiah: 10, minimumRedemption: 1000, endDate: '2026-12-31' };

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Referral service belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
function codeFor(id: string) { return `SULTRA-${createHash('sha256').update(`referral:${id}`).digest('hex').slice(0, 8).toUpperCase()}`; }
function json(data: unknown, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
// Fase 1.4: format error konsisten { error: { code, message, requestId } }.
function bad(message: string, status = 400) { return NextResponse.json({ ok: false, error: { code: 'REFERRAL_ERROR', message, requestId: randomUUID() } }, { status, headers: { 'Cache-Control': 'no-store' } }); }
async function currentUser() { try { const client = await getServerSupabase(); const { data: { user } } = await client.auth.getUser(); return user; } catch { return null; } }
function campaignClosed() { return new Date(`${campaign.endDate}T23:59:59.999Z`).getTime() < Date.now(); }
function fingerprint(value: string) {
  return createHash('sha256').update(`${process.env.REFERRAL_FINGERPRINT_SALT || 'suki-referral-fingerprint-v1'}:${value}`).digest('hex');
}
function requestMetadata(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '';
  const userAgent = request.headers.get('user-agent') || '';
  return { ip_hash: forwarded ? fingerprint(forwarded) : null, ua_hash: userAgent ? fingerprint(userAgent) : null };
}
function referralError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('pending redemption already exists')) return bad('Masih ada pengajuan yang sedang diverifikasi.', 409);
  if (message.includes('insufficient referral balance')) return bad('Saldo poin belum mencukupi.', 409);
  if (message.includes('referral account not found')) return bad('Akun referral belum siap.', 409);
  if (message.includes('payout operator authorization required')) return bad('Akses operator payout diperlukan.', 403);
  if (message.includes('second operator required')) return bad('Pembayaran membutuhkan operator kedua.', 409);
  if (message.includes('rejection reason required')) return bad('Alasan penolakan wajib diisi.', 422);
  if (message.includes('payment reference required')) return bad('Referensi pembayaran wajib diisi.', 422);
  if (message.includes('terminal payout status')) return bad('Payout sudah berada pada status final.', 409);
  if (message.includes('payout not found')) return bad('Payout tidak ditemukan.', 404);
  if (message.includes('self referral is not eligible')) return bad('Referral tidak dapat menggunakan kode sendiri.', 422);
  if (message.includes('referral code not found')) return bad('Kode referral tidak ditemukan.', 404);
  if (message.includes('account already referred')) return bad('Akun ini sudah memiliki referral.', 409);
  if (message.includes('referral risk review required')) return bad('Referral menunggu pemeriksaan keamanan.', 409);
  return bad('Campaign belum dapat diproses.', 503);
}

export async function GET(request: NextRequest) {
  // Fase 1.5: batasi 60 request/menit per IP untuk API publik.
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const action = request.nextUrl.searchParams.get('action') || 'campaign';
  if (action === 'campaign') return json(campaign);
  try {
    const db = adminClient();
    if (action === 'payout_queue') {
      const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
      const status = request.nextUrl.searchParams.get('status') || 'pending';
      const sessionDb = await getServerSupabase();
      const { data, error } = await sessionDb.rpc('list_referral_payouts', { p_status: status });
      if (error) throw error;
      return json(data || []);
    }
    if (action === 'risk_queue') {
      const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
      const sessionDb = await getServerSupabase();
      const { data, error } = await sessionDb.rpc('list_referral_risk_flags', { p_limit: 50 });
      if (error) throw error;
      return json(data || []);
    }
    if (action === 'leaderboard') {
      const { data: events, error: eventsError } = await db.from('referral_account_events').select('referrer_id').eq('event_type', 'qualified').limit(5000);
      if (eventsError) throw eventsError;
      const counts = new Map<string, number>(); (events || []).forEach(event => counts.set(event.referrer_id, (counts.get(event.referrer_id) || 0) + 1));
      const ids = Array.from(counts.keys()); if (!ids.length) return json([]);
      const { data: accounts, error: accountsError } = await db.from('referral_accounts').select('auth_user_id,total_points').in('auth_user_id', ids);
      if (accountsError) throw accountsError;
      const rows = (accounts || []).map(account => ({ id: account.auth_user_id, qualified_referrals: counts.get(account.auth_user_id) || 0, total_points: account.total_points || 0 })).sort((a, b) => b.qualified_referrals - a.qualified_referrals || b.total_points - a.total_points).slice(0, 50);
      const me = await currentUser().catch(() => null);
      return json(rows.map((row, index) => ({ rank: index + 1, name: `Affiliator ${createHash('sha256').update(row.id).digest('hex').slice(0, 4).toUpperCase()}`, qualified_referrals: row.qualified_referrals, total_points: row.total_points, you: !!me && row.id === me.id })));
    }
    const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
    const code = codeFor(user.id);
    if (action === 'redemptions') {
      const { data, error } = await db.from('referral_account_redemptions').select('id,points,rupiah_amount,status,created_at').eq('auth_user_id', user.id).order('id', { ascending: false }).limit(20);
      if (error) throw error;
      return json(data || []);
    }
    if (action === 'analytics') {
      const { data: events, error } = await db.from('referral_account_events').select('event_type,source_channel,created_at').eq('referrer_id', user.id).order('id', { ascending: false }).limit(1000);
      if (error) throw error;
      const rows = events || [];
      const byChannel = new Map<string, { visits: number; signups: number; qualified: number }>();
      rows.forEach((event) => { const channel = String(event.source_channel || 'direct'); const current = byChannel.get(channel) || { visits: 0, signups: 0, qualified: 0 }; if (event.event_type === 'link_visit') current.visits += 1; if (event.event_type === 'signup') current.signups += 1; if (event.event_type === 'qualified') current.qualified += 1; byChannel.set(channel, current); });
      return json({ totals: { visits: rows.filter((event) => event.event_type === 'link_visit').length, signups: rows.filter((event) => event.event_type === 'signup').length, qualified: rows.filter((event) => event.event_type === 'qualified').length }, channels: Array.from(byChannel.entries()).map(([channel, values]) => ({ channel, ...values })).sort((a, b) => b.qualified - a.qualified || b.signups - a.signups).slice(0, 12) });
    }
    const { error: accountError } = await db.from('referral_accounts').upsert({ auth_user_id: user.id, referral_code: code }, { onConflict: 'auth_user_id', ignoreDuplicates: true });
    if (accountError) throw accountError;
    const [{ data: account, error: accountReadError }, { count, error: countError }, { data: activity, error: activityError }] = await Promise.all([
      db.from('referral_accounts').select('referral_code,total_points,lifetime_points').eq('auth_user_id', user.id).single(),
      db.from('referral_account_events').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).eq('event_type', 'qualified'),
      db.from('referral_account_events').select('event_type,source_channel,created_at').eq('referrer_id', user.id).order('id', { ascending: false }).limit(10),
    ]);
    if (accountReadError || countError || activityError) throw accountReadError || countError || activityError;
    // user_id disertakan agar klien bisa berlangganan realtime event milik sendiri
    // (difilter referrer_id=eq.<user_id>); tidak ada data orang lain yang bocor.
    return json({ campaign, user_id: user.id, referral_code: account?.referral_code || code, total_points: account?.total_points || 0, lifetime_points: account?.lifetime_points || 0, qualified_referrals: count || 0, recent_activity: activity || [] });
  } catch (error) { console.error('[referral-summary]', error instanceof Error ? error.message : 'unknown'); return referralError(error); }
}

async function postHandler(request: NextRequest) {
  // Fase 1.5: batasi 60 request/menit per IP (endpoint sensitif: payout & klaim).
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const body = await request.json().catch(() => ({}));
  const actionParsed = parseOr400(ReferralActionSchema, body);
  if (!actionParsed.ok) return bad('Action referral tidak dikenali.');
  const action = actionParsed.data.action;
  try {
    const db = adminClient();
    if (action === 'visit') {
      const visitParsed = parseOr400(VisitSchema, body);
      if (!visitParsed.ok) return visitParsed.response;
      const code = visitParsed.data.referral_code;
      const source = normalizeChannel(visitParsed.data.source_channel);
      const { data: owner, error: ownerError } = await db.from('referral_accounts').select('auth_user_id').eq('referral_code', code).maybeSingle();
      if (ownerError) throw ownerError;
      if (!owner) return bad('Kode referral tidak ditemukan.', 404);
      const eventKey = createHash('sha256').update(`${code}:${source}:${request.headers.get('user-agent') || ''}`).digest('hex');
      // Simpan sidik perangkat ke metadata: dipakai rantai anti-fraud
      // (claim_referral menandai signup yang berbagi fingerprint).
      const { error } = await db.from('referral_account_events').upsert({ referrer_id: owner.auth_user_id, referral_code: code, event_type: 'link_visit', source_channel: source, event_key: eventKey, metadata: requestMetadata(request) }, { onConflict: 'event_key', ignoreDuplicates: true });
      if (error) throw error;
      return json({ tracked: true });
    }
    const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
    if (action === 'payout_transition') {
      const payoutParsed = parseOr400(PayoutTransitionSchema, body);
      if (!payoutParsed.ok) return payoutParsed.response;
      const redemptionId = payoutParsed.data.redemption_id;
      const toStatus = payoutParsed.data.to_status;
      const note = payoutParsed.data.note;
      const paymentReference = payoutParsed.data.payment_reference;
      const sessionDb = await getServerSupabase();
      const { data, error } = await sessionDb.rpc('transition_referral_payout', {
        p_redemption_id: redemptionId,
        p_to_status: toStatus,
        p_note: note || null,
        p_payment_reference: paymentReference || null,
      });
      if (error) throw error;
      return json(data?.[0] || {});
    }
    if (campaignClosed()) return bad('Campaign referral telah berakhir.', 410);
    const code = String(body.referral_code || '').trim().toUpperCase();
    if (action === 'claim') {
      if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return bad('Kode referral belum valid.');
      const eventKey = createHash('sha256').update(`signup:${user.id}:${code}`).digest('hex');
      const { data, error } = await db.rpc('claim_referral', { p_referred_user_id: user.id, p_referral_code: code, p_source_channel: normalizeChannel(body.source_channel), p_event_key: eventKey, p_metadata: requestMetadata(request) });
      if (error) throw error;
      return json(data?.[0] || { claimed: true, duplicate: false, risk_flagged: false });
    }
    if (action === 'qualified') {
      const referredId = String(body.referred_user_id || user.id); if (referredId !== user.id) return bad('Identitas referral tidak sesuai sesi.', 403);
      const { data, error } = await db.rpc('qualify_referral', { p_referred_user_id: referredId, p_points: campaign.pointsPerQualifiedInvite });
      if (error) throw error;
      return json(data?.[0] || { qualified: true, points_awarded: 0, duplicate: true });
    }
    if (action === 'redeem') {
      const points = Number(body.points); const method = String(body.payout_method || '').trim().slice(0, 30); const account = String(body.payout_account || '').trim();
      if (!Number.isSafeInteger(points) || points < campaign.minimumRedemption || points % campaign.pointsPerRupiah !== 0 || !method || account.length < 4) return bad('Minimal penukaran 1.000 poin dan data pencairan wajib lengkap.');
      const { data, error } = await db.rpc('create_referral_redemption', { p_auth_user_id: user.id, p_points: points, p_rupiah_amount: Math.floor(points / campaign.pointsPerRupiah), p_payout_method: method, p_payout_account_masked: `${account.slice(0, 2)}••••${account.slice(-2)}` });
      if (error) throw error;
      return json({ ...(data?.[0] || {}), message: 'Pengajuan diterima untuk verifikasi.' }, 201);
    }
    return bad('Action referral tidak dikenali.');
  } catch (error) { console.error('[referral-api]', error instanceof Error ? error.message : 'unknown'); return referralError(error); }
}

// CSRF double-submit: endpoint payout/klaim sensitif, wajib token valid.
export const POST = csrfProtected(postHandler);
