'use strict';

// Router commerce: profil akun, alamat, keranjang, checkout, pesanan,
// penawaran, notifikasi, dan ulasan. Diekstrak dari server.js tanpa
// perubahan perilaku; dipasang di /api.
const express = require('express');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');
const { ok, fail } = require('../lib/http');
const { positiveInt, safeText } = require('../lib/validation');
const { currentUser } = require('../lib/sessions');
const { orderNumber, createNotification, shippingProviders } = require('../lib/orders');
const { ALL_DISTRICTS } = require('../shared/taxonomy');

const router = express.Router();
const districts = ALL_DISTRICTS;

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const [user] = await query(
      'SELECT id, name, email, phone, role, district, avatar_url, bio, rating_average, rating_count, is_verified, phone_verified, verification_status, created_at FROM users WHERE id = ?',
      [currentUser(req)]
    );
    if (!user) return fail(res, 404, 'Profil tidak ditemukan');
    ok(res, { ...user, rating_average: Number(user.rating_average || 0), rating_count: Number(user.rating_count || 0) });
  } catch (error) { next(error); }
});

router.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const { name, email, bio, district, avatar_url } = req.body || {};
    if (name !== undefined && safeText(name, 80).length < 2) return fail(res, 422, 'Nama minimal 2 karakter');
    if (email !== undefined && email && !/^\S+@\S+\.\S+$/.test(String(email))) return fail(res, 422, 'Email belum valid');
    if (district !== undefined && !districts.includes(district)) return fail(res, 422, 'Kecamatan tidak valid');
    await run('UPDATE users SET name = COALESCE(?, name), email = ?, bio = ?, district = COALESCE(?, district), avatar_url = ? WHERE id = ?',
      [name === undefined ? null : safeText(name, 80), email ? safeText(email, 160) : null, bio ? safeText(bio, 500) : null, district || null, avatar_url ? safeText(avatar_url, 500) : null, currentUser(req)]);
    const [user] = await query('SELECT id, name, email, phone, role, district, avatar_url, bio, rating_average, rating_count, verification_status FROM users WHERE id = ?', [currentUser(req)]);
    ok(res, user);
  } catch (error) { next(error); }
});

router.get('/me/addresses', requireAuth, async (req, res, next) => {
  try {
    ok(res, await query(
      'SELECT id, label, recipient_name, phone, address_line, district, city, province, postal_code, notes, is_default FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC',
      [currentUser(req)]
    ));
  } catch (error) { next(error); }
});

router.post('/me/addresses', requireAuth, async (req, res, next) => {
  try {
    const { label = 'Rumah', recipient_name, phone, address_line, district = 'Kendari', city = 'Kendari', province = 'Sulawesi Tenggara', postal_code = null, notes = null, is_default = false } = req.body || {};
    if (safeText(recipient_name, 100).length < 2 || !/^08\d{8,13}$/.test(phone || '') || safeText(address_line, 500).length < 8 || !districts.includes(district)) {
      return fail(res, 422, 'Data alamat belum valid');
    }
    if (is_default) await run('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', [currentUser(req)]);
    const result = await run(
      'INSERT INTO user_addresses (user_id, label, recipient_name, phone, address_line, district, city, province, postal_code, notes, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [currentUser(req), safeText(label, 60) || 'Rumah', safeText(recipient_name, 100), phone, safeText(address_line, 500), district,
        safeText(city, 80), safeText(province, 80), postal_code ? safeText(postal_code, 10) : null, notes ? safeText(notes, 300) : null, is_default ? 1 : 0]
    );
    res.status(201);
    ok(res, { id: result.id, message: 'Alamat tersimpan' });
  } catch (error) { next(error); }
});

