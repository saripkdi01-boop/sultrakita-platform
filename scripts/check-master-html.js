'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync('public/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>\s*(\/\* ============ KONFIG INTEGRASI[\s\S]*?)<\/script>/gi)];
if (scripts.length !== 1) throw new Error(`expected one inline master script, found ${scripts.length}`);
new vm.Script(scripts[0][1], { filename: 'public/index.html:inline-script' });
for (const marker of ['view-home', 'view-market', 'view-groups', 'darkBtn', 'mobileNav', 'postModal', 'sellModal', 'prodModal', 'storyModal']) {
  if (!html.includes(`id="${marker}"`)) throw new Error(`master marker missing: ${marker}`);
}
console.log('PASS: master HTML inline script and interactive markers verified');
