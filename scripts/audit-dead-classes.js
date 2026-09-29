#!/usr/bin/env node
/**
 * Dead-class audit.
 *
 * Tailwind silently drops any utility whose key does not exist in the theme.
 * A typo such as `shadow-tint-sm` against a config key of `shadow-qwen-sm`
 * produces no error, no warning and no build failure — the class simply
 * vanishes from the emitted CSS and the element renders unstyled. Neither
 * `tsc` nor `next build` can see it, so this check exists to catch that class
 * of bug before it reaches a screenshot.
 *
 * It earned its keep immediately: it caught `shadow-tint-*` (4 dead classes
 * against a `qwen-*` config key) and `bg-danger`/`text-success`/etc. (8 dead
 * classes, because the semantic colours only existed as `suki-danger`).
 *
 * Pipeline: strip comments, extract quoted strings, split into tokens, keep
 * only tokens that plausibly are utilities, then look each one up in the built
 * stylesheet.
 *
 * Three details that matter for accuracy:
 *
 * 1. Comments are stripped first. Without that, an apostrophe in prose
 *    ("the spec's own") opens a phantom string literal and the surrounding
 *    English is scanned as if it were class names.
 * 2. A token must contain a hyphen, or be in SINGLE_WORD below. This is what
 *    stops prop literals such as `variant?: 'text' | 'rect'` from being
 *    reported as a missing `text` class.
 * 3. Arbitrary-value utilities (`transition-[a,b,c]`) are emitted with escaped
 *    brackets and commas, and the escaping does not survive a naive compare.
 *    Those are matched against a bracket/comma/backslash-stripped copy of the
 *    stylesheet.
 *
 * Usage:
 *   node scripts/audit-dead-classes.js <built.css> <file...>
 * Exits non-zero when any candidate has no rule, so it can gate CI.
 */
const fs = require('fs');

const [cssPath, ...sources] = process.argv.slice(2);
if (!cssPath || !sources.length) {
  console.error('usage: node scripts/audit-dead-classes.js <built.css> <file...>');
  process.exit(2);
}

const raw = fs.readFileSync(cssPath, 'utf8');
// Tailwind escapes `:` `.` `/` `[` `]` `(` `)` `#` `%` `!` in selectors with a
// leading backslash, but it writes a comma inside an arbitrary value as the CSS
// hex escape `\2c ` (note the trailing space), not as `\,`. Both forms have to
// be undone or an arbitrary-value class like
// `transition-[a,b]` looks like it was never emitted.
const css = raw
  .replace(/\\2c\s/gi, ',')
  .replace(/\\/g, '');
// For arbitrary-value utilities the escaping is inconsistent, so a second
// normalised copy is used as a fallback comparison.
const cssNormalised = raw.replace(/[\\[\],]/g, '');

/**
 * Tailwind utility prefixes this project uses. A token must start with one of
 * these, which is the main guard against prose leaking in as false positives.
 */
const PREFIXES = [
  'bg', 'text', 'border', 'rounded', 'shadow', 'ring', 'outline', 'divide',
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr',
  'gap', 'space', 'w', 'h', 'size', 'min', 'max', 'aspect', 'inset', 'top', 'right',
  'bottom', 'left', 'z', 'order', 'col', 'row', 'grid', 'flex', 'inline', 'block',
  'hidden', 'relative', 'absolute', 'fixed', 'sticky', 'static', 'overflow', 'object',
  'font', 'tracking', 'leading', 'uppercase', 'lowercase', 'capitalize', 'truncate',
  'whitespace', 'break', 'list', 'items', 'justify', 'content', 'self', 'place',
  'transition', 'duration', 'ease', 'delay', 'animate', 'transform', 'scale', 'rotate',
  'translate', 'skew', 'origin', 'opacity', 'cursor', 'pointer-events', 'select', 'touch',
  'resize', 'appearance', 'caret', 'accent', 'fill', 'stroke', 'backdrop', 'blur',
  'brightness', 'contrast', 'grayscale', 'invert', 'saturate', 'sepia', 'drop',
  'sr', 'not', 'first', 'last', 'odd', 'even', 'hover', 'focus', 'active', 'visited',
  'disabled', 'checked', 'required', 'invalid', 'group', 'peer', 'motion', 'print',
];

/** Valid utilities that are a single word, so have no hyphen to key off. */
const SINGLE_WORD = new Set([
  'truncate', 'underline', 'italic', 'uppercase', 'lowercase', 'capitalize',
  'antialiased', 'block', 'inline', 'flex', 'grid', 'hidden', 'contents', 'table',
  'relative', 'absolute', 'fixed', 'sticky', 'static', 'isolate', 'invisible',
  'visible', 'transform', 'resize', 'container', 'border', 'shadow', 'ring',
  'outline', 'transition', 'filter', 'backdrop', 'divide', 'space', 'gap',
  'order', 'place', 'overflow', 'object', 'font', 'list', 'items', 'justify',
  'content', 'self', 'opacity', 'cursor', 'select', 'touch', 'appearance',
  'caret', 'accent', 'fill', 'stroke', 'blur', 'drop', 'origin', 'scale',
  'rotate', 'translate', 'skew', 'inset', 'aspect', 'size',
]);

/** State markers and own classes that legitimately emit no utility rule. */
const IGNORE = new Set(['group', 'peer', 'sr-only', 'suki-skeleton']);

function stripComments(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

function baseToken(token) {
  return token.includes(':') ? token.split(':').pop() : token;
}

function isUtility(token) {
  if (token.length < 3) return false;
  if (token.includes('(') || token.includes(')')) return false;
  if (token.startsWith('--')) return false;
  const base = baseToken(token);
  if (!base) return false;
  // Needs a hyphen to look like a utility, unless it is a known single word.
  if (!base.includes('-') && !SINGLE_WORD.has(base)) return false;
  return PREFIXES.includes(base.split('-')[0]);
}

const candidates = new Set();
for (const file of sources) {
  const text = stripComments(fs.readFileSync(file, 'utf8'));
  const strings = text.match(/'[^'\n]*'|"[^"\n]*"|`[^`\n]*`/g) || [];
  for (const rawStr of strings) {
    for (const token of rawStr.slice(1, -1).split(/\s+/)) {
      if (token && isUtility(token)) candidates.add(baseToken(token));
    }
  }
}

const missing = [];
for (const token of [...candidates].sort()) {
  if (IGNORE.has(token)) continue;
  const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?<![\\w-])${escaped}(?![\\w-])`);
  if (re.test(css)) continue;
  // Arbitrary-value fallback: compare with brackets and commas stripped.
  if (cssNormalised.includes(token.replace(/[\\[\],]/g, ''))) continue;
  missing.push(token);
}

console.log(`scanned ${candidates.size} candidate utilities from ${sources.length} file(s)`);
if (!missing.length) {
  console.log('OK: every candidate resolves to a rule in the built CSS');
  process.exit(0);
}
console.log(`\nDEAD CLASSES (${missing.length}) — no rule in the built CSS:`);
for (const token of missing) console.log(`  ${token}`);
process.exit(1);
