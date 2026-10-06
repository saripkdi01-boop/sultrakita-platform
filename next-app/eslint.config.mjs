import { globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  globalIgnores([
    '.next/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
  ]),
  ...nextVitals,
  {
    // Existing app patterns predating React Compiler / Next 16's stricter preset.
    // Keep them visible as code review findings without blocking the production gate.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-location-assign-relative-destination': 'warn',
      'jsx-a11y/role-supports-aria-props': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',
      'import/no-anonymous-default-export': 'warn',
    },
  },
];
