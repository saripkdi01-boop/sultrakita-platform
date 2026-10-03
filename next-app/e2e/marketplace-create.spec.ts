/**
 * E2E: /marketplace/create — form Jual totalitas.
 *
 * - Gate login untuk tamu (termasuk dark mode & mobile 360px).
 * - Form terautentikasi diuji dengan stub /auth/v1/user (tanpa kredensial asli):
 *   validasi inline, format harga, draft autosave, penolakan file bukan gambar,
 *   alur unggah foto (gagal jujur tanpa sesi server), reorder/hapus foto,
 *   dan penanganan 401 yang jujur saat submit.
 * - Batas uji yang jujur: publish end-to-end butuh sesi login asli —
 *   tidak diklaim di sini.
 */
import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import path from 'node:path';

const FIXTURES = path.join(__dirname, 'fixtures');
const photo1 = path.join(FIXTURES, 'photo1.png');
const photo2 = path.join(FIXTURES, 'photo2.png');
const notImage = path.join(FIXTURES, 'bukan-gambar.txt');

const FAKE_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'penguji@example.com',
  user_metadata: { full_name: 'Penguji' },
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
};

/** Kumpulkan error JS yang nyata; abaikan kegagalan jaringan lingkungan
 *  sandbox (resource eksternal, WebSocket realtime ke host dummy) —
 *  bukan bug aplikasi. */
function collectRealErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const text = m.text();
    if (/^Failed to load resource/.test(text)) return;
    if (/WebSocket connection to/.test(text)) return;
    errors.push(text);
  });
  return errors;
}

async function noHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe('/marketplace/create — gate tamu', () => {
  test('kartu ajakan login tampil, tautan benar, tanpa stub lama @mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'khusus viewport mobile');
    const errors = collectRealErrors(page);
    await page.goto('/marketplace/create', { waitUntil: 'networkidle' });

    await expect(page.getByRole('heading', { name: 'Masuk dulu untuk mulai menjual' })).toBeVisible();
    const link = page.getByRole('region', { name: 'Perlu masuk' }).getByRole('link', { name: /Masuk \/ Daftar/ });
    await expect(link).toHaveAttribute('href', '/login?redirect=%2Fmarketplace%2Fcreate');
    await expect(page.getByText('Form listing sedang disiapkan')).toHaveCount(0);

    await noHorizontalOverflow(page);
    expect(errors).toEqual([]);
    await page.screenshot({ path: testInfo.outputPath('gate-light.png') });
  });

  test('dark mode rapi @mobile', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chrome', 'khusus viewport mobile');
    await page.addInitScript(() => {
      localStorage.setItem('sultrakita-theme', 'dark');
    });
    await page.goto('/marketplace/create', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Masuk dulu untuk mulai menjual' })).toBeVisible();
    await noHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('gate-dark.png'), fullPage: true });
  });
});

