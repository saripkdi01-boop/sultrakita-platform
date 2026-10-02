# VISUAL TRANSFORMATION V1.0 — Creative Direction
**Program:** SukiApps Visual Transformation V1.0 · **Branch:** `fitur/visual-transformation-v1`
**Big idea:** "Digital Nusantara — Satu Indonesia, Banyak Peluang."
**Tagline konseptual:** "Temukan yang dekat. Bangun yang berarti."

## 1. Posisi visual

SukiApps adalah ekosistem digital Sulawesi Tenggara. Transformasi ini mengubah kesan
"direktori digital sederhana" menjadi "pengalaman digital yang bercerita": modern,
hangat, inklusif, profesional, dan berakar pada budaya Indonesia — tanpa meniru
website lain dan tanpa mengorbankan kecepatan, aksesibilitas, atau fungsi yang
sudah berjalan.

## 2. Bahasa visual: "Editorial Nusantara yang hidup"

- **Modern Indonesian editorial illustration** — ilustrasi karikatur editorial yang
  modern, bersahabat, berkarakter; bukan kartun anak-anak, bukan template generik.
- **Contemporary SaaS interface** — hierarki jelas, spacing lega, komponen konsisten.
- **Playful but professional** — aksen warna hangat (gold, coral) di atas fondasi
  tepercaya (forest, teal, ocean).
- **Cultural storytelling yang hormat** — pesisir Sultra, rumah panggung generik,
  nelayan, pedagang pasar, UMKM, anak muda berteknologi. Tidak memakai elemen
  sakral sebagai dekorasi; tidak mencampur atribut adat berbeda secara sembarangan
  (lihat `next-app/components/illustrations/CULTURAL-NOTES.md`).

## 3. Palet "Digital Nusantara" (namespace `--dn-*`)

| Token | Hex | Peran |
|---|---|---|
| Forest Green | `#123C35` | Fondasi, teks gelap, footer/section dalam |
| Tropical Teal | `#13A89E` | Aksi primer, aksen hidup |
| Ocean Blue | `#243A58` | Kedalaman, header malam, kepercayaan |
| Warm Gold | `#F3B544` | Sorotan, CTA sekunder, kehangatan |
| Coral | `#F17B51` | Aksen ekspresif, badge, energi |
| Warm Cream | `#F7F3E8` | Latar terang, kanvas ilustrasi |
| Emas brand SUKI | `#D4AF37` | Dipertahankan berdampingan (logo 2026, titik khas) |

Logo SUKI 2026 (SVG di `next-app/public/brand/`) tetap dipakai apa adanya.
Mode gelap didukung via `html[data-theme='dark']`; token lama (`--suki-*`, `--sk-*`)
tidak ditimpa — lapisan `--dn-*` hidup berdampingan.

## 4. Tipografi

Sans-serif modern yang sudah dipakai proyek (tanpa font baru — hemat performa).
Hierarki: display (clamp responsif) → h2 section → body 16px/1.65 → label/meta.
Bahasa Indonesia harus terbaca nyaman di semua ukuran layar.

## 5. Hero: Digital Nusantara berlapis

Komposisi tiga lapis dengan parallax lembut (transform-only, hormati
`prefers-reduced-motion`):
- **Background** — langit warm cream, matahari, awan bergerak perlahan, perbukitan tropis.
- **Midground** — laut teal berombak, rumah panggung di tepi air, perahu.
- **Foreground** — nelayan, pedagang pasar, pelaku UMKM, anak muda dengan laptop,
  dedaunan tropis pembingkai.
- Headline + CTA tetap di atas dengan kontras aman; ilustrasi tidak mengganggu
  keterbacaan.

## 6. Empat ruang, satu keluarga visual

Tiap ruang punya ilustrasi + aksen warna sendiri, dalam sistem yang sama:
- **Marketplace — Belanja lokal** (aksen teal): pedagang, produk UMKM, transaksi digital.
- **Properti — Ruang & properti** (aksen ocean): rumah tropis, rumah panggung, tanah, ruko.
- **Peluang — Kerja & karier** (aksen gold): talenta muda, kolaborasi lintas profesi.
- **Komunitas — Ruang warga** (aksen coral): warga berkumpul, diskusi hangat.

## 7. Motion

- Reveal saat section masuk viewport (opacity/translateY, sekali).
- Micro-interaction CTA & kartu (scale 1.015, press 0.97 — selaras `sukiMotion`).
- Parallax terbatas pada ilustrasi dekoratif hero.
- Semua animasi: transform/opacity saja, tanpa layout shift, nonaktif saat
  `prefers-reduced-motion`.

## 8. Kejujuran data (aturan anti-sepi)

Tidak ada statistik, testimoni, listing, atau aktivitas yang difabrikasi.
Bagian tanpa data memakai empty state yang jujur dan tetap indah — bukan
polesan seolah ramai.

## 9. Batasan implementasi

- Perubahan visual saja; kontrak data, API, auth (Google/Facebook + callback),
  billing Midtrans, cron, realtime, pencarian, dan filter dipertahankan.
- Metadata, SEO, structured data, analytics yang ada dipertahankan.
- Mobile-first; tanpa horizontal overflow; target sentuh ≥ 44px.
- Tidak ada merge ke main / deploy / migrasi DB / perubahan env di program ini.
