# SUKI UI/UX Audit — `feat/uiux-overhaul-v1`

Scope: `next-app/` only. Root Express/legacy runtime untouched.
Date: 2026-09-29
Baseline: `main` @ `ab0d8db` (feat(seo): expand public sitemap)

---

## 0. How this audit was produced

Read-only inspection plus local tooling. No production change, no schema change,
no auth/API/payment/webhook/middleware change.

Evidence gathered:

- `next-app/app/globals.css` — 3,216 lines / 473 KB, parsed by section and token family
- `next-app/tailwind.config.ts`
- 40 × `app/**/page.tsx`, 4 × `layout.tsx`, 62 × `components/**/*.tsx`
- Live production probes against `https://sukiapps.web.id` (median of 3 requests per route)
- Vercel API (project metadata, deployment history, env var **names** only)
- GitHub API (repo metadata, traffic)
- Supabase: not queried — no access token available in this environment

Secret handling: no secret value was read, printed, or committed. The Vercel env
listing requested `decrypt=false` and only key names were captured.

---

## 1. Executive summary

The frontend is **not** suffering from a lack of effort — it is suffering from
**accretion**. Multiple design-system generations were layered on top of each
other instead of replacing each other, and the newest layer never fully won.

Three findings drive most of the visible inconsistency:

| # | Finding | Impact |
|---|---------|--------|
| F1 | **Six parallel token families** plus 4 conflicting re-declarations of the same bare names | `var(--teal)` resolves to different colours depending on which file consumes it |
| F2 | **The `sultra-*` palette names disagree with their own values** — `sultra-teal` is `#A16207` (amber), `sultra-mint` is `#F5EEDB` (beige), `sultra-coral` is `#B45309` (brown) | 322 `dark:` utilities exist but the tokens they reference never adapt; dark mode is effectively cosmetic |
| F3 | **584 `!important` declarations and duplicated blocks** (`.quick-nav` ×7, `.marketplace-page .marketplace-card*` ×5) | The cascade is unpredictable; new work cannot reliably override old work |

### Verified traffic position

There is **no analytics installed at all**. Probed `/`, `/beranda`,
`/marketplace`, `/login` for `gtag`, `googletagmanager`, `@vercel/analytics`,
`posthog`, `clarity`, `plausible`, `umami`, `dataLayer` — **zero hits**.
Vercel Web Analytics reports 0 pageviews / 30 days.

Real traffic data that exists (GitHub repo only, 2026-09-10 → 2026-09-23):

- Page views: 1 total / 1 unique
- Git clones: 3,054 total / 628 unique

The clone pattern (792 clones from 97 uniques on 2026-09-15) is automated
scraping, not users. The repo is public and its docs name the production env
vars. **No secret values leak**, but the infrastructure map is public.

---

## 2. Foundation findings

### F1 — Six token families, four conflicting bare-name blocks

Token families found in `globals.css`:

- `--theme-*` — 68 definitions (the "SUKI Theme Contract v1", lines 228–279)
- `--color-*` — 38 definitions (line 3138)
- `--suki-*` — 19 definitions (lines 3, 988, 1013)
- `--rh-*` — 15 definitions (line 2990, `:root`-scoped inside `.reference-home`)
- `--tsuki-*` — 8 definitions (line 1813)
- `--marketplace-*` — 6 definitions

Additionally the bare names `--ink --forest --teal --mint --sand --gold --coral
--line` are re-declared in **four** separate blocks with **different values**:

- line 3 (`:root`) — `--teal: #A16207` (amber)
- line 59 (`:root`) — `--teal: #087F72` (green)
- line 221+ (`html[data-theme='dark']`) — `--teal: #51C8B8`
- line 3188+ (`:root`) — `--teal: #087F72`

Consumption is spread across every family:

```
var(--suki-forest)  ×75    var(--rh-brand)  ×18    var(--tsuki-line)  ×10
var(--suki-line)    ×55    var(--rh-line)   ×14    var(--tsuki-muted) ×7
var(--suki-teal)    ×45    var(--rh-ink)    ×11    var(--color-text-primary) ×5
```

**Consequence:** a component written against `--teal` renders amber in one
context and green in another.

### F2 — The `sultra-*` palette is semantically wrong

From `tailwind.config.ts` (before):

```
teal:      '#A16207'   ← amber, not teal
mint:      '#F5EEDB'   ← beige, not mint
coral:     '#B45309'   ← brown, not coral
'text-dark': '#E2E8F0' ← light grey, used as "dark" text
```

Usage counts:

```
text-sultra-teal     ×88      bg-sultra-mint      ×51
text-sultra-forest   ×64      border-sultra-mint  ×51
text-sultra-sand     ×57      bg-sultra-dark      ×42
```

