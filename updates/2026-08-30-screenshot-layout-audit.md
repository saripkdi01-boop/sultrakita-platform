# Screenshot Layout Audit — 30 Agustus 2026

## Evidence from supplied screenshot

The supplied 720px image showed the app content occupying roughly the left half of the browser viewport. The header had a detached-looking primary navigation row, the search field appeared unexpectedly in the header stack, cards were narrow, and a large empty dark region remained on the right. This indicated a CSS breakpoint/layout sizing failure rather than a data issue.

## Root cause

The legacy CSS had multiple conflicting breakpoint layers. The rescue layer used `.layout` as a block with a constrained `.feed-column`, while older tablet rules could reintroduce grid sizing. The primary nav and topbar also had independent sticky/offset behavior. Production cache-busting was stale, allowing an older CSS/JS asset combination to remain visible after newer commits.

## Remediation

The primary navigation remains inside the single semantic header stack. A final cascade reset now forces `html`, `body`, `#app`, `.layout`, and `.feed-column` to use the full available viewport under 1200px, hides rails on mobile/tablet, removes accidental fixed-width behavior, and ensures cards are width-safe. The mobile searchbar is hidden unless explicitly open and is part of normal header flow when open. CSS and JS asset query versions were bumped to invalidate stale production assets.

## Post-fix render evidence

At 720x1612, the main feed now spans the full viewport: composer, discovery card, marketplace header, chips, listing cards, and seller section use the available width with balanced margins. The right-side empty region is gone. At 834x1194, the tablet feed also spans the viewport, navigation and topbar are aligned, and the primary content is not narrowed by a hidden/legacy rail grid. API-backed listings render normally in the local runtime.
