import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, notFound, serviceUnavailable, unauthorized } from '@/lib/api-error';
import { attachInteractionMeta, isMissingTableError } from '@/lib/feed-counts';
import { verifyCsrfToken } from '@/lib/security/csrf';

const UUID_RE = /^[a-zA-Z0-9_-]{1,120}$/;

// Delegasi ke verifyCsrfToken waktu-konstan di lib/security/csrf.ts.
function checkCsrf(request: NextRequest) {
  return verifyCsrfToken(request);
}

// Bila migrasi 20261001210000_saved_posts.sql belum dijalankan, endpoint 503
// dengan pesan jujur — JANGAN mengembalikan data palsu atau berpura-pura sukses.
function tableNotReady(request: NextRequest) {
  return serviceUnavailable(request, 'Fitur simpan belum tersedia karena pembaruan database belum dijalankan. Coba lagi nanti.');
}

const saveSchema = z.object({
  postId: z.string().regex(UUID_RE, 'Postingan tidak valid.'),
  idempotencyKey: z.string().max(120).nullish(),
});

/**
 * Profil publik yang aman untuk konsumsi klien: masking avatar dihitung
 * server-side dari `visibility_settings`, lalu field internal
 * `visibility_settings` DIBUANG agar tidak ikut di-serialize ke JSON.
 */
function toPublicProfile(
  profile:
    | { display_name?: unknown; username?: unknown; avatar_url?: unknown; visibility_settings?: { avatar?: string } }
    | null
    | undefined,
) {
  if (!profile || typeof profile !== 'object') return null;
  const avatarHidden = profile.visibility_settings?.avatar !== 'public';
  return {
    display_name: profile.display_name ?? null,
    username: profile.username ?? null,
    avatar_url: avatarHidden ? null : (profile.avatar_url ?? null),
  };
}

/**
 * GET /api/saved?limit=
 * Daftar postingan yang disimpan pengguna yang sedang login (terbaru dulu).
 * Balikan: { data: [...] } — postingan diperkaya likes_count/comments_count/liked.
 */
export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 30) || 30, 1), 100);

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const { data, error } = await supabase
      .from('saved_posts')
      .select('created_at,posts(id,content,media_urls,type,privacy,location,mood,created_at,user_id,profiles(display_name,username,avatar_url,visibility_settings))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) {
      if (isMissingTableError(error)) return tableNotReady(request);
      return internalError(request, 'Daftar simpanan belum dapat dimuat.');
    }
    const rows: Array<Record<string, unknown> & { id: string }> = [];
    for (const entry of (data || []) as unknown as Array<{ created_at: string; posts: unknown }>) {
      const joined = entry.posts;
      const post = (Array.isArray(joined) ? joined[0] : joined) as (Record<string, unknown> & { id?: unknown }) | null;
      if (!post || typeof post.id !== 'string') continue;
      post.profiles = toPublicProfile(post.profiles as Parameters<typeof toPublicProfile>[0]);
      const row: Record<string, unknown> & { id: string } = { ...post, id: post.id, saved_at: entry.created_at };
      rows.push(row);
    }
    await attachInteractionMeta(supabase, rows, user.id);
    return NextResponse.json({ data: rows }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
  } catch {
    return internalError(request, 'Daftar simpanan belum dapat dimuat.');
  }
}

/**
 * POST /api/saved { postId }
 * Menyimpan postingan. Idempoten.
 * Balikan: { ok, saved: true }.
 */
export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  let body: unknown;
  try { body = await request.json(); } catch { return badRequest(request, 'Format data tidak valid.'); }
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Permintaan tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;

    const { data: post, error: postError } = await supabase.from('posts').select('id').eq('id', parsed.data.postId).eq('status', 'published').maybeSingle();
    if (postError) return internalError(request, 'Simpan belum dapat diproses.');
    if (!post) return notFound(request, 'Postingan tidak ditemukan.');

    const { error } = await supabase.from('saved_posts').insert({ post_id: parsed.data.postId, user_id: user.id });
    if (error) {
      if (isMissingTableError(error)) return tableNotReady(request);
      if (error.code !== '23505') return internalError(request, 'Simpan belum dapat diproses.');
    }
    return NextResponse.json({ ok: true, saved: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return internalError(request, 'Simpan belum dapat diproses.');
  }
}

/**
 * DELETE /api/saved?postId=
 * Menghapus postingan dari simpanan. Idempoten.
 * Balikan: { ok, saved: false }.
 */
export async function DELETE(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  const postId = request.nextUrl.searchParams.get('postId');
  if (!postId || !UUID_RE.test(postId)) return badRequest(request, 'Postingan tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;

    const { error } = await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
    if (error) {
      if (isMissingTableError(error)) return tableNotReady(request);
      return internalError(request, 'Hapus simpanan belum dapat diproses.');
    }
    return NextResponse.json({ ok: true, saved: false }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return internalError(request, 'Hapus simpanan belum dapat diproses.');
  }
}
