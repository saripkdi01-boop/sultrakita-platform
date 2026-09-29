import type { Config } from 'tailwindcss';

/**
 * SUKI Apps — Tailwind theme.
 *
 * The `sultra-*` palette names are preserved because ~370 existing call sites
 * depend on them. What changed is where their VALUES come from:
 *
 *   before: each name held a fixed hex that disagreed with its own semantics
 *           (sultra-teal was #A16207 = amber, sultra-mint was #F5EEDB = beige,
 *           sultra-coral was #B45309 = brown), so light/dark could not adapt.
 *   after:  each name resolves through the canonical `--suki-rgb-*` channel
 *           tokens defined in app/styles/suki-foundation.css, so the palette
 *           follows the SUKI Theme Contract automatically in both themes and
 *           supports Tailwind alpha modifiers (e.g. `bg-sultra-forest/20`).
 *
 * `sultra-blue` was referenced 3x as `to-sultra-blue` but had no key here, so
 * those gradients silently rendered no colour. It is now defined.
 *
 * SUKI green remains the single primary brand colour. No brand value is
 * replaced — values are derived from the existing Theme Contract v1.
 */
const withAlpha = (channel: string) => `rgb(var(${channel}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './actions/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* Canonical semantic palette — use these for new work. */
        suki: {
          bg: withAlpha('--suki-rgb-bg'),
          surface: withAlpha('--suki-rgb-surface'),
          'surface-raised': withAlpha('--suki-rgb-surface-raised'),
          'surface-muted': withAlpha('--suki-rgb-surface-muted'),
          'surface-soft': withAlpha('--suki-rgb-surface-soft'),
          text: withAlpha('--suki-rgb-text'),
          'text-strong': withAlpha('--suki-rgb-text-strong'),
          'text-muted': withAlpha('--suki-rgb-text-muted'),
          'text-subtle': withAlpha('--suki-rgb-text-subtle'),
          border: withAlpha('--suki-rgb-border'),
          'border-strong': withAlpha('--suki-rgb-border-strong'),
          primary: withAlpha('--suki-rgb-primary'),
          'primary-hover': withAlpha('--suki-rgb-primary-hover'),
          'primary-soft': withAlpha('--suki-rgb-primary-soft'),
          gold: withAlpha('--suki-rgb-gold'),
          danger: withAlpha('--suki-rgb-danger'),
          warning: withAlpha('--suki-rgb-warning'),
          success: withAlpha('--suki-rgb-success'),
          info: withAlpha('--suki-rgb-info'),
        },

        /* Legacy `sultra-*` names, now theme-aware. */
        sultra: {
          forest: withAlpha('--suki-rgb-primary'),
          teal: withAlpha('--suki-rgb-primary'),
          mint: withAlpha('--suki-rgb-primary-soft'),
          sand: withAlpha('--suki-rgb-surface-muted'),
          dark: withAlpha('--suki-rgb-surface'),
          gold: withAlpha('--suki-rgb-gold'),
          coral: withAlpha('--suki-rgb-danger'),
          blue: withAlpha('--suki-rgb-info'),
          line: withAlpha('--suki-rgb-border'),
          ink: withAlpha('--suki-rgb-text'),
        },

        /* Short aliases kept for the pre-existing bare token names. */
        ink: withAlpha('--suki-rgb-text'),
        forest: withAlpha('--suki-rgb-primary'),
        teal: withAlpha('--suki-rgb-primary'),
        mint: withAlpha('--suki-rgb-primary-soft'),
        sand: withAlpha('--suki-rgb-surface-muted'),
        gold: withAlpha('--suki-rgb-gold'),
        coral: withAlpha('--suki-rgb-danger'),
        charcoal: withAlpha('--suki-rgb-text-strong'),
        line: withAlpha('--suki-rgb-border'),

        stone: { 950: withAlpha('--suki-rgb-text-strong') },
        cream: {
          DEFAULT: withAlpha('--suki-rgb-surface-muted'),
          50: withAlpha('--suki-rgb-surface'),
          100: withAlpha('--suki-rgb-surface-soft'),
          200: withAlpha('--suki-rgb-border'),
        },

        /* ------------------------------------------------------------------
         * Qwen spec palette — "Sultra Mature".
         *
         * These keys mirror the UI spec's component API so its examples
         * (`bg-brand-500`, `bg-surface-elevated`, `text-text-primary`,
         * `border-border-subtle`) work verbatim.
         *
         * They resolve to the `--qwen-*` tokens in
         * app/styles/suki-foundation.css section 12, which hold the accents and
         * the surface / text / border scale. Brand colours are NOT here: they
         * come from the canonical `--suki-rgb-primary*` channels, so the whole
         * app — old call sites and new primitives alike — follows one value.
         *
         * `brand`, `surface`, `accent`, `text` and `border` were all free keys
         * — no collision with the palettes above or with Tailwind core.
         * ------------------------------------------------------------------ */
        brand: {
          /* These resolve to the canonical `--suki-rgb-primary*` channels in
             suki-foundation.css section 1 — the same tokens `sultra-*` and
             `suki-*` already read. There is exactly one definition of the
             brand colour in this codebase, so a rebrand or a rollback is a
             single edit in that one block.

             The spec's five-step scale (50/100/500/600/700) is preserved as a
             public API because the spec's component examples use it, but it
             collapses onto the contract's three real steps: 50 and 100 are the
             soft tint, 500 is the brand, 600 and 700 are the pressed and
             active steps. Two names pointing at one value is deliberate — it
             keeps the spec's vocabulary working without inventing colours that
             the contract does not have. */
          50: withAlpha('--suki-rgb-primary-tint'),
          100: withAlpha('--suki-rgb-primary-soft'),
          500: withAlpha('--suki-rgb-primary'),
          600: withAlpha('--suki-rgb-primary-hover'),
          700: withAlpha('--suki-rgb-primary-active'),
        },

        accent: {
          wakatobi: withAlpha('--qwen-accent-wakatobi'),
          tolaki: withAlpha('--qwen-accent-tolaki'),
          buton: withAlpha('--qwen-accent-buton'),
        },

        surface: {
          base: withAlpha('--qwen-surface-base'),
          elevated: withAlpha('--qwen-surface-elevated'),
          sunken: withAlpha('--qwen-surface-sunken'),
          overlay: withAlpha('--qwen-surface-overlay'),
        },

        /* Yields the spec's `text-text-primary` / `text-text-muted` forms. */
        text: {
          primary: withAlpha('--qwen-text-primary'),
          secondary: withAlpha('--qwen-text-secondary'),
          muted: withAlpha('--qwen-text-muted'),
        },

        /* Yields the spec's `border-border-subtle` form. */
        border: {
          subtle: withAlpha('--qwen-border-subtle'),
          strong: withAlpha('--qwen-border-strong'),
        },

        'on-accent': 'var(--qwen-on-accent)',

        /* Semantic state colours as top-level keys. They already existed but
           only as `suki-danger`, `suki-success` and so on, so a component
           wanting a danger border had to reach into the `suki` namespace while
           its neighbours used bare names like `border-subtle`. These aliases
           point at the same canonical channel tokens — no new value is
           introduced — and they collide with nothing, since Tailwind has no
           core `danger`/`success`/`warning`/`info` keys. */
        danger: withAlpha('--suki-rgb-danger'),
        success: withAlpha('--suki-rgb-success'),
        warning: withAlpha('--suki-rgb-warning'),
        info: withAlpha('--suki-rgb-info'),
      },

      borderRadius: {
        card: 'var(--suki-radius-lg, 20px)',
        feature: 'var(--suki-radius-xl, 26px)',
        pill: 'var(--suki-radius-pill, 999px)',

        /* Spec radius scale. Namespaced rather than overriding Tailwind's core
           `rounded-sm/md/lg`, because the spec's steps do NOT line up with the
           core ones: spec `md` is 12px while core `rounded-md` is 6px, so
           overriding core would silently resize every existing rounded surface
           in the app. New components use these keys to match the spec exactly. */
        'qwen-sm': 'var(--qwen-radius-sm)',
        'qwen-md': 'var(--qwen-radius-md)',
        'qwen-lg': 'var(--qwen-radius-lg)',
        'qwen-full': 'var(--qwen-radius-full)',
      },

      fontFamily: {
        /* next/font self-hosts and exposes these as CSS variables in
           app/layout.tsx. Listing the variable first means the self-hosted
           file wins; the literal names stay as fallbacks so the stack still
           resolves if the variable is ever missing.
           `DM Sans` was dropped from this stack: it was declared but never
           loaded anywhere, so it never matched and only added noise. */
        sans: ['var(--font-body)', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-display)', 'Playfair Display', 'Georgia', 'serif'],
      },

      letterSpacing: {
        'qwen-tight': 'var(--qwen-tracking-tight)',
        'qwen-wide': 'var(--qwen-tracking-wide)',
      },

      lineHeight: {
        'qwen-relaxed': 'var(--qwen-leading-relaxed)',
      },

      boxShadow: {
        'suki-glass': '0 22px 70px rgb(15 23 42 / 12%)',
        'suki-sm': 'var(--theme-shadow-sm)',
        'suki-md': 'var(--theme-shadow-md)',
        'suki-lg': 'var(--theme-shadow-lg)',

        /* Spec elevation. Namespaced for the same reason as the radius keys:
           overriding core `shadow-sm/md/lg` would retint 49 existing call
           sites. These carry the spec's warm tint and the brand-tinted hover
           step. */
        'tint-sm': 'var(--qwen-shadow-sm)',
        'tint-md': 'var(--qwen-shadow-md)',
        'tint-md-hover': 'var(--qwen-shadow-md-hover)',
        'tint-lg': 'var(--qwen-shadow-lg)',
      },

      backdropBlur: { glass: '24px' },

      /* Shared rhythm so components stop inventing one-off spacing. */
      spacing: {
        'suki-1': 'var(--suki-space-1)',
        'suki-2': 'var(--suki-space-2)',
        'suki-3': 'var(--suki-space-3)',
        'suki-4': 'var(--suki-space-4)',
        'suki-5': 'var(--suki-space-5)',
        'suki-6': 'var(--suki-space-6)',
        'suki-8': 'var(--suki-space-8)',
        'suki-10': 'var(--suki-space-10)',
        'suki-12': 'var(--suki-space-12)',
      },

      /* Accessible touch-target floor. */
      minHeight: {
        tap: 'var(--suki-tap-min, 44px)',
        control: 'var(--suki-control-md, 44px)',
      },
      minWidth: {
        tap: 'var(--suki-tap-min, 44px)',
        control: 'var(--suki-control-md, 44px)',
      },

      transitionTimingFunction: {
        suki: 'var(--suki-ease-standard)',
        'suki-emphasis': 'var(--suki-ease-emphasis)',
      },

      fontSize: {
        'suki-xs': 'var(--suki-text-xs)',
        'suki-sm': 'var(--suki-text-sm)',
        'suki-base': 'var(--suki-text-base)',
        'suki-lg': 'var(--suki-text-lg)',
        'suki-xl': 'var(--suki-text-xl)',
        'suki-2xl': 'var(--suki-text-2xl)',
        'suki-3xl': 'var(--suki-text-3xl)',
      },

      keyframes: {
        'suki-shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'suki-rise': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'suki-shimmer': 'suki-shimmer 1.5s var(--suki-ease-standard) infinite',
        'suki-rise': 'suki-rise 320ms var(--suki-ease-emphasis) both',
      },
    },
  },
  plugins: [],
};

export default config;
