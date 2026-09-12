import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './actions/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        suki: { indigo: '#5B5FEF', coral: '#FF5A7A', light: '#F8FAFC', dark: '#0B0F19', 'text-dark': '#E2E8F0', 'text-light': '#0F172A', 'secondary-dark': '#94A3B8', 'secondary-light': '#64748B' },
        stone: { 950: '#1C1917' },
        cream: { DEFAULT: '#FDFBF7', 50: '#FFFDF9', 100: '#F8F4EA', 200: '#EEE5D2' },
        gold: { DEFAULT: '#D4AF37', 400: '#E4C45A', 600: '#B89220', 700: '#8E6E11' },
        charcoal: '#121212', ink: '#12211F', forest: '#292524', teal: '#A16207', mint: '#F5EEDB', sand: '#FAF9F6', coral: '#B45309', line: '#E7E5E4', 'sultra-dark': '#1C1917', 'sultra-forest': '#292524', 'sultra-teal': '#A16207', 'sultra-mint': '#F5EEDB', 'sultra-sand': '#FAF9F6', 'sultra-gold': '#D4AF37'
      },
      borderRadius: { card: '20px', feature: '28px' },
      fontFamily: { sans: ['DM Sans', 'system-ui', 'sans-serif'], display: ['Playfair Display', 'Georgia', 'serif'] },
      boxShadow: { 'suki-glass': '0 22px 70px rgba(15,23,42,.12)' },
      backdropBlur: { glass: '24px' },
    },
  },
  plugins: [],
};
export default config;
