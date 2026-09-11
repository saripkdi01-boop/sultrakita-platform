import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { getServerSupabase } from '@/lib/supabase/server';

const campaign = { name: 'Ajak Teman, Tumbuh Bersama', pointsPerQualifiedInvite: 100, pointsPerRupiah: 10, minimumRedemption: 1000, endDate: '2026-12-31' };
function adminClient() { const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!url || !key) throw new Error('Referral service belum dikonfigurasi.'); return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } }); }
function codeFor(id: string) { return `SULTRA-${createHash('sha256').update(`referral:${id}`).digest('hex').slice(0, 8).toUpperCase()}`; }
function json(data: unknown, status = 200) { return NextResponse.json({ ok: true, data }, { status }); }
function bad(error: string, status = 400) { return NextResponse.json({ ok: false, error }, { status }); }
async function currentUser() { try { const client = await getServerSupabase(); const { data: { user } } = await client.auth.getUser(); return user; } catch { return null; } }

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action') || 'campaign';
  if (action === 'campaign') return json(campaign);
  const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
  try {
    const db = adminClient(); const code = codeFor(user.id);
    await db.from('referral_accounts').upsert({ auth_user_id: user.id, referral_code: code }, { onConflict: 'auth_user_id', ignoreDuplicates: true });
    const [{ data: account }, { count }, { data: activity }] = await Promise.all([
      db.from('referral_accounts').select('referral_code,total_points,lifetime_points').eq('auth_user_id', user.id).single(),
      db.from('referral_account_events').select('id', { count: 'exact', head: true }).eq('referrer_id', user.id).eq('event_type', 'qualified'),
      db.from('referral_account_events').select('event_type,source_channel,created_at').eq('referrer_id', user.id).order('id', { ascending: false }).limit(10),
    ]);
    return json({ campaign, referral_code: account?.referral_code || code, total_points: account?.total_points || 0, lifetime_points: account?.lifetime_points || 0, qualified_referrals: count || 0, recent_activity: activity || [] });
  } catch (error) { console.error('[referral-summary]', error instanceof Error ? error.message : 'unknown'); return bad('Campaign belum terhubung ke database.', 503); }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({})); const action = String(body.action || 'visit');
  try {
    const db = adminClient();
    if (action === 'visit') {
      const code = String(body.referral_code || '').trim().toUpperCase(); const source = String(body.source_channel || 'direct').trim().toLowerCase().slice(0, 30);
      if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return bad('Kode referral belum valid.');
      const { data: owner } = await db.from('referral_accounts').select('auth_user_id').eq('referral_code', code).maybeSingle(); if (!owner) return bad('Kode referral tidak ditemukan.', 404);
      const eventKey = createHash('sha256').update(`${code}:${source}:${request.headers.get('user-agent') || ''}`).digest('hex');
      await db.from('referral_account_events').upsert({ referrer_id: owner.auth_user_id, referral_code: code, event_type: 'link_visit', source_channel: source, event_key: eventKey }, { onConflict: 'event_key', ignoreDuplicates: true });
      return json({ tracked: true });
    }
    const user = await currentUser(); if (!user) return bad('Sesi login diperlukan.', 401);
    const code = String(body.referral_code || '').trim().toUpperCase();
    if (action === 'claim') {
      if (!/^SULTRA-[A-F0-9]{8}$/.test(code)) return bad('Kode referral belum valid.');
      const { data: owner } = await db.from('referral_accounts').select('auth_user_id').eq('referral_code', code).maybeSingle(); if (!owner || owner.auth_user_id === user.id) return bad('Referral tidak dapat diklaim.', 422);
      const eventKey = createHash('sha256').update(`signup:${user.id}:${code}`).digest('hex');
      await db.from('referral_accounts').upsert({ auth_user_id: user.id, referral_code: codeFor(user.id), referred_by: owner.auth_user_id }, { onConflict: 'auth_user_id', ignoreDuplicates: true });
      await db.from('referral_account_events').upsert({ referrer_id: owner.auth_user_id, referred_user_id: user.id, referral_code: code, event_type: 'signup', source_channel: String(body.source_channel || 'direct').slice(0, 30), event_key: eventKey }, { onConflict: 'event_key', ignoreDuplicates: true });
      return json({ claimed: true });
    }
    if (action === 'qualified') {
      const referredId = String(body.referred_user_id || user.id); if (referredId !== user.id) return bad('Identitas referral tidak sesuai sesi.', 403);
      const { data: referral } = await db.from('referral_account_events').select('id,referrer_id,referral_code').eq('referred_user_id', user.id).eq('event_type', 'signup').maybeSingle(); if (!referral) return bad('Referral signup belum ditemukan.', 404);
      const eventKey = createHash('sha256').update(`qualified:${user.id}:${referral.referrer_id}`).digest('hex'); const { error: eventError } = await db.from('referral_account_events').insert({ referrer_id: referral.referrer_id, referred_user_id: user.id, referral_code: referral.referral_code, event_type: 'qualified', source_channel: 'verified_activity', event_key: eventKey }); if (eventError && eventError.code !== '23505') throw eventError;
      if (!eventError) { const { data: account } = await db.from('referral_accounts').select('total_points,lifetime_points').eq('auth_user_id', referral.referrer_id).single(); await db.from('referral_accounts').update({ total_points: Number(account?.total_points || 0) + 100, lifetime_points: Number(account?.lifetime_points || 0) + 100, updated_at: new Date().toISOString() }).eq('auth_user_id', referral.referrer_id); }
      return json({ qualified: true, points_awarded: eventError ? 0 : 100 });
    }
    if (action === 'redeem') {
      const points = Number(body.points); const method = String(body.payout_method || '').trim().slice(0, 30); const account = String(body.payout_account || '').trim();
      if (!Number.isSafeInteger(points) || points < campaign.minimumRedemption || points % campaign.pointsPerRupiah !== 0 || !method || account.length < 4) return bad('Minimal penukaran 1.000 poin dan data pencairan wajib lengkap.');
      const { data: balance } = await db.from('referral_accounts').select('total_points').eq('auth_user_id', user.id).single(); if (Number(balance?.total_points || 0) < points) return bad('Saldo poin belum mencukupi.', 409);
      const { data: pending } = await db.from('referral_account_redemptions').select('id').eq('auth_user_id', user.id).eq('status', 'pending').limit(1); if (pending?.length) return bad('Masih ada pengajuan yang sedang diverifikasi.', 409);
      const { data, error } = await db.from('referral_account_redemptions').insert({ auth_user_id: user.id, points, rupiah_amount: Math.floor(points / campaign.pointsPerRupiah), payout_method: method, payout_account_masked: `${account.slice(0, 2)}••••${account.slice(-2)}` }).select('id,status,rupiah_amount').single(); if (error) throw error; return json({ ...data, message: 'Pengajuan diterima untuk verifikasi.' }, 201);
    }
    return bad('Action referral tidak dikenali.');
  } catch (error) { console.error('[referral-api]', error instanceof Error ? error.message : 'unknown'); return bad('Campaign belum dapat diproses.', 503); }
}
