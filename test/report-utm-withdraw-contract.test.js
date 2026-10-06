'use strict';

// Kontrak alur Laporkan (report), tarik-lamaran (withdraw), dan atribusi UTM.
// Gaya: analisis statis sumber (seperti test lain di repo ini) — tanpa DB,
// tanpa kredensial, tanpa browser.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

// ---------------------------------------------------------------------------
// A. Alur Laporkan (regresi PR #33)
// ---------------------------------------------------------------------------

test('A1: lib/actions/reports.ts "use server" dan HANYA mengekspor fungsi async', () => {
  const src = read('next-app/lib/actions/reports.ts');
  assert.match(src, /^'use server';/m);
  // Tidak boleh ada export const/object/function non-async (aturan Next.js).
  assert.doesNotMatch(src, /^export (const|let|var|type|interface|enum|class|abstract)/m);
  assert.doesNotMatch(src, /^export function (?!async)/m);
  for (const name of ['reportPost', 'reportListing', 'reportProperty']) {
    assert.match(src, new RegExp(`export async function ${name}\\(`), `${name} harus ada`);
  }
});

test('A2: lib/report-reasons.ts modul biasa (tanpa use server) dan konsisten', () => {
  const src = read('next-app/lib/report-reasons.ts');
  // Direktif 'use server' sebagai statement baris sendiri tidak boleh ada
  // (frasa di komentar dokumentasi dikecualikan).
  assert.doesNotMatch(src, /^'use server';?\s*$/m);
  assert.match(src, /export const REPORT_REASONS/);
  assert.match(src, /export const REPORT_REASON_LABELS/);
  assert.match(src, /export function isValidReportReason/);
  // Setiap reason punya label.
  const reasons = [...src.matchAll(/'([a-z_]+)',/g)].map((m) => m[1]);
  assert.ok(reasons.length >= 5, 'minimal 5 alasan');
  for (const r of reasons) {
    assert.match(src, new RegExp(`${r}:\\s*'[^']+'`), `label untuk ${r}`);
  }
});

test('A3: ReportButton memakai label dari modul biasa, bukan dari server action', () => {
  const src = read('next-app/components/moderation/ReportButton.tsx');
  assert.match(src, /from '@\/lib\/report-reasons'/);
  assert.doesNotMatch(src, /lib\/actions\/reports/);
  assert.match(src, /role="menu"/);
  assert.match(src, /aria-expanded/);
});

test('A4: server action laporan validasi input dan tidak pernah melempar', () => {
  const src = read('next-app/lib/actions/reports.ts');
  assert.match(src, /isValidReportReason\(reason\)/);
  assert.match(src, /ID_RE\.test\(/);
  // Semua jalur mengembalikan { ok }, tidak ada throw keluar.
  assert.doesNotMatch(src, /^\s*throw /m);
});

test('A5: RLS marketplace_reports mengizinkan reporter menulis laporannya', () => {
  const mig = read('supabase/migrations/20260905230000_marketplace_next_generation.sql');
  assert.match(mig, /reports_own_manage[\s\S]{0,200}for all to authenticated/);
});

// ---------------------------------------------------------------------------
// B. Tarik lamaran (withdraw)
// ---------------------------------------------------------------------------

test('B1: migrasi policy UPDATE withdraw ada dan restriktif', () => {
  const mig = read('supabase/migrations/20261002203000_job_application_withdraw.sql');
  assert.match(mig, /create policy applications_own_withdraw on public\.job_applications/);
  assert.match(mig, /for update to authenticated/);
  assert.match(mig, /auth\.uid\(\) = applicant_id/);
  assert.match(mig, /status = 'withdrawn'/);
  // Hanya status aktif yang bisa ditarik.
  assert.match(mig, /'submitted', 'viewed', 'screening', 'interview'/);
});

test('B2: withdrawApplication validasi kepemilikan + status sebelum update', () => {
  const src = read('next-app/lib/actions/jobs.ts');
  assert.match(src, /export async function withdrawApplication\(/);
  assert.match(src, /eq\('applicant_id', user\.id\)/);
  assert.match(src, /update\(\{ status: 'withdrawn' \}\)/);
  assert.match(src, /revalidatePath\('\/jobs\/applications'\)/);
});

test('B3: UI /jobs/applications punya tombol Tarik lamaran untuk status aktif', () => {
  const src = read('next-app/app/jobs/applications/applications-client.tsx');
  // i18n (PR #81): literal pindah ke dict-propertijobs (kunci pjWithdraw).
  const dict = read('next-app/lib/i18n/dict-propertijobs.ts');
  assert.match(src, /p\('pjWithdraw'\)/);
  assert.match(dict, /pjWithdraw: 'Tarik lamaran'/);
  assert.match(src, /withdrawApplication\(/);
  assert.match(src, /window\.confirm/);
});

// ---------------------------------------------------------------------------
// C. Wiring UTM signup
// ---------------------------------------------------------------------------

test('C1: lib/utm.ts menangkap first-touch dari URL ke cookie', () => {
  const src = read('next-app/lib/utm.ts');
  assert.match(src, /export function captureUtmFromUrl/);
  assert.match(src, /export function readUtmFromCookie/);
  assert.match(src, /export const UTM_COOKIE = 'sk_utm'/);
  assert.doesNotMatch(src, /'use server'/);
});

test('C2: UtmCapture dipasang di root layout', () => {
  const layout = read('next-app/app/layout.tsx');
  assert.match(layout, /<UtmCapture/);
  const comp = read('next-app/components/analytics/UtmCapture.tsx');
  assert.match(comp, /captureUtmFromUrl/);
  assert.match(comp, /'use client'/);
});

test('C3: signup email menyertakan UTM ke user_metadata', () => {
  const src = read('next-app/components/auth/AuthGate.tsx');
  assert.match(src, /readUtmFromCookie/);
  assert.match(src, /utm_source: utm\.utm_source/);
  assert.match(src, /supabase\.auth\.signUp/);
});

test('C4: auth callback menulis UTM OAuth ke profiles (first-touch)', () => {
  const src = read('next-app/app/auth/callback/route.ts');
  assert.match(src, /parseUtmCookieServer/);
  assert.match(src, /from\('profiles'\)\.update\(/);
  assert.match(src, /is\('utm_source', null\)/);
});

test('C5: migrasi trigger UTM menyiapkan salinan metadata → profiles', () => {
  const mig = read('supabase/migrations/20261002203100_profiles_utm_trigger.sql');
  assert.match(mig, /handle_new_auth_profile/);
  assert.match(mig, /raw_user_meta_data->>'utm_source'/);
  assert.match(mig, /coalesce\(profiles\.utm_source, excluded\.utm_source\)/);
});