`bg-sultra-dark` is used **42 times, always behind a `dark:` prefix** — i.e. the
pattern is `bg-white dark:bg-sultra-dark`. Because `sultra-dark` was a fixed
`#1C1917` and `dark:` requires the `dark` **class** on `<html>`, and because
`lib/preferences.tsx` sets *both* `dataset.theme` and `classList.toggle('dark')`,
this one path does work. Every other `sultra-*` token does not adapt.

### F2b — Undefined palette key

`to-sultra-blue` is used **3 times** but no `sultra-blue` key exists in
`tailwind.config.ts`. Tailwind emits no rule, so those gradient stops render
nothing. Silent visual bug.

### F3 — Specificity debt

- **584** `!important` declarations
- **1,688** total rules
- Duplicate selector blocks: `html[data-theme='dark']` ×8, `.quick-nav` ×7,
  `.beranda-shell` ×7, `.quick-nav-item` ×6, `.marketplace-page` ×6,
  `.beranda-feed-post` ×6, and 18 `.marketplace-page …` selectors ×4–5 each
- `app/globals.css` is **3,216 lines** in one file with 80+ section comments

### F4 — 227 minified component lines

227 lines in `components/` and `app/` exceed 400 characters. The worst offenders
put an entire page into a single JSX line, which makes review, diffing, and
targeted fixes impractical:

- `components/layout/AppLayout.tsx` — 4 lines total, one is ~2,600 chars
- `components/layout/QuickNavBar.tsx` — 6 lines total
- `app/marketplace/page.tsx` — 49 lines, line 30 is ~1,400 chars
- `app/ajak-teman/page.tsx` — a single ~15,000 char JSX expression

---

## 3. Accessibility findings

| Check | Result |
|---|---|
| `aria-label` usage | 265 ✓ |
| `aria-live` / `role=` usage | 102 ✓ |
| `<img>` without `alt` | 0 ✓ |
| `<div onClick>` (non-semantic) | 3 ⚠ |
| `prefers-reduced-motion` blocks in CSS | 30+ ✓ |
| `.reduce-motion` class support (in-app preference) | **1** ✗ |
| Interactive controls below 44px | **140 rules** ✗ |
| Focus ring on `.quick-nav-item` | `outline: 0` with partial replacement ⚠ |
| Skip-to-content link | **absent** ✗ |

Touch-target specifics:

- `.header-icon` — 40×40
- `.mobile-menu` (≤780px) — 42×42
- `.drawer-head button` — 36×36
- `.modal-close` — 36×36
- `.chat-header-actions button` — 32×32
- `.chat-attach` / `.chat-emoji` / `.chat-send` — 32–34px
- `.collapse-toggle` — 26×26
- `.heart-btn` — 32×32
- `.profile-actions button` / `.drawer-tools button` — 24×24
- `.chat-bubble-actions button` — 23×23
- `.blocked-row .danger-btn` — ~32px

`ProfileHub.tsx` writes `document.documentElement.classList.toggle('reduce-motion', …)`
but `globals.css` only contains **one** `.reduce-motion` rule, so the in-app
preference is effectively non-functional.

---

## 4. Layout findings

Only **7** `overflow-x: hidden|clip` guards existed for 40 routes.

Highest overflow risk:

- `components/marketplace/MarketplaceCard.tsx` — long listing titles + price row
- `components/beranda/FeedPost.tsx` — unbroken URLs in post bodies
- `components/chat/ChatInbox.tsx` — long display names in a fixed 360px column
- `.quick-nav` — 7 competing width definitions (`min(100% - 32px, 1080px)`,
  `100%`, `min(100%, 1120px)`)

`app/profile/page.tsx` **does not exist** — only `app/profile/[username]/page.tsx`.
Live probe: `GET /profile` → **HTTP 404 with a 12.9s TTFB**. Flagged as a routing
recommendation (see §8), not changed here.

---

## 5. State-coverage findings

Loading / empty / error handling is re-implemented per surface:

- 19 component files handle loading
- 16 handle empty
- 17 handle error
- Only 7 skeleton/shimmer CSS rules exist

Observed inconsistencies: some surfaces show a bare "Memuat…" string, some show
`animate-pulse` blocks, some show nothing at all; empty states vary between
`campaign-empty`, `setting-empty`, `chat-empty`, `security-empty`, and inline
`<p>` text; errors surface via `role="alert"`, `role="status"`, or plain text.

---

## 6. Performance findings

Live production, median of 3 requests per route, region `sin1`:

| Route | TTFB | Total | Size |
|---|---|---|---|
| `/` | 0.365s | 0.377s | 36 KB |
| `/beranda` | 0.311s | 0.365s | 90 KB |
| `/marketplace` | 0.326s | 0.375s | 49 KB |
| `/jobs` | 0.329s | 0.378s | 47 KB |
| `/properti` | 0.359s | 0.448s | 88 KB |
| `/groups` | 0.339s | 0.392s | 46 KB |
| `/login` | 0.330s | 0.332s | 8 KB |
| `/signup` | 0.343s | 0.347s | 8 KB |
| `/api/health` | **2.811s** | 2.813s | 110 B |

