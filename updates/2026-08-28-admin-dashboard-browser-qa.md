# Admin Dashboard Browser QA

QA lokal dilakukan pada `http://127.0.0.1:3110/admin/index.html` dan `http://127.0.0.1:3110/admin/dashboard.html` pada viewport sandbox.

Halaman login menampilkan field Session bearer, Admin token, tombol Verifikasi akses, link kembali ke marketplace, dan focus outlines yang terlihat. Dashboard tanpa credential menampilkan sidebar dengan pesan akses belum tersedia, header dashboard, tombol mode gelap, tombol keluar, dan tidak menampilkan data operasional sensitif. Ini sesuai pola default-deny; API tetap menjadi otoritas permission.

## Production QA

Setelah commit `d353976`, health production mengembalikan `api: up`, `db: up`, `storage: down`, build `d353976c5a8389e7e5246343b32f5d1bd9f318ee`. Endpoint `/admin/index.html`, `/admin/dashboard.html`, `/admin/users.html`, `/admin/audit-logs.html`, dan `/admin.html` semuanya HTTP 200. `/api/admin/v2/` tanpa session menghasilkan HTTP 401. Canonical `/admin` tetap mengembalikan `Cache-Control: no-store, no-cache, must-revalidate` dan security headers existing.
