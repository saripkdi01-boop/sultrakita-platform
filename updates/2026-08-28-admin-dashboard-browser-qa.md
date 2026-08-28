# Admin Dashboard Browser QA

QA lokal dilakukan pada `http://127.0.0.1:3110/admin/index.html` dan `http://127.0.0.1:3110/admin/dashboard.html` pada viewport sandbox.

Halaman login menampilkan field Session bearer, Admin token, tombol Verifikasi akses, link kembali ke marketplace, dan focus outlines yang terlihat. Dashboard tanpa credential menampilkan sidebar dengan pesan akses belum tersedia, header dashboard, tombol mode gelap, tombol keluar, dan tidak menampilkan data operasional sensitif. Ini sesuai pola default-deny; API tetap menjadi otoritas permission.
