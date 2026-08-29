# FRONTEND FORENSIC AUDIT V2

## Ringkasan
Audit terhadap codebase existing SultraKita menunjukkan bahwa masalah utama berada pada koordinasi app shell dan breakpoint, bukan pada ketiadaan fitur. Repository sudah memiliki topbar, icon primary navigation, persistent left rail, optional right rail, mobile bottom navigation, drawer full-height, bottom sheet, filter pills, infinite loading, serta state `setDrawer` dan `nav` di `app.js`. Karena itu pendekatan V2 dipertahankan sebagai **recover + refactor**, bukan pembuatan aplikasi baru.

## Root cause yang ditemukan

| Area | Temuan | Dampak | Perbaikan V2 |
|---|---|---|---|
| Primary navigation | `icon-tabbar` tersedia tetapi sebelumnya hanya ikon dan tidak menjadi jalur navigasi berlabel pada viewport sempit. | User harus menebak fungsi ikon; shell terasa bertumpuk dengan bottom navigation. | Menambahkan label `Beranda`, `Video`, `Komunitas`, `Dasbor`, `Notifikasi`, dan `Profil`; menampilkan sebagai horizontal scroll yang scrollbar-nya disembunyikan secara aman pada mobile/tablet. |
| Mobile navigation | Bottom navigation sebelumnya membawa fungsi yang tumpang tindih dengan primary navigation dan bottom bar tetap berpotensi menambah chrome. | Duplikasi fungsi dan vertical/horizontal density yang tidak konsisten. | Bottom navigation disembunyikan pada V2 mobile/tablet; primary navigation menjadi jalur utama yang terlihat, sedangkan drawer tetap menjadi tempat shortcut dan pengaturan. |
| Tablet behavior | Rule legacy `max-width:1199px` menyembunyikan left/right rail sekaligus mengubah layout menjadi block. | Tablet diperlakukan seperti mobile mentah dan kehilangan compact navigation. | Breakpoint 768–1199px memakai labeled primary nav, compact icon-only left rail 72px, main content terukur, dan right rail opsional disembunyikan. |
| Desktop behavior | Desktop sudah memiliki left rail tetapi ukuran dan rhythm belum menjadi sistem tunggal. | Feed utama kurang dominan dan halaman terasa penuh panel. | Desktop ≥1200px memakai grid 248px + main 700px + right rail 280px dengan sticky rail dan max-width shell. |
| Overflow | Filter/chip/pagination memakai horizontal scrolling yang belum memiliki treatment UI seragam. | Garis scrollbar/native overflow tampak seperti elemen UI dan berpotensi membuat halaman melebar. | Filter, pager, pagination, dan chip row memakai `max-width:100%`, `overflow-x:auto`, `scrollbar-width:none`, dan WebKit equivalent; child controls tetap flex-shrink-safe. |
| Drawer | Drawer existing sudah memiliki profile, shortcuts, accordion, upgrade CTA, backdrop, z-index, dan body lock. | Risiko terbesar berasal dari positioning/visibility, bukan markup. | Drawer tidak diganti; layer V2 hanya menyamakan warna, radius, shadow, focus surface, dan mempertahankan trigger `#drawer-toggle` serta `setDrawer`. |
| API/data | `app.js` memakai endpoint existing untuk categories/listings/images/comments/reports/conversations dan Supabase realtime. | Risiko regresi jika frontend diganti dengan mockup. | Perubahan hanya markup shell dan CSS; route/API/database/Supabase client tidak diubah. |

## Breakpoint contract

| Mode | Rentang | Shell |
|---|---:|---|
| Mobile | 0–767px | Topbar konsisten, labeled primary navigation horizontal, main content satu kolom, drawer melalui hamburger, tanpa bottom navigation duplikatif. |
| Tablet | 768–1199px | Topbar dengan hamburger, labeled primary navigation, compact icon-only rail 72px, main content terukur, right rail disederhanakan. |
| Desktop | ≥1200px | Topbar, persistent left sidebar 248px, main content max-width, optional right rail 280px. |

## Validasi

Runtime lokal berhasil memuat data demo dan existing create flow tetap terbuka melalui tombol `Buat listing`. `npm run lint`, `npm test`, `npm run build`, serta `git diff --check` lulus. Pada viewport QA desktop 1280px, computed state menunjukkan `primaryNav: none`, `bottomNav: none`, `leftRail: block`, dan layout tidak mengalami horizontal overflow; ini sesuai kontrak desktop. State mobile/tablet ditentukan oleh media rules terpisah pada stylesheet V2 dan tidak menggunakan `overflow-x:hidden` sebagai workaround global.

## Berkas perubahan

- `public/index.html`: label primary navigation ditambahkan tanpa menghapus binding `data-view` existing.
- `public/rescue-upgrade.css`: aturan V2 responsive shell, compact tablet rail, mobile labeled navigation, overflow-safe controls, dan token compatibility.
- `FRONTEND-FORENSIC-AUDIT-V2.md`: audit dan kontrak breakpoint.

Tidak ada perubahan pada database, skema Supabase, endpoint API, autentikasi, atau route existing.

## V3 follow-up implementation

Instruksi lanjutan meminta architectural rescue, sehingga perubahan V3 tidak hanya menambah warna. Drawer existing kini benar-benar berperilaku sebagai **left off-canvas drawer** dengan lebar maksimum 360px, tinggi `100dvh`, safe-area, overlay, body scroll lock, animasi, focus restoration, focus trap, dan penutupan melalui Escape/backdrop. Primary navigation tetap berasal dari markup existing yang sama dan tidak dibuat ulang sebagai sistem kedua.

Browser QA berhasil membuka drawer dari hamburger. Drawer menampilkan `Menu SultraKita`, profile Alex Sultra, CTA seller, shortcut Marketplace/Komunitas/Insight/Donasi/Notifikasi/Tersimpan, bantuan, pengaturan, dan CTA upgrade. Data flow dan endpoint tidak diubah.
