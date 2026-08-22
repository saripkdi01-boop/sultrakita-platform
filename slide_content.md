# Rekapitulasi Pengembangan SultraKita

## Cover
SultraKita
Marketplace lokal Kendari dan Sulawesi Tenggara
Rekapitulasi pengembangan hingga audit Lighthouse

## Slide 1
### Visi Produk Lokal
SultraKita dibangun sebagai ruang jual-beli yang dekat, relevan, dan berakar pada kebutuhan warga Kendari serta Sulawesi Tenggara.

- Fokus kategori: properti, elektronik, kendaraan, jasa, UMKM, kuliner, fashion, dan kebutuhan lokal.
- Nilai utama: kedekatan wilayah, pencarian yang relevan, dan pertumbuhan ekonomi komunitas.
- Posisi produk: alternatif marketplace lokal dengan konteks daerah yang lebih kuat.

## Slide 2
### Dari Prototipe Menuju Fondasi Marketplace
Perjalanan pengembangan mengubah repository awal menjadi platform yang memiliki API, database, frontend, deployment, dan dokumentasi operasional.

- Express API modular dan SQLite/D1 schema dengan seed kategori serta wilayah Sultra.
- Frontend responsif dengan pencarian, filter, sorting, statistik, dan formulir publikasi listing.
- Deployment publik melalui Cloudflare Worker dan database D1.

## Slide 3
### Fitur Transaksi dan Komunitas
SultraKita berkembang dari katalog menjadi platform interaksi lokal.

- Listing dengan kategori, distrik, harga, kondisi, pagination, view count, dan favorit.
- Komentar, saran, laporan listing, dan dukungan proyek melalui pledge donasi.
- Chat pembeli–penjual berbasis Server-Sent Events pada source Express.

## Slide 4
### Kepercayaan Seller dan Keamanan Data
Fondasi trust and safety mulai dibangun untuk mengurangi spam dan meningkatkan kepercayaan.

- OTP dengan hash, expiry, attempt limit, dan session token.
- Pengajuan verifikasi seller untuk KTP, NIB, atau dokumen pendukung.
- Validasi upload maksimal lima foto, format terbatas, ukuran terbatas, dan nama file acak.
- Escaping HTML pada listing untuk mengurangi risiko XSS.

## Slide 5
### SEO Lokal dan Discoverability
Platform diperkuat agar mudah dipahami mesin pencari dan mudah dibagikan.

- Metadata title, description, canonical, Open Graph, Twitter Cards, dan JSON-LD.
- Structured data WebSite serta LocalBusiness untuk Kendari dan Sulawesi Tenggara.
- Favicon, social preview, web manifest, sitemap.xml, dan robots.txt.
- Route sitemap dan robots sudah dilayani langsung oleh Worker live.

## Slide 6
### Analytics Realtime yang Privacy-Aware
Analytics sederhana ditambahkan untuk membantu keputusan produk tanpa menyimpan IP mentah.

- Event: page_view, listing_view, search, dan listing_contact.
- Ringkasan: total event, page views, listing views, pencarian, kontak, listing teratas, dan tren harian.
- Rate limit khusus tracking: 120 event per IP per menit pada Worker.
- Retention D1 otomatis: data analytics lebih lama dari 90 hari dihapus melalui cron harian.

## Slide 7
### Kualitas Terukur dengan Google Lighthouse
Audit dilakukan terhadap URL production live setelah deployment dan perbaikan aksesibilitas.

| Kategori | Skor |
|---|---:|
| Performance | 96/100 |
| Accessibility | 94/100 |
| Best Practices | 96/100 |
| SEO | 100/100 |

Perbaikan aksesibilitas meningkatkan skor dari 83 menjadi 94 melalui label select dan kontras footer. Hasil ini adalah snapshot audit pada perangkat dan jaringan emulasi, bukan jaminan ranking mesin pencari.

## Slide 8
### Langkah Berikutnya Menuju Skala Regional
Fondasi teknis sudah siap untuk dikembangkan menjadi marketplace regional yang lebih kuat.

- Auth provider OTP resmi, admin authentication berbasis secret manager, dan verifikasi seller dengan workflow moderasi.
- Cloudflare R2 untuk media, Durable Objects/WebSocket untuk chat skala tinggi, dan backup D1.
- Payment gateway resmi, settlement, kebijakan retur, fraud prevention, analytics dashboard, dan observability.
- Migrasi dari workers.dev ke custom domain premium ketika pendanaan tersedia.

## Slide 9
### Penutup
SultraKita
Dari warga Sultra, untuk pertumbuhan Sultra.

Repository: github.com/saripkdi01-boop/sultrakita-platform
Demo: sultrakita.aplikasi-cerdasku.workers.dev
