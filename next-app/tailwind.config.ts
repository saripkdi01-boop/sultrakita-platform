import type { Config } from 'tailwindcss';
const config: Config = { content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'], theme: { extend: { colors: { ink: '#12211F', forest: '#0E6258', teal: '#138A7D', mint: '#E7F3EF', sand: '#F8F6F1', gold: '#C78B45', coral: '#E76452', line: '#DDE7E3' }, borderRadius: { card: '20px', feature: '28px' } } }, plugins: [] };
export default config;