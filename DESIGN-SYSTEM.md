# Design System "Teluk & Tenun" — Fondasi Overhaul /beranda

**Scope:** social platform SUKI Apps (`/beranda` overhaul), branch `upgrade/beranda-worldclass-overhaul`.
**Identitas:** warm sand/cream, ink hangat, aksen amber-gold + coral bakar + teal dalam.
**DILARANG:** gradien neon, glassmorphism berlebih, blob, bayangan raksasa, emoji sebagai ikon.

Sumber token: `next-app/design-system/tokens.css` (namespace `--sk-*`).
Primitif: `next-app/components/ui/` (barrel `index.ts`, style `ui-primitives.css`).

---

## 1. Token warna

| Token | Light | Dark | Pakai untuk |
|---|---|---|---|
| `--sk-bg` | `#FAF9F6` | `#141210` | latar halaman |
| `--sk-surface` | `#FFFFFF` | `#1E1B18` | kartu, sheet, dialog, toast |
| `--sk-surface-2` | `#F5EEDB` | `#292524` | latar sekunder, hover halus, skeleton |
| `--sk-ink` | `#1C1917` | `#F5F5F4` | teks utama (body) |
| `--sk-ink-2` | `#292524` | `#E7E5E4` | teks penekanan |
| `--sk-muted` | `#66736F` | `#A8A29E` | teks sekunder — kontras ≥ 4.5:1 di atas `--sk-bg` |
| `--sk-faint` | `#A8A29E` | `#78716C` | **dekoratif/meta kecil SAJA**, bukan body |
| `--sk-line` | `#E7E5E4` | `#2E2A26` | border halus |
| `--sk-line-strong` | `#D6D3D1` | `#44403C` | border tegas, divider |
| `--sk-brand` | `#A16207` | `#D4AF37` | amber-gold — CTA primer, aksen |
| `--sk-brand-hover` | `#854D05` | `#E5C15A` | hover CTA |
| `--sk-brand-soft` | `#FAF3E3` | `#2A2417` | latar lembut amber (chip, highlight) |
| `--sk-teal` | `#0E6258` | `#45B8A8` | teal dalam — link, ikon aksi, tab aktif |
| `--sk-teal-soft` | `#E6F2EF` | `#1A2B28` | latar lembut teal |
| `--sk-danger` | `#B3261E` | `#E57373` | error, hapus |
| `--sk-success` | `#2E7D32` | `#81C784` | sukses, online |
| `--sk-warning` | `#B45309` | `#E8A04C` | peringatan |
| `--sk-focus` | `#0E6258` | `#45B8A8` | ring fokus — terlihat di kedua tema |

Catatan dark mode: **intentional, bukan inversi** — permukaan tetap hangat (`#141210`/`#1E1B18`),
brand diganti gold terang `#D4AF37` agar terbaca, teks body kontras ≥ 4.5:1 (`--sk-muted: #A8A29E` di atas `#141210` ≈ 7:1).
Toggle tema lewat class `.dark` di `<html>` (lihat `lib/preferences.tsx`).

## 2. Tipografi

Font: `--sk-font` = `'Plus Jakarta Sans'` (warisan dari `globals.css`).

| Peran | Ukuran | Berat | Contoh pakai |
|---|---|---|---|
| display | 28px | 800 | judul sheet/dialog besar, hero kecil |
| title | 20px | 800 | judul dialog (`.sk-dialog-title`) |
| section | 16px | 800 | judul sheet (`.sk-sheet-title`), heading state |
| body | 15px | 400–600 | teks konten feed |
| meta | 13px | 400–600 | timestamp, subtitle, deskripsi toast |
| caption | 12px | 600 | label kecil, tooltip, badge |

Line-height teks: 1.5–1.7 (paragraf), 1.2–1.3 (heading).

## 3. Spacing

