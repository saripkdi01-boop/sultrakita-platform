#!/usr/bin/env node
'use strict';

/**
 * Supabase Community comments/RLS integration test.
 *
 * Default: read-only preflight. Full CRUD/RLS matrix requires --write and two
 * dedicated test-user credentials. The script creates a temporary public group,
 * post, and comments, then removes the group at the end through the owner session.
 * Never point this at production users; use an isolated Supabase project or
 * dedicated test accounts.
 *
 * Required environment for --write:
 *   SUPABASE_URL
 *   SUPABASE_ANON_KEY
 *   SUPABASE_TEST_OWNER_EMAIL / SUPABASE_TEST_OWNER_PASSWORD
 *   SUPABASE_TEST_MEMBER_EMAIL / SUPABASE_TEST_MEMBER_PASSWORD
 * Optional:
 *   SUPABASE_TEST_GROUP_ID and SUPABASE_TEST_POST_ID for read-only preflight.
 */

const crypto = require('crypto');

const WRITE = process.argv.includes('--write');
const BASE_URL = String(process.env.SUPABASE_URL || '').replace(/\/$/, '');
const ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const TABLES = ['groups', 'group_members', 'group_posts', 'group_post_comments'];

function fail(message) {
  console.error(`Community Supabase RLS test failed: ${message}`);
  process.exitCode = 1;
}

function skip(message) {
  console.log(`Community Supabase RLS test skipped: ${message}`);
  process.exitCode = 0;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`missing environment variables: ${missing.join(', ')}`);
}

async function request(path, { token, method = 'GET', body, query = {}, expected = null } = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query).forEach(([key, value]) => url.searchParams.set(key, value));
  const headers = { apikey: ANON_KEY, Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    headers.Prefer = 'return=representation';
  }
  const response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (expected && !expected.includes(response.status)) {
    throw new Error(`${method} ${path} returned HTTP ${response.status}: ${JSON.stringify(data).slice(0, 500)}`);
  }
  return { status: response.status, data, headers: response.headers };
}

async function signIn(email, password) {
  const result = await request('/auth/v1/token', {
    method: 'POST',
    query: { grant_type: 'password' },
    body: { email, password },
    expected: [200],
  });
  assert(result.data && result.data.access_token && result.data.user?.id, `sign-in did not return a user for ${email}`);
  return { token: result.data.access_token, user: result.data.user };
}

function authHeader(token) { return { token }; }

async function preflight() {
  requireEnv(['SUPABASE_URL', 'SUPABASE_ANON_KEY']);
  const results = [];
  for (const table of TABLES) {
    const result = await request(`/rest/v1/${table}`, { query: { select: '*', limit: '1' }, expected: [200, 206] });
    results.push(`${table}:${result.status}`);
  }
  console.log(`Community Supabase preflight passed (${results.join(', ')}).`);
  console.log('Full RLS CRUD matrix is opt-in: run with --write using two dedicated test accounts.');
}