Good: static routes are prerendered and CDN-cached (`x-vercel-cache: HIT`).

Problems:

- **No `content-encoding` on responses.** `/beranda` ships 90 KB of HTML uncompressed.
- **`/api/health` takes 2.8s** — it hits the database on every request and is not cached.
- `/profile` 404 costs 12.9s TTFB.
- Deploy history: 30 READY / 10 ERROR out of the last 40. All 10 failures are
  `dependabot` dependency bumps, not authored code.

---

## 7. Route and header findings

| Route | Live status | Note |
|---|---|---|
| `/` | 200 | |
| `/beranda` | 200 | |
| `/marketplace` | 200 | |
| `/jobs` | 200 | |
| `/properti` | 200 | |
| `/groups` | 200 | |
| `/chat` | 307 → `/login?redirect=%2Fchat` | correct middleware behaviour |
| `/login` | 200 | |
| `/signup` | 200 | |
| `/profile` | **404** | route does not exist (only `[username]`) |
| `/settings` | 307 → `/settings/account` | correct |
| `/api/health` | 200 | `{"api":"up","db":"up","storage":"up"}` |

Headers:

```
permissions-policy: camera=(), microphone=(), geolocation=()
```

**This blocks camera, microphone and geolocation outright.** For a marketplace
that needs product-photo upload and a property product that needs a map pin,
this will break core features. Recorded as a critical recommendation (§8) —
changing it is a security-posture decision, not a UI decision.

CSP is permissive: `script-src 'self' 'unsafe-inline' 'unsafe-eval'`.

`/Business` exists as a route folder (`app/Business/page.tsx`) and is linked 6×
from `home-client.tsx`. Case-mismatch risk on case-sensitive hosts, but it
resolves 200 in production.

---

## 8. Recommendations requiring a decision (NOT changed)

These are outside the "visual-only, no contract change" boundary of this branch.
Each needs an explicit decision.

**R1 — Turn on analytics.** There is currently no way to know whether any of this
work helps. Vercel Web Analytics is free on Hobby; GA4 is free. Without this the
redesign cannot be evaluated.

**R2 — `permissions-policy` blocks camera/mic/geolocation.** Required for photo
upload and property location. Changing it is a deliberate security trade-off.

**R3 — `/profile` returns 404 with a 12.9s TTFB.** Either add a redirect to the
signed-in user's `/profile/[username]`, or accept 404. Fixing it touches
middleware/routing, which this branch must not change.

**R4 — Make the repository private.** 3,054 clones / 628 uniques over 14 days,
with a clear scraping signature. No secret values leak, but the docs enumerate
production env var names.

**R5 — Compress responses.** No `content-encoding` observed. Should be handled at
the Vercel/host layer.

**R6 — Cache `/api/health`.** 2.8s TTFB on every hit; it queries the database.

**R7 — Repair or delete the stale UI branches.** `feat/fb-style-ui-v3`,
`feat/social-marketplace-ui-v4`, `feat/mobile-fb-ui` have **0 commits ahead** of
main and are 356–380 commits behind. `feat/worldclass-ui-v1` is 5 ahead but 479
behind. They are noise.

**R8 — Fix the dependabot failure loop.** 10 of the last 40 deploys failed, all
from dependency bumps. The error detail was not retrievable via the API.

**R9 — `app/Business` casing.** Rename to lowercase with a redirect if the host
ever becomes case-sensitive.

---

## 9. Plan applied on this branch

Batch 1 (this commit) — **Foundation**:

- `app/styles/suki-foundation.css` — new, additive, visual-only (676 lines)
  - §1 canonical `--suki-rgb-*` channel tokens for both themes
  - §2 spacing / radius / type / motion / control scales
  - §3 legacy bridge collapsing all six families + bare names onto the contract
  - §4 `sultra-*` compatibility rules + the missing `to-sultra-blue` stop
  - §5 touch targets raised to the 44px floor on interactive elements only
  - §6 single focus-visible ring + `.suki-skip-link`
  - §7 `.suki-skeleton` / `.suki-state` / `.suki-feedback` primitives
  - §8 layout-safety guards (`overflow-x: clip`, `min-width: 0`, media caps)
  - §9 motion preferences, incl. the previously dead `.reduce-motion` class
  - §10 forced-colors support
- `tailwind.config.ts` — `sultra-*` + new `suki-*` palette bound to channel
  tokens so light/dark adapt and alpha modifiers work; `sultra-blue` defined
- `app/layout.tsx` — imports the foundation layer; adds `viewport` export
  (light + dark `theme-color`); adds the skip-to-content link

Rollback for Batch 1: delete `app/styles/suki-foundation.css`, revert
`tailwind.config.ts` and `app/layout.tsx`. No other file depends on it.

Batches 2–5 are applied as separate, individually revertable commits.
