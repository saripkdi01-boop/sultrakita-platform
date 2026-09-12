import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

const campaign = { name: 'Ajak Teman, Tumbuh Bersama', pointsPerQualifiedInvite: 100, pointsPerRupiah: 10, minimumRedemption: 1000, endDate: '2026-12-31' };

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Referral service belum dikonfigurasi.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
function codeFor(id: string) { return `SULTRA-${createHash('sha256').update(`referral:${id}`).digest('hex').slice(0, 8).toUpperCase()}`; }
function json(data: unknown, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function bad(error: string, status = 400) { return NextResponse.json({ ok: false, error }, { status }); }
async function currentUser() { try { const client = await getServerSupabase(); const { data: { user } } = await client.auth.getUser(); return user; } catch { return null; } }
function campaignClosed() { return new Date(`${campaign.endDate}T23:59:59.999Z`).getTime() < Date.now(); }
function referralError(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('pending redemption already exists')) return bad('Masih ada pengajuan yang sedang diverifikasi.', 409);
  if (message.includes('insufficient referral balance')) return bad('Saldo poin belum mencukupi.', 409);
  if (message.includes('referral account not found')) return bad('Akun referral belum siap.', 409);
  return bad('Campaign belum dapat diproses.', 503);
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action') || 'campaign';
  if (action === 'campaign') return json(campaign);
  const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
  try {
    const db = adminClient(); const code = codeFor(user.id);
    const { error: accountError } = await db.from('referral_accounts').upsert({ auth_user_id: user.id, referral_code: code }, { onConflict: 'auth_user_id', ignoreDuplicates: true });
    if (accountError) throw accountError;
    const [{ data: account, error: accountReadError }, { count, error: countError }, { data: activity, error: activityError }] = await Promise.all([
      db.from('referral_accounts').select('referral_code,total_points,lifetime_points').eq('auth_user_id', user.id).single(),
      db.from('referral_account_events').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).eq('event_type', 'qualified'),
      db.from('referral_account_events').select('event_type,source_channel,created_at').eq('referrer_id', user.id).order('id', { ascending: false }).limit(10),
    ]);
    if (accountReadError || countError || activityError) throw accountReadError || countError || activityError;
    return json({ campaign, referral_code: account?.referral_code || code, total_points: account?.total_points || 0, lifetime_points: account?.lifetime_points || 0, qualified_referrals: count || 0, recent_activity: activity || [] });
  } catch (error) { console.error('[referral-summary]', error instanceof Error ? error.message : 'unknown'); return referralError(error); }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})); const action = String(body.action || 'visit');
  try {
    const db = adminClient();
    if (action === 'visit') {
      const code = String(body.referral_code || '').trim().toUpperCase(); const source = String(body.source_channel || 'direct').trim().toLowerCase().slice(0, 30);
      if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return bad('Kode referral belum valid.');
      const { data: owner, error: ownerError } = await db.from('referral_accounts').select('auth_user_id').eq('referral_code', code).maybeSingle();
      if (ownerError) throw ownerError;
      if (!owner) return bad('Kode referral tidak ditemukan.', 404);
      const eventKey = createHash('sha256').update(`${code}:${source}:${request.headers.get('user-agent') || ''}`).digest('hex');
      const { error } = await db.from('referral_account_events').upsert({ referrer_id: owner.auth_user_id, referral_code: code, event_type: 'link_visit', source_channel: source, event_key: eventKey }, { onConflict: 'event_key', ignoreDuplicates: true });
      if (error) throw error;
      return json({ tracked: true });
    }
    const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
    if (campaignClosed()) return bad('Campaign referral telah berakhir.', 410);
    const code = String(body.referral_code || '').trim().toUpperCase();
    if (action === 'claim') {
      if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return bad('Kode referral belum valid.');
      const { data: owner, error: ownerError } = await db.from('referral_accounts').select('auth_user_id').eq('referral_code', code).maybeSingle();
      if (ownerError) throw ownerError;
      if (!owner || owner.auth_user_id === user.id) return bad('Referral tidak dapat diklaim.', 422);
      const selfCode = codeFor(user.id);
      const { data: existing, error: existingError } = await db.from('referral_accounts').select('referred_by').eq('auth_user_id', user.id).maybeSingle();
      if (existingError) throw existingError;
      if (existing?.referred_by && existing.referred_by !== owner.auth_user_id) return bad('Akun ini sudah memiliki referral.', 409);
      if (existing?.referred_by === owner.auth_user_id) return json({ claimed: true, duplicate: true });
      const { error: accountError } = await db.from('referral_accounts').upsert({ auth_user_id: user.id, referral_code: selfCode }, { onConflict: 'auth_user_id', ignoreDuplicates: true });
      if (accountError) throw accountError;
      const { data: claimed, error: claimError } = await db.from('referral_accounts').update({ referred_by: owner.auth_user_id, updated_at: new Date().toISOString() }).eq('auth_user_id', user.id).is('referred_by', null).select('referred_by').maybeSingle();
      if (claimError) throw claimError;
      if (!claimed) return bad('Referral sudah diproses oleh sesi lain.', 409);
      const eventKey = createHash('sha256').update(`signup:${user.id}:${code}`).digest('hex');
      const { error: eventError } = await db.from('referral_account_events').upsert({ referrer_id: owner.auth_user_id, referred_user_id: user.id, referral_code: code, event_type: 'signup', source_channel: String(body.source_channel || 'direct').slice(0, 30), event_key: eventKey }, { onConflict: 'event_key', ignoreDuplicates: true });
      if (eventError) throw eventError;
      return json({ claimed: true });
    }
    if (action === 'qualified') {
      const referredId = String(body.referred_user_id || user.id); if (referredId !== user.id) return bad('Identitas referral tidak sesuai sesi.', 403);
      const { data: referral, error: referralErrorRead } = await db.from('referral_account_events').select('id,referrer_id,referral_code').eq('referred_user_id', user.id).eq('event_type', 'signup').maybeSingle();
      if (referralErrorRead) throw referralErrorRead;
      if (!referral) return bad('Referral signup belum ditemukan.', 404);
      const eventKey = createHash('sha256').update(`qualified:${user.id}:${referral.referrer_id}`).digest('hex');
      const { error: eventError } = await db.from('referral_account_events').insert({ referrer_id: referral.referrer_id, referred_user_id: user.id, referral_code: referral.referral_code, event_type: 'qualified', source_channel: 'verified_activity', event_key: eventKey });
      if (eventError?.code === '23505') return json({ qualified: true, points_awarded: 0, duplicate: true });
      if (eventError) throw eventError;
      const { error: pointsError } = await db.rpc('increment_referral_account_points', { p_referrer_id: referral.referrer_id, p_points: campaign.pointsPerQualifiedInvite });
      if (pointsError) throw pointsError;
      return json({ qualified: true, points_awarded: campaign.pointsPerQualifiedInvite });
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
