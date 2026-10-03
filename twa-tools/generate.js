/**
 * Generator proyek Android TWA SUKI Apps.
 *
 * Dijalankan di GitHub Actions (lihat .github/workflows/build-apk.yml):
 *  1. Mengambil web manifest LIVE dari sukiapps.web.id
 *  2. Membangun twa-manifest.json (package id.web.sukiapps)
 *  3. Men-generate proyek Android lengkap (ikon launcher, splash, shortcuts)
 *     ke direktori twa/ via API Bubblewrap (non-interaktif)
 *
 * Pemakaian lokal:
 *   cd twa-tools && npm install && node generate.js
 */
'use strict';

const path = require('path');
const fs = require('fs');

const REPO_ROOT = path.join(__dirname, '..');
const TWA_DIR = path.join(REPO_ROOT, 'twa');
const MANIFEST_FILE = path.join(TWA_DIR, 'twa-manifest.json');

const WEB_MANIFEST_URL = process.env.SUKI_WEB_MANIFEST_URL || 'https://sukiapps.web.id/manifest.webmanifest';
const PACKAGE_ID = process.env.SUKI_PACKAGE_ID || 'id.web.sukiapps';
const APP_VERSION_NAME = process.env.SUKI_APP_VERSION || '1.0.0';

async function main() {
  const core = require('@bubblewrap/core');
  const { updateProject } = require('@bubblewrap/cli/dist/lib/cmds/shared.js');

  console.log('Mengambil web manifest:', WEB_MANIFEST_URL);
  const twaManifest = await core.TwaManifest.fromWebManifest(WEB_MANIFEST_URL);

  // Override khusus SUKI Apps
  twaManifest.packageId = PACKAGE_ID;
  twaManifest.name = 'SUKI Apps';
  twaManifest.launcherName = 'SUKI';
  twaManifest.appVersionName = APP_VERSION_NAME;
  twaManifest.appVersionCode = 1;
  twaManifest.enableNotifications = false; // web push belum diimplementasi
  // signingKey diisi dummy — signing APK dilakukan manual via apksigner di CI
  twaManifest.signingKey = { path: './suki-release.keystore', alias: 'suki' };

  const err = twaManifest.validate();
  if (err) throw new Error('twa-manifest tidak valid: ' + err);

  fs.mkdirSync(TWA_DIR, { recursive: true });
  await twaManifest.saveToFile(MANIFEST_FILE);
  console.log('twa-manifest.json ditulis:', MANIFEST_FILE);

  const dummyPrompt = { printMessage: (...args) => console.log('[bubblewrap]', ...args) };
  const ok = await updateProject(true, null, dummyPrompt, TWA_DIR, MANIFEST_FILE);
  if (!ok) throw new Error('generate proyek Android gagal');
  console.log('Proyek Android TWA selesai di-generate di:', TWA_DIR);
}

main().catch((e) => {
  console.error('GAGAL:', e.message);
  process.exit(1);
});
