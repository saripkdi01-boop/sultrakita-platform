# Catatan Budaya — Pustaka Ilustrasi "Digital Nusantara"

Pustaka: `next-app/components/illustrations/` (NusantaraHero, 4 scene ekosistem,
Motifs). Semua bentuk digambar orisinal dari nol untuk SUKI Apps; bukan
meniru brand/kompetitor mana pun. Palet: Forest Green `#123C35`, Tropical
Teal `#13A89E`, Ocean Blue `#243A58`, Warm Gold `#F3B544`, Coral `#F17B51`,
Warm Cream `#F7F3E8`, aksen emas brand `#D4AF37` (+ turunan tint-nya).

## Apa yang digambar (dan mengapa)

- **Kehidupan pesisir generik Sultra**: nelayan dengan jaring, perahu dayung,
  rumah panggung di tepi air, ombak, palem, dedaunan tropis. Ini lanskap
  sehari-hari warga pesisir — bukan simbol sakral.
- **Ekonomi rakyat**: pedagang pasar dengan keranjang hasil bumi, lapak
  UMKM, transaksi digital (ponsel + centang), kavling tanah, ruko, rumah
  tropis, talenta muda dengan laptop, dokumen lamaran, diskusi komunitas
  yang hangat.
- **Motif tenun sebagai pola geometris abstrak** (`TenunPattern`): diamond
  berulang tanpa mengklaim mewakili motif tenun daerah tertentu. Tenun
  adalah kerajinan yang hidup di banyak daerah Sultra; pola di sini
  generik-abstrak, bukan replika motif adat spesifik mana pun.

## Apa yang SENGAJA tidak digambar

- **Tidak ada elemen sakral/adat spesifik sebagai dekorasi**: tidak ada
  replika rumah adat sakral, tidak ada ornamen ritual, tidak ada tiruan
  pakaian adat daerah tertentu, tidak ada simbol keagamaan.
- **Rumah panggung digambar generik pesisir** (atap pelana sederhana,
  tiang, dek) — bukan arsitektur adat khas suku mana pun.
- **Tidak mencampur atribut adat berbeda secara sembarangan**: tidak ada
  figur yang memakai kombinasi atribut dari beberapa tradisi sekaligus.
- **Tidak ada klaim data**: ilustrasi tidak menampilkan angka statistik,
  testimoni, badge, atau klaim pencapaian apa pun.

## Panduan pakai (aksesibilitas)

- **Dekoratif murni** → biarkan default: `aria-hidden="true"`
  `focusable="false"`. Ini berlaku untuk semua komponen bila dipasang
  sebagai hiasan di samping teks yang sudah menjelaskan maknanya
  (contoh: hero di samping headline).
- **Bermakna / berdiri sendiri** → kirim prop `title`, mis.
  `<NusantaraHero title="Ilustrasi kehidupan pesisir digital Sultra" />`.
  Komponen lalu me-render `role="img"` + `<title>` dan menghapus
  `aria-hidden`. Pakai hanya bila ilustrasi menyampaikan informasi yang
  tidak ada di teks sekitarnya.
- **Motifs** (`TenunPattern`, `WaveDivider`, `TropicalLeaf`, `CloudDrift`,
  `SunDisc`) selalu dekoratif — jangan beri `title`; tidak ada prop
  semacam itu.
- `TenunPattern` me-render elemen `<pattern>` — wajib dipasang di dalam
  `<defs>` lalu direferensikan via `fill="url(#id)"`. Beri `id` yang unik
  per halaman bila dipakai lebih dari sekali.

## Panduan parallax (NusantaraHero)

Scene dibagi tiga lapisan: `<g className="dn-layer" data-depth="0.1">`
(background), `0.25` (midground), `0.45` (foreground). Gerakkan tiap
lapisan dengan `translate` proporsional terhadap scroll/pointer dikali
`data-depth`. Hormati `prefers-reduced-motion`: matikan parallax bila
pengguna memintanya.
