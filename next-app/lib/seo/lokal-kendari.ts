/**
 * Data 10 halaman SEO lokal "Kendari" — programmatic SEO SUKI Apps.
 *
 * ATURAN INTEGRITAS (wajib):
 * - Semua teks deskriptif bersifat umum & jujur: tidak ada angka statistik,
 *   testimoni karangan, atau klaim yang tidak terverifikasi.
 * - Daftar listing di setiap halaman HANYA berasal dari query read-only ke
 *   database (tabel listings / properties / jobs) dengan filter anti-demo.
 *   Bila query kosong, halaman menampilkan empty state jujur — bukan listing
 *   fiktif.
 */

export type SumberListing = 'listings' | 'properties' | 'jobs';

export interface KendariKategori {
  slug: string;
  /** Label pendek, mis. "Motor Bekas". */
  label: string;
  /** H1 unik halaman. */
  h1: string;
  /** Meta title unik. */
  title: string;
  /** Meta description unik. */
  description: string;
  /** 2 paragraf deskriptif jujur tentang kategori ini di Kendari. */
  paragraf: string[];
  /** Tips umum bertransaksi aman — generik, bukan klaim. */
  tips: string[];
  sumber: SumberListing;
  /** Kata kunci pencocokan judul/deskripsi (ilike, OR) untuk sumber listings/jobs. */
  katakunci: string[];
  /** Nilai kolom properties.category — wajib bila sumber = properties. */
  kategoriProperti?: string[];
  ctaHref: string;
  ctaLabel: string;
}

