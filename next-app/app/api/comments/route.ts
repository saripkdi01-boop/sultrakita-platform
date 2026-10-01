import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { checkRateLimit, clientIp } from '@/lib/rate-limit';
import { badRequest, forbidden, internalError, notFound, unauthorized } from '@/lib/api-error';
import { verifyCsrfToken } from '@/lib/security/csrf';

const UUID_RE = /^[a-zA-Z0-9_-]{1,120}$/;

// Delegasi ke verifyCsrfToken waktu-konstan di lib/security/csrf.ts.
function checkCsrf(request: NextRequest) {
  return verifyCsrfToken(request);
}

type Cursor = { createdAt: string; id: string };
function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}
function decodeCursor(value: string | null): Cursor | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as Partial<Cursor>;
    if (typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') throw new Error('bad');
    return parsed as Cursor;
  } catch {
    throw new Error('invalid_cursor');
  }
}

/**
 * Masking avatar dihitung server-side dari `visibility_settings`, lalu field
 * internal `visibility_settings` DIBUANG agar tidak ikut di-serialize ke JSON.
 */
function toPublicProfile(
  profile:
    | { display_name?: unknown; username?: unknown; avatar_url?: unknown; visibility_settings?: { avatar?: string } }
    | null
    | undefined,
) {
  if (!profile || typeof profile !== 'object') return null;
  const avatarPublic = profile.visibility_settings?.avatar === 'public';
  return {
    display_name: profile.display_name ?? null,
    username: profile.username ?? null,
    avatar_url: avatarPublic ? profile.avatar_url ?? null : null,
  };
}

function maskAvatar(row: Record<string, unknown>) {
  row.profiles = toPublicProfile(row.profiles as Parameters<typeof toPublicProfile>[0]);
  return row;
}

const postSchema = z.object({
  postId: z.string().regex(UUID_RE, 'Postingan tidak valid.'),
  content: z.string().trim().min(1, 'Komentar tidak boleh kosong.').max(500, 'Komentar maksimal 500 karakter.'),
  parentId: z.string().regex(UUID_RE, 'Balasan tidak valid.').nullish(),
  idempotencyKey: z.string().max(120).nullish(),
});

/**
 * GET /api/comments?postId=&cursor=&limit=
 * Thread komentar per postingan, terbaru dulu, paginasi keyset sederhana.
 * Balikan: { data, pageInfo: { endCursor, hasNextPage } }.
 */
export async function GET(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api');
  if (limited) return limited;
  const params = request.nextUrl.searchParams;
  const postId = params.get('postId');
  if (!postId || !UUID_RE.test(postId)) return badRequest(request, 'Postingan tidak valid.');
  const limit = Math.min(Math.max(Number(params.get('limit') || 10) || 10, 1), 30);
  let cursor: Cursor | null;
  try { cursor = decodeCursor(params.get('cursor')); } catch {
    return badRequest(request, 'Kursor komentar tidak valid. Muat ulang.');
  }

  try {
    const supabase = await getServerSupabase();
    const { data: post, error: postError } = await supabase.from('posts').select('id').eq('id', postId).eq('status', 'published').maybeSingle();
    if (postError) return internalError(request, 'Komentar belum dapat dimuat.');
    if (!post) return notFound(request, 'Postingan tidak ditemukan.');

    let query = supabase
      .from('comments')
      .select('id,post_id,user_id,content,parent_id,created_at,profiles(display_name,username,avatar_url,visibility_settings)')
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(limit + 1);
    if (cursor) query = query.lt('created_at', cursor.createdAt);
    const { data, error } = await query;
    if (error) return internalError(request, 'Komentar belum dapat dimuat.');

    const rows = ((data || []) as Array<Record<string, unknown>>).map(maskAvatar);
    const hasNextPage = rows.length > limit;
    if (hasNextPage) rows.pop();
    const last = rows.at(-1);
    const endCursor = hasNextPage && last ? encodeCursor({ createdAt: String(last.created_at), id: String(last.id) }) : null;

    // Nama penulis komentar induk (untuk label "membalas …"), batch sekali.
    const parentIds = Array.from(new Set(rows.map((row) => row.parent_id).filter((value): value is string => typeof value === 'string')));
    const replyTo = new Map<string, string>();
    if (parentIds.length) {
      const { data: parents } = await supabase.from('comments').select('id,profiles(display_name,username)').in('id', parentIds);
      for (const parent of (parents || []) as Array<{ id: string; profiles?: { display_name?: string; username?: string } | null }>) {
        replyTo.set(parent.id, parent.profiles?.username || parent.profiles?.display_name || 'warga');
      }
    }
    const dataWithReply = rows.map((row) => ({
      ...row,
      reply_to_name: typeof row.parent_id === 'string' ? replyTo.get(row.parent_id) || 'komentar' : null,
    }));
    return NextResponse.json(
      { data: dataWithReply, pageInfo: { endCursor, hasNextPage } },
      { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } },
    );
  } catch {
    return internalError(request, 'Komentar belum dapat dimuat.');
  }
}

