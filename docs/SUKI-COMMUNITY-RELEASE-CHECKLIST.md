# SUKI Community Release Checklist

## Implemented in code

During the controlled soft launch, new memberships are automatically approved with `status = 'active'`, including private groups. Authentication is still required, and write actions remain restricted to active members. Re-enable owner approval before a broad public launch if private-community moderation is required.

- [x] Discover public and private group records through the existing authenticated Groups page.
- [x] Create a group through `create_suki_group`; creator becomes owner and active member.
- [x] Join public groups immediately.
- [x] Auto-approve membership for private groups during the controlled soft launch.
- [x] Leave groups without allowing an owner to remove themselves accidentally.
- [x] Create discussion, question, and announcement posts.
- [x] Add comments with a 1–1,000 character limit.
- [x] Add `like`, `support`, and `insight` reactions.
- [x] Delete comments through server-side authorization.
- [x] Add loading, empty, error, disabled, and membership-required states.
- [x] Add additive RLS migration for comments and reactions.
- [x] Add realtime publication entries for comments and reactions.

## Required staging verification

- [ ] Apply `20260912060000_suki_communities.sql` and `20260913060000_suki_community_interactions.sql` twice in an isolated staging project.
- [ ] Verify tables, indexes, constraints, policies, function grants, and realtime publication membership.
- [ ] Verify anonymous users cannot create, join, post, comment, or react.
- [ ] Verify an authenticated user can create a public group and becomes its owner/member.
- [ ] Verify a second user can find and join the public group.
- [ ] Verify private-group posts and comments are inaccessible to non-members.
- [ ] Verify active members can create posts, comments, and reactions.
- [ ] Verify owners can moderate comments and non-owners cannot delete another user's comment.
- [ ] Verify two browser sessions receive new post/comment/reaction updates through realtime.
- [ ] Verify retrying a reaction does not create duplicates.
- [ ] Verify deleting a user-owned group comment removes only that comment.
- [ ] Verify backup and restore of the new tables.

## Production gate

The migration is **BLOCKED from production** until the Supabase project ref, staging evidence, RLS matrix, backup/restore result, and rollback owner are explicitly reviewed. Code build readiness does not equal database or production readiness.

## Validation performed in this workspace

| Check | Result |
|---|---|
| `npx tsc --noEmit` in `next-app` | Passed |
| `npm run build` in `next-app` | Passed |
| `node scripts/test-community-migration.js` | Passed, 12 assertions |
| Root `npm test` | Passed, 87 passed, 7 skipped |
| Root `npm run build` | Passed |
| Root `npm run test:security` | Skipped safely because no staging database URL was configured |
| Production `/groups` read-only smoke | HTTP 200; no mutation performed |
