import { test, expect } from '@playwright/test';

test.describe('SUKI Apps UI/UX baseline — homepage baru', () => {
  test('hero menjelaskan manfaat dan CTA Mulai Gratis menuju pendaftaran', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /Satu pintu untuk semua urusan digital/i })).toBeVisible();
    const cta = page.locator('.hm-hero').getByRole('link', { name: /Mulai Gratis/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', '/signup');
    await expect(cta).toHaveAttribute('data-track', 'cta_mulai_gratis');
    const box = await cta.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
  });

  test('enam pintu klikabel dan berlabel event door_click', async ({ page }) => {
    await page.goto('/');
    const doors = page.locator('#pintu .hm-door');
    await expect(doors).toHaveCount(6);
    for (const href of ['/marketplace', '/properti', '/jobs', '/groups', '/Business', '/kendari']) {
      await expect(page.locator(`#pintu a.hm-door[href="${href}"]`)).toHaveAttribute('data-track', 'door_click');
    }
  });

  test('cerita harga: satu harga, dua mata uang', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('#hm-price-panel');
    await expect(panel).toContainText('Rp 2,5 jt');
    await page.getByRole('tab', { name: /Dolar/i }).click();
    await expect(page.getByRole('tab', { name: /Dolar/i })).toHaveAttribute('aria-selected', 'true');
    await expect(panel).toContainText('$149');
    await expect(panel).toContainText('$299');
    await expect(panel).toContainText('$499');
  });

  test('menu mobile membuka enam pintu dan CTA tetap terjangkau', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const menu = page.locator('.hm-menu-btn');
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    const navigation = page.locator('#hm-nav');
    await expect(navigation.getByRole('link', { name: 'Marketplace' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: /Mulai Gratis/i })).toBeVisible();
  });
});