async function runWriteMatrix() {
  requireEnv([
    'SUPABASE_URL', 'SUPABASE_ANON_KEY',
    'SUPABASE_TEST_OWNER_EMAIL', 'SUPABASE_TEST_OWNER_PASSWORD',
    'SUPABASE_TEST_MEMBER_EMAIL', 'SUPABASE_TEST_MEMBER_PASSWORD',
  ]);

  const owner = await signIn(process.env.SUPABASE_TEST_OWNER_EMAIL, process.env.SUPABASE_TEST_OWNER_PASSWORD);
  const member = await signIn(process.env.SUPABASE_TEST_MEMBER_EMAIL, process.env.SUPABASE_TEST_MEMBER_PASSWORD);
  assert(owner.user.id !== member.user.id, 'owner and member test accounts must be different');

  const suffix = crypto.randomBytes(5).toString('hex');
  let groupId;
  let postId;
  let ownerCommentId;
  let memberCommentId;
  try {
    const createdGroup = await request('/rest/v1/groups', {
      ...authHeader(owner.token), method: 'POST',
      body: { owner_id: owner.user.id, name: `RLS Test ${suffix}`, slug: `rls-test-${suffix}`, description: 'Temporary automated RLS test fixture', category: 'umum', privacy: 'public' },
      expected: [201],
    });
    groupId = createdGroup.data?.[0]?.id;
    assert(groupId, 'group fixture was not created');

    const joined = await request('/rest/v1/group_members', {
      ...authHeader(member.token), method: 'POST',
      body: { group_id: groupId, user_id: member.user.id, role: 'member', status: 'active' },
      expected: [201],
    });
    assert(joined.status === 201, 'member fixture was not created');

    const createdPost = await request('/rest/v1/group_posts', {
      ...authHeader(owner.token), method: 'POST',
      body: { group_id: groupId, author_id: owner.user.id, body: 'Temporary RLS test post', post_type: 'discussion' },
      expected: [201],
    });
    postId = createdPost.data?.[0]?.id;
    assert(postId, 'post fixture was not created');

    const anonRead = await request('/rest/v1/group_post_comments', { query: { select: 'id', group_id: `eq.${groupId}`, limit: '1' }, expected: [200, 206] });
    assert(Array.isArray(anonRead.data), 'anonymous public read did not return a list');

    const ownerComment = await request('/rest/v1/group_post_comments', {
      ...authHeader(owner.token), method: 'POST',
      body: { group_id: groupId, post_id: postId, author_id: owner.user.id, body: 'Owner comment fixture' }, expected: [201],
    });
    ownerCommentId = ownerComment.data?.[0]?.id;
    assert(ownerCommentId, 'owner comment was not created');

    const memberComment = await request('/rest/v1/group_post_comments', {
      ...authHeader(member.token), method: 'POST',
      body: { group_id: groupId, post_id: postId, author_id: member.user.id, body: 'Member comment fixture' }, expected: [201],
    });
    memberCommentId = memberComment.data?.[0]?.id;
    assert(memberCommentId, 'member comment was not created');

    await request('/rest/v1/group_post_comments', {
      ...authHeader(member.token), method: 'POST',
      body: { group_id: groupId, post_id: postId, author_id: owner.user.id, body: 'Spoofed author must be rejected' }, expected: [401, 403],
    });

    await request('/rest/v1/group_post_comments', {
      ...authHeader(member.token), method: 'PATCH', query: { id: `eq.${ownerCommentId}` },
      body: { body: 'Unauthorized update must be rejected' }, expected: [401, 403],
    });

    await request('/rest/v1/group_post_comments', {
      ...authHeader(owner.token), method: 'PATCH', query: { id: `eq.${ownerCommentId}` },
      body: { body: 'Owner update allowed' }, expected: [200],
    });

    await request('/rest/v1/group_post_comments', {
      ...authHeader(member.token), method: 'DELETE', query: { id: `eq.${ownerCommentId}` }, expected: [204],
    }).then((result) => assert(result.status === 204, 'member delete unexpectedly returned a non-empty response'));
    // A denied DELETE can return 204 with zero affected rows under PostgREST; verify the row remains.
    const ownerStillThere = await request('/rest/v1/group_post_comments', { ...authHeader(owner.token), query: { select: 'id', id: `eq.${ownerCommentId}` }, expected: [200, 206] });
    assert(ownerStillThere.data?.some((row) => row.id === ownerCommentId), 'non-owner member deleted the owner comment');

    await request('/rest/v1/group_post_comments', {
      ...authHeader(owner.token), method: 'DELETE', query: { id: `eq.${ownerCommentId}` }, expected: [204],
    });
    const ownerGone = await request('/rest/v1/group_post_comments', { ...authHeader(owner.token), query: { select: 'id', id: `eq.${ownerCommentId}` }, expected: [200, 206] });
    assert(!ownerGone.data?.some((row) => row.id === ownerCommentId), 'comment author could not delete own comment');
    ownerCommentId = null;

    await request('/rest/v1/group_post_comments', {
      ...authHeader(member.token), method: 'DELETE', query: { id: `eq.${memberCommentId}` }, expected: [204],
    });
    memberCommentId = null;

    console.log('Community Supabase RLS matrix passed: public read, authenticated member insert, author spoof denial, author update, non-owner delete denial, and author delete.');
  } finally {
    // Owner deletion cascades fixture comments/posts/membership/group. This is the only cleanup mutation.
    if (groupId) {
      const cleanup = await request('/rest/v1/groups', { ...authHeader(owner.token), method: 'DELETE', query: { id: `eq.${groupId}` }, expected: [204] });
      if (cleanup.status !== 204) console.warn(`Warning: cleanup returned HTTP ${cleanup.status}; remove fixture group ${groupId} manually.`);
    }
  }
}

(async () => {
  try {
    if (!BASE_URL || !ANON_KEY) return skip('SUPABASE_URL and SUPABASE_ANON_KEY are not configured.');
    if (!WRITE) return await preflight();
    if (process.env.SUPABASE_TEST_ALLOW_WRITES !== 'true') return skip('write mode requires SUPABASE_TEST_ALLOW_WRITES=true.');
    await runWriteMatrix();
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
})();
