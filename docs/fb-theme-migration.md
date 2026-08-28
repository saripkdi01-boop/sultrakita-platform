# Catatan Migrasi UI Facebook-style v3

Perubahan v3 memakai pendekatan **selector-preserving**. ID dan kontrak event existing tidak diganti; elemen baru hanya menambah lapisan navigasi dan presentasi.

| Area lama | Selector tetap | Peran v3 |
|---|---|---|
| Search topbar | `#search`, `#search-button`, `#suggestions`, `.top-search` | Search pill Facebook-style; tetap memanggil `loadListings()` dan suggestions existing. |
| Lokasi | `#location-pill`, `#location-label`, dynamic `#location-dialog` | Trigger lokasi tetap; dialog dibangun oleh app.js. |
| Statistik | `#total-listings`, `#covered-districts`, `#weekly-new-listings`, `#stats-status` | Widget metric tetap, hanya diberi surface dan token baru. |
| Kategori | `#categories`, `[data-category]`, `#form-category` | Category row tetap dinamis dari `/api/categories`. |
| Listing | `#listings`, `#load-more`, `[data-open-listing]`, `[data-action]` | Event delegation dan pagination tetap; card dirender oleh `listingCard()`. |
| Filter | `#district`, `#sort`, `#radius`, `#min-price`, `#max-price`, `#clear-filter` | Filter chip/select tetap memakai parameter query existing. |
| Dialog seller | `#sell-dialog`, `#listing-form`, `#request-otp`, `#onboarding-finish` | Flow OTP, onboarding, upload foto, dan finalize tidak diubah. |
| Donasi | `#donation-cta`, dynamic `#donation-dialog` | Flow `POST /api/donations` dan redirect `payment_url` tetap. |
| Compare/recent | `#compare-tray`, `#compare-dialog`, `#recent-section`, `#recent-listings` | Key localStorage dan render lama tetap. |
| Desktop navigation baru | `.fb-top-tabs`, `.fb-right-panel` | Elemen presentasional baru; breakpoint ≥1440 menampilkan right rail. |
| Mobile navigation baru | `#mobile-menu`, `#mobile-menu-drawer`, `#mobile-menu-overlay` | Bottom sheet baru; `#mobile-sell` tetap ada secara hidden agar binding onboarding lama aman. |
| Theme | `#theme-toggle`, `localStorage['sultra-dark']` | Toggle existing dipakai oleh drawer dan topbar; meta theme-color tetap diperbarui. |

## Aturan implementasi berikutnya

Jangan menghapus atau mengganti nama selector yang tercantum di atas tanpa memperbarui binding pada `public/app.js` dalam perubahan yang sama. Tambahkan gaya baru di `public/fb-theme.css` agar override dapat ditinjau dan dihapus secara terpisah dari stylesheet historis.
