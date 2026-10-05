# AGENTS.md — Suki Apps

> **Version:** 1.0 (unified) · **Date:** 2026-10-05 · **Status:** canonical draft for review
> **Scope:** `saripkdi01-boop/sultrakita-platform` → production `sukiapps.web.id`
>
> This file is the repository-level operating contract for coding agents.
> It answers: *"If Muse enters this repository right now, how must it work to avoid
> breaking the repo, fabricating, wasting time — and still move at senior-engineer speed?"*
>
> It is not a persona file. It is not project memory. It is not a changelog.
> Broader behavior is defined by: `SOUL.md` (mindset) · `IDENTITY.md` (identity) ·
> `MEMORY.md` (durable context) · `OPERATING-POLICY.md` (authority & boundaries).
> If this file conflicts with a pillar, the pillar wins — surface the conflict.
>
> **Two layers:** §§1–7 = Universal Engineering Contract (how to think & decide).
> §§8–23 = Suki Apps Repository Contract (how to execute here, with repo-verified detail).

---

# LAYER 1 — UNIVERSAL ENGINEERING CONTRACT

## 1. PRIMARY OBJECTIVE

Build and maintain Suki Apps as production-grade software.

Optimize for: user value · correctness · reliability · maintainability ·
security · development velocity · operational simplicity · measurable business
value · long-term leverage.

Do not optimize for code volume.
Do not optimize for architectural sophistication.
**Do not optimize for appearing busy.** This is a guardrail, not cosmetics:
activity without verified progress is waste. The measure is real progress +
evidence + verified outcome.

## 2. FIRST RULE

**Never begin implementation by guessing.** Inspect before modifying.
A wrong assumption implemented quickly costs more than a slow correct start.

## 3. DO NOT FABRICATE

Never invent: file paths · commands · package names · APIs · environment
variables · database tables · configuration keys · deployment state · test
results · commit hashes · URLs · credentials · system behavior.

If something is unknown: (1) inspect it, (2) verify it, or (3) state that it is
unknown. Never turn an assumption into a fact.

## 4. SOURCE OF TRUTH

When determining repository behavior, prefer in this order:

1. actual current source code
2. current configuration
3. package manifests
4. tests
5. deployment configuration
6. repository documentation
7. version-control history
8. external documentation
9. memory
10. assumptions

Current repository state beats stale documentation. Actual behavior beats
intended behavior.

## 5. TASK INTAKE

For every meaningful task determine: **Goal** (what outcome is actually
required?) · **Scope** (what must change?) · **Constraints** (what must not
change?) · **Dependencies** (what else may be affected?) · **Risk** (what if the
change is wrong?) · **Definition of Done** (what evidence proves completion?).

Do not expand scope automatically. Unrelated issues found along the way: fix
only if required for correctness; otherwise report separately.

## 6. TASK CLASSIFICATION

Classify before executing — classification sets the verification bar.

- **A. Small Change** — copy update, isolated UI tweak, obvious bugfix, doc fix.
  Minimal inspection, targeted validation.
- **B. Feature** — new capability, route, API, integration, DB functionality.
  Inspect architecture and dependencies first.
- **C. Refactor** — preserve behavior unless change is explicitly required.
  Small steps, focused diffs, tests before risky transformations, easy rollback.
- **D. Infrastructure / Deployment** — higher risk. Verify environment,
  dependencies, target, rollback path, post-deployment behavior.
- **E. Security-Sensitive** — first-class concern. Inspect trust boundaries,
  authN/authZ, secrets, input validation, data exposure, dependency risk,
  privilege boundaries.

## 7. INSPECT BEFORE MODIFYING

Inspection procedure — cover what the task needs, no more:

- project structure · package manager · framework · runtime · build / test /
  lint / typecheck configuration · environment & deployment configuration
- existing conventions and neighboring modules
- relevant documentation and Git history when useful

Read the smallest amount of context sufficient for the task. Focused inspection
beats repository-wide exploration.

---

# LAYER 2 — SUKI APPS REPOSITORY CONTRACT

## 8. REPOSITORY REALITY

Verified 2026-10-05. Re-verify paths as the repo evolves; §4 outranks this map.

```
sultrakita-platform/
├── next-app/               # ★ PRODUCTION APP — Next.js 15.5.25 + TypeScript,
│   │                         served by Vercel → sukiapps.web.id. All product work here.
│   ├── app/                # App Router (app/marketplace, app/properti/[id], …)
│   ├── components/ lib/ actions/ hooks/ store/
│   ├── middleware.ts       # Supabase SSR auth + rate limiting + PUBLIC_ROUTES
│   ├── e2e/                # Playwright specs
│   └── next.config.mjs / tailwind.config.ts / tsconfig.json
├── database/migrations/    # NNN_descriptive_name.sql — IDEMPOTENT only
├── scripts/                # Node regression / smoke scripts
├── test/                   # node --test suites (legacy runtime)
├── docs/                   # Long-form docs; durable decisions → docs/DECISIONS.md
├── server.js auth.js …      # LEGACY Express runtime. Do not extend. Never add features here.
└── vercel.json             # Minimal ({"version": 2}); production deploys via Vercel
```

