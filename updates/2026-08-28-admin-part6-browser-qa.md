# Part 6 Admin Dashboard Browser QA

QA lokal dilakukan pada `/admin/dashboard.html` dan `/admin/users.html` setelah redesign Part 6. Dashboard tampil dengan tema gelap professional, sidebar Workspace, topbar search pengguna, profile chip `GUEST`, toggle Mode, dan Keluar. Tanpa credential, navigasi sensitif tidak muncul dan konten operasional tidak memuat data; status akses tetap default-deny.

Halaman Users menggunakan shell yang sama dan mempertahankan state default-deny tanpa tabel/PII sebelum session bearer dan admin token valid. Focus outlines terlihat pada interactive elements melalui browser annotation, dan header/topbar tetap terbaca pada layout desktop. CSS menyediakan breakpoint mobile <=980px dan <=620px untuk drawer sidebar, stack topbar, dan tabel horizontal scrolling.
