import type { Config } from 'tailwindcss';
import { palette } from './theme.config';

const colors = Object.fromEntries(
  Object.entries(palette).map(([name]) => [
    name,
    `rgb(var(--color-${name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}) / <alpha-value>)`,
  ]),
);

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...colors,
        sultra: {
          forest: 'rgb(var(--color-forest) / <alpha-value>)',
          teal: 'rgb(var(--color-teal) / <alpha-value>)',
          mint: 'rgb(var(--color-mint) / <alpha-value>)',
          sand: 'rgb(var(--color-sand) / <alpha-value>)',
          gold: 'rgb(var(--color-gold) / <alpha-value>)',
          coral: 'rgb(var(--color-coral) / <alpha-value>)',
          dark: 'rgb(var(--color-text-primary) / <alpha-value>)',
        },
        ink: 'rgb(var(--color-text-primary) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
      },
      borderRadius: { card: '20px', feature: '28px' },
      boxShadow: {
        soft: '0 4px 20px -2px rgba(45, 90, 61, 0.08)',
        dropdown: '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
        'glow-teal': '0 0 15px rgba(26, 138, 125, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