Skala dasar 4px: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 48`.
(Token lama `--suki-space-*` tetap ada untuk kode legacy; kode baru pakai nilai literal skala ini.)

## 4. Radius

`--sk-r-sm: 8px` · `--sk-r-md: 12px` · `--sk-r-lg: 16px` · `--sk-r-xl: 20px` · `--sk-r-pill: 999px`
(pill untuk chip, avatar, IconButton).

## 5. Shadow (subtle — bukan raksasa)

- Kartu/sheet: `0 -8px 32px rgba(28,25,23,.16)` (sheet), toast `0 8px 24px rgba(28,25,23,.14)`, dialog `0 12px 40px rgba(28,25,23,.2)`.
- Prinsip: satu arah, blur ≤ 40px, opacity ≤ 0.2. Tidak ada shadow berlapis ganda.

## 6. Motion

- `--sk-d-fast: 120ms` · `--sk-d-base: 180ms` · `--sk-d-slow: 280ms`
- `--sk-ease: cubic-bezier(.2,.7,.3,1)`
- `prefers-reduced-motion: reduce` → semua durasi jadi `1ms`, ease jadi `linear`; shimmer Skeleton, animasi sheet/dialog/toast, dan transisi tombol **dimatikan** (`ui-primitives.css`).
- Video autoplay feed tetap mengikuti pola `ViewportVideo` (hormat reduced-motion) — lihat audit Fase A.

## 7. Primitif (`components/ui/`)

| Komponen | Props kunci | Catatan a11y |
|---|---|---|
| `Button` | variant `primary/secondary/ghost/danger`, size `sm/md`, `loading` | `aria-busy` saat loading, `:disabled` |
| `IconButton` | `label` **wajib** | hit area min 44×44px, `aria-label` |
| `Avatar` | `name`, `src?`, `size?`, `presence?` | fallback inisial saat img gagal, `role="img"` |
| `Skeleton` | `variant line/circle/block` | shimmer hormat reduced-motion |
| `Sheet` | `open`, `onClose`, `title?` | bottom sheet mobile / dialog di desktop, Esc, focus trap ringan, safe-area |
| `Dialog` | `open`, `onClose`, `title`, `description?` | `role=dialog aria-modal`, Esc, backdrop, focus trap, restore fokus |
| `Tooltip` | `content`, `position?` | `role=tooltip`, tampil saat hover/fokus |
| `Tabs` | `tabs[]`, `value`, `onChange` | `tablist/tab`, navigasi panah ←/→ |
| `ToastProvider` + `useToast()` | `toast({title, description?, tone?, duration?})` | `aria-live=polite`, auto-dismiss 4s, maks 3 tampil |
| `EmptyState` | `icon`, `title`, `description?`, `action?` | tanpa ilustrasi raksasa |
| `ErrorState` | `title?`, `message?`, `onRetry`, `retryLabel?` | `role=alert`, tombol "Coba lagi" |

Pola umum: `'use client'`, TypeScript strict tanpa `any`, ikon dari `lucide-react`,
semua warna/spasi/radius/motion dari `var(--sk-*)`. Import: `import { Button } from '@/components/ui'`.

## 8. Aturan anti-drift

1. **Jangan tambah token `--sk-*` baru tanpa alasan tertulis** — usulkan dulu di PR description / catatan fase. Token yang dipakai < 2 tempat = kandidat dihapus.
2. **Jangan hardcode warna** di komponen baru — selalu `var(--sk-*)`. Warna di luar tabel §1 butuh justifikasi desain.
3. **Setiap komponen baru harus punya varian dark** — uji dengan toggle tema; tidak ada halaman "belang" (lihat temuan F8 audit Fase A).
4. **Jangan duplikat primitif** — cek `components/ui/` dulu; yang sudah ada: `MenuItem`, `ModalSupport`, `ModalPartnership` (spesifik domain, bukan primitif).
5. **Aksesibilitas bukan opsional:** label untuk ikon, `alt`/`aria-label` untuk gambar, kontras teks ≥ 4.5:1, keyboard (Tab/Esc/panah) untuk semua overlay & tab, `prefers-reduced-motion` dihormati.
6. **Bahasa UI default id-ID** (konsisten dengan komposer beranda); string yang akan di-i18n-kan ditaruh di props, bukan di-hardcode di dalam primitif bila memungkinkan.
7. **Tidak ada data palsu** di komponen — empty/error state jujur (keputusan Fase 0 D-07).