/**
 * POST /api/comments { postId, content, parentId?, idempotencyKey? }
 * CSRF double-submit + rate limit + idempoten (dedup via idempotency_key).
 * Balikan: { ok, comment }.
 */
export async function POST(request: NextRequest) {
  const limited = await checkRateLimit(request, 'api', clientIp(request));
  if (limited) return limited;
  if (!checkCsrf(request)) return forbidden(request, 'Token keamanan tidak valid. Muat ulang halaman.');
  let body: unknown;
  try { body = await request.json(); } catch { return badRequest(request, 'Format data tidak valid.'); }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return badRequest(request, parsed.error.issues[0]?.message || 'Komentar tidak valid.');

  try {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return unauthorized(request);
    const limitedUser = await checkRateLimit(request, 'api', user.id);
    if (limitedUser) return limitedUser;

    const { postId, content, parentId } = parsed.data;
    const { data: post, error: postError } = await supabase.from('posts').select('id').eq('id', postId).eq('status', 'published').maybeSingle();
    if (postError) return internalError(request, 'Komentar belum dapat dikirim.');
    if (!post) return notFound(request, 'Postingan tidak ditemukan.');

    // Balasan hanya 1 level: parent harus komentar tingkat atas di post yang sama.
    if (parentId) {
      const { data: parent, error: parentError } = await supabase.from('comments').select('id,post_id,parent_id').eq('id', parentId).maybeSingle();
      if (parentError) return internalError(request, 'Komentar belum dapat dikirim.');
      if (!parent || parent.post_id !== postId || parent.parent_id) return badRequest(request, 'Balasan hanya didukung satu level.');
    }

    const idempotencyKey = parsed.data.idempotencyKey?.slice(0, 120) || `${user.id}:${postId}:${Date.now()}`;
    const { data: existing } = await supabase
      .from('comments')
      .select('id,post_id,user_id,content,parent_id,created_at,profiles(display_name,username,avatar_url,visibility_settings)')
      .eq('user_id', user.id)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();
    if (existing) return NextResponse.json({ ok: true, comment: maskAvatar(existing as unknown as Record<string, unknown>), deduped: true }, { headers: { 'Cache-Control': 'no-store' } });

    const { data: created, error: insertError } = await supabase
      .from('comments')
      .insert({ post_id: postId, user_id: user.id, content, parent_id: parentId || null, idempotency_key: idempotencyKey })
      .select('id,post_id,user_id,content,parent_id,created_at,profiles(display_name,username,avatar_url,visibility_settings)')
      .single();
    if (insertError) {
      // Race: kunci idempotency sama terkirim bersamaan → ambil yang sudah ada.
      if (insertError.code === '23505') {
        const { data: raced } = await supabase
          .from('comments')
          .select('id,post_id,user_id,content,parent_id,created_at,profiles(display_name,username,avatar_url,visibility_settings)')
          .eq('user_id', user.id)
          .eq('idempotency_key', idempotencyKey)
          .maybeSingle();
        if (raced) return NextResponse.json({ ok: true, comment: maskAvatar(raced as unknown as Record<string, unknown>), deduped: true }, { headers: { 'Cache-Control': 'no-store' } });
      }
      return internalError(request, 'Komentar belum dapat dikirim.');
    }
    return NextResponse.json({ ok: true, comment: maskAvatar(created as unknown as Record<string, unknown>) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return internalError(request, 'Komentar belum dapat dikirim.');
  }
}
