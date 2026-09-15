import { test, expect, type Page } from '@playwright/test';

type Theme = 'light' | 'dark';

const routes = [
  { name: 'home', path: '/' },
  { name: 'marketplace', path: '/marketplace' },
  { name: 'property', path: '/properti' },
  { name: 'jobs', path: '/jobs' },
  { name: 'chat', path: '/chat' },
];

async function setTheme(page: Page, theme: Theme) {
  await page.addInitScript(({ theme }) => {
    localStorage.setItem('sultrakita-theme', theme);
    localStorage.setItem('sultra-dark', String(theme === 'dark'));
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, { theme });
}

async function assertThemeContract(page: Page, theme: Theme) {
  const state = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const bodyStyle = getComputedStyle(body);
    const probe = document.querySelector('main, [role="main"], .platform-shell') || body;
    const probeStyle = getComputedStyle(probe);
    return {
      dataTheme: root.dataset.theme,
      hasDarkBridge: root.classList.contains('dark') || body.classList.contains('dark'),
      colorScheme: root.style.colorScheme || getComputedStyle(root).colorScheme,
      bodyColor: bodyStyle.color,
      bodyBackground: bodyStyle.backgroundColor,
      probeColor: probeStyle.color,
      probeBackground: probeStyle.backgroundColor,
    };
  });

  expect(state.dataTheme).toBe(theme);
  expect(state.colorScheme).toBe(theme);
  if (theme === 'dark') expect(state.hasDarkBridge).toBeTruthy();
  expect(state.bodyColor).not.toBe(state.bodyBackground);
  expect(state.probeColor).not.toBe(state.probeBackground);
}

for (const route of routes) {
  for (const theme of ['light', 'dark'] as const) {
    test(`${route.name} stays visually synchronized in ${theme} mode`, async ({ page }) => {
      await setTheme(page, theme);
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      await page.evaluate(() => document.fonts?.ready);
      await assertThemeContract(page, theme);
      await expect(page).toHaveScreenshot(`${route.name}-${theme}.png`, {
        fullPage: true,
        animations: 'disabled',
        caret: 'hide',
        scale: 'css',
        maxDiffPixelRatio: 0.01,
      });
    });
  }
}

test('dark mode keeps the palette in the navy family', async ({ page }) => {
  await setTheme(page, 'dark');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const palette = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return ['--theme-bg', '--theme-surface', '--theme-surface-muted', '--theme-text', '--theme-primary']
      .map(name => root.getPropertyValue(name).trim());
  });
  expect(palette.every(value => value.length > 0)).toBeTruthy();
  expect(palette).not.toContain('#14251f');
  expect(palette).not.toContain('#1d5144');
});
