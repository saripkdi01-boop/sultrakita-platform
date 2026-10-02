# QC VISUAL TRANSFORMATION V1.0 — Ringkasan Hasil
**Tanggal:** 2026-10-03 · **Branch:** `fitur/visual-transformation-v1` · **Basis:** `origin/main` 136e46c
**Commit:** `0e165f7` + commit susulan QC (lihat `git log`)

## Gerbang verifikasi

| Cek | Perintah / metode | Hasil |
|---|---|---|
| Typecheck | `npx tsc --noEmit` (next-app) | **LOLOS** — 0 error |
| Lint | `npm run lint` (next-app) | **LOLOS** — exit 0; hanya warning pre-existing (`<img>` vs `<Image/>`, `exhaustive-deps`, dsb. — bukan dari file program ini) |
| Build produksi | `npm run build` di worktree bersih (commit 0e165f7) | **LOLOS** — BUILD_EXIT:0 |
| Screenshot before/after | Playwright Chromium, 8 rute × desktop 1440 + mobile 390 | **16/16 LOLOS** (1 retry: /beranda mobile timeout → 200 OK) |
| Smoke test rute | HTTP status semua rute utama | **16/16 HTTP 200** |
| Horizontal overflow | `document.documentElement.scrollWidth - clientWidth` | **0 px** (home light, home dark, section ekosistem) |
| Dark mode | homepage `data-theme='dark'` | **LOLOS** — ilustrasi + teks terbaca |

Catatan metode screenshot: server lokal memakai `NEXT_PUBLIC_SUPABASE_URL` asli +
`NEXT_PUBLIC_SUPABASE_ANON_KEY=visual-qc-dummy-key` (kunci asli TIDAK diambil dari
vault). Fetch data gagal gracefully → halaman tampil dalam empty/error state.
Perbandingan visual tetap valid untuk perubahan program ini.

## Perbandingan before → after (bukti di `~/workspace/your_files/suki-visual-v1-qc/`)

- **Hero homepage:** sebelum = peta orbit abstrak (EcosystemMap); sesudah = ilustrasi
  Digital Nusantara berlapis (langit + awan + bukit + laut + rumah panggung + perahu +
  nelayan/pedagang/UMKM/anak muda + dedaunan tropis + pola tenun) dengan parallax
  pointer dan badge "Pasar lokal"/"Komunitas".
- **Section #ekosistem:** EcosystemMap pindah ke sini (fungsi interaktif utuh) +
  4 kartu ilustrasi baru dengan aksen warna khas tiap ruang.
- **Empty state 4 ruang:** marketplace/properti/jobs/groups kini berilustrasi
  (jujur — tanpa angka/statistik palsu).
- **Login:** panel kiri desktop kini tampil (perbaikan bug pre-existing
  `.hidden{display:none!important}`) + ilustrasi Nusantara dekoratif.
- **Dark mode:** hero dan kartu terbaca baik.

## Bug yang ditemukan & diperbaiki saat QC

1. **Hero art collapse (2px):** `.suki-overhaul-hero-map` memakai
   `place-items:center` sehingga `.dn-hero-art` (semua child absolute) menyusut.
   → Perbaikan: `width: min(100%, 620px)` di `.dn-hero-art`.
2. **Panel kiri login tak pernah tampil di desktop:** `app/globals.css` memiliki
   `.hidden{display:none!important}` (pre-existing) yang mematikan `lg:block`.
   → Perbaikan surgical di `nusantara.css`: kembalikan `display:block` khusus
   panel AuthGate pada ≥1024px. Tidak menyentuh rule global.
3. **Skrip screenshot ESM:** `require` di `.mjs` → diganti `import`.

## Klasifikasi sisa masalah

- **Fixed:** 3 bug di atas.
- **Known limitation:** screenshot memakai kunci dummy (lihat catatan metode);
  verifikasi device fisik + Lighthouse butuh browser live (delegasi ke parent);
  build di working tree utama sempat gagal karena type error milik sesi lain
  (`lib/rate-limit.ts` preset `aichat` — bukan bagian program ini; sesi tersebut
  sudah perbaiki di worktree-nya).
- **Blocked:** tidak ada.
- **Release blocker:** tidak ada dari sisi program ini.

## Tidak dilakukan (sesuai batas keras)

Merge ke main, deploy production, migrasi DB, perubahan env/secrets, push
(dilakukan parent via PAT transient Sarip — PR #56 OPEN).
