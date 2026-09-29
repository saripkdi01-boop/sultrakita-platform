# SUKI Apps — UI UX Pro Max Audit

## Scope

Audit and progressive UI/UX upgrade for the local-first digital ecosystem of Southeast Sulawesi.

## Detected active stack

- Next.js 15 App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Playwright for browser and visual tests
- Supabase-backed application flows

The repository also contains a legacy Express/vanilla frontend under `public/`. The production landing page and the current modern application surfaces are implemented under `next-app/`; this pass targets that active Next.js surface and deliberately preserves legacy API/DOM contracts.

## UI UX Pro Max integration

Imported into:

```text
next-app/.agents/skills/ui-ux-pro-max/
```

Persisted design system:

```text
next-app/design-system/suki-apps/MASTER.md
next-app/design-system/suki-apps/pages/marketplace.md
next-app/design-system/suki-apps/pages/community.md
```

The design system uses a balanced modern direction, subtle motion, standard density, mobile-first responsive behavior, visible focus, reduced-motion support, and SVG icons.

## Implemented in this pass

- Added explicit `typecheck` script.
- Added `test:uiux` Playwright script.
- Added landing-page UI/UX smoke tests for primary journeys, keyboard focus, mobile menu state, and 44px touch target.
- Added `uiux-review.css` as a small compatibility-safe review layer.
- Added ARIA relationships for primary navigation, mobile menu, hero, search form, ecosystem, process, and about sections.
- Preserved existing routes, API payloads, authentication behavior, local storage keys, and legacy selectors.

## Deliberately not changed

- Database schemas and migrations.
- Supabase/auth contracts.
- Listing, jobs, property, and community API payloads.
- Production secrets and deployment settings.
- Legacy `public/` runtime behavior.

## Validation target

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npx playwright install --with-deps chromium
npm run test:uiux
npm run test:visual
```

Visual screenshots should be reviewed by a human before updating baselines or merging.
