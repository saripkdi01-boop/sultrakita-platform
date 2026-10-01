// Helper server-side: menempelkan metadata interaksi (jumlah suka/komentar,
// status suka & ikuti penulis) ke baris postingan SECARA BATCH — tanpa N+1.
// Dipakai /api/feed dan /api/saved.

type SupabaseLike = { from: (table: string) => any };
type PostRow = Record<string, unknown> & { id: string; user_id?: string };

function countBy(rows: Array<{ post_id?: string }>): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of rows) {
    if (!row.post_id) continue;
    map.set(row.post_id, (map.get(row.post_id) || 0) + 1);
  }
  return map;
}

/**
 * Menempelkan likes_count, comments_count, liked, following_author ke setiap row.
 * - counts dihitung dari tabel likes/comments (publik, RLS read).
 * - liked / following_author hanya diisi bila userId tersedia (null untuk anon).
 * - Mengembalikan row yang sama (dimutasi) agar pemanggil tetap memegang referensi.
 */
export async function attachInteractionMeta(
  supabase: SupabaseLike,
  rows: PostRow[],
  userId: string | null,
): Promise<PostRow[]> {
  if (!rows.length) return rows;
  const ids = Array.from(new Set(rows.map((row) => String(row.id)).filter(Boolean)));
  if (!ids.length) return rows;

  const [{ data: likeRows }, { data: commentRows }] = await Promise.all([
    supabase.from('likes').select('post_id').in('post_id', ids),
    supabase.from('comments').select('post_id').in('post_id', ids),
  ]);
  const likesCount = countBy((likeRows || []) as Array<{ post_id?: string }>);
  const commentsCount = countBy((commentRows || []) as Array<{ post_id?: string }>);

  const likedSet = new Set<string>();
  const followingSet = new Set<string>();
  if (userId) {
    const authorIds = Array.from(new Set(rows.map((row) => String(row.user_id || '')).filter(Boolean)));
    const [myLikes, myFollows] = await Promise.all([
      supabase.from('likes').select('post_id').eq('user_id', userId).in('post_id', ids),
      authorIds.length
        ? supabase.from('follows').select('following_id').eq('follower_id', userId).in('following_id', authorIds)
        : Promise.resolve({ data: [] as Array<{ following_id?: string }> }),
    ]);
    for (const row of (myLikes.data || []) as Array<{ post_id?: string }>) if (row.post_id) likedSet.add(row.post_id);
    for (const row of (myFollows.data || []) as Array<{ following_id?: string }>) if (row.following_id) followingSet.add(row.following_id);
  }

  for (const row of rows) {
    const id = String(row.id);
    row.likes_count = likesCount.get(id) || 0;
    row.comments_count = commentsCount.get(id) || 0;
    row.liked = likedSet.has(id);
    row.following_author = row.user_id ? followingSet.has(String(row.user_id)) : false;
  }
  return rows;
}

/** Deteksi "tabel belum ada" dari error PostgREST agar API bisa 503 jujur. */
export function isMissingTableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const record = error as Record<string, unknown>;
  const code = typeof record.code === 'string' ? record.code : '';
  const message = typeof record.message === 'string' ? record.message : '';
  return (
    code === 'PGRST205' || // PostgREST: tabel tidak ada di schema cache
    code === '42P01' || // Postgres: undefined_table
    /could not find the table|schema cache/i.test(message)
  );
}
