import { test, expect } from '@playwright/test';

test.describe('SUKI Apps UI/UX baseline', () => {
  test('landing page exposes the primary journey and keyboard-visible controls', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Temukan yang dekat/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Mulai menjelajah/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Saya punya bisnis/i })).toBeVisible();
    const navigation = page.locator('#suki-primary-navigation');
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 921) {
      await expect(navigation).toBeVisible();
    } else {
      await expect(navigation).toBeAttached();
    }

    const searchTrigger = page.getByRole('button', { name: /Apa yang sedang Anda cari/i });
    await searchTrigger.focus();
    await expect(searchTrigger).toBeFocused();
    await expect(searchTrigger).toHaveCSS('min-height', '44px');
  });

  test('mobile menu exposes its state and keeps CTA reachable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const menu = page.locator('.suki-overhaul-menu');
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    const navigation = page.locator('#suki-primary-navigation');
    await expect(navigation).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Untuk bisnis' })).toBeVisible();
  });
});
