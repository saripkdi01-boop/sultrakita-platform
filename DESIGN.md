# SUKI Apps Design System

**Status:** v1.1 · 2026-09-30  
**Scope:** Public marketing homepage (`/`) and shared visual language for SUKI Apps.

## 1. Brand

SUKI Apps is a **local digital ecosystem for Sulawesi Tenggara**. The experience should feel **local, connected, human, useful, modern, and growing**—not like a generic SaaS template, AI landing page, dashboard, or crypto interface.

### Product message

> **Temukan yang dekat. Bangun yang berarti.**

### Design principles

1. **Local clarity:** show the relationship to Sultra without relying on decoration alone.
2. **Connected discovery:** Marketplace, Properti, Peluang, and Komunitas should feel like related rooms in one product.
3. **Useful restraint:** hierarchy comes from scale, spacing, and contrast before ornament.
4. **Human momentum:** motion confirms state and direction; it never competes with content.
5. **Trust by default:** semantic HTML, visible focus, clear labels, and honest error states are part of the brand.

## 2. Token architecture

The implementation uses four layers:

```text
primitive → semantic → component → UI
```

Components consume semantic or component tokens. Primitive values are changed centrally, not inside individual components. The homepage namespace is `--so-*`; shared app tokens remain available to existing authenticated surfaces until those surfaces are migrated.

### Primitive palette

| Role | Light primitive | Dark primitive | Notes |
|---|---|---|---|
| Ink | `#14231F` | `#E9F3EF` | Deep forest / off-white text |
| Forest | `#17463A` | `#B7E0D2` | Primary dark action / dark-theme brand tint |
| Teal | `#138A7D` | `#71D5C1` | Brand action and active state |
| Mint | `#E8F3EF` | `#193A34` | Soft brand surface |
| Sand | `#F8F7F2` | `#171E1C` | Base neutral surface |
| Line | `#DDE8E2` | `#34504A` | Subtle border |
| Muted | `#687872` | `#A7BDB6` | Secondary copy |
| Gold | `#B98328` | `#E6C47A` | Accent / step marker |
| Error | `#B64E43` | `#F09B91` | Error with text/icon support |

### Semantic tokens

| Token | Meaning |
|---|---|
| `--so-surface-base` | Page background |
| `--so-surface-raised` | Card and search surface |
| `--so-surface-elevated` | Open search, detail panel, floating CTA |
| `--so-content-primary` | Main readable content |
| `--so-content-secondary` | Supporting copy |
| `--so-content-muted` | Caption and metadata |
| `--so-border-subtle` | Quiet separation |
| `--so-border-default` | Interactive/control boundary |
| `--so-action-primary` | Main CTA and active state |
| `--so-action-primary-hover` | Hover state |
| `--so-action-primary-active` | Pressed state |
| `--so-focus-ring` | Keyboard focus indicator |
| `--so-feedback-error` | Error state |
| `--so-feedback-success` | Success state |

### Component tokens

- **Primary CTA:** `--so-action-primary`, `--so-content-on-action`, `--so-focus-ring`
- **Secondary CTA:** `--so-surface-raised`, `--so-content-primary`, `--so-border-default`
- **Search:** `--so-surface-raised`, `--so-surface-elevated`, `--so-border-default`, `--so-action-primary`
- **Ecosystem node:** `--so-surface-raised`, `--so-border-default`, `--so-action-primary`
- **Process rail:** `--so-border-subtle`, `--so-action-primary`

## 3. Theme behavior

Light and dark are separate tonal mappings, not an inversion. Dark mode uses a charcoal-green base (`#171E1C` family), off-white text, lighter brand accents, and lighter elevated surfaces to communicate hierarchy where shadows lose strength.

Theme selector: `.dark` on the document root. Homepage semantic tokens are remapped behind the same component selectors. Dark-mode requirements:

- no pure-black base or pure-white body copy;
- elevated cards are lighter than the base surface;
- teal/gold accents are shifted lighter and less saturated;
- focus remains visible against both the component and page surface;
- status/selection is never communicated by color alone.

## 4. Typography

