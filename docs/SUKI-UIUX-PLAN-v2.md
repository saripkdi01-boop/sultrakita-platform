# TAHAP 1 — RENCANA FILE-LEVEL
## SUKI Apps UI/UX Overhaul — realisasi spesifikasi Qwen

**Status:** Phase 1 dieksekusi & tervalidasi
**Repo:** `saripkdi01-boop/sultrakita-platform`
**Branch:** `feat/uiux-overhaul-v1` (menumpuk di atas PR #16)
**TARGET:** `next-app/`

---

## 0. KEPUTUSAN STAKEHOLDER (final, sudah diterapkan)

### K1 — Nilai brand: SETUJU `#15803D`
Diterapkan. **Satu token, satu tempat.**

`--suki-rgb-primary` di `suki-foundation.css` §1 sekarang memegang Sultra
Emerald dan menjadi **satu-satunya** definisi warna brand di codebase. Setiap
utility `brand-*`, `sultra-*` dan `suki-*` mengalir dari token itu.

Skala 5 langkah milik spec (50/100/500/600/700) dipertahankan sebagai API
publik karena contoh komponen spec memakainya, tapi dipetakan ke tiga langkah
nyata kontrak:

| Spec | Token kanonik | Light | Dark |
|---|---|---|---|
| `brand-50` | `--suki-rgb-primary-tint` | `240 247 244` | `15 41 32` |
| `brand-100` | `--suki-rgb-primary-soft` | `220 240 227` | `20 58 44` |
| `brand-500` | `--suki-rgb-primary` | `21 128 61` | `74 222 128` |
| `brand-600` | `--suki-rgb-primary-hover` | `22 101 52` | `134 239 172` |
| `brand-700` | `--suki-rgb-primary-active` | `20 83 45` | `187 247 208` |

Dua nama menunjuk satu nilai itu **disengaja**: menjaga kosakata spec tetap
hidup tanpa mengarang warna yang tidak dimiliki kontrak.

**Rollback = satu edit.** Ubah `--suki-rgb-primary` (dan pasangan hover/active/
soft/tint) di §1. Tidak ada tempat kedua yang perlu disentuh.

Ditambahkan: `--suki-rgb-primary-active`, `--suki-rgb-primary-tint`, dan
`--color-brand-active` kini menunjuk step `active` (sebelumnya keliru
menunjuk `hover`).

### K2 — Instrument Serif: SETUJU, pakai `next/font`
Diterapkan. Plus Jakarta Sans (body/UI) + Instrument Serif (display) keduanya
**self-hosted** — tidak ada request render-blocking ke `fonts.googleapis.com`.

**FOUT/layout shift sudah ditangani, dan ini terverifikasi di CSS hasil build:**

```
@font-face{font-family:"Instrument Serif Fallback";src:local("Times New Roman");
  ascent-override:117.94%;descent-override:36.93%;size-adjust:83.94%}
@font-face{font-family:"Plus Jakarta Sans Fallback";src:local("Arial");
  ascent-override:98.88%;descent-override:21.15%;size-adjust:104.98%}
```

Itu bukan fallback nama biasa — `next/font` men-generate face fallback dengan
**metrik yang dikalibrasi** (ascent/descent/size-adjust) sehingga tinggi baris
tidak melompat saat font asli selesai dimuat. Rantai fallback juga menyertakan
Georgia seperti yang Anda minta:

```
--font-display: var(--font-instrument), "Instrument Serif", Georgia, serif
```

### K3 — Permissions-Policy: PILIH (C), commit terpisah
Diterapkan sebagai commit tersendiri dengan pesan yang Anda tentukan:
`chore(security): update permissions-policy to allow self for media and geolocation`

Perubahan: `camera=(), microphone=(), geolocation=()` → `camera=(self),
microphone=(self), geolocation=(self)`. Terisolasi dari design token sehingga
tim keamanan bisa me-review diff-nya tanpa membongkar overhaul UI.

---

## 1. RINGKASAN KEPUTUSAN DESAIN

| Aspek | Keputusan | Alasan |
|---|---|---|
| Brand | `#15803D` di `--suki-rgb-primary`, **satu token** | Rollback = satu edit (K1) |
| Token spec lain | Namespace `--qwen-*` | Nama `--color-*` spec bentrok nilai hidup |
| Dark mode | **Wajib**, tiap token punya pasangan dark | Dark mode sudah live (204 hook `data-theme`) |
| Tipografi sans | Plus Jakarta Sans via `next/font` | Sudah efektif dipakai |
| Tipografi serif | Instrument Serif (fallback Georgia) | Satu-satunya perubahan tipografi terlihat |
| Radius | `qwen-sm/md/lg/full` (6/12/20/9999) | Tidak menimpa `rounded-*` inti Tailwind |
| Shadow | `tint-sm/md/md-hover/lg` | Tidak menimpa `shadow-*` inti |
| `DM Sans` | Dihapus dari stack | Dideklarasikan tapi tidak pernah dimuat — deklarasi mati |
| `cn()` | `next-app/lib/utils.ts` | Diizinkan spec (`cn.ts` sebagai pengecualian `lib/`) |

**Prinsip:** spec = sumber niat desain, bukan perintah literal. Di mana spec
bertabrakan dengan arsitektur hidup, arsitektur menang dan konflik dilaporkan.

---

## 2. FILE YANG DIUBAH — PHASE 1 (selesai)

| File | Perubahan |
|---|---|
| `next-app/lib/utils.ts` | **BARU** — `cn()` = clsx + tailwind-merge |
| `next-app/app/styles/suki-foundation.css` | §1 brand → Sultra Emerald; +§12 token spec; +§13 kontrak font |
| `next-app/tailwind.config.ts` | Palet `brand-*`/`accent-*`/`surface-*`/`text-*`/`border-*`, radius/shadow/tracking, font stack |
| `next-app/app/layout.tsx` | `next/font` self-host, kelas font di `<html>` |
| `next-app/package.json` | +`clsx`, +`tailwind-merge` |
| `scripts/audit-dead-classes.js` | **BARU** — deteksi kelas mati (lihat §5) |
| `docs/SUKI-UIUX-PLAN-v2.md` | Dokumen ini |

**Catatan penempatan token:** spec meminta `globals.css`. Token spec diletakkan
di `suki-foundation.css` karena (a) file itu sudah jadi layer fondasi additive
sejak PR #16, (b) `globals.css` sudah 3.216 baris, (c) rollback jadi 1 file.
`globals.css` **tetap** diizinkan spec — ini pilihan penempatan, bukan penolakan.

---

## 3. FILE YANG DIUBAH — PHASE 2–7 (rencana)

### Phase 2 — primitif
**BARU:** `components/ui/button.tsx`, `card.tsx`, `input.tsx`, `badge.tsx`, `avatar.tsx`

> `skeleton.tsx` **tidak** dibuat: `Skeleton` sudah ada di `components/ui/States.tsx`
> (PR #16). Membuat file kedua = dua implementasi untuk satu hal.

### Phase 3 — app shell
`components/layout/`: `AppLayout.tsx`, `Header.tsx`, `SidebarDesktop.tsx`,
`SidebarMobileDrawer.tsx`, `QuickNavBar.tsx`, `TopNavigationBar.tsx`,
`NotificationCenter.tsx`

> Nama file spec (`header.tsx`, `sidebar.tsx`, `bottom-nav.tsx`, `app-shell.tsx`)
> **tidak dipakai** — file hidup memakai PascalCase dan sudah diimpor se-repo.
> Rename = impor rusak. Isi yang diubah, bukan nama.

### Phase 4–6 — halaman (presentasi saja)
`app/page.tsx`, `beranda/`, `marketplace/`, `login/`, `signup/`, `profile/`,
`settings/`, `jobs/`, `properti/`, `groups/`, `chat/`, `dashboard/`

**Aturan keras:** `useEffect`, `fetch`, `useState` data, nama props, bentuk data
**tidak disentuh**. Hanya `className` + struktur JSX.

### Phase 7 — hardening
Responsive, a11y, motion, focus, kontras.

---

## 4. FILE YANG TIDAK DISENTUH

**Dilarang mutlak**
`app/api/**` · `lib/actions/**` · `lib/auth/**` · `lib/supabase/**` ·
`lib/realtime/**` · `middleware.ts` · `types/database.ts` · `supabase/**` ·
`server.js` · `realtime/server.js` · `package.json` root · `.env*`

**Satu-satunya pengecualian, sesuai K3:** satu baris `Permissions-Policy` di
`next-app/next.config.mjs`, di commit terpisah. Security header lain
(CSP, X-Frame-Options, Referrer-Policy, X-Content-Type-Options) **tidak
disentuh**.

**Tidak disentuh karena sudah stabil**
`e2e/**` (baseline snapshot **tidak** diregenerasi) · `test/**` ·
`scripts/test-*.js` · `components/auth/AuthGate.tsx` (di-remap via CSS)

**Dependency:** hanya `clsx` + `tailwind-merge`. ❌ `class-variance-authority`
tidak ditambah (di luar daftar izin) → varian ditulis manual.

---

## 5. RISIKO

| # | Risiko | Mitigasi | Status |
|---|---|---|---|
| R1 | Token `--color-*` spec bentrok nilai hidup | Namespace `--qwen-*` | ✅ ditangani |
| R2 | **Kelas mati**: utility yang key-nya tidak ada dibuang Tailwind **tanpa error apa pun** | `scripts/audit-dead-classes.js` | ✅ ditangani |
| R3 | Dark mode rusak | Pasangan dark per token | ✅ ditangani |
| R4 | Kontrak test di shell | `window.location.href` + `label: 'SUKI Suits'` dipertahankan | ✅ |
| R5 | Build lokal (`sharp` arm64) | Workaround WASM; CI x64 sumber kebenaran | ⚠️ batasan |
| R6 | `next/font` unduh saat build | Terbukti berhasil; metric-matched fallback ter-emit | ✅ |
| R7 | Baseline visual basi | **Tidak** regenerasi; QA manual | ⚠️ |
| R8 | Preview Vercel kena SSO | Login dulu di browser | ⚠️ |
| R9 | 12+ halaman disentuh | 1 fase = 1 commit | ⚠️ |
| R10 | Brand baru mengubah ~370 call site sekaligus | Disetujui (K1); rollback 1 token | ⚠️ dipantau |

---

## 6. URUTAN COMMIT

1. `feat(ui): add design tokens, fonts and cn() helper` ← **Phase 1**
2. `chore(security): update permissions-policy to allow self for media and geolocation` ← **K3**
3. `feat(ui): add core UI primitives` ← Phase 2
4. `refactor(ui): rebuild app shell and navigation`
5. `refactor(ui): redesign homepage and beranda`
6. `refactor(ui): redesign marketplace discovery`
7. `refactor(ui): redesign auth, profile and settings`
8. `refactor(ui): align jobs, properti, groups and chat`
9. `fix(a11y): responsive, contrast, motion and focus hardening`

---

## 7. ACCEPTANCE CRITERIA

375 / 768 / 1024 / 1440 px · `aria-label` pada tombol ikon-saja · kontras ≥4.5:1 ·
`focus-visible` terlihat · animasi dibungkus `prefers-reduced-motion` ·
tanpa CLS · hero `next/image` + `priority` · tanpa warna hardcoded **di komponen baru**

**Validasi tiap fase**
```
cd next-app && npx tsc --noEmit && npm run build && cd ..
npm run lint && npm test && git diff --check
```

---

## 8. KONFLIK SPEC vs ARSITEKTUR

| # | Konflik | Resolusi |
|---|---|---|
| C1 | `--color-text-primary` dll sudah ada dengan nilai berbeda | Namespace `--qwen-*` |
| C2 | Premis "dark mode masa depan" — padahal **sudah live** | Pasangan dark wajib |
| C3 | `class-variance-authority` tidak ada di daftar izin | Varian manual |
| C4 | `skeleton.tsx` duplikat `States.tsx` | Perluas `States.tsx` |
| C5 | Nama file layout spec ≠ file hidup | Pertahankan nama hidup |
| C6 | `app/(routes)/**` tidak ada (40 `page.tsx` di `app/`) | Pakai struktur hidup |
| C7 | `npm run format` **tidak ada**; Prettier/ESLint tidak terpasang | **DILAPORKAN** — butuh keputusan |
| C8 | `DM Sans` deklarasi mati | Dihapus dari stack |
| C9 | 108 warna hardcoded legacy (`bg-white` 73, `text-gray-500` 24) | Scope komponen baru saja |
| C10 | Nama repo di dokumen spec `saripkdi01-teep` → 404 | Pakai `saripkdi01-boop` |
| C11 | Preview Vercel `public: False` (SSO) | QA manual butuh login |
| C12 | `Manrope` + `Clash Display` di `globals.css` tidak pernah dimuat | Dibiarkan; di luar scope |

### BACKEND CHANGE REQUIRED
**Tidak ada.** Spec murni UI. Satu-satunya perubahan non-UI adalah
`Permissions-Policy` (K3), dipisah sebagai commit tersendiri.

### CATATAN UNTUK KEPUTUSAN LANJUTAN
`--suki-rgb-success` light = `22 128 90` dan brand baru = `21 128 61`. Keduanya
hijau dan kini **berjarak sangat dekat**, sehingga badge sukses bisa terbaca
seperti badge brand. Belum diubah karena di luar mandat K1 — perlu keputusan
Anda apakah `success` digeser (mis. ke arah teal) agar tetap terbedakan.
