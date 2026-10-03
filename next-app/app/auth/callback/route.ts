import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { parseUtmCookieServer, UTM_COOKIE } from '@/lib/utm';
import { parseReferralCookieServer, REF_COOKIE } from '@/lib/referral-attribution';

function requestCookies(request: Request) {
  return request.headers.get('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separator = part.indexOf('=');
      return {
        name: separator >= 0 ? part.slice(0, separator) : part,
        value: separator >= 0 ? decodeURIComponent(part.slice(separator + 1)) : '',
      };
    }) || [];
}
function safeRedirect(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/dashboard';
  const pathname = value.split('?')[0];
  return pathname === '/login' || pathname === '/signup' || pathname === '/auth/callback' ? '/dashboard' : value;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next');
  const safeNext = safeRedirect(next);

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=auth_callback', url.origin));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL('/login?error=auth_config', url.origin));
  }

  const response = NextResponse.redirect(new URL(safeNext, url.origin));
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => requestCookies(request),
      setAll: (cookies: { name: string; value: string; options: CookieOptions }[]) => {
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/login?error=auth_callback', url.origin));
  }

  // Admin-aware redirect: akun admin/super_admin yang login OAuth (Google/
  // Facebook) TANPA tujuan eksplisit langsung diarahkan ke /dashboard/admin.
  // Best-effort: kegagalan baca role tidak menggagalkan login.
  // Header Location pada respons redirect boleh dimutasi sebelum dikembalikan;
  // cookie sesi yang ditulis saat exchange tetap utuh di objek response yang sama.
  try {
    if (safeNext === '/dashboard') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        const role = (profile as { role?: string } | null)?.role;
        if (role === 'admin' || role === 'super_admin') {
          response.headers.set('Location', new URL('/dashboard/admin', url.origin).toString());
        }
      }
    }
  } catch {
    // Abaikan — login tetap sukses ke tujuan default.
  }

  // Atribusi UTM first-touch untuk signup OAuth: salin dari cookie sk_utm ke
  // profiles, hanya bila utm_source masih kosong (jangan timpa atribusi awal).
  // Best-effort: kegagalan tidak menggagalkan login.
  try {
    const utm = parseUtmCookieServer(request.headers.get('cookie'));
    if (utm?.utm_source) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { data: existing } = await supabase.from('profiles').select('utm_source').eq('id', user.id).maybeSingle();
        if (existing && !existing.utm_source) {
          await supabase.from('profiles').update({
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
          }).eq('id', user.id).is('utm_source', null);
        }
        // Atribusi tercatat (atau sudah ada) → hapus cookie agar tidak dipakai ulang.
        response.cookies.set(UTM_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
      }
    }
  } catch {
    // Abaikan — login tetap sukses tanpa atribusi UTM.
  }

  // Klaim referral first-touch untuk signup OAuth: baca cookie sk_ref lalu
  // panggil RPC claim_referral via service role (anti-fraud tetap jalan di DB).
  // Best-effort: kegagalan tidak menggagalkan login; cookie dipertahankan agar
  // klaim bisa dicoba lagi, kecuali statusnya terminal.
  try {
    const refCode = parseReferralCookieServer(request.headers.get('cookie'));
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (refCode && adminKey && supabaseUrl) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        const { createClient } = await import('@supabase/supabase-js');
        const admin = createClient(supabaseUrl, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
        const eventKey = createHash('sha256').update(`signup:${user.id}:${refCode}`).digest('hex');
        const { error: claimError } = await admin.rpc('claim_referral', {
          p_referred_user_id: user.id,
          p_referral_code: refCode,
          p_source_channel: 'oauth',
          p_event_key: eventKey,
          p_metadata: {},
        });
        const message = claimError?.message || '';
        const terminal = !claimError || /already referred|not found|self referral|invalid referral claim|referral claim race/i.test(message);
        if (terminal) {
          response.cookies.set(REF_COOKIE, '', { path: '/', maxAge: 0, sameSite: 'lax' });
        }
      }
    }
  } catch {
    // Abaikan — login tetap sukses tanpa klaim referral.
  }

  return response;
}
