'use strict';

// Router percakapan buyer-seller: thread, pesan, SSE stream.
// Diekstrak dari server.js tanpa perubahan perilaku; dipasang di /api/conversations.
// Catatan: guard keanggotaan ganda — middleware use() + cek inline per-route (dipertahankan).
const express = require('express');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');
const { normalizeRole } = require('../rbac');
const { requireConversationMember } = require('../authorization');
const { ok, fail } = require('../lib/http');
const { positiveInt } = require('../lib/validation');
const { notifySellerWhatsApp } = require('../lib/whatsapp');

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const listingId = positiveInt(req.body?.listing_id) ? Number(req.body.listing_id) : null;
    const requestedSellerId = positiveInt(req.body?.seller_id) ? Number(req.body.seller_id) : null;
    const actorId = Number(req.user.id);
    let sellerId = requestedSellerId;
    if (listingId) {
      const [listing] = await query('SELECT seller_id FROM listings WHERE id = ?', [listingId]);
      if (!listing) return fail(res, 404, 'Listing tidak ditemukan');
      sellerId = Number(listing.seller_id);
      if (requestedSellerId && requestedSellerId !== sellerId) return fail(res, 403, 'Seller tidak sesuai dengan listing');
    }
    if (!positiveInt(sellerId) || sellerId === actorId) return fail(res, 422, 'Seller tujuan belum valid');
    const existing = await query('SELECT * FROM conversations WHERE listing_id IS NOT DISTINCT FROM ? AND buyer_id = ? AND seller_id = ?',
      [listingId, actorId, sellerId]);
    if (existing.length) return ok(res, existing[0]);
    const created = await run('INSERT INTO conversations (listing_id, buyer_id, seller_id) VALUES (?, ?, ?)', [listingId, actorId, sellerId]);
    const [conversation] = await query('SELECT * FROM conversations WHERE id = ?', [created.id]);
    res.status(201);
    ok(res, conversation);
  } catch (error) { next(error); }
});

router.use('/:id/messages', async (req, res, next) => {
  if (!positiveInt(req.params.id)) return fail(res, 400, 'ID percakapan tidak valid');
  if (req.method === 'POST' && (!req.body?.body || String(req.body.body).trim().length < 1 || String(req.body.body).trim().length > 2000)) {
    return fail(res, 422, 'Pesan belum valid');
  }
  next();
}, requireConversationMember());

router.use('/:id/stream', async (req, res, next) => {
  if (!positiveInt(req.params.id)) return fail(res, 400, 'ID percakapan tidak valid');
  if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
  const [member] = await query('SELECT id FROM conversations WHERE id = ? AND (buyer_id = ? OR seller_id = ?)',
    [Number(req.params.id), Number(req.user.id), Number(req.user.id)]);
  if (!member && !['admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akses tidak diizinkan');
  next();
});

router.get('/:id/messages', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID percakapan tidak valid');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    const [member] = await query('SELECT id FROM conversations WHERE id = ? AND (buyer_id = ? OR seller_id = ?)',
      [Number(req.params.id), Number(req.user.id), Number(req.user.id)]);
    if (!member && !['admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akses tidak diizinkan');
    ok(res, await query(
      'SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? ORDER BY m.created_at ASC',
      [Number(req.params.id)]
    ));
  } catch (error) { next(error); }
});

router.post('/:id/messages', async (req, res, next) => {
  try {
    const { body } = req.body || {};
    if (!body || body.trim().length < 1 || body.trim().length > 2000) return fail(res, 422, 'Pesan belum valid');
    if (!req.user) return fail(res, 401, 'Autentikasi diperlukan');
    const conversations = await query(
      'SELECT c.*, l.title AS listing_title, seller.name AS seller_name, seller.phone AS seller_phone FROM conversations c LEFT JOIN listings l ON l.id = c.listing_id LEFT JOIN users seller ON seller.id = c.seller_id WHERE c.id = ?',
      [Number(req.params.id)]
    );
    if (!conversations.length) return fail(res, 404, 'Percakapan tidak ditemukan');
    const conversation = conversations[0];
    if (conversation.status !== 'open') return fail(res, 409, 'Percakapan sudah ditutup');
    const created = await run('INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)',
      [Number(req.params.id), Number(req.user.id), body.trim()]);
    await run('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [Number(req.params.id)]);
    const [message] = await query('SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.id = ?', [created.id]);
    if (Number(req.user.id) === Number(conversation.buyer_id)) {
      void notifySellerWhatsApp({
        phone: conversation.seller_phone, sellerName: conversation.seller_name, listingTitle: conversation.listing_title,
        senderName: message.sender_name, message: message.body, channel: 'pesan pembeli',
      });
    }
    res.status(201);
    ok(res, message);
  } catch (error) { next(error); }
});

router.get('/:id/stream', async (req, res) => {
  if (!positiveInt(req.params.id)) return res.status(400).end();
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  res.write(': connected\n\n');
  let lastId = Number(req.query.after || 0);
  const timer = setInterval(async () => {
    try {
      const rows = await query(
        'SELECT m.*, u.name AS sender_name FROM messages m JOIN users u ON u.id = m.sender_id WHERE m.conversation_id = ? AND m.id > ? ORDER BY m.id ASC',
        [Number(req.params.id), lastId]
      );
      for (const message of rows) {
        lastId = message.id;
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      }
    } catch { clearInterval(timer); res.end(); }
  }, 2000);
  req.on('close', () => clearInterval(timer));
});

module.exports = router;
