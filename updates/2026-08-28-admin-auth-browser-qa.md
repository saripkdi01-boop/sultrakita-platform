# Part 7 Admin Authentication Browser QA

QA lokal dilakukan pada `/admin/dashboard.html` dan `/admin/users.html?search=kendari` tanpa credential.

Kedua halaman protected tidak merender data admin; browser diarahkan ke `/admin/index.html` dengan parameter `next` yang mengembalikan path internal `/admin/...`. Login page menampilkan field Session bearer, Admin token, tombol Verifikasi akses, dan link marketplace. Tidak ada Supabase anon key, password, atau token pada URL.

## Production QA

Health production setelah commit `5ef2f9a` mengembalikan `api: up`, `db: up`, `storage: down`, build `5ef2f9a0e86381549f5428ee82b2848f8e2e8083`. `/admin/index.html`, `/admin/dashboard.html`, `/admin/users.html`, dan `/admin.html` HTTP 200. `/api/admin/v2/` tanpa credential menghasilkan HTTP 401. HTML route tetap statis dan client-side guard mengarahkan protected page ke login sebelum page API/data controller dijalankan. GitHub Actions run `33131143000` selesai sukses.
