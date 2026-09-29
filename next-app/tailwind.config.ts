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
      },

      borderRadius: {
        card: 'var(--suki-radius-lg, 20px)',
        feature: 'var(--suki-radius-xl, 26px)',
        pill: 'var(--suki-radius-pill, 999px)',
      },

      fontFamily: {
        sans: ['DM Sans', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },

      boxShadow: {
        'suki-glass': '0 22px 70px rgb(15 23 42 / 12%)',
        'suki-sm': 'var(--theme-shadow-sm)',
        'suki-md': 'var(--theme-shadow-md)',
        'suki-lg': 'var(--theme-shadow-lg)',
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
