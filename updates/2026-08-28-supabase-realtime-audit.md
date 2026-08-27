# Supabase Frontend & Realtime Audit

## Implementasi

Homepage memakai `public/supabase-client.js` dan `public/live-feed.js` sebagai integration layer optional. Helper membaca konfigurasi dari `window.SULTRA_SUPABASE_CONFIG` atau `/api/public-config`, lalu membuat browser client hanya jika URL dan anon key public tersedia. Service-role key tidak pernah dikirim ke browser. Auth utama tetap memakai Express OTP/session existing karena Supabase Functions `request-otp` dan `verify-otp` belum dikonfigurasi/terbukti tersedia.

`subscribeNewListings()` berlangganan `INSERT` pada `public.listings` dengan filter status active. `live-feed.js` merender banner memakai DOM API dan `textContent`, memiliki `role=status`, tombol Lihat, tombol Tutup berlabel, auto-dismiss 10 detik, dan memanggil `loadListings()` existing. Bila konfigurasi public Supabase kosong atau library client tidak tersedia, helper menjadi no-op dan alur Express tetap menjadi source of truth.

## QA lokal

Homepage lokal dengan query `?phase=realtime` memuat `supabase-client.js?v=realtime-1`, `live-feed.js?v=realtime-1`, `app.js?v=realtime-1`, dan `styles.css?v=realtime-1`. `window.SultraSupabase` dan `window.SultraLiveFeed` tersedia sebagai object; `window.SULTRA_SUPABASE_CONFIG` kosong; banner tidak muncul; `#listings[aria-busy]` kembali menjadi `false`; halaman menampilkan empty state valid karena tidak ada listing aktif.

## Konfigurasi production

Production `/api/public-config` sebelumnya mengembalikan URL/key null. Karena itu Realtime belum diklaim aktif. Implementasi tetap siap diaktifkan setelah anon key public dan Realtime publication/table authorization dikonfigurasi, tanpa memindahkan endpoint Express atau mengubah koneksi database.

Screenshot Chromium headless `updates/qa/homepage-realtime-375.png` pada viewport `375x812` menunjukkan homepage mobile tetap ter-layout, bottom navigation tetap terlihat, dan banner live-feed tidak muncul saat konfigurasi Realtime kosong. Console Chromium hanya mencatat warning lingkungan DBus yang tidak terkait aplikasi.
