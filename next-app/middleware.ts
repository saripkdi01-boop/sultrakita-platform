import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import {
  checkRateLimit,
  getClientIp,
  RATE_LIMIT_PRESETS,
  rateLimitHeaders,
  retryAfterSeconds,
} from './lib/security/rate-limit';

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/callback',
  '/legal/',
  '/beranda',
  '/marketplace',
  '/suki-marketplace',
  '/properti',
  '/groups',
  '/jobs',
  '/reels',
  '/help-center',
  '/support',
  '/security-center',
];

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) =>
    route.endsWith('/')
      ? pathname.startsWith(route)
      : pathname === route || pathname.startsWith(`${route}/`),
  );
}

// ---------------------------------------------------------------------------
// [slice-a] Maintenance mode — dibaca dari tabel `site_settings`
// (key `maintenance_mode`, value jsonb boolean; dikelola modul admin/settings).
// - Hanya dibaca bila env Supabase ada.
// - Gagal-buka (tabel belum ada, RLS menolak, jaringan gagal): lanjut normal.
// - Hasil di-cache 60 detik per instance agar tidak membebani database.
// - Pakai service-role key bila ada (server-side saja), fallback ke anon key.
// ---------------------------------------------------------------------------
const MAINTENANCE_CACHE_TTL_MS = 60_000;
let maintenanceCache: { value: boolean; at: number } | null = null;

async function isMaintenanceMode(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  const now = Date.now();
  if (maintenanceCache && now - maintenanceCache.at < MAINTENANCE_CACHE_TTL_MS) {
    return maintenanceCache.value;
  }
  try {
    const res = await fetch(`${url}/rest/v1/site_settings?key=eq.maintenance_mode&select=value`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (!res.ok) return false; // fail-open
    const rows = (await res.json()) as Array<{ value?: unknown }>;
    const on = rows.length > 0 && rows[0]?.value === true;
    maintenanceCache = { value: on, at: now };
    return on;
  } catch {
    return false; // fail-open: jangan crash bila tabel/flag belum tersedia
  }
}

function maintenancePageResponse(): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sedang Perawatan — SukiApps</title>
<style>body{font-family:system-ui,sans-serif;background:#f8fafc;color:#0f172a;display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;padding:24px}main{max-width:480px;text-align:center;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:40px 32px}h1{font-size:24px;margin:0 0 12px}p{color:#475569;line-height:1.6}</style>
</head>
<body><main>
<h1>SukiApps sedang perawatan</h1>
<p>Kami sedang melakukan pemeliharaan terjadwal agar layanan makin baik.<br>Silakan kembali beberapa saat lagi. Terima kasih atas pengertiannya.</p>
</main></body></html>`;
  return new NextResponse(html, {
    status: 503,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '120',
      'Cache-Control': 'no-store',
    },
  });
}

// ---------------------------------------------------------------------------
// [slice-a] Penanganan khusus /api/*: rate limiting ringan + maintenance.
// API routes memiliki autentikasi & respons error sendiri, jadi mereka TIDAK
// melewati logika redirect auth halaman di bawah (perilaku lama dipertahankan).
// ---------------------------------------------------------------------------
async function handleApiRequest(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  // Health check selalu lolos (probe load balancer / monitoring).
  if (pathname === '/api/health') return NextResponse.next();

  const ip = getClientIp(request);
  const rl = checkRateLimit(`api:${ip}`, RATE_LIMIT_PRESETS.general);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.' },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders(rl, RATE_LIMIT_PRESETS.general),
          'Retry-After': retryAfterSeconds(rl),
        },
      },
    );
  }

  if (await isMaintenanceMode()) {
    return NextResponse.json(
      { error: 'SukiApps sedang dalam perawatan. Silakan coba lagi nanti.' },
      { status: 503, headers: { 'Retry-After': '120' } },
    );
  }

  return NextResponse.next();
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  if (url.hostname === 'www.sukiapps.web.id') {
    const canonical = url.clone();
    canonical.hostname = 'sukiapps.web.id';
    return NextResponse.redirect(canonical, 308);
  }

  // [slice-a] API: hanya rate limit + maintenance (tanpa redirect auth).
  if (url.pathname.startsWith('/api/')) {
    return handleApiRequest(request);
  }

  // [slice-a] Maintenance mode untuk halaman (fail-open bila flag tak terbaca).
  if (!url.pathname.startsWith('/maintenance') && (await isMaintenanceMode())) {
    return maintenancePageResponse();
  }

  const publicRoute = isPublicRoute(url.pathname);
  if (url.pathname === '/admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url), 308);
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return publicRoute ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && url.pathname.startsWith('/admin')) {
    const login = new URL('/login', request.url);
    login.searchParams.set('redirect', '/admin/dashboard');
    return NextResponse.redirect(login);
  }
  if (!user && !publicRoute) { const redirect = url.clone(); redirect.pathname = '/login'; redirect.searchParams.set('redirect', url.pathname); return NextResponse.redirect(redirect); }
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) return NextResponse.redirect(new URL('/dashboard', request.url));
  if (user && !publicRoute && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/seller'))) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (url.pathname.startsWith('/admin') && !['admin', 'super_admin'].includes(profile?.role || '')) return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    if (url.pathname.startsWith('/seller') && profile?.role !== 'seller' && profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
  }
  return response;
}

// API routes own their authentication and error responses. Keeping them out of
// this page middleware prevents unauthenticated API calls from becoming HTML 307
// redirects to /login. [slice-a] API tetap melewati middleware lewat matcher
// kedua di bawah, tetapi ditangani khusus di awal `middleware()` (hanya rate
// limiting ringan + maintenance mode, tanpa redirect auth).
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
    '/api/:path*',
  ],
};
