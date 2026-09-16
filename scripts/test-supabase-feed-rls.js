#!/usr/bin/env node
'use strict';

/**
 * Suki Feed RLS staging test.
 * Default is read-only preflight. --write requires two dedicated test users and
 * SUPABASE_TEST_ALLOW_WRITES=true. Never run write mode against production data.
 */
const crypto = require('crypto');
const WRITE = process.argv.includes('--write');
const BASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const TABLES = ['posts', 'likes', 'post_comments', 'saved_posts', 'post_shares'];
const fail = (message) => { console.error(`Feed RLS test failed: ${message}`); process.exitCode = 1; };
const skip = (message) => { console.log(`Feed RLS test skipped: ${message}`); };
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const requireEnv = (names) => { const missing = names.filter((name) => !process.env[name]); if (missing.length) throw new Error(`missing environment variables: ${missing.join(', ')}`); };

async function request(path, { token, method = 'GET', body, query = {}, expected = null } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
  const headers = { apikey: ANON_KEY, Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) { headers['Content-Type'] = 'application/json'; headers.Prefer = 'return=representation'; }
  const response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text(); let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (expected && !expected.includes(response.status)) throw new Error(`${method} ${path} returned HTTP ${response.status}: ${JSON.stringify(data).slice(0, 500)}`);
  return { status: response.status, data };
}
async function signIn(email, password) {
  const result = await request('/auth/v1/token', { method: 'POST', query: { grant_type: 'password' }, body: { email, password }, expected: [200] });
  assert(result.data?.access_token && result.data?.user?.id, `sign-in did not return a user for ${email}`);
  return { token: result.data.access_token, user: result.data.user };
}
const auth = (token) => ({ token });

async function preflight() {
  requireEnv(['SUPABASE_URL', 'SUPABASE_ANON_KEY']);
  const results = [];
  for (const table of TABLES) {
    const result = await request(`/rest/v1/${table}`, { query: { select: 'id', limit: '1' }, expected: table === 'posts' || table === 'likes' || table === 'post_comments' ? [200, 206] : [200, 206, 401, 404] });
    results.push(`${table}:${result.status}`);
  }
  console.log(`Feed RLS preflight passed (${results.join(', ')}).`);
  console.log('Write matrix is opt-in: use --write with two dedicated staging accounts and SUPABASE_TEST_ALLOW_WRITES=true.');
}

async function runWriteMatrix() {
  requireEnv(['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_TEST_OWNER_EMAIL', 'SUPABASE_TEST_OWNER_PASSWORD', 'SUPABASE_TEST_MEMBER_EMAIL', 'SUPABASE_TEST_MEMBER_PASSWORD']);
  const owner = await signIn(process.env.SUPABASE_TEST_OWNER_EMAIL, process.env.SUPABASE_TEST_OWNER_PASSWORD);
  const member = await signIn(process.env.SUPABASE_TEST_MEMBER_EMAIL, process.env.SUPABASE_TEST_MEMBER_PASSWORD);
  assert(owner.user.id !== member.user.id, 'owner and member test accounts must be different');
  const suffix = crypto.randomBytes(5).toString('hex');
  let postId; let ownerCommentId; let memberCommentId;
  try {
    const post = await request('/rest/v1/posts', { ...auth(owner.token), method: 'POST', body: { user_id: owner.user.id, content: `RLS fixture ${suffix}`, privacy: 'public', type: 'post', status: 'published', idempotency_key: `rls-${suffix}` }, expected: [201] });
    postId = post.data?.[0]?.id; assert(postId, 'post fixture was not created');
    const anonPost = await request('/rest/v1/posts', { query: { select: 'id', id: `eq.${postId}` }, expected: [200, 206] });
    assert(anonPost.data?.some((row) => row.id === postId), 'anonymous public post read failed');

    const ownerComment = await request('/rest/v1/post_comments', { ...auth(owner.token), method: 'POST', body: { post_id: postId, user_id: owner.user.id, content: 'Owner comment fixture', status: 'visible', idempotency_key: `owner-${suffix}` }, expected: [201] });
    ownerCommentId = ownerComment.data?.[0]?.id; assert(ownerCommentId, 'owner comment fixture was not created');
    const memberComment = await request('/rest/v1/post_comments', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: member.user.id, content: 'Member comment fixture', status: 'visible', idempotency_key: `member-${suffix}` }, expected: [201] });
    memberCommentId = memberComment.data?.[0]?.id; assert(memberCommentId, 'member comment fixture was not created');
    await request('/rest/v1/post_comments', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: owner.user.id, content: 'Spoofed author', status: 'visible', idempotency_key: `spoof-${suffix}` }, expected: [401, 403] });

    await request('/rest/v1/likes', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: member.user.id }, expected: [201] });
    await request('/rest/v1/likes', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: owner.user.id }, expected: [401, 403] });
    await request('/rest/v1/saved_posts', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: member.user.id }, expected: [201] });
    await request('/rest/v1/saved_posts', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: owner.user.id }, expected: [401, 403] });
    await request('/rest/v1/post_shares', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: member.user.id, channel: 'clipboard', idempotency_key: `share-${suffix}` }, expected: [201] });
    await request('/rest/v1/post_shares', { ...auth(member.token), method: 'POST', body: { post_id: postId, user_id: owner.user.id, channel: 'clipboard', idempotency_key: `spoof-share-${suffix}` }, expected: [401, 403] });

    await request('/rest/v1/post_comments', { ...auth(member.token), method: 'DELETE', query: { id: `eq.${ownerCommentId}` }, expected: [204] });
    const ownerStillThere = await request('/rest/v1/post_comments', { ...auth(owner.token), query: { select: 'id', id: `eq.${ownerCommentId}` }, expected: [200, 206] });
    assert(ownerStillThere.data?.some((row) => row.id === ownerCommentId), 'non-owner deleted owner comment');
    console.log('Feed RLS write matrix passed: public post/comment read, owner spoof denial, like/save/share ownership, and non-owner delete denial.');
  } finally {
    if (memberCommentId) await request('/rest/v1/post_comments', { ...auth(member.token), method: 'DELETE', query: { id: `eq.${memberCommentId}` }, expected: [204] }).catch(() => {});
    if (ownerCommentId) await request('/rest/v1/post_comments', { ...auth(owner.token), method: 'DELETE', query: { id: `eq.${ownerCommentId}` }, expected: [204] }).catch(() => {});
    if (postId) await request('/rest/v1/posts', { ...auth(owner.token), method: 'DELETE', query: { id: `eq.${postId}` }, expected: [204] }).catch(() => {});
  }
}

(async () => {
  try {
    if (!BASE_URL || !ANON_KEY) return skip('SUPABASE_URL and SUPABASE_ANON_KEY are not configured.');
    if (!WRITE) return await preflight();
    if (process.env.SUPABASE_TEST_ALLOW_WRITES !== 'true') return skip('write mode requires SUPABASE_TEST_ALLOW_WRITES=true.');
    await runWriteMatrix();
  } catch (error) { fail(error instanceof Error ? error.message : String(error)); }
})();
