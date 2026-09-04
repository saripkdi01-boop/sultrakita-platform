# Catatan Temuan PDF Riset Terunggah

Sumber: `/home/ubuntu/projects/sultrakita-afcaa4d7/Dari Portal Berita k_71866784_20260904_022202622.pdf`

## Temuan utama

Dokumen menegaskan transformasi SultraKita dari portal berita menuju ekosistem digital regional, dengan pola navigasi yang meniru efektivitas struktur Facebook namun tetap mempertahankan identitas merek lokal. Inti arsitektur yang dianjurkan adalah menu terkelompok, status aktif yang jelas, sidebar dapat dilipat, badge notifikasi, dan drawer mobile.

Sidebar dianjurkan dibagi ke dalam beberapa klaster fungsi: **Akun**, **SultraKita**, **Ekonomi & Marketplace**, **Bisnis**, serta **Dukung & Berkolaborasi**. Struktur ini dimaksudkan untuk membantu pengguna memahami hirarki produk dan berpindah antar konteks tanpa kebingungan.

Dokumen juga menekankan bahwa implementasi harus berbasis **design tokens** agar konsisten dan mudah dipelihara. Variabel yang disebut eksplisit mencakup warna (`--sk-primary`, `--sk-bg`, `--sk-text`), radius (`--sk-radius`), bayangan (`--sk-shadow-sm`), serta spacing.

Integrasi teknis yang ditekankan meliputi:

1. **Supabase** untuk autentikasi, basis data, badge notifikasi real-time, serta logika role-based menu.
2. **Cloudflare R2** untuk aset seperti avatar/gambar profil agar terpisah dari repositori dan dapat memanfaatkan CDN.
3. **Vercel** untuk build, preview, dan alur deploy modern.
4. **GitHub** untuk version control dan dokumentasi implementasi.

Aksesibilitas yang ditekankan mencakup target sentuh minimum 44px, fokus keyboard yang jelas, dan kesiapan mobile-first untuk pengguna Sulawesi Tenggara.

## Komponen/pola yang ditonjolkan dalam PDF

| Komponen | Fungsi |
| --- | --- |
| Sidebar collapsible | Mode expanded/collapsed untuk efisiensi layar |
| Grouped menu | Pengelompokan fitur berdasarkan domain tugas |
| State aktif | Penanda halaman saat ini dengan gaya kontras |
| Notification badge | Angka notifikasi untuk notifikasi/chat/update |
| Mobile drawer | Navigasi layar kecil dengan overlay dan dismiss |
| Icon + label | Meningkatkan scanability dan makna item menu |

## Implikasi langsung untuk tugas ini

Implementasi baru sebaiknya tidak sekadar menyalin HTML lama, tetapi memecah struktur menjadi komponen React yang modular dengan konfigurasi menu terpusat, dukungan RBAC, dan gaya visual yang bisa diperluas ke produk SUKI Suits.
