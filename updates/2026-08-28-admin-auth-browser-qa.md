# Part 7 Admin Authentication Browser QA

QA lokal dilakukan pada `/admin/dashboard.html` dan `/admin/users.html?search=kendari` tanpa credential.

Kedua halaman protected tidak merender data admin; browser diarahkan ke `/admin/index.html` dengan parameter `next` yang mengembalikan path internal `/admin/...`. Login page menampilkan field Session bearer, Admin token, tombol Verifikasi akses, dan link marketplace. Tidak ada Supabase anon key, password, atau token pada URL.