export const KENDARI_KATEGORI: KendariKategori[] = [
  {
    slug: 'motor-bekas',
    label: 'Motor Bekas',
    h1: 'Motor Bekas di Kendari',
    title: 'Motor Bekas di Kendari — Jual Beli Motor Second | SUKI Apps',
    description:
      'Cari motor bekas di Kendari: bebek, matic, dan sport second dari penjual lokal. Bandingkan harga, cek kondisi langsung, dan transaksi aman lewat SUKI Apps.',
    paragraf: [
      'Motor adalah kendaraan harian warga Kendari — dari kawasan Mandonga dan Baruga hingga Kambu dan Poasia. Pasar motor bekas di Kendari menawarkan pilihan bebek, matic, hingga sport dengan harga yang jauh lebih terjangkau dibanding unit baru, cocok untuk kebutuhan kerja, kuliah, maupun usaha.',
      'Lewat SUKI Apps, penjual motor bekas di Kendari bisa memasang listing lengkap dengan foto dan harga, sementara pembeli bisa menghubungi penjual secara langsung. Selalu sempatkan cek fisik unit, surat-surat, dan nomor rangka sebelum memutuskan.',
    ],
    tips: [
      'Cek fisik motor secara langsung: mesin, rem, ban, dan kelistrikan.',
      'Pastikan STNK dan BPKB asli dan cocok dengan nomor rangka.',
      'Hindari membayar DP atau transfer sebelum melihat unitnya.',
      'Lakukan transaksi di tempat yang ramai dan aman.',
    ],
    sumber: 'listings',
    katakunci: ['motor'],
    ctaHref: '/marketplace?q=motor',
    ctaLabel: 'Cari motor di Marketplace',
  },
  {
    slug: 'kos-murah',
    label: 'Kos Murah',
    h1: 'Kos Murah di Kendari',
    title: 'Kos Murah di Kendari — Dekat Kampus & Pusat Kota | SUKI Apps',
    description:
      'Temukan kos murah di Kendari: dekat kampus UHO, pusat kota, dan kawasan kerja. Lihat foto, fasilitas, dan harga kos dari pemilik langsung di SUKI Apps.',
    paragraf: [
      'Kebutuhan kos di Kendari tinggi, terutama di sekitar kampus Universitas Halu Oleo (Kadia, Kambu) dan pusat kota (Mandonga, Kendari Barat). Banyak pemilik kos memasang info kamar lengkap dengan fasilitas — dari kos sederhana hingga eksklusif full AC.',
      'Di halaman ini Anda bisa menelusuri listing kos yang dipasang pemilik di SUKI Apps lengkap dengan harga dan lokasi kecamatannya. Hubungi pemilik langsung untuk survei kamar sebelum membayar.',
    ],
    tips: [
      'Survei kamar langsung sebelum membayar uang muka.',
      'Tanyakan detail fasilitas: air, listrik, WiFi, dan aturan kos.',
      'Minta kwitansi resmi untuk setiap pembayaran.',
      'Waspadai harga yang jauh di bawah pasaran tanpa alasan jelas.',
    ],
    sumber: 'properties',
    katakunci: [],
    kategoriProperti: ['kos_kosan'],
    ctaHref: '/properti',
    ctaLabel: 'Lihat semua properti',
  },
  {
    slug: 'mobil-bekas',
    label: 'Mobil Bekas',
    h1: 'Mobil Bekas di Kendari',
    title: 'Mobil Bekas di Kendari — Jual Beli Mobil Second | SUKI Apps',
    description:
      'Cari mobil bekas di Kendari dari penjual lokal: city car, MPV keluarga, hingga niaga. Cek kondisi dan surat-surat sebelum transaksi di SUKI Apps.',
    paragraf: [
      'Mobil bekas menjadi pilihan banyak keluarga dan pelaku usaha di Kendari untuk mobilitas harian maupun operasional. Unit second dari penjual lokal biasanya bisa dinego dan langsung dicek kondisinya tanpa perantara.',
      'SUKI Apps mempertemukan penjual dan pembeli mobil bekas di Kendari dalam satu tempat. Gunakan filter pencarian dan selalu verifikasi dokumen kendaraan sebelum bertransaksi.',
    ],
    tips: [
      'Periksa BPKB, STNK, dan faktur — pastikan tidak dalam sengketa.',
      'Ajak mekanik kepercayaan untuk inspeksi mesin dan kaki-kaki.',
      'Jangan transfer uang sebelum unit dan surat diverifikasi.',
      'Balik nama segera setelah transaksi untuk keamanan hukum.',
    ],
    sumber: 'listings',
    katakunci: ['mobil'],
    ctaHref: '/marketplace?q=mobil',
    ctaLabel: 'Cari mobil di Marketplace',
  },
  {
    slug: 'rumah-dijual',
    label: 'Rumah Dijual',
    h1: 'Rumah Dijual di Kendari',
    title: 'Rumah Dijual di Kendari — Second, Subsidi & Baru | SUKI Apps',
    description:
      'Temukan rumah dijual di Kendari: rumah second, subsidi, hingga perumahan baru dari developer. Lihat peta lokasi dan hubungi penjual langsung di SUKI Apps.',
    paragraf: [
      'Kendari terus berkembang — kawasan Baruga, Kambu, dan Poasia menjadi area hunian yang diminati. Pilihan rumah dijual di Kendari beragam: rumah second siap huni, rumah subsidi, hingga unit baru dari developer perumahan.',
      'Setiap listing properti di SUKI Apps dilengkapi peta lokasi sehingga Anda bisa menilai akses ke jalan utama, sekolah, dan fasilitas umum. Hubungi penjual atau agen langsung dari halaman listing.',
    ],
    tips: [
      'Verifikasi sertifikat tanah (SHM/HGB) di BPN sebelum transaksi.',
      'Cek IMB/PBG dan status perizinan bangunan.',
      'Survei lokasi di jam berbeda untuk menilai akses dan lingkungan.',
      'Gunakan notaris/PPAT resmi untuk akta jual beli.',
    ],
    sumber: 'properties',
    katakunci: [],
    kategoriProperti: ['rumah_second', 'rumah_subsidi', 'rumah_mewah', 'properti_developer'],
    ctaHref: '/properti',
    ctaLabel: 'Jelajahi peta properti',
  },
  {
    slug: 'jasa-tukang',
    label: 'Jasa Tukang',
    h1: 'Jasa Tukang di Kendari',
    title: 'Jasa Tukang di Kendari — Bangunan, Servis & Renovasi | SUKI Apps',
    description:
      'Butuh tukang bangunan, servis, atau renovasi di Kendari? Temukan penyedia jasa lokal dengan portofolio dan ulasan di SUKI Apps.',
    paragraf: [
      'Dari renovasi rumah di Baruga hingga perbaikan instalasi di Mandonga, kebutuhan jasa tukang di Kendari selalu ada. Penyedia jasa lokal di SUKI Apps memasang layanan mereka lengkap dengan deskripsi pekerjaan dan area layanan.',
      'Bandingkan beberapa penyedia jasa, tanyakan estimasi biaya tertulis, dan sepakati sistem pembayaran bertahap sesuai progres pekerjaan.',
    ],
    tips: [
      'Minta estimasi biaya tertulis sebelum pekerjaan dimulai.',
      'Sepakati pembayaran bertahap sesuai progres, bukan lunas di muka.',
      'Simpan bukti chat dan kwitansi setiap pembayaran.',
      'Cek portofolio atau hasil kerja sebelumnya bila tersedia.',
    ],
    sumber: 'listings',
    katakunci: ['tukang', 'jasa'],
    ctaHref: '/marketplace?q=jasa',
    ctaLabel: 'Cari jasa di Marketplace',
  },
  {
    slug: 'kuliner',
    label: 'Kuliner',
    h1: 'Kuliner Kendari',
    title: 'Kuliner Kendari — Jajanan & Makanan Lokal | SUKI Apps',
    description:
      'Jelajahi kuliner Kendari: jajanan pasar, makanan rumahan, dan produk olahan lokal dari UMKM. Pesan langsung dari penjual di SUKI Apps.',
    paragraf: [
      'Kendari punya kekayaan kuliner — dari sinonggi dan olahan sagu khas Sultra hingga jajanan pasar dan roti rumahan. Banyak UMKM kuliner di Kendari memasarkan produknya lewat SUKI Apps agar mudah ditemukan warga.',
      'Dukung usaha kuliner lokal dengan memesan langsung dari penjual. Setiap listing mencantumkan deskripsi produk dan area penjualnya.',
    ],
    tips: [
      'Tanyakan ketersediaan dan estimasi pengiriman sebelum memesan.',
      'Untuk makanan, pastikan tanggal produksi dan daya tahannya.',
      'Simpan bukti pembayaran setiap transaksi.',
      'Beri ulasan jujur agar UMKM lain terbantu.',
    ],
    sumber: 'listings',
    katakunci: ['kuliner', 'makanan', 'roti', 'kopi', 'kue', 'jajanan'],
    ctaHref: '/marketplace?q=kuliner',
    ctaLabel: 'Jelajahi kuliner lokal',
  },
  {
    slug: 'hp-bekas',
    label: 'HP Bekas',
    h1: 'HP Bekas di Kendari',
    title: 'HP Bekas di Kendari — Second Mulus Bergaransi Toko | SUKI Apps',
    description:
      'Cari HP bekas di Kendari: smartphone second mulus dari penjual lokal. Cek kondisi fisik dan kelengkapan sebelum membeli di SUKI Apps.',
    paragraf: [
      'Ganti HP tidak harus selalu beli baru. Pasar HP bekas di Kendari menawarkan smartphone second dengan harga miring — cocok untuk HP kedua, anak sekolah, atau kebutuhan usaha.',
      'Di SUKI Apps, penjual HP bekas mencantumkan kondisi fisik dan kelengkapan (dus, charger, nota). Selalu cek unit langsung dan pastikan IMEI terdaftar sebelum membayar.',
    ],
    tips: [
      'Cek IMEI dan pastikan tidak terblokir.',
      'Uji semua fungsi: layar, kamera, baterai, sinyal, dan speaker.',
      'Minta nota pembelian dan kartu garansi bila masih ada.',
      'Transaksi tatap muka di tempat aman, hindari transfer duluan.',
    ],
    sumber: 'listings',
    katakunci: ['hp', 'handphone', 'smartphone', 'laptop'],
    ctaHref: '/marketplace?q=hp',
    ctaLabel: 'Cari HP di Marketplace',
  },
  {
    slug: 'tanah-dijual',
    label: 'Tanah Dijual',
    h1: 'Tanah Dijual di Kendari',
    title: 'Tanah Dijual di Kendari — Kavling & Tanah Kosong | SUKI Apps',
    description:
      'Cari tanah dijual di Kendari: kavling siap bangun dan tanah kosong untuk investasi. Lihat lokasi di peta dan verifikasi sertifikat di SUKI Apps.',
    paragraf: [
      'Tanah di Kendari — baik kavling siap bangun maupun tanah kosong — diminati untuk hunian dan investasi seiring pertumbuhan kota ke arah Baruga, Kambu, dan Poasia. Listing tanah di SUKI Apps dilengkapi peta lokasi agar posisi bidang mudah dinilai.',
      'Sebelum transaksi, verifikasi keaslian sertifikat dan pastikan bidang tanah tidak dalam sengketa. Gunakan jasa notaris/PPAT untuk setiap peralihan hak.',
    ],
    tips: [
      'Cek keaslian sertifikat di kantor BPN setempat.',
      'Pastikan batas bidang jelas dan tidak sengketa.',
      'Survei akses jalan dan kontur tanah secara langsung.',
      'Semua transaksi tanah wajib lewat akta PPAT/notaris.',
    ],
    sumber: 'properties',
    katakunci: [],
    kategoriProperti: ['tanah_kavling', 'tanah_kosong'],
    ctaHref: '/properti',
    ctaLabel: 'Lihat peta tanah',
  },
  {
    slug: 'lowongan-kerja',
    label: 'Lowongan Kerja',
    h1: 'Lowongan Kerja di Kendari',
    title: 'Lowongan Kerja di Kendari & Sulawesi Tenggara | SUKI Apps',
    description:
      'Temukan lowongan kerja terbaru di Kendari dan Sulawesi Tenggara: dari perusahaan tambang, konstruksi, hingga UMKM. Lamar langsung lewat SUKI Jobs.',
    paragraf: [
      'Kendari sebagai ibu kota Sulawesi Tenggara menjadi pusat aktivitas ekonomi — dari jasa dan perdagangan hingga proyek konstruksi dan pertambangan di kabupaten sekitar. SUKI Jobs menghimpun lowongan dari perusahaan yang membuka rekrutmen di wilayah ini.',
      'Buat profil pelamar sekali, lalu lamar ke banyak lowongan. Pastikan CV dan data diri selalu terbaru agar peluang dilirik perekrut lebih besar.',
    ],
    tips: [
      'Waspadai lowongan yang meminta biaya/transfer dalam proses rekrutmen.',
      'Verifikasi profil perusahaan sebelum mengirim data pribadi.',
      'Jangan berikan data bank atau OTP kepada siapa pun.',
      'Lamar hanya lewat kanal resmi perusahaan atau SUKI Jobs.',
    ],
    sumber: 'jobs',
    katakunci: [],
    ctaHref: '/jobs',
    ctaLabel: 'Lihat semua lowongan',
  },
  {
    slug: 'kontrakan',
    label: 'Kontrakan',
    h1: 'Kontrakan di Kendari',
    title: 'Kontrakan di Kendari — Rumah Kontrakan Tahunan | SUKI Apps',
    description:
      'Sewa kontrakan di Kendari: rumah kontrakan tahunan untuk keluarga dan karyawan. Lihat foto, harga, dan lokasi di SUKI Apps.',
    paragraf: [
      'Bagi keluarga dan karyawan yang butuh hunian lebih lega dari kos, kontrakan tahunan di Kendari menjadi pilihan — tersebar di Mandonga, Baruga, Kambu, hingga Poasia dengan variasi jumlah kamar dan harga.',
      'Listing kontrakan di SUKI Apps mencantumkan harga, jumlah kamar, dan kecamatan lokasinya. Survei langsung dan buat perjanjian sewa tertulis sebelum membayar.',
    ],
    tips: [
      'Buat perjanjian sewa tertulis: durasi, harga, dan hak-kewajiban.',
      'Dokumentasikan kondisi rumah dengan foto saat serah terima.',
      'Tanyakan siapa menanggung perbaikan dan biaya rutin.',
      'Bayar via transfer bank agar ada bukti, bukan tunai tanpa kwitansi.',
    ],
    sumber: 'properties',
    katakunci: [],
    kategoriProperti: ['kontrakan'],
    ctaHref: '/properti',
    ctaLabel: 'Cari kontrakan lain',
  },
];

export function getKendariKategori(slug: string): KendariKategori | undefined {
  return KENDARI_KATEGORI.find((kategori) => kategori.slug === slug);
}

export const KENDARI_SLUGS: string[] = KENDARI_KATEGORI.map((kategori) => kategori.slug);