test.describe('/marketplace/create — form terautentikasi (stub)', () => {
  test.beforeEach(async ({ page, context }) => {
    // @supabase/ssr menyimpan sesi di cookie; gotrue-js hanya memanggil
    // /auth/v1/user bila ada access_token — jadi tanam sesi palsu dulu.
    await context.addCookies([
      {
        name: 'sb-dummy-auth-token',
        value: JSON.stringify({
          access_token: 'fake-access-token',
          token_type: 'bearer',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          refresh_token: 'fake-refresh-token',
          user: FAKE_USER,
        }),
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.route('**/auth/v1/user**', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(FAKE_USER) }),
    );
  });

  test('validasi inline + draft autosave + foto + 401 jujur @chromium', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'cukup sekali di desktop');
    const errors = collectRealErrors(page);
    await page.goto('/marketplace/create', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Jual barang & jasa lokal' })).toBeVisible();

    // 1. Submit kosong -> error inline Bahasa Indonesia
    await page.getByRole('button', { name: /Terbitkan listing/ }).click();
    await expect(page.getByText('Judul minimal 10 karakter')).toBeVisible();
    await expect(page.getByText('Pilih kategori yang tersedia.')).toBeVisible();
    await expect(page.getByText('Pilih kondisi barang.')).toBeVisible();
    await expect(page.getByText('Harga harus berupa angka.')).toBeVisible();
    await expect(page.getByText('Deskripsi minimal 20 karakter')).toBeVisible();
    await expect(page.getByText('Pilih kota/kabupaten di Sulawesi Tenggara.')).toBeVisible();

    // 2. Isi valid
    await page.getByLabel(/Judul/).fill('Sepeda lipat Polygon Urbano 20 inci');
    await page.getByLabel(/Kategori/).selectOption('Olahraga');
    await page.getByRole('radio', { name: 'Bekas — kondisi baik' }).click();
    await page.getByLabel(/Harga \(Rp\)/).fill('1500000');
    await expect(page.getByLabel(/Harga \(Rp\)/)).toHaveValue('1.500.000');
    await expect(page.getByText('Rp 1.500.000').first()).toBeVisible();
    await page.getByLabel(/Deskripsi/).fill('Sepeda lipat bekas pemakaian wajar, rem dan gigi normal, bonus tas.');
    await page.getByLabel(/Kota \/ Kabupaten/).selectOption('Kendari');
    await page.getByLabel(/WhatsApp/).fill('081234567890');

    // 3. Draft tersimpan otomatis di perangkat
    await page.waitForTimeout(1600);
    const draft = await page.evaluate(() => localStorage.getItem('sk_marketplace_draft_v1'));
    expect(draft).toBeTruthy();
    expect(JSON.parse(draft as string).title).toContain('Sepeda lipat');
    await expect(page.getByText(/Draft tersimpan otomatis/)).toBeVisible();

    // 4. File bukan gambar ditolak dengan jujur
    const fileInput = page.locator('input[type="file"].fbmc-hidden-input');
    await fileInput.setInputFiles(notImage);
    await expect(page.getByText(/bukan gambar/)).toBeVisible();

    // 5. Dua foto valid -> unggah -> gagal jujur (server tak punya sesi)
    await fileInput.setInputFiles([photo1, photo2]);
    await expect(page.getByRole('button', { name: 'Ulangi' }).first()).toBeVisible({ timeout: 25000 });

    // 6. Reorder: geser foto pertama ke kanan
    await expect(page.getByRole('button', { name: 'Hapus foto 1' })).toBeVisible();
    await page.getByRole('button', { name: 'Geser foto 1 ke kanan' }).click();
    await expect(page.getByRole('button', { name: 'Hapus foto 2' })).toBeVisible();

    // 7. Hapus semua foto
    await page.getByRole('button', { name: /Hapus foto/ }).first().click();
    await page.getByRole('button', { name: /Hapus foto/ }).first().click();
    await expect(page.getByRole('button', { name: /Hapus foto/ })).toHaveCount(0);

    // 8. Submit -> server 401 (stub hanya di client) -> gate + pesan jujur
    // Jeda singkat: pastikan React selesai commit state pasca-hapus foto.
    await page.waitForTimeout(1200);
    await page.getByRole('button', { name: /Terbitkan listing/ }).click();
    await expect(page.getByText('Sesi Anda berakhir.')).toBeVisible({ timeout: 25000 });
    await expect(page.getByRole('heading', { name: 'Masuk dulu untuk mulai menjual' })).toBeVisible();

    expect(errors).toEqual([]);
    await noHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('form-filled.png'), fullPage: true });
  });

  test('dark mode form @chromium', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'cukup sekali di desktop');
    await page.addInitScript(() => {
      localStorage.setItem('sultrakita-theme', 'dark');
    });
    await page.goto('/marketplace/create', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Jual barang & jasa lokal' })).toBeVisible();
    await noHorizontalOverflow(page);
    await page.screenshot({ path: testInfo.outputPath('form-dark.png'), fullPage: true });
  });
});
