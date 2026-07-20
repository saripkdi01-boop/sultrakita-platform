const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. GET: Ambil Semua Produk
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. POST: Tambah Produk UMKM
app.post('/api/products', async (req, res) => {
  const { name, price, stock, umkm_name, category } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, stock, umkm_name, category) VALUES (?, ?, ?, ?, ?)',
      [name, price, stock, umkm_name, category]
    );
    res.json({ success: true, message: 'Produk berhasil ditambahkan', productId: result.insertId });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend SultraKita berjalan pada port ${PORT}`);
});