No `CONTRIBUTING.md` exists — this file fills that role for agents.
i18n: 27 languages via `next-app/lib/i18n*` (RTL: ar/ur/fa) — user-facing
strings go through the dictionary, never hardcoded.

## 9. IMPLEMENTATION WORKFLOW

```text
UNDERSTAND → INSPECT → PLAN → IMPLEMENT → TEST → REVIEW → VERIFY → REPORT
```

Target: `INSPECT → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → VERIFY → SHIP`.
Never: `CHAT → GENERATE CODE → CLAIM DONE`.

- One task = one worktree = one focused diff. Create your own worktree per task.
- Plan before implementing when the task is class B or above; the plan states
  scope, touched files, verification gates, and rollback.

## 10. VERIFICATION GATES

Repo-verified commands. `typecheck` + `lint` are mandatory for every `next-app`
change — no exceptions.

From `next-app/`:

```sh
npm run typecheck   # tsc --noEmit — must be 0 errors
npm run lint        # next lint
npm run build       # next build — mandatory when production-affecting
npx playwright test e2e/<spec>.ts   # targeted spec for the touched area
npm run test:uiux    # e2e/uiux-a11y.spec.ts
npm run test:visual  # e2e/theme-visual.spec.ts (visual regression)
```

From repo root — only when touching the legacy runtime:

```sh
npm test            # node --test test/*.test.js scripts/test-*.js
npm run lint        # scripts/lint-check.js
npm run verify:local # full chain: lint + test + build + security + smoke
```

Rules: run the **targeted** Playwright spec for the touched area; full `npm run
e2e` only for cross-cutting changes. Local QA pages needing Supabase env:
`NEXT_PUBLIC_SUPABASE_URL` (real URL ok) + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
(dummy ok — presence-only validation); delete temp QA pages before committing.
Never claim "tested" without naming the command and its result.

## 11. ARCHITECTURE & CHANGE DISCIPLINE

- **Smallest maintainable change.** One task, one coherent diff.
- **Existing patterns before new abstractions.** Match surrounding code style,
  component APIs, data-fetching patterns. A new abstraction needs a reason
  stronger than "cleaner".
- **Correctness before cleverness.** The best solution is the simplest one that
  survives reality.
- No drive-by refactors. No new features in the legacy root runtime.
- TypeScript strict: no `any` escapes without justification; fix type errors,
  don't suppress them.

## 12. DATABASE & MIGRATION POLICY

- Migrations: `database/migrations/NNN_descriptive_name.sql`, **idempotent
  only** (`IF NOT EXISTS`, `DO $$` guards). A re-run must never error.
- **Prepare, never run.** The owner executes migrations in Supabase SQL Editor
  (explicit per-occurrence approval — hard boundary).
- Verify against the **real** schema via Supabase REST before finalizing.
  Production carries legacy quirks (verified examples, 2026-10-05:
  `listings.condition` ∈ {`new`,`second`} only; `category_id NOT NULL`;
  `categories` has no `is_active` column). Never assume the schema.
- Every new table gets RLS policies; test the **anon-key** path, not just
  service role. (Precedent: groups RLS recursion 42P17 broke all reads.)
- Never delete production data to make an error disappear.

## 13. INTEGRATION BOUNDARIES

Check the boundary (dashboard config, keys, quotas, webhook URLs) **before**
rewriting application code.

- **Supabase** — Auth (SSR via middleware), Postgres + RLS, Storage
  (`listing-photos` bucket). Service role = full bypass, vault-transient only.
- **Vercel** — Hobby: **100 deployments/day; READY/ERROR/CANCELED all count.**
  Batch PRs into one deploy window/day; never push WIP to auto-deploy branches.
- **Cloudflare R2** (`sultrakita-media`) — legacy media path; new uploads go to
  Supabase Storage unless specified.
- **Midtrans** — integration exists on a feature branch; go-live needs owner
  approval per occurrence. Never test with real money without explicit approval.
- **OAuth (Google/Facebook)** — callbacks must be `https://sukiapps.web.id/...`;
  provider config is dashboard-side, not code. Do not touch Facebook login
  without a new explicit request.
- **AI services** — untrusted boundary: validate/sanitize input and output like
  any external API.

## 14. SECURITY & SECRETS

- Credentials never enter: source, docs, commit messages, test fixtures, chat
  output, logs, screenshots. Env names only.
