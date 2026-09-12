import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ browserHealth: string[] }>({
  browserHealth: async ({ page }, use, testInfo) => {
    const failures: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') failures.push(`console:${message.text().slice(0, 240)}`);
    });
    page.on('pageerror', (error) => failures.push(`page:${error.message.slice(0, 240)}`));
    page.on('requestfailed', (request) => {
      const url = new URL(request.url());
      failures.push(`network:${request.method()} ${url.pathname} ${request.failure()?.errorText || 'failed'}`);
    });
    await use(failures);
    if (failures.length) await testInfo.attach('browser-health', { body: failures.join('\n'), contentType: 'text/plain' });
  },
});

export { expect };