router.get('/cart', requireAuth, async (req, res, next) => {
  try {
    const [cart] = await query('SELECT id, updated_at FROM carts WHERE user_id = ?', [currentUser(req)]);
    if (!cart) return ok(res, { items: [], subtotal: 0 });
    const items = await query(
      'SELECT ci.id, ci.listing_id, ci.quantity, l.title, l.price, l.image_url, l.seller_id, l.status FROM cart_items ci JOIN listings l ON l.id = ci.listing_id WHERE ci.cart_id = ? ORDER BY ci.id DESC',
      [cart.id]
    );
    ok(res, {
      items: items.map(item => ({ ...item, quantity: Number(item.quantity), price: Number(item.price), line_total: Number(item.price) * Number(item.quantity) })),
      subtotal: items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0),
    });
  } catch (error) { next(error); }
});

router.post('/cart/items', requireAuth, async (req, res, next) => {
  try {
    const listingId = Number(req.body?.listing_id);
    const quantity = Number(req.body?.quantity || 1);
    if (!positiveInt(listingId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return fail(res, 422, 'Listing atau jumlah belum valid');
    }
    const [listing] = await query("SELECT id, status FROM listings WHERE id = ? AND status = 'active'", [listingId]);
    if (!listing) return fail(res, 404, 'Listing aktif tidak ditemukan');
    let [cart] = await query('SELECT id FROM carts WHERE user_id = ?', [currentUser(req)]);
    if (!cart) {
      const created = await run('INSERT INTO carts (user_id) VALUES (?)', [currentUser(req)]);
      cart = { id: created.id };
    }
    const [existing] = await query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND listing_id = ?', [cart.id, listingId]);
    if (existing) await run('UPDATE cart_items SET quantity = ? WHERE id = ?', [Math.min(99, Number(existing.quantity) + quantity), existing.id]);
    else await run('INSERT INTO cart_items (cart_id, listing_id, quantity) VALUES (?, ?, ?)', [cart.id, listingId, quantity]);
    await run('UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [cart.id]);
    ok(res, { listing_id: listingId, quantity });
  } catch (error) { next(error); }
});

router.patch('/cart/items/:id', requireAuth, async (req, res, next) => {
  try {
    const quantity = Number(req.body?.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) return fail(res, 422, 'Jumlah harus antara 1 dan 99');
    const [item] = await query('SELECT ci.id FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE ci.id = ? AND c.user_id = ?',
      [Number(req.params.id), currentUser(req)]);
    if (!item) return fail(res, 404, 'Item keranjang tidak ditemukan');
    await run('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [quantity, item.id]);
    ok(res, { id: item.id, quantity });
  } catch (error) { next(error); }
});

router.delete('/cart/items/:id', requireAuth, async (req, res, next) => {
  try {
    await run('DELETE FROM cart_items WHERE id IN (SELECT ci.id FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE ci.id = ? AND c.user_id = ?)',
      [Number(req.params.id), currentUser(req)]);
    ok(res, { deleted: true });
  } catch (error) { next(error); }
});

router.post('/shipping/quotes', requireAuth, async (req, res, next) => {
  try {
    const weight = Math.min(100000, Math.max(100, Number(req.body?.weight_grams || 1000)));
    const destination = safeText(req.body?.destination_city || 'Kendari', 80);
    const distanceFactor = /kendari/i.test(destination) ? 1 : 1.35;
    const quotes = shippingProviders.map(item => ({
      ...item,
      price: Math.ceil((item.base + Math.max(0, weight - 1000) * 8) * distanceFactor / 1000) * 1000,
      weight_grams: weight,
      destination_city: destination,
      is_estimate: true,
      notice: 'Estimasi; booking dan resi provider memerlukan kredensial API resmi.',
    }));
    ok(res, quotes);
  } catch (error) { next(error); }
});

router.post('/checkout', requireAuth, async (req, res, next) => {
  try {
    const addressId = Number(req.body?.address_id);
    const paymentMethod = ['qris', 'virtual_account', 'manual_transfer'].includes(req.body?.payment_method) ? req.body.payment_method : 'manual_transfer';
    const [address] = await query('SELECT id FROM user_addresses WHERE id = ? AND user_id = ?', [addressId, currentUser(req)]);
    if (!address) return fail(res, 422, 'Alamat pengiriman wajib dipilih');
    const [cart] = await query('SELECT id FROM carts WHERE user_id = ?', [currentUser(req)]);
    if (!cart) return fail(res, 422, 'Keranjang masih kosong');
    const items = await query(
      "SELECT ci.listing_id, ci.quantity, l.title, l.price, l.seller_id FROM cart_items ci JOIN listings l ON l.id = ci.listing_id WHERE ci.cart_id = ? AND l.status = 'active'",
      [cart.id]
    );
    if (!items.length) return fail(res, 422, 'Tidak ada listing aktif di keranjang');
    const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
    const shipping = Math.min(500000, Math.max(12000, Math.ceil(items.reduce((sum, item) => sum + Number(item.quantity), 0) * 8000 / 1000) * 1000));
    const total = subtotal + shipping;
    const number = orderNumber();
    const created = await run(
      'INSERT INTO orders (order_number, buyer_id, address_id, subtotal, shipping_amount, total_amount, payment_method, escrow_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [number, currentUser(req), addressId, subtotal, shipping, total, paymentMethod, 'held']
    );
    for (const item of items) {
      await run('INSERT INTO order_items (order_id, listing_id, seller_id, title_snapshot, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [created.id, item.listing_id, item.seller_id, item.title, item.price, item.quantity, Number(item.price) * Number(item.quantity)]);
      // Listing tetap aktif sampai webhook/provider mengonfirmasi pembayaran; mencegah barang terkunci oleh checkout gagal.
      if (item.seller_id) {
        await createNotification({
          userId: item.seller_id, type: 'order_created', title: 'Pesanan baru',
          body: `Pesanan ${number} membutuhkan perhatian.`, link: `/orders.html?id=${created.id}`,
        });
      }
    }
    await run('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    res.status(201);
    ok(res, {
      order_id: created.id, order_number: number, subtotal, shipping_amount: shipping, total_amount: total,
      payment_status: 'pending', order_status: 'pending', message: 'Pesanan dibuat. Provider pembayaran resmi belum diaktifkan.',
    });
  } catch (error) { next(error); }
});

router.get('/orders', requireAuth, async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT id, order_number, subtotal, shipping_amount, total_amount, payment_method, payment_status, order_status, escrow_status, created_at FROM orders WHERE buyer_id = ? ORDER BY id DESC LIMIT 50',
      [currentUser(req)]
    );
    ok(res, rows.map(row => ({ ...row, total_amount: Number(row.total_amount), subtotal: Number(row.subtotal), shipping_amount: Number(row.shipping_amount) })));
  } catch (error) { next(error); }
});

router.get('/orders/:id', requireAuth, async (req, res, next) => {
  try {
    const [order] = await query('SELECT * FROM orders WHERE id = ? AND buyer_id = ?', [Number(req.params.id), currentUser(req)]);
    if (!order) return fail(res, 404, 'Pesanan tidak ditemukan');
    const items = await query('SELECT id, listing_id, title_snapshot, unit_price, quantity, line_total FROM order_items WHERE order_id = ? ORDER BY id', [order.id]);
    const [shipment] = await query('SELECT provider, service_code, tracking_number, status, tracking_url, last_event, last_event_at FROM shipments WHERE order_id = ?', [order.id]);
    ok(res, {
      ...order,
      subtotal: Number(order.subtotal), shipping_amount: Number(order.shipping_amount), total_amount: Number(order.total_amount),
      items, shipment: shipment || null,
    });
  } catch (error) { next(error); }
});

router.post('/offers', requireAuth, async (req, res, next) => {
  try {
    const listingId = Number(req.body?.listing_id);
    const amount = Number(req.body?.amount);
    const message = safeText(req.body?.message, 500);
    if (!positiveInt(listingId) || !Number.isSafeInteger(amount) || amount < 1000) return fail(res, 422, 'Listing atau nilai tawaran belum valid');
    const [listing] = await query("SELECT id, seller_id, title, status FROM listings WHERE id = ? AND status = 'active'", [listingId]);
    if (!listing || !listing.seller_id) return fail(res, 404, 'Listing aktif tidak ditemukan');
    if (Number(listing.seller_id) === currentUser(req)) return fail(res, 422, 'Seller tidak dapat menawar listing sendiri');
    const result = await run('INSERT INTO offers (listing_id, buyer_id, seller_id, amount, message) VALUES (?, ?, ?, ?, ?)',
      [listingId, currentUser(req), listing.seller_id, amount, message || null]);
    await createNotification({
      userId: listing.seller_id, type: 'offer_received', title: 'Tawaran harga baru',
      body: `Ada tawaran baru untuk ${listing.title}.`, link: `/chat.html?listing=${listingId}`,
    });
    res.status(201);
    ok(res, { id: result.id, status: 'pending', amount });
  } catch (error) { next(error); }
});

router.patch('/offers/:id', requireAuth, async (req, res, next) => {
  try {
    const status = ['accepted', 'rejected', 'cancelled'].includes(req.body?.status) ? req.body.status : null;
    if (!status) return fail(res, 422, 'Status tawaran tidak valid');
    const [offer] = await query('SELECT * FROM offers WHERE id = ? AND seller_id = ?', [Number(req.params.id), currentUser(req)]);
    if (!offer) return fail(res, 404, 'Tawaran tidak ditemukan');
    await run("UPDATE offers SET status = ?, responded_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'", [status, offer.id]);
    await createNotification({
      userId: offer.buyer_id, type: `offer_${status}`, title: `Tawaran ${status}`,
      body: `Tawaran Anda untuk listing #${offer.listing_id} telah ${status}.`, link: `/chat.html?listing=${offer.listing_id}`,
    });
    ok(res, { id: offer.id, status });
  } catch (error) { next(error); }
});

router.get('/notifications', requireAuth, async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT id, type, title, body, body AS message, data, link, read_at, (read_at IS NOT NULL) AS read, created_at FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 50',
      [currentUser(req)]
    );
    const [unread] = await query('SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND read_at IS NULL', [currentUser(req)]);
    ok(res, { items: rows, unread: Number(unread.total || 0) });
  } catch (error) { next(error); }
});

