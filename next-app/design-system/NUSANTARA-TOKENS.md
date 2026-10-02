# Token Digital Nusantara (`--dn-*`)

Lapisan token untuk program **VISUAL TRANSFORMATION V1.0** SukiApps.
File: `design-system/tokens-nusantara.css`.

Prinsip: **berdampingan, bukan menggantikan.** File ini hanya mendefinisikan
variabel ber-namespace `--dn-*`; token lama (`--suki-*`, `--sk-*`) tidak
disentuh dan tetap menjadi sumber kebenaran untuk komponen yang sudah live.

## 1. Palet mentah

| Token | Hex | Peran |
|---|---|---|
| `--dn-forest` | `#123C35` | Primer (light) |
| `--dn-teal` | `#13A89E` | Aksen |
| `--dn-ocean` | `#243A58` | Teks gelap alternatif |
| `--dn-gold` | `#F3B544` | Aksen / CTA (juga primer di dark) |
| `--dn-coral` | `#F17B51` | Aksen energik |
| `--dn-cream` | `#F7F3E8` | Latar utama (light) |
| `--dn-brand-gold` | `#D4AF37` | Emas brand SUKI 2026 — dipertahankan berdampingan |

## 2. Turunan (tint & shade)

Setiap warna punya 3 tint (campur putih 88/72/52%) dan 2 shade
(campur hitam 35/55%), dihitung manual dengan interpolasi linear:

- `--dn-{warna}-100 / -200 / -300` — tint, untuk latar lembut & hover
- `--dn-{warna}-700 / -800` — shade, untuk hover/active & teks di atas warna terang

Contoh: `--dn-teal-100: #E4F5F3`, `--dn-teal-700: #0C6D67`,
`--dn-forest-800: #0A1B1D`, `--dn-gold-300: #F9DBA5`,
`--dn-coral-800: #6C3724`. Daftar lengkap ada di file CSS.

## 3. Token semantik

| Token | Light | Dark (`html[data-theme='dark']`) |
|---|---|---|
| `--dn-bg` | `#F7F3E8` (cream) | `#0C1411` |
| `--dn-surface` | `#FFFFFF` | `#141F1B` |
| `--dn-surface-2` | `#FBF9F4` (cream-300) | `#1C2A24` |
| `--dn-text` | `#123C35` (forest) | `#F2EFE3` |
| `--dn-text-muted` | `#5A6B66` | `#A7B3AC` |
| `--dn-border` | `#DCD3BC` | `#2A3831` |
| `--dn-primary` | `#123C35` (forest) | `#F3B544` (gold) |
| `--dn-primary-strong` | `#0C2722` (forest-700) | `#F9DBA5` (gold-300) |
| `--dn-accent` | `#F3B544` (gold) | `#8ED5D0` (teal-300) |
| `--dn-on-primary` | `#FFFFFF` | `#123C35` (forest) |

Catatan: di tema gelap, primer beralih dari forest ke gold agar tombol
tetap kontras di atas latar gelap.

## 4. Kontras WCAG AA (teks normal ≥ 4.5:1)

Rasio di bawah adalah **estimasi perhitungan manual** (rumus luminansi
relatif WCAG), bukan hasil alat ukur — **perlu verifikasi tool**
(mis. WebAIM Contrast Checker) sebelum dipakai untuk klaim aksesibilitas
resmi.

Pasangan yang lolos (estimasi):

| Pasangan | Rasio estimasi |
|---|---|
| `--dn-text` (`#123C35`) di atas `--dn-bg` (`#F7F3E8`) | ~11.5:1 |
| `#FFFFFF` di atas `--dn-primary` light (`#123C35`) | ~12.7:1 |
| `--dn-teal-700` (`#0C6D67`) di atas `#FFFFFF` | ~6.2:1 |
| `--dn-gold` (`#F3B544`) di atas `--dn-forest` (`#123C35`) | ~7.0:1 |
| `#FFFFFF` di atas `--dn-coral-700` (`#9D5035`) | ~5.8:1 |
| `--dn-ocean` (`#243A58`) di atas `--dn-cream` (`#F7F3E8`) | ~10.4:1 |
| `#FFFFFF` di atas `--dn-ocean` (`#243A58`) | ~11.5:1 |
| `--dn-text-muted` light (`#5A6B66`) di atas `--dn-bg` | ~5.1:1 |
| `--dn-text-muted` dark (`#A7B3AC`) di atas `--dn-bg` dark (`#0C1411`) | ~8.6:1 |
| `--dn-primary` dark (`#F3B544`) di atas `--dn-bg` dark (`#0C1411`) | ~10.2:1 |

Pasangan yang **gagal** AA untuk teks (jangan dipakai sebagai teks):

| Pasangan | Rasio estimasi | Solusi |
|---|---|---|
| `--dn-teal` (`#13A89E`) di atas `#FFFFFF` | ~2.9:1 | pakai `--dn-teal-700` untuk teks; teal murni hanya untuk grafis/dekorasi |
| `#FFFFFF` di atas `--dn-coral` (`#F17B51`) | ~2.7:1 | pakai `--dn-coral-700` sebagai latar tombol, atau teks `--dn-coral-800` di atas krem |

## 5. Tipografi, spacing, radius, shadow, motion

- **Font**: `--dn-font-sans` (Plus Jakarta Sans — sudah dimuat di
  `app/layout.tsx`) dan `--dn-font-display` (Playfair Display — juga sudah
  dimuat). **Tidak ada font baru yang ditambahkan.**
- **Skala**: `--dn-text-xs` (12px) → `--dn-text-sm` → `--dn-text-base`
  → `--dn-text-lg` → `--dn-text-xl` → `--dn-text-2xl` → `--dn-display`,
  memakai `clamp()` agar responsif (kecil di mobile, lega di desktop).
- **Leading**: `--dn-leading-tight/snug/normal/relaxed`
  (1.1 / 1.25 / 1.5 / 1.65).
- **Weight**: `--dn-weight-regular/medium/semibold/bold/extrabold`
  (400–800).
- **Spacing**: `--dn-space-1` s/d `--dn-space-20` (skala 4px: 4–80px).
- **Radius**: `--dn-radius-sm/md/lg/xl/2xl/pill` (8px → 999px).
- **Shadow**: `--dn-shadow-sm/md/lg` (3 level, tint hangat kehijauan).
- **Motion**: `--dn-duration-instant/fast/normal/slow/slower`
  (100/160/240/480/800ms), `--dn-ease-out/in-out/spring`.
- **Reduced motion**: blok `@media (prefers-reduced-motion: reduce)`
  memaksa semua durasi menjadi 1ms. Komponen `Reveal.tsx` juga
  menonaktifkan animasinya sepenuhnya dalam kondisi ini.

## 6. Kapan memakai `--dn-*` vs token lama

- **`--suki-*`**: komponen inti yang sudah live dan stabil
  (tema umum, shadow kartu, motion dasar). Jangan migrasi tanpa alasan.
- **`--sk-*`**: identitas overhaul "Teluk & Tenun" (area sosial/komunitas).
  Tetap dipakai di permukaan yang sudah mengadopsinya.
- **`--dn-*`**: **permukaan baru** program Visual Transformation V1.0 —
  hero/landing baru, section marketing "Digital Nusantara", ilustrasi,
  dan komponen baru seperti `Reveal`. Aturan:
  1. Jangan mencampur namespace dalam satu komponen baru — pilih satu.
  2. Jangan me-redefine token lama dengan nilai `--dn-*` (anti-drift).
  3. Bila komponen lama butuh perbaikan visual, ajukan dulu sebelum
     memigrasikannya ke `--dn-*`.
