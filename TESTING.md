# Testing Checklist — Support System

## Pre-deployment

- [ ] Jalankan migration `supabase/migrations/20260908000000_support_system.sql`.
- [ ] Jalankan `npm run seed:help` dengan environment Supabase yang aman.
- [ ] Jalankan `cd next-app && npm run build` tanpa error TypeScript.
- [ ] Verifikasi route `/security-center`, `/help-center`, `/support`, `/legal/terms`, dan `/admin/support-tickets`.

## Sidebar

- [ ] Hamburger membuka sidebar.
- [ ] Pusat Keamanan mengarah ke `/security-center`.
- [ ] Pusat Bantuan mengarah ke `/help-center`.
- [ ] Laporkan Masalah mengarah ke `/support`.
- [ ] Ketentuan dan Kebijakan mengarah ke `/legal/terms`.

## Ticket system

- [ ] Form support dapat dibuka.
- [ ] Ticket dapat dibuat oleh user terautentikasi.
- [ ] Nomor ticket terbentuk dengan format `SUP-YYYY-XXXXXX`.
- [ ] Tracking ticket menampilkan status dan timeline.
- [ ] Admin dapat memfilter dan mengubah status ticket.

## Help, security, legal

- [ ] Search dan filter kategori Help Center bekerja.
- [ ] Detail artikel dapat dibuka berdasarkan slug.
- [ ] Security Checkup tampil.
- [ ] Trusted devices dapat dihapus oleh pemilik.
- [ ] Dokumen legal dan versi tampil.

## Production smoke test

```bash
for path in /security-center /help-center /support /legal/terms /admin/support-tickets; do
  curl -I "https://sultrakita-platform.vercel.app$path"
done
```
