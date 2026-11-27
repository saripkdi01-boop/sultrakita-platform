# Folder `/content` — konten lokal PSI Kendari

Semua konten lokal ditulis sebagai berkas di folder ini dan dibaca saat build
(tanpa database/CMS). Setelah menambah atau mengubah berkas: **commit + push** —
Vercel akan membangun ulang situs secara otomatis.

> **Aturan emas:** jangan mengarang nama, angka, tanggal, atau kutipan. Bila data
> belum ada, biarkan kosong (`null` / `[]`) atau tulis “menunggu data resmi”.
> Jangan pernah menyimpan NIK, foto KTP, nomor HP, atau data pribadi pemilih (UU PDP No. 27/2022).

Berkas yang namanya diawali `_` (mis. `_contoh.md`) diabaikan — berguna untuk draf.

---

## 1. Berita lokal — `berita-lokal/*.md`

Nama berkas disarankan `YYYY-MM-DD-judul-singkat.md`.

```markdown
---
judul: "Judul berita"
slug: judul-berita              # opsional; default dari nama berkas
tanggal: "2026-12-01T10:00:00+08:00"   # WITA = +08:00
penulis: "Redaksi PSI Kendari"
rubrik: "Kendari & Sultra"
label: TERVERIFIKASI            # lihat daftar label di bawah
wilayah: kota-kendari           # opsional; slug dari struktur/dpd.json (untuk filter wilayah)
gambar:                         # opsional
  src: "/uploads/foto.jpg"      # taruh berkas di public/uploads/ atau URL https
  alt: "Deskripsi foto untuk pembaca layar"
  kredit: "Nama fotografer / sumber"
ringkasan: "Maks. 280 karakter."
sumber:                         # opsional, dianjurkan
  - nama: "Nama dokumen/sumber"
    url: "https://..."          # opsional
---

Isi berita dalam **Markdown** (judul `##`, daftar, tabel, tautan).
```

Halaman: `/kendari-sultra/berita/<slug>`; tampil juga di beranda dan `/kendari-sultra`.

## 2. Klarifikasi / cek fakta — `klarifikasi/*.md`

Template baku SOP anti-hoaks (semua kolom wajib diisi; tulis “Belum diketahui.” bila memang belum diketahui):

```markdown
---
judul: "Judul singkat klaim"
slug: judul-singkat-klaim
tanggal: "2026-12-01T09:00:00+08:00"   # tanggal entri dibuat/diperbarui
penulis: "Redaksi PSI Kendari"
label: HOAKS_DIBANTAH
klaim: "Kalimat klaim persis seperti beredar."
pertama_beredar: "Kapan/di mana klaim pertama beredar, atau 'Belum diketahui.'"
fakta:
  - teks: "Fakta yang dapat diperiksa."
    sumber: "Nama sumber"
    tanggal: "2026-11-30"
    url: "https://..."          # opsional
belum_diketahui:
  - "Hal yang belum diketahui."
keputusan: "HOAKS — DIBANTAH. ..."
---

Catatan tambahan (opsional, Markdown).
```

## 3. Struktur — `struktur/*.json`

- `dpp.json`, `dpw-sultra.json` — objek `{ tingkat, nama, sk, pengurus[], catatan, kantor, anggota_tercatat, sumber_url }`.
- `dpd.json` — `{ "wilayah": [ { slug, nama, jenis, dpd, pengurus[], sk, kantor, catatan, antara_feed, data_pemilu } ] }`.
- `pengurus[]` berisi `{ "jabatan": "Ketua", "nama": "…" | null, "foto": null, "catatan": "menunggu data resmi" }`.
- Status halaman wilayah otomatis **“Data terisi”** hanya bila minimal satu `nama` pengurus terisi.
- `sk`: `{ "nomor": "…/SK/DPP/…", "penerbit": "DPP PSI" }` atau `null`.

## 4. Agenda — `agenda/*.json`

```json
{
  "agenda": [
    {
      "id": "2026-12-05-rapat-kerja",
      "judul": "Rapat kerja wilayah",
      "mulai": "2026-12-05T09:00:00+08:00",
      "selesai": "2026-12-05T12:00:00+08:00",
      "tempat": "Kantor DPW, Jl. Laute 3 No. 9, Mandonga",
      "wilayah": "kota-kendari",
      "penyelenggara": "DPW PSI Sulawesi Tenggara",
      "status": "terjadwal",
      "keterangan": "Opsional",
      "sumber": "Opsional"
    }
  ]
}
```

`status`: `terjadwal` | `berlangsung` | `selesai` | `ditunda` | `dibatalkan`. Waktu selalu ditampilkan dalam WITA.

## 5. Data pemilu — `data-pemilu/<id>.json`

Lihat `kendari-2024.json`. Jumlah suara semua dapil **harus** sama dengan `total_suara_partai`
(build mencetak peringatan bila tidak cocok). Cantumkan `sumber.dokumen` secara persis.

## 6. Galeri lokal — `galeri/galeri.json`

```json
{ "foto": [ { "src": "/uploads/kegiatan.jpg", "alt": "Deskripsi", "keterangan": "Opsional", "kredit": "Wajib", "tanggal": "2026-12-01" } ] }
```

## Label verifikasi baku

| Nilai di berkas | Tampil sebagai | Kapan dipakai |
| --- | --- | --- |
| `TERVERIFIKASI` | TERVERIFIKASI | Sumber primer resmi (psi.id, dokumen KPU, SK) atau sudah dicek admin |
| `DILAPORKAN_MEDIA` | DILAPORKAN MEDIA | Diberitakan media / beredar, belum terverifikasi resmi |
| `KLAIM_TIDAK_TERBUKTI` | KLAIM — TIDAK TERBUKTI | Klaim tanpa bukti yang dapat diperiksa |
| `HOAKS_DIBANTAH` | HOAKS — DIBANTAH | Terbukti keliru/rekayasa menurut pemeriksa fakta |
| `TERKLARIFIKASI` | TERKLARIFIKASI | Sudah ada klarifikasi resmi pihak terkait |

Penulisan bebas seperti `"HOAKS — DIBANTAH"` juga diterima.
