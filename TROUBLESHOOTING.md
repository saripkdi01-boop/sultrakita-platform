# Troubleshooting — Support System

## Sidebar tidak berubah

Lakukan hard refresh (`Ctrl+Shift+R` atau `Cmd+Shift+R`), buka mode Incognito, dan pastikan deployment Vercel terbaru berstatus READY. Source sidebar harus berada di `next-app/components/navigation/SidebarNavigation.tsx` dan route support harus menggunakan path absolut.

## Halaman 404

Pastikan root directory project Vercel adalah `next-app`, lalu periksa route di `next-app/app`. Migration database tidak menentukan apakah route Next.js ditemukan; 404 route biasanya berasal dari deployment yang belum berpindah atau konfigurasi root directory.

## Ticket tidak tersimpan

Jalankan migration support terlebih dahulu. Pastikan user sudah login, RLS `support_tickets` aktif, dan browser memiliki session Supabase. Periksa response server action serta log deployment tanpa menampilkan service role key.

## Artikel tidak tampil

Jalankan `npm run seed:help` dengan URL Supabase dan service role key yang benar. Pastikan artikel memiliki `is_published = true`. Jangan memasukkan service role key ke environment frontend atau repository.

## Build gagal

Jalankan `cd next-app && npm run build`. Perbaiki error TypeScript terlebih dahulu dan jangan mengaktifkan workflow n8n sebelum build lulus.
