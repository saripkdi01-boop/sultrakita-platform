#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const checks = [
  ['server.js', ['node', '--check', 'server.js']],
  ['scripts/api-smoke.js', ['node', '--check', 'scripts/api-smoke.js']],
  ['scripts/security-regression.js', ['node', '--check', 'scripts/security-regression.js']],
  ['scripts/modernization-check.js', ['node', '--check', 'scripts/modernization-check.js']]
];

for (const [label, command] of checks) {
  if (!fs.existsSync(label)) throw new Error(`missing source file: ${label}`);
  const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`syntax check failed: ${label}`);
}

const sourceRoots = ['server.js', 'auth.js', 'seo.js', 'public', 'shared', 'scripts'];
const files = [];
for (const root of sourceRoots) {
  if (fs.statSync(root).isFile()) files.push(root);
  else for (const entry of fs.readdirSync(root, { withFileTypes: true })) if (entry.isFile() && entry.name.endsWith('.js')) files.push(`${root}/${entry.name}`);
}
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  if (/catch\s*\{\s*\}/.test(source)) throw new Error(`empty catch block found: ${file}`);
}

console.log('PASS: syntax checks and no-empty-catch rule');
