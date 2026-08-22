# World-class UI/UX Audit

## Temuan prioritas

| Area | Temuan | Dampak |
|---|---|---|
| Homepage markup | `public/index.html` berisi dua dokumen HTML lengkap yang tergabung; browser merender homepage dua kali. | CLS, duplikasi navigasi, aksesibilitas buruk, dan pengalaman tidak profesional. |
| Design system | Beberapa style inline saling bertentangan dengan `styles.css`; token warna berubah antara gold/green dan beberapa variabel tidak didefinisikan konsisten. | Visual drift dan maintenance sulit. |
| Discovery | Listing card masih mengandalkan emoji, tidak punya hierarchy gambar/metadata yang kuat, filter terbatas, dan state kosong terlalu polos. | Nilai produk dan scanning speed rendah dibanding marketplace modern. |
| Navigation | Sidebar desktop dan bottom navigation mobile belum punya active state berbasis scroll, search experience, atau affordance akun yang jelas. | Orientasi pengguna dan conversion seller belum maksimal. |
| Detail/interaksi | Card tidak membuka detail listing; share/favorit hanya lokal, dan contact flow belum punya context yang jelas. | Engagement dan trust loop belum lengkap. |
| Chat | `public/chat.html` standalone dengan UI sederhana dan setup ID mentah; tidak konsisten dengan homepage. | Parity produk rendah dan onboarding percakapan membingungkan. |
| Admin | `public/admin.html` mengirim token tanpa bearer session, sementara backend mewajibkan session + admin token. | Panel admin drift dan alur operasional gagal/kurang aman. |
| Worker parity | `scripts/build-worker-page.js` dapat menyinkronkan HTML/CSS/JS homepage ke template Worker. | Perubahan harus selalu dibuild ke Worker sebelum deploy agar tidak terjadi drift. |
| Backend | API listing sudah mendukung q/category/district/condition/min/max/sort/pagination, tetapi frontend hanya memakai subset. | Kapabilitas backend belum terasa pada UX. |

## Arah desain

SultraKita akan memakai visual identity **Tropical Commerce**: hijau hutan sebagai anchor trust, warm sand sebagai canvas, coral/orange untuk action, dan cyan sebagai discovery accent. Layout akan memakai max-width editorial, sticky glass navigation, search-first discovery bar, hero split dengan proof metrics, category chips, dense but breathable listing grid, skeletons, empty/error states, and responsive bottom navigation. Identitas SultraKita tetap asli, bukan salinan Facebook Marketplace atau Shopee.

## Checklist implementasi

- [ ] Rewrite homepage menjadi satu dokumen HTML valid.
- [ ] Bangun design tokens, typography, focus states, reduced-motion, and responsive breakpoints.
- [ ] Perbarui app.js dengan API-driven stats/categories/listings, filters, search suggestions, view details, local favorites, sharing, donation, and seller modal.
- [ ] Tambahkan backend endpoint detail images, safer public listing payload, category filter compatibility, and contact/conversation handoff where supported.
- [ ] Modernisasi chat.html dan perbaiki bearer session handling pada admin.html.
- [ ] Jalankan build-worker-page.js untuk sinkronisasi homepage ke Worker.
- [ ] Jalankan regression, smoke, browser checks, commit, push, dan deploy.
