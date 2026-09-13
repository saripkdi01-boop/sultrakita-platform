import { test, expect } from './fixtures';

const chatPath = '/chat';

test.describe('SUKI Chat live auth boundary', () => {
  test('requires an authenticated session before opening live chat', async ({ page, browserHealth }, testInfo) => {
    await page.goto(chatPath, { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/login\?redirect=%2Fchat|\/login$/);
    expect(browserHealth, browserHealth.join('\n')).toEqual([]);
    testInfo.annotations.push({ type: 'note', description: 'Authenticated chat scenarios require a Supabase storage state in the deployment environment.' });
  });
});
