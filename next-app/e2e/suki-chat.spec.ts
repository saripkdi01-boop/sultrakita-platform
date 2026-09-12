import { test, expect } from './fixtures';

const chatPath = '/chat';

test.describe('SUKI Chat Full Upgrade', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(chatPath, { waitUntil: 'domcontentloaded' });
    await expect(page.getByLabel('SUKI Chat')).toBeVisible();
  });

  test('renders the chat shell, contact list, and initial conversation', async ({ page, browserHealth }, testInfo) => {
    if (testInfo.project.name === 'chromium') {
      await expect(page.getByLabel('Daftar kontak')).toBeVisible();
      await expect(page.getByRole('button', { name: /Wa Ode Rahma/ })).toBeVisible();
    }
    await expect(page.getByText('Halo! Listing kopra Tolaki yang kamu simpan masih tersedia.')).toBeVisible();
    await expect(page.getByText('Percakapan aman')).toBeVisible();
    expect(browserHealth, browserHealth.join('\n')).toEqual([]);
  });

  test('opens command palette with Ctrl/Cmd+K and supports contact search', async ({ page }, testInfo) => {
    await page.keyboard.press('ControlOrMeta+k');
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(palette).toBeVisible();
    await expect(palette.getByText('Cari kontak')).toBeVisible();
    if (testInfo.project.name === 'mobile-chrome') return;
    await palette.getByPlaceholder('Apa yang ingin kamu lakukan?').fill('tema');
    await expect(palette.getByText('Ganti tema')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(palette).toBeHidden();

    const search = page.getByLabel('Cari percakapan');
    await search.fill('Rina');
    await expect(page.getByRole('button', { name: /Rina Mardiana/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Wa Ode Rahma/ })).toBeHidden();
  });

  test('sends an optimistic message and reaches read acknowledgement', async ({ page }) => {
    const composer = page.getByLabel('Tulis pesan');
    const message = `E2E message ${Date.now()}`;
    await composer.fill(message);
    await composer.press('Enter');
    await expect(page.getByText(message, { exact: true })).toBeVisible();
    await expect(page.getByLabel('Mengirim')).toBeVisible();
    await expect.poll(async () => page.getByLabel('Dibaca').count(), { timeout: 3_500 }).toBeGreaterThan(0);
  });

  test('shows typing indicator while composing and supports quick emoji', async ({ page }) => {
    const composer = page.getByLabel('Tulis pesan');
    await composer.fill('Sedang menyusun pesan');
    await expect(page.getByText('Wa Ode sedang mengetik')).toBeVisible();
    await page.getByRole('button', { name: 'Tambahkan emoji' }).click();
    await expect(composer).toHaveValue('Sedang menyusun pesan 😊');
  });

  test('opens the message context menu and toggles a reaction', async ({ page }) => {
    const message = page.getByText('Halo! Listing kopra Tolaki yang kamu simpan masih tersedia.', { exact: true });
    await message.click({ button: 'right' });
    await expect(page.getByRole('menu')).toBeVisible();
    await expect(page.getByRole('menuitem', { name: 'Balas' })).toBeVisible();
    await page.getByRole('menuitem', { name: 'Reaksi' }).click();
    await expect(page.locator('.suki-reaction')).toContainText('❤️');
  });

  test('switches theme and opens a new chat dialog', async ({ page }, testInfo) => {
    await page.locator('.suki-chat-head-actions button[aria-label="Tema"]').click();
    await expect(page.locator('.suki-chat-page')).toHaveClass(/suki-chat-dark/);
    await page.locator('.suki-chat-head-actions button[aria-label="Tema"]').click();
    await expect(page.locator('.suki-chat-page')).not.toHaveClass(/suki-chat-dark/);
    if (testInfo.project.name === 'mobile-chrome') return;

    await page.getByRole('button', { name: 'Chat baru' }).click();
    const dialog = page.getByRole('dialog', { name: 'Chat baru' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /La Ode Fikri/ }).click();
    await expect(page.locator('.suki-chat-conversation-person').getByText('La Ode Fikri', { exact: true })).toBeVisible();
  });

  test('keeps the composer reachable on a mobile viewport', async ({ page, browserHealth }) => {
    await expect(page.getByLabel('Tulis pesan')).toBeVisible();
    await expect(page.getByLabel('Kirim pesan')).toBeVisible();
    await expect(page.getByText('Halo! Listing kopra Tolaki yang kamu simpan masih tersedia.')).toBeVisible();
    expect(browserHealth, browserHealth.join('\n')).toEqual([]);
  });
});
