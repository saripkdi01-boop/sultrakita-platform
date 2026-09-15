const fs = require('fs');
const checks = [
  ['vanilla html dark selector', ['public/index.html', "html[data-theme='dark']"]],
  ['vanilla drawer foreground', ['public/index.html', '#sidebarDrawer .drawer-link']],
  ['next sidebar guard', ['next-app/app/globals.css', 'Final sidebar contrast guard']],
  ['next dark menu item', ['next-app/app/globals.css', "html[data-theme='dark'] .mobile-drawer .menu-item"]],
];
for (const [name, [file, needle]] of checks) {
  const ok = fs.readFileSync(file, 'utf8').includes(needle);
  if (!ok) throw new Error(`FAIL ${name}`);
  console.log(`PASS ${name}`);
}
