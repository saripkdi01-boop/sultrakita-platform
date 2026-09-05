import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const publicRoutes = ['/login', '/signup', '/auth/callback', '/legal/'];
  const isPublicRoute = publicRoutes.some(route => route === '/legal/' ? url.pathname.startsWith('/legal/') : url.pathname === route || url.pathname.startsWith(`${route}/`));
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return isPublicRoute ? NextResponse.next() : NextResponse.redirect(new URL('/login', request.url));
  }
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { cookies: { getAll() { return request.cookies.getAll(); }, setAll(cookies: { name: string; value: string; options: CookieOptions }[]) { cookies.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); } } });
  const { data: { user } } = await supabase.auth.getUser();
  if (!user && !isPublicRoute) { const redirect = url.clone(); redirect.pathname = '/login'; redirect.searchParams.set('redirect', url.pathname); return NextResponse.redirect(redirect); }
  if (user && (url.pathname === '/login' || url.pathname === '/signup')) return NextResponse.redirect(new URL('/dashboard', request.url));
  if (user && !isPublicRoute && (url.pathname.startsWith('/admin') || url.pathname.startsWith('/seller'))) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (url.pathname.startsWith('/admin') && profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
    if (url.pathname.startsWith('/seller') && profile?.role !== 'seller' && profile?.role !== 'admin') return NextResponse.redirect(new URL('/dashboard?error=unauthorized', request.url));
  }
  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'] };