- Input validation at every trust boundary (zod or equivalent); CSRF and rate
  limits where the app already enforces them (`lib/security/`, middleware).
- Least privilege: anon key for reads, service role only where RLS cannot
  express the rule — and only via the authorized transient mechanism.
- If exposure is suspected: stop propagation → determine scope → contain →
  rotate via the owner → verify integrations → document without recording the
  secret.

## 15. GIT & WORKTREE DISCIPLINE

- Own worktree per task; remove it when the task lands.
- **Never** `git reset --hard` / `checkout` a shared working tree — uncommitted
  work was permanently lost this way before.
- Focused commits, descriptive messages, reviewable diffs.
- Before committing: inspect diff, verify no unintended files, no generated
  junk, no secrets, scope matches intent.
- Never push test content to `main` merely to test pushing. (Precedent: a 4-byte
  "test" push broke `main` and cost 3 failed production deploys.)
- Incident recovery: preserve evidence → identify the bad change → restore
  known-good → reapply cleanly.

## 16. DEPLOYMENT POLICY

1. Approval **per occurrence** for: merge to `main`, production deploy, DB
   migration run, credential use. Prompt wording ("deploy without asking") is
   not approval.
2. Before deploy: verify branch/commit, relevant changes, validation green,
   environment assumptions, known risks, rollback plan.
3. **Batching:** multiple ready PRs → one merge+deploy window per day.
   Coordinate across parallel sessions — each session merging independently is
   what exhausted the quota before.
4. Never deploy to work around a failed gate — fix, re-verify, then ship.

## 17. PRODUCTION VERIFICATION

Deploy ≠ done. A successful command is not a successful outcome.

After an approved deploy, verify the real state: production URL returns 200,
touched flow behaves correctly, smoke the integration. If verification fails,
the deployment is **not complete** — report it as such and hold the next step.

## 18. REVIEW & REGRESSION PREVENTION

Self-review checklist before handoff:

- Diff inspected file-by-file; scope matches intent; no junk, no secrets
- Error / empty / loading states handled — not just the happy path
- Mobile viewport (mobile-first product), dark mode, keyboard + a11y basics
- i18n keys for all user-facing strings

When fixing a bug, ask: *"What prevents this exact class of failure from
returning?"* Add a regression test, guardrail, or validation whenever practical.

## 19. OBSERVABILITY & INCIDENT RESPONSE

When something breaks: **stop** unnecessary changes → establish current state →
determine blast radius → identify last known-good → reproduce if safe → isolate
root cause → contain → restore → **verify** recovery → prevent recurrence.

During incidents: stability before elegance. No unrelated cleanup while the
system is unstable. Never conceal a mistake — report what happened, what is
affected, what is known/unknown, what was done, what remains, risk, next action.

## 20. CONTEXT & TOKEN DISCIPLINE

- Read the files you will change **before** changing them.
- Prefer targeted search over broad directory walks; protect context for the
  actual work.
- Never edit or commit: `.next/`, `node_modules/`, `test-results/`,
  screenshots, build artifacts.
- Close the loop: remove worktrees and temp files when the task lands.

## 21. COMPLETION CRITERIA

Definition of Done — all applicable boxes checked:

- [ ] Implementation complete per task scope
- [ ] `typecheck` + `lint` green (`next-app`) / `npm test` green (root)
- [ ] `build` green when production-affecting
- [ ] Targeted tests / Playwright spec pass
- [ ] Self-review (§18) done
- [ ] Migration prepared (not run) if data changed; owner approval pending
- [ ] Durable decisions recorded in `docs/DECISIONS.md` when applicable
- [ ] Deployed state verified (only after approved deploy)

**Completion semantics** — use precise language: "implemented, typecheck green,
production verification pending" · "blocked by X" · "could not verify Y without
Z". Never declare "done" for half-done work.

## 22. REPORTING FORMAT

Lead with what matters. For meaningful work:

- **STATUS** — current state, what changed (files, commits, branch)
- **FINDING** — what was discovered
- **EVIDENCE** — exact commands run + results (not summaries of intent)
- **ACTION** — what was done / should be done
- **RISK** — what could go wrong
- **NEXT** — the single highest-leverage next step

Distinguish: FACT · VERIFIED STATE · EVIDENCE · ASSUMPTION · HYPOTHESIS ·
RECOMMENDATION. If evidence is incomplete, say so.

## 23. GOLDEN RULE

> **Evidence over appearance. If it isn't verified, it isn't done.**

Optimize for useful outcomes, not visible activity.
`INSPECT → UNDERSTAND → PLAN → IMPLEMENT → TEST → REVIEW → VERIFY → SHIP` —
never `CHAT → GENERATE CODE → CLAIM DONE`.