router.post('/notifications/:id/read', requireAuth, async (req, res, next) => {
  try {
    await run('UPDATE notifications SET read_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [Number(req.params.id), currentUser(req)]);
    ok(res, { read: true });
  } catch (error) { next(error); }
});

router.post('/orders/:id/reviews', requireAuth, async (req, res, next) => {
  try {
    const rating = Number(req.body?.rating);
    const body = safeText(req.body?.body, 800);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail(res, 422, 'Rating harus 1 sampai 5');
    const [order] = await query("SELECT id FROM orders WHERE id = ? AND buyer_id = ? AND order_status IN ('delivered','completed')",
      [Number(req.params.id), currentUser(req)]);
    if (!order) return fail(res, 409, 'Pesanan belum dapat diberi ulasan');
    const [item] = await query('SELECT listing_id, seller_id FROM order_items WHERE order_id = ? AND seller_id IS NOT NULL LIMIT 1', [order.id]);
    if (!item) return fail(res, 409, 'Seller pesanan tidak ditemukan');
    const result = await run('INSERT INTO reviews (order_id, reviewer_id, reviewee_id, listing_id, rating, body) VALUES (?, ?, ?, ?, ?, ?)',
      [order.id, currentUser(req), item.seller_id, item.listing_id, rating, body || null]);
    const [summary] = await query('SELECT AVG(rating) AS average, COUNT(*) AS total FROM reviews WHERE reviewee_id = ?', [item.seller_id]);
    await run('UPDATE users SET rating_average = ?, rating_count = ? WHERE id = ?',
      [Number(summary.average || 0).toFixed(2), Number(summary.total || 0), item.seller_id]);
    res.status(201);
    ok(res, { id: result.id, rating, message: 'Ulasan tersimpan' });
  } catch (error) {
    if (String(error.message).toLowerCase().includes('unique')) return fail(res, 409, 'Pesanan sudah diberi ulasan');
    next(error);
  }
});

module.exports = router;
