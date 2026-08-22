# SultraKita v3 Release Update

Folder ini adalah checkpoint pembaruan berikutnya setelah `UPGRADE-MASTER-PROMPT-v3.md`.

## Urutan penggunaan

1. Baca `PRODUCTION-RUNBOOK.md` sebelum menyentuh environment production.
2. Baca `SERVER-CHANGES.md` untuk membedakan hardening yang sudah diterapkan dari gap yang masih terbuka.
3. Jalankan baseline test dan verifikasi deployment.
4. Kerjakan authorization/ownership sebagai update kode berikutnya sebelum mengaktifkan fitur mutation yang lebih luas.
5. Tambahkan test keamanan bersamaan dengan implementasi, bukan setelah deployment.
6. Buat folder update baru dengan pola `updates/YYYY-MM-DD-nama-release/` untuk setiap checkpoint berikutnya.

## Status checkpoint ini

| Item | Status |
|---|---|
| Production runbook | Tersedia |
| Server hardening awal | Diterapkan pada commit `ec0236d` |
| Full authorization middleware | Belum selesai |
| Full upload hardening | Belum selesai |
| Runtime parity Express/Worker | Belum selesai |
| Production deployment | Belum dilakukan oleh checkpoint ini |

## Next recommended update

`updates/YYYY-MM-DD-p0-auth-ownership/` dengan fokus pada session middleware, ownership matrix, OTP abuse controls, conversation membership, dan regression tests.