- **Display:** Plus Jakarta Sans 700–800, `clamp(47px, 6vw, 78px)`, tight tracking for the hero.
- **Editorial accent:** Playfair Display italic for short emphasis only.
- **Body:** Plus Jakarta Sans 400–500, 12–15px with `1.7–1.8` line-height.
- **Labels:** Plus Jakarta Sans 700–900, 9–11px, uppercase only for metadata/kickers.
- **Numeric/data:** Plus Jakarta Sans 700–800 with tabular clarity where values are compared.

Do not introduce additional font families or arbitrary display sizes without documenting the role here.

## 5. Spacing, radius, and elevation

The base rhythm is an **8px grid**, with 4px reserved for optical corrections. Approved spacing steps are `4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 112, 128`.

- **Small radius:** 8px
- **Medium radius:** 12–16px
- **Large radius:** 20–28px
- **Pill:** 999px
- **Hero/special:** 26–28px

Elevation is conveyed by restrained shadow in light mode and surface lift/border contrast in dark mode:

- **Flat:** no shadow, shared surface
- **Raised:** `0 12px 30px rgba(18, 33, 31, .06)`
- **Elevated:** `0 18px 40px rgba(18, 33, 31, .10)`
- **Floating:** `0 26px 60px rgba(18, 33, 31, .14)`

## 6. Motion

Motion tokens live in `next-app/lib/motion-tokens.ts`.

- **Fast:** 160ms for press/hover acknowledgement
- **Standard:** 280ms for state change and detail swap
- **Emphasis:** 520ms for staged entrance
- **Ease:** standard ease-out for UI, emphasized ease-in-out for narrative reveal
- **Reduced motion:** preserve state changes and opacity feedback; remove large travel, parallax, and decorative movement.

No auto-playing or looping surface is used on the homepage, so no pause control is required.

## 7. Component state matrix

| Component | Default | Hover | Active/pressed | Focus | Disabled/loading | Error/success |
|---|---|---|---|---|---|---|
| Primary CTA | teal fill / white text | lighter teal + lift | darker teal / immediate press | 3px focus ring | reserved for in-flight actions | actionable inline feedback where applicable |
| Secondary CTA | raised surface / border | raised surface | border and text deepen | 3px focus ring | muted but readable | n/a |
| Search | bordered raised surface | border emphasis | expanded state | labeled input + ring | loading label when query is sent | API error must name next step |
| Ecosystem node | raised card + label | border/lift | `aria-pressed=true` + active border | visible ring | n/a | selection uses label + icon + border, not color alone |
| Mobile menu | icon button | surface tint | open/close state | visible ring | n/a | n/a |
| Process step | quiet row | surface tint | active row + progress rail | focus ring | n/a | n/a |

Interactive targets are at least 44px where practical. Native buttons, anchors, headings, and inputs are preferred over ARIA lookalikes.

## 8. Accessibility and QA

- Focus is implemented with `:focus-visible`, a 3px ring, and 3px offset.
- Source order matches visual reading order.
- Search has an accessible label and a native input.
- Ecosystem selection exposes `aria-pressed` and retains text labels.
- Color is paired with text, icon, border, or shape for meaning.
- `prefers-reduced-motion: reduce` is tested and preserves feedback.
- Reflow is checked at 320px as the accessibility floor and at the product breakpoints: 360, 390, 414, 768, 1024, 1280, 1440, and 1920px.
- WCAG AA target: 4.5:1 normal text, 3:1 large text and control boundaries. Disabled controls are still perceivable.

## 9. Microsoft frontend design review gate

Before release, review the homepage against three pillars:

1. **Frictionless insight-to-action:** one primary CTA, search and ecosystem discovery within three interactions.
2. **Quality craft:** tokens, intentional typography, distinctive composition, responsive behavior, theme parity, keyboard operation.
3. **Trustworthy building:** no fake functionality, actionable errors, preserved existing routes and APIs.

A release is not complete while a blocking theme, contrast, overflow, or keyboard defect remains.

## 10. Known exceptions and migration notes

- Existing authenticated pages still use the legacy global token names in `globals.css`; the homepage uses the namespaced semantic layer above to avoid breaking business logic.
- Existing `/api/feed` can return HTTP 500 when the local sandbox lacks its backend data integration. The homepage does not depend on that API for its marketing content; the issue is tracked as an environment/backend dependency.
- The public domain deployment remains external to this repository and requires the Vercel project connection to be restored.
