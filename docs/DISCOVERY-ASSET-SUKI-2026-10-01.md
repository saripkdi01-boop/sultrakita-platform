# Laporan Discovery Aset — SUKI Apps UI/UX Overhaul
**Tanggal:** 1 Oktober 2026 (WITA)
**Cakupan:** Read-only discovery di Figma, Canva, Google Drive, Linear
**Hasil ringkas:** Tidak ditemukan satu pun aset merek SUKI Apps yang resmi di keempat sumber. Akun-akun tersebut terhubung, tetapi kosong/tidak relevan untuk SUKI Apps.

---

## 1. FIGMA
- **Status akses:** ✅ Terhubung (OAuth via Figma MCP Server). Akun: saripkdi01@gmail.com (handle "persada persada indonesia"), tim "Sarip's team" (tier starter, seat View, peran admin).
- **Hasil pencarian:** ❌ Tidak bisa dilakukan — katalog MCP Figma **tidak menyediakan tool pencarian/daftar file**. Semua tool baca (`get_metadata`, `get_design_context`, `get_screenshot`, `get_variable_defs`, `get_libraries`, `search_design_system`) wajib menerima `fileKey` + `node-id` yang diekstrak dari URL Figma.
- **Kesimpulan:** Tanpa URL file Figma dari Sarip, tidak ada cara read-only untuk menemukan file "SUKI Apps"/"SultraKita". Tidak ditemukan file, frame, komponen, atau design token apa pun.

## 2. CANVA
- **Status akses:** ✅ Terhubung (OAuth via Canva MCP Server).
- **Hasil pencarian:**
  - `search-designs --query "SUKI"` → kosong
  - `search-designs --query "Sultra"` → kosong
  - `search-designs` (tanpa query) → kosong
  - `list-brand-kits` → kosong (tidak ada brand kit)
- **Kesimpulan:** Akun Canva tidak memiliki desain maupun brand kit sama sekali. Tidak ada logo, warna, atau template SUKI Apps.

## 3. GOOGLE DRIVE
- **Status akses:** ✅ Terhubung (via `hatch_gws_cli drive`).
- **Hasil pencarian:**
  - Nama berisi "SUKI" → kosong
  - Nama berisi "Sultra" → kosong
  - Isi penuh (`fullText`) "SUKI", "sukiapps", "SultraKita" → kosong
  - Daftar lengkap root Drive (59 item): seluruhnya dokumen bisnis properti di Sulawesi Tenggara — PDF update proyek ("BAHAGIA LAND", "MADINAH 3", "BARUGA REGENCY", "PRIMA CAMPUS SQUARE", dll.), RAB spreadsheet ("RAB Alat & Perangkat Pendukung Kantor PT. SDP", "Analisa Biaya Upah Kerja Baja & Atap"), company profile SDP Group, template e-book, checklist affiliator, foto/video survei, folder "TrustWalletBackup" dan "DO NOT DELETE Bitverse Backup", serta satu file `index.html` yang tidak jelas kaitannya.
- **Kesimpulan:** Tidak ada brand guide, brief, logo, foto, copy, atau dokumen produk SUKI Apps / SultraKita. Tidak ada file yang layak diunduh sebagai aset resmi.

## 4. LINEAR
- **Status akses:** ✅ Terhubung (OAuth via Linear MCP, akses read-only).
- **Workspace:** `saripkdi`, tim **"Saripkdi"** (dibuat 30 Sep 2026 22:22 UTC / kemarin malam). Proyek: tidak ada.
- **Issue yang ada (hanya 4, semuanya onboarding otomatis):**

| ID | Judul | Status | Prioritas | Label |
|----|-------|--------|-----------|-------|
| SAR-1 | Get familiar with Linear | Todo | No priority | — |
| SAR-2 | Connect your tools | Todo | No priority | — |
| SAR-3 | Import your data | Todo | No priority | — |
| SAR-4 | Set up your teams | Todo | No priority | — |

- **Kesimpulan:** ❌ **Tidak ada issue yang relevan** dengan UI/UX overhaul atau homepage SUKI Apps. Sesuai instruksi, tidak membuat issue baru.

---

## (b) Aset yang layak dipakai untuk redesign homepage
**Dari keempat sumber di atas: tidak ada.** Satu-satunya aset merek yang dapat diverifikasi sebagai baseline adalah yang sudah ada di repo lokal `~/workspace/suki-redesign/next-app/public/`:
- `brand/suki-logo-mark.svg` (+ `.png`): logo mark — kotak teal bergradasi (#18B6A4 → #087F73) dengan huruf "S" putih dan aksen emas (#F4D35E).
- `public/design-tokens.css`: token warna brand `--color-brand: #0D5C4B` (hover #084638), latar #F7F8F6, teks #172522.
- `BrandLogo.tsx` (components/layout) sebagai implementasi komponen logo.
- Jika Sarip bisa menyediakan: URL file Figma, link Canva, atau folder Drive khusus SUKI — discovery bisa dijalankan ulang terhadap sumber tersebut.

## (c) Issue Linear yang relevan
Tidak ada. Empat issue yang ada (SAR-1 s/d SAR-4) adalah panduan onboarding Linear otomatis, semuanya status Todo tanpa prioritas. Direkomendasikan agar parent agent membuat issue baru (mis. epik "Homepage UI/UX Overhaul") atau meminta konfirmasi Sarip sebelum membuat.

## (d) Tidak ditemukan / tidak dapat diakses — alasan
1. **Figma:** Terhubung, tetapi MCP tidak mengekspos pencarian/daftar file; semua akses butuh URL file dari pengguna. → *Blokir teknis connector, bukan izin.*
2. **Canva:** Terhubung, akun kosong (tanpa desain dan tanpa brand kit). → *Tidak ada aset yang tersimpan.*
3. **Google Drive:** Terhubung, tidak ada file bernama/berisi kata kunci SUKI/sukiapps/SultraKita; isi Drive adalah dokumen bisnis properti. → *Tidak ada aset terkait proyek.*
4. **Linear:** Terhubung, workspace baru (dibuat kemarin), hanya berisi issue onboarding otomatis. → *Belum ada pelacakan kerja UI/UX.*

**Catatan:** Perbandingan desain Figma vs implementasi saat ini tidak dapat dilakukan karena tidak ada file Figma yang ditemukan. Baseline desain saat ini adalah `design-tokens.css` dan logo mark di repo lokal.
