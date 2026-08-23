'use strict';

const { Client } = require('pg');

if (process.env.NODE_ENV === 'production' || process.env.SEED_DEMO !== 'true') {
  console.error('Seed demo diblokir. Set SEED_DEMO=true dan jangan gunakan NODE_ENV=production.');
  process.exit(1);
}
const url = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
if (!url) {
  console.error('DATABASE_URL atau SUPABASE_DB_URL wajib diisi.');
  process.exit(1);
}

const fixtures = [
  ['Honda Vario 160 Demo', 'kendaraan', 24500000, 'second', 'Mandonga'],
  ['Yamaha NMAX Connected Demo', 'kendaraan', 31500000, 'second', 'Baruga'],
  ['Kamera Mirrorless Wakatobi Demo', 'elektronik', 6800000, 'second', 'Kendari Barat'],
  ['Laptop Kerja UMKM Demo', 'elektronik', 5200000, 'second', 'Kadia'],
  ['Sewa Kios Pusat Kota Demo', 'properti', 18000000, 'second', 'Kendari'],
  ['Rumah Minimalis Siap Huni Demo', 'properti', 450000000, 'second', 'Poasia'],
  ['Ikan Kakap Segar Nelayan Demo', 'kuliner', 85000, 'new', 'Poasia'],
  ['Kopi Lokal Konawe Demo', 'kuliner', 65000, 'new', 'Unaaha'],
  ['Jasa Servis AC Panggilan Demo', 'jasa', 150000, 'new', 'Puuwatu'],
  ['Jasa Foto Produk UMKM Demo', 'jasa', 350000, 'new', 'Kadia'],
  ['Tenun Buton Handmade Demo', 'fashion', 450000, 'new', 'Wolio'],
  ['Tas Rajut Wakatobi Demo', 'fashion', 185000, 'new', 'Wangi-Wangi'],
  ['Perabot Kayu Jati Demo', 'perabotan', 1200000, 'second', 'Kolaka'],
  ['Meja Kerja Minimalis Demo', 'perabotan', 750000, 'new', 'Mandonga'],
  ['Alat Pancing Laut Demo', 'hobi-koleksi', 900000, 'second', 'Betoambari'],
  ['Sepeda Lipat Komuter Demo', 'hobi-koleksi', 2300000, 'second', 'Baruga'],
  ['Bibit Kakao Unggul Demo', 'pertanian', 75000, 'new', 'Ladongi'],
  ['Pupuk Organik Kebun Demo', 'pertanian', 125000, 'new', 'Tirawuta'],
  ['Motor Roda Tiga Usaha Demo', 'kendaraan', 28000000, 'second', 'Raha'],
  ['Tanah Kavling Dekat Pelabuhan Demo', 'properti', 175000000, 'second', 'Pasarwajo'],
  ['Ikan Teri Kering Muna Demo', 'hasil-laut', 95000, 'new', 'Napabalano'],
  ['Olahan Rumput Laut Demo', 'hasil-laut', 110000, 'new', 'Kaledupa'],
  ['Operator Alat Berat Demo', 'lowongan-kerja', 4500000, 'new', 'Sampara'],
  ['Admin Toko Online UMKM Demo', 'lowongan-kerja', 2800000, 'new', 'Kambu'],
];

(async () => {
  const client = new Client({ connectionString: url, ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false } });
  try {
    await client.connect();
    const categories = await client.query('SELECT id, slug FROM categories');
    const bySlug = new Map(categories.rows.map(row => [row.slug, row.id]));
    let inserted = 0;
    for (const [title, category, price, condition, district] of fixtures) {
      const exists = await client.query('SELECT id FROM listings WHERE title = $1 AND is_demo = true LIMIT 1', [title]);
      if (exists.rowCount) continue;
      const categoryId = bySlug.get(category);
      if (!categoryId) throw new Error(`Kategori fixture tidak tersedia: ${category}`);
      await client.query(`INSERT INTO listings (category_id, title, description, price, condition, status, district, city, province, is_demo) VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, 'Sulawesi Tenggara', true)`, [categoryId, title, `Listing demo staging V6 untuk menguji discovery ${district}. Bukan data penjual nyata.`, price, condition, district, district === 'Wolio' || district === 'Betoambari' ? 'Baubau' : 'Kendari']);
      inserted += 1;
    }
    console.log(JSON.stringify({ seeded: inserted, total_fixtures: fixtures.length, environment: 'staging-only' }));
  } catch (error) {
    console.error(`Seed demo gagal: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await client.end().catch(error => console.error(`[seed-close] ${error.message}`));
  }
})();
