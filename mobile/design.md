# Rencana Desain Mobile SultraKita

## Arah Produk

SultraKita adalah marketplace komunitas untuk menemukan produk, jasa, dan seller lokal di Sulawesi Tenggara. Aplikasi mobile memakai pola iOS-first: hierarki jelas, navigasi tab bawah, tombol utama mudah dijangkau ibu jari, safe area, state loading/error yang jujur, dan interaksi singkat tanpa halaman buntu. Backend existing tetap menjadi sumber data; aplikasi mobile tidak membuat schema, endpoint, atau proses server baru.

## Screen List

| Layar | Konten utama | Fungsi |
|---|---|---|
| Beranda | Header lokasi, pencarian, kategori, listing terbaru, seller pilihan | Menjelajah listing, membuka pencarian, memilih kategori, dan menyegarkan feed |
| Pencarian | Input kata kunci, filter distrik/kategori/harga, hasil listing | Mencari produk dan jasa dengan filter yang tetap terlihat |
| Detail Listing | Foto, harga, judul, distrik, seller, deskripsi, status verifikasi | Melihat detail, menyimpan listing, membagikan, dan menghubungi seller |
| Buat Listing | Foto, judul, kategori, harga, kondisi, distrik, deskripsi | Menyusun listing baru melalui endpoint backend existing |
| Aktivitas | Notifikasi, listing tersimpan, status interaksi | Memantau aktivitas yang relevan |
| Akun | Profil, status autentikasi, OTP email/WhatsApp, preferensi | Masuk dengan endpoint OTP existing dan mengelola identitas lokal |
| Sheet Filter | Filter kategori, distrik, rentang harga, urutan | Penyaringan cepat tanpa kehilangan konteks feed |
| Empty/Error State | Pesan jujur, aksi coba lagi, fallback offline lokal | Mencegah pengalaman buntu saat backend belum dapat diakses |

## Tata Letak Mobile Portrait

Beranda memakai header ringkas dengan logo wordmark, lokasi “Kendari”, dan avatar akun. Di bawahnya terdapat search bar besar yang dapat dijangkau satu tangan, chip kategori horizontal, kemudian hero kecil dengan pesan lokal dan CTA “Jelajahi listing”. Feed menggunakan kartu dengan gambar rasio 4:3, harga tegas, metadata singkat, dan tombol simpan. Tab bar bawah berisi **Beranda**, **Cari**, **Aktivitas**, dan **Akun**.

Detail listing menggunakan foto besar di bagian atas, ringkasan harga dan lokasi setelah foto, lalu CTA sticky di bawah: **Chat seller** sebagai aksi utama dan **Simpan** sebagai aksi sekunder. Buat Listing dibuka sebagai layar penuh dengan tombol kembali, progress ringan, tombol “Terbitkan listing” di bagian bawah, serta validasi inline.

## Alur Pengguna Utama

### Menemukan Listing

Pengguna membuka Beranda, memilih kategori atau memasukkan kata kunci, melihat hasil feed, mengetuk kartu, membaca detail, lalu memilih Simpan atau Chat seller. Jika data gagal dimuat, aplikasi menampilkan retry dan tidak mengarang listing atau angka statistik.

### Masuk dengan OTP

Pengguna membuka Akun, memilih kanal email atau WhatsApp yang tersedia pada backend existing, memasukkan tujuan, meminta kode, memasukkan enam digit OTP, lalu menerima sesi. State sesi disimpan secara lokal secara aman; aplikasi tidak menampilkan kode OTP atau secret provider.

### Membuat Listing

Pengguna mengetuk tombol tambah, memilih foto opsional, mengisi judul, kategori, harga, kondisi, distrik, dan deskripsi, meninjau ringkasan, lalu mengirim ke endpoint listing existing. Jika belum login, aplikasi mengarahkan ke OTP sebelum submit.

## Warna dan Tipografi

Palet mengambil karakter pesisir dan komunitas Sulawesi Tenggara tanpa menjadi dekoratif berlebihan.

| Token | Nilai | Pemakaian |
|---|---|---|
| `primary` | `#0B6E69` | CTA, tab aktif, aksen utama |
| `primaryDeep` | `#064E4A` | Header, teks kontras, pressed state |
| `coral` | `#E87561` | Badge lokal, highlight, status perhatian |
| `sand` | `#F5EBDD` | Latar aksen dan chip lembut |
| `background` | `#F8FAF8` | Latar utama terang |
| `surface` | `#FFFFFF` | Kartu dan sheet |
| `foreground` | `#172321` | Teks utama |
| `muted` | `#687773` | Metadata dan bantuan |
| `border` | `#DDE7E2` | Divider lembut |
| `success` | `#238B62` | Status sukses |
| `error` | `#C94A4A` | Error dan validasi |

Tipografi menggunakan sans-serif sistem dengan judul tebal dan body regular. Radius kartu 18–22 px, tombol utama 14–16 px, dan elevasi lembut menggantikan border berat. Mode gelap mempertahankan kontras dengan permukaan hijau arang dan aksen teal yang tidak menyilaukan.

## Kontrak Backend yang Dipertahankan

Aplikasi memakai endpoint existing seperti `/api/v2/discovery/search`, `/api/listings/:id`, `/api/auth/request-otp`, `/api/auth/verify-otp`, `/api/listings`, `/api/favorites`, `/api/conversations`, dan `/api/notifications` sesuai dukungan backend yang tersedia. Tidak ada perubahan pada backend SultraKita, migration, secret, schema, atau provider eksternal.
