import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const POST_ID = /^[a-zA-Z0-9_-]{1,120}$/;
const COMMENT_ID = /^[a-zA-Z0-9-]{1,120}$/;
const MAX_CONTENT = 1000;

function encodeCommentCursor(createdAt: string, id: string) {
  return Buffer.from(JSON.stringify({ v: 1, createdAt, id })).toString('base64url');
}

function decodeCommentCursor(value: string | null) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as { v?: number; createdAt?: string; id?: string };
    if (parsed.v !== 1 || typeof parsed.createdAt !== 'string' || typeof parsed.id !== 'string') throw new Error('invalid_cursor');
    return parsed;
  } catch {
    throw new Error('invalid_cursor');
  }
}

function csrfValid(request: NextRequest) {
  const header = request.headers.get('x-csrf-token');
  const cookie = request.cookies.get('suki_csrf')?.value;
  return Boolean(header && cookie && header === cookie);
}

async function session() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  const postId = request.nextUrl.searchParams.get('postId');
  const cursor = request.nextUrl.searchParams.get('cursor');
  const limit = Math.min(Math.max(Number(request.nextUrl.searchParams.get('limit') || 20) || 20, 1), 50);
  if (!postId || !POST_ID.test(postId)) return NextResponse.json({ error: 'invalid_post' }, { status: 400 });
  try {
    const decodedCursor = decodeCommentCursor(cursor);
    const { supabase } = await session();
    let query = supabase.from('post_comments').select('id,post_id,user_id,content,status,created_at').eq('post_id', postId).order('created_at', { ascending: true }).order('id', { ascending: true }).limit(limit + 1);
    if (decodedCursor) query = query.or(`created_at.gt.${decodedCursor.createdAt},and(created_at.eq.${decodedCursor.createdAt},id.gt.${decodedCursor.id})`);
    const { data, error } = await query;
    if (error) throw error;
    const rows = data || [];
    const hasNextPage = rows.length > limit;
    if (hasNextPage) rows.pop();
    const last = rows.at(-1);
    return NextResponse.json({ data: rows, pageInfo: { nextCursor: hasNextPage && last ? encodeCommentCursor(last.created_at, last.id) : null, hasNextPage }, contractVersion: 'suki-comments-v1' }, { headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' } });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    return NextResponse.json({ error: code === '42P01' ? 'comments_schema_unavailable' : 'comments_unavailable' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!csrfValid(request)) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  let body: { postId?: string; content?: string; idempotencyKey?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'invalid_json' }, { status: 400 }); }
  const postId = body.postId || '';
  const content = body.content?.trim().replace(/\s+/g, ' ') || '';
  if (!POST_ID.test(postId) || content.length < 1 || content.length > MAX_CONTENT) return NextResponse.json({ error: 'invalid_comment' }, { status: 422 });
  try {
    const { supabase, user } = await session();
    if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
    const idempotencyKey = body.idempotencyKey?.trim().slice(0, 120) || `${user.id}:${postId}:${content}`;
    const { data, error } = await supabase.from('post_comments').upsert({ post_id: postId, user_id: user.id, content, status: 'visible', idempotency_key: idempotencyKey }, { onConflict: 'post_id,user_id,idempotency_key', ignoreDuplicates: false }).select('id,post_id,user_id,content,status,created_at').single();
    if (error) throw error;
    return NextResponse.json({ ok: true, data, idempotencyKey, contractVersion: 'suki-comments-v1' }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
    return NextResponse.json({ error: code === '42P01' ? 'comments_schema_unavailable' : code === '42501' ? 'permission_denied' : 'comment_failed' }, { status: code === '42501' ? 403 : 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!csrfValid(request)) return NextResponse.json({ error: 'csrf_failed' }, { status: 403 });
  const commentId = request.nextUrl.searchParams.get('commentId');
  if (!commentId || !COMMENT_ID.test(commentId)) return NextResponse.json({ error: 'invalid_comment' }, { status: 400 });
  try {
    const { supabase, user } = await session();
    if (!user) return NextResponse.json({ error: 'authentication_required' }, { status: 401 });
    const { error } = await supabase.from('post_comments').delete().eq('id', commentId).eq('user_id', user.id);
    if (error) throw error;
    return NextResponse.json({ ok: true, deleted: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return NextResponse.json({ error: 'comment_delete_failed' }, { status: 500 }); }
}
