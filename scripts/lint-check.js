#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');

const checks = [
  ['server.js', ['node', '--check', 'server.js']],
  ['worker.js', ['bash', '-lc', 'node --input-type=module --check < worker.js']],
  ['scripts/api-smoke.js', ['node', '--check', 'scripts/api-smoke.js']],
  ['scripts/security-regression.js', ['node', '--check', 'scripts/security-regression.js']]
];

for (const [label, command] of checks) {
  if (!fs.existsSync(label)) throw new Error(`missing source file: ${label}`);
  const result = spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`syntax check failed: ${label}`);
}

console.log('PASS: dependency-free JavaScript syntax checks');
