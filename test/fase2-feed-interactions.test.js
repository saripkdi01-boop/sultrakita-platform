const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const migration = fs.readFileSync(path.join(root, 'supabase/migrations/20260917000000_feed_interactions_v1.sql'), 'utf8');
const interactions = fs.readFileSync(path.join(root, 'next-app/app/api/interactions/route.ts'), 'utf8');
const comments = fs.readFileSync(path.join(root, 'next-app/app/api/comments/route.ts'), 'utf8');
const feedPost = fs.readFileSync(path.join(root, 'next-app/components/beranda/FeedPost.tsx'), 'utf8');

test('Fase 2 memiliki tabel save/share, target komentar sosial, dan policy account-scoped', () => {
  for (const marker of ['alter table public.post_comments', 'create unique index if not exists post_comments_user_idempotency_idx', 'create table if not exists public.saved_posts', 'create table if not exists public.post_shares', 'saved_posts_insert_own', 'saved_posts_delete_own', 'post_shares_insert_own', 'post_comments_public_read', 'post_comments_owner_insert', 'p.status = \'published\'']) assert.match(migration, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('API interaction mendukung like, save, share, delete, dan idempotency', () => {
  for (const marker of ["['like', 'save', 'share']", "action === 'save'", "action === 'like'", 'post_shares', 'idempotencyKey', 'csrf_failed']) assert.match(interactions, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('API komentar memvalidasi, meng-idempotensi, dan menghapus komentar milik user', () => {
  for (const marker of ['post_comments', 'MAX_CONTENT', 'replace(/\\s+/g', 'idempotency_key', 'comments_schema_unavailable', 'comment_delete_failed', 'encodeCommentCursor', 'created_at.eq']) assert.match(comments, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('FeedPost memakai server interaction helper, bukan localStorage save', () => {
  assert.match(feedPost, /setPostSaved/);
  assert.match(feedPost, /recordPostShare/);
  assert.match(feedPost, /createPostComment/);
  assert.doesNotMatch(feedPost, /suki-saved-posts/);
});
