# SUKI Community / Groups Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable authenticated users to discover, create, join, leave, post, comment, react to, and see live-updated interactions inside SUKI Community groups.

**Architecture:** Extend the existing Next.js `/groups` page and `lib/actions/groups.ts` server-action boundary. Add an additive Supabase migration for group comments and reactions with explicit RLS and realtime publication. Keep production schema application blocked until explicit approval; validate code, migration SQL, and unauthenticated route behavior locally and through read-only production smoke.

**Tech Stack:** Next.js 15, React, TypeScript, Supabase SSR/server actions, PostgreSQL/RLS, Supabase Realtime, lucide-react.

**Spec:** User request: activate all SUKI Community/group components so users can create groups and interact with each other.

## Global Constraints

- Do not apply DDL or mutate production data without explicit authorization.
- Preserve existing user changes; do not reset, force-push, or delete data.
- Keep anonymous users read-only for public groups and require authentication for create, join, post, comment, and reaction actions.
- Private group posts/comments/reactions must be limited to active members.
- Owner/moderator permissions must not be broadened accidentally.
- Validate input lengths and enum values at both application and database boundaries.
- Realtime is an enhancement; initial page load and mutation responses must work without a realtime connection.

---

### Task 1: Add additive group interaction schema and RLS

**Files:**
- Create: `supabase/migrations/20260913060000_suki_community_interactions.sql`
- Test: `scripts/test-community-migration.js`

**Interfaces:**
- Produces `group_post_comments(id, group_id, post_id, author_id, body, created_at, updated_at)`.
- Produces `group_post_reactions(post_id, user_id, reaction_type, created_at)` with primary key `(post_id,user_id,reaction_type)`.
- Produces policies for public-group reads, active-member reads/writes for private groups, author update/delete, and owner/moderator moderation.
- Adds both tables to `supabase_realtime` idempotently.

- [ ] **Step 1: Write a migration contract test** that asserts the migration contains both tables, primary/foreign keys, length checks, RLS enablement, auth.uid predicates, and realtime publication guards.
- [ ] **Step 2: Run `node scripts/test-community-migration.js`** and confirm it fails because the migration does not yet exist.
- [ ] **Step 3: Write the additive migration.** Use `create table if not exists`, `create index if not exists`, `alter table ... enable row level security`, named `drop policy if exists` followed by explicit policies, and guarded publication additions.
- [ ] **Step 4: Run the migration contract test** and verify it passes.
- [ ] **Step 5: Review the RLS matrix** for anonymous, authenticated non-member, active member, author, moderator, and owner before any migration application.

### Task 2: Extend server actions for feed interactions

**Files:**
- Modify: `next-app/lib/actions/groups.ts`
- Test: `scripts/test-community-actions.js`

**Interfaces:**
- `getGroupFeed(groupId: string)` returns posts with `comment_count`, `reaction_count`, `viewer_reactions`, and nested author profile.
- `createGroupComment(groupId: string, postId: string, body: string)` returns the created comment with author profile.
- `toggleGroupReaction(groupId: string, postId: string, reactionType: 'like' | 'support' | 'insight')` returns `{ reacted: boolean; reaction_type: string }`.
- `deleteGroupComment(groupId: string, commentId: string)` returns `{ ok: true }` for author/owner/moderator.

- [ ] **Step 1: Add validation tests** for empty/oversized comment bodies, invalid reaction types, and malformed IDs.
- [ ] **Step 2: Run the action contract tests** and confirm they fail for missing exports.
- [ ] **Step 3: Implement server actions** through `requireServerUser()`, query membership before private-group access, and use Supabase filters that mirror RLS.
- [ ] **Step 4: Make reaction toggles idempotent** by deleting the viewer’s reaction when present and inserting when absent.
- [ ] **Step 5: Return friendly, non-sensitive errors** and rerun action contract tests.

### Task 3: Complete Groups UI for comments and reactions

**Files:**
- Modify: `next-app/app/groups/page.tsx`
- Create: `next-app/components/groups/GroupPostCard.tsx`
- Create: `next-app/components/groups/GroupInteractionComposer.tsx`

**Interfaces:**
- `GroupPostCard` receives a post with comments/reactions and callbacks for reaction, comment submission, and comment deletion.
- `GroupInteractionComposer` receives `groupId`, `postId`, and `onCreated(comment)`.

- [ ] **Step 1: Add UI-level data types** for comments, reaction counts, and viewer reactions.
- [ ] **Step 2: Extract post rendering into `GroupPostCard`** with accessible buttons for Like, Support, Insight, and Comment.
- [ ] **Step 3: Add inline comment composer** with a 1–1,000 character limit, loading state, error state, and optimistic-safe response handling.
- [ ] **Step 4: Add comment list** with author, timestamp, body, and delete control only when permitted by the server result.
- [ ] **Step 5: Add reaction toggle controls** and refresh group counters after successful mutations.
- [ ] **Step 6: Preserve existing create group, join/leave, post composer, empty state, loading state, and modal close behavior.
- [ ] **Step 7: Add live refresh subscription** for `group_posts`, `group_post_comments`, and `group_post_reactions` when Supabase realtime is available; fall back silently to manual refresh.

### Task 4: Harden membership and group lifecycle UX

**Files:**
- Modify: `next-app/app/groups/page.tsx`
- Modify: `next-app/lib/actions/groups.ts`
- Test: `next-app/e2e/groups.spec.ts`

- [ ] **Step 1: Add explicit guest state** explaining that login is required for create/join/post/comment/reaction.
- [ ] **Step 2: Disable post/comment/reaction controls** for non-members of private groups and show the pending state for join requests.
- [ ] **Step 3: Add create/join/post mutation loading guards** to prevent double submission.
- [ ] **Step 4: Add browser test coverage** for public route render, create modal, empty state, and guest action messaging.
- [ ] **Step 5: Run the browser tests** against a local/staging environment only; do not submit production mutations.

### Task 5: Validate, document, and gate release

**Files:**
- Modify: `docs/SOFT-LAUNCH-READINESS.md`
- Create: `docs/SUKI-COMMUNITY-RELEASE-CHECKLIST.md`

- [ ] **Step 1: Run `git diff --check`.
- [ ] **Step 2: Run root `npm run lint`, `npm test`, `npm run build`, and `npm run test:security`.
- [ ] **Step 3: Install/use existing `next-app` dependencies only if approved and run `npm run lint`, `npx tsc --noEmit`, and `npm run build`.
- [ ] **Step 4: Run migration contract and route smoke tests.
- [ ] **Step 5: Document that the migration is BLOCKED from production until project ref, staging application, RLS matrix, and rollback plan are verified.
- [ ] **Step 6: Perform read-only production checks for `/groups`, `/api/csrf`, and the generated page; do not create a group or post in production.

## Release gate

The feature is **BLOCKED for public launch** until a staging project successfully verifies: two-user group creation/join, private-group isolation, post/comment/reaction CRUD, realtime update, owner moderation, and rollback/restore. Code readiness is separate from production schema readiness.

## Rollback

Code rollback alone does not revert the additive schema. If staging verification fails, revert the code change and leave the additive tables unused; do not drop tables or data. Any production correction requires a separately reviewed migration.
