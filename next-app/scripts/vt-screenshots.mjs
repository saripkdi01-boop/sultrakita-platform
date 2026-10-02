/**
 * Screenshot before/after untuk QC Visual Transformation V1.0.
 * Pakai: node scripts/vt-screenshots.mjs <baseUrl> <outDir> <tag>
 * Contoh: node scripts/vt-screenshots.mjs http://localhost:3000 /tmp/vt-shots before
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs';

const routes = [
  { name: 'home', path: '/' },
  { name: 'marketplace', path: '/marketplace' },
  { name: 'properti', path: '/properti' },
  { name: 'jobs', path: '/jobs' },
  { name: 'groups', path: '/groups' },
  { name: 'business', path: '/Business' },
  { name: 'login', path: '/login' },
  { name: 'beranda', path: '/beranda' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

async function main() {
  const [baseUrl, outDir, tag] = process.argv.slice(2);
  if (!baseUrl || !outDir || !tag) {
    console.error('Pakai: node scripts/vt-screenshots.mjs <baseUrl> <outDir> <tag>');
    process.exit(1);
  }
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  for (const vp of viewports) {
    for (const r of routes) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
      // Matikan animasi agar screenshot deterministik
      await page.addInitScript(() => {
        document.documentElement.dataset.theme = 'light';
        const s = document.createElement('style');
        s.textContent = '*,*::before,*::after{animation-duration:0.001ms!important;transition-duration:0.001ms!important}';
        document.head.appendChild(s);
      });
      const url = `${baseUrl}${r.path}`;
      try {
        const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(1200);
        const file = `${outDir}/${tag}-${r.name}-${vp.name}.png`;
        await page.screenshot({ path: file, fullPage: false });
        results.push({ route: r.name, viewport: vp.name, status: resp ? resp.status() : 'no-response', file });
        console.log(`OK ${vp.name} ${r.path} -> ${resp && resp.status()} ${file}`);
      } catch (e) {
        results.push({ route: r.name, viewport: vp.name, status: 'ERROR', error: String(e).slice(0, 200) });
        console.log(`GAGAL ${vp.name} ${r.path}: ${String(e).slice(0, 120)}`);
      }
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync(`${outDir}/${tag}-manifest.json`, JSON.stringify(results, null, 2));
  console.log(`Selesai: ${results.length} screenshot -> ${outDir}`);
}

main();
