'use strict';

// Router upload: presigned URL R2, commit metadata, avatar (crop cerdas),
// dan foto listing multipihak.
// Diekstrak dari server.js tanpa perubahan perilaku.
const express = require('express');
const multer = require('multer');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');
const { normalizeRole } = require('../rbac');
const { ok, fail, failCode } = require('../lib/http');
const { positiveInt, safeText } = require('../lib/validation');
const { currentUser } = require('../lib/sessions');
const { presignStorageConfigured, publicObjectUrl, uploadObject, presignObject } = require('../lib/storage');
const { upload, avatarUpload, hasValidImageSignature, normalizeAvatar } = require('../lib/images');

const router = express.Router();

router.post('/uploads/presign', requireAuth, async (req, res, next) => {
  try {
    const listingId = Number(req.body?.listingId);
    const files = Array.isArray(req.body?.files) ? req.body.files : [];
    if (!positiveInt(listingId) || !files.length || files.length > 5) return fail(res, 422, 'listingId dan maksimal 5 file wajib diisi');
    const [listing] = await query('SELECT id, seller_id FROM listings WHERE id = ?', [listingId]);
    if (!listing) return fail(res, 404, 'Listing tidak ditemukan');
    if (!['admin', 'super_admin'].includes(normalizeRole(req.user.role)) && Number(listing.seller_id) !== Number(req.user.id)) {
      return fail(res, 403, 'Akses tidak diizinkan');
    }
    if (!presignStorageConfigured()) {
      return failCode(res, 503, 'STORAGE_UNAVAILABLE', 'Upload foto sedang belum tersedia. Coba lagi setelah storage dikonfigurasi.');
    }
    const normalized = files
      .map(file => ({ name: safeText(file.name, 160), type: String(file.type || '').toLowerCase(), size: Number(file.size) }))
      .filter(file => /^image\/(jpeg|png|webp)$/.test(file.type) && Number.isSafeInteger(file.size) && file.size > 0 && file.size <= 5 * 1024 * 1024);
    if (normalized.length !== files.length) return fail(res, 422, 'Setiap file harus JPG, PNG, atau WEBP maksimal 5 MB');
    const { nativeR2Configured } = require('../lib/storage');
    if (nativeR2Configured()) {
      const uploads = await Promise.all(normalized.map(file => presignObject(file)));
      return ok(res, uploads);
    }
    const response = await fetch(process.env.R2_PRESIGN_URL, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.R2_UPLOAD_TOKEN || ''}`, 'content-type': 'application/json' },
      body: JSON.stringify({ listingId, files: normalized }),
    });
    if (!response.ok) return failCode(res, 503, 'STORAGE_UNAVAILABLE', 'Storage tidak dapat membuat URL upload sementara.');
    const payload = await response.json();
    if (!Array.isArray(payload.uploads) || payload.uploads.length !== normalized.length) {
      return failCode(res, 502, 'STORAGE_INVALID_RESPONSE', 'Storage memberikan respons upload yang tidak valid.');
    }
    return ok(res, payload.uploads);
  } catch (error) { console.error('[upload-presign]', error.message); return next(error); }
});

router.post('/uploads/commit', requireAuth, async (req, res, next) => {
  try {
    const listingId = Number(req.body?.listingId);
    const uploads = Array.isArray(req.body?.uploads) ? req.body.uploads : [];
    if (!positiveInt(listingId) || !uploads.length || uploads.length > 5) return fail(res, 422, 'listingId dan metadata upload belum valid');
    const [listing] = await query('SELECT id, seller_id FROM listings WHERE id = ?', [listingId]);
    if (!listing) return fail(res, 404, 'Listing tidak ditemukan');
    if (!['admin', 'super_admin'].includes(normalizeRole(req.user.role)) && Number(listing.seller_id) !== Number(req.user.id)) {
      return fail(res, 403, 'Akses tidak diizinkan');
    }
    const existing = await query('SELECT COUNT(*) AS total FROM listing_images WHERE listing_id = ?', [listingId]);
    if (Number(existing[0]?.total || 0) + uploads.length > 5) return fail(res, 422, 'Maksimal lima foto per listing');
    const base = String(process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '');
    const committed = [];
    for (const [index, uploadItem] of uploads.entries()) {
      const fileUrl = String(uploadItem.publicUrl || '');
      if (!base || !fileUrl.startsWith(`${base}/`)) return fail(res, 422, 'URL foto tidak berasal dari storage resmi');
      const result = await run('INSERT INTO listing_images (listing_id, file_url, sort_order) VALUES (?, ?, ?)',
        [listingId, fileUrl.slice(0, 1000), Number(existing[0].total) + index]);
      committed.push({ id: result.id, file_url: fileUrl });
    }
    return ok(res, committed);
  } catch (error) { next(error); }
});

router.post('/me/avatar', requireAuth, avatarUpload.single('avatar'), async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) return fail(res, 422, 'Foto profil JPG, PNG, WebP, atau GIF maksimal 5 MB wajib dipilih');
    if (file.mimetype !== 'image/gif' && !(await hasValidImageSignature(file))) {
      return fail(res, 422, 'Isi file gambar tidak sesuai dengan MIME yang diizinkan');
    }
    const normalized = await normalizeAvatar(file);
    const avatarUrl = await uploadObject(normalized);
    await run('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, currentUser(req)]);
    ok(res, { avatar_url: avatarUrl, width: 512, height: 512, content_type: normalized.mimetype, focus_source: normalized.focusSource });
  } catch (error) {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return fail(res, 413, 'Foto profil maksimal 5 MB');
    next(error);
  }
});

router.post('/listings/:id/images', requireAuth, upload.array('images', 5), async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    if (!req.files?.length) return fail(res, 422, 'Minimal satu foto JPG, PNG, atau WEBP diperlukan');
    for (const file of req.files) {
      if (!(await hasValidImageSignature(file))) return fail(res, 422, 'Isi file gambar tidak sesuai dengan MIME yang diizinkan');
    }
    const listing = await query('SELECT id, seller_id FROM listings WHERE id = ?', [Number(req.params.id)]);
    if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    if (!['admin', 'super_admin'].includes(normalizeRole(req.user.role)) && Number(listing[0].seller_id) !== Number(req.user.id)) {
      return fail(res, 403, 'Akses tidak diizinkan');
    }
    const existing = await query('SELECT COUNT(*) AS total FROM listing_images WHERE listing_id = ?', [Number(req.params.id)]);
    const images = [];
    for (const [index, file] of req.files.entries()) {
      const fileUrl = await uploadObject(file);
      await run('INSERT INTO listing_images (listing_id, file_url, sort_order) VALUES (?, ?, ?)',
        [Number(req.params.id), fileUrl, Number(existing[0].total) + index]);
      images.push(fileUrl);
    }
    ok(res, images);
  } catch (error) { next(error); }
});

router.get('/listings/:id/images', async (req, res, next) => {
  try {
    if (!positiveInt(req.params.id)) return fail(res, 400, 'ID listing tidak valid');
    const listing = await query("SELECT id FROM listings WHERE id = ? AND status = 'active'", [Number(req.params.id)]);
    if (!listing.length) return fail(res, 404, 'Listing tidak ditemukan');
    ok(res, await query('SELECT id, file_url, sort_order, created_at FROM listing_images WHERE listing_id = ? ORDER BY sort_order', [Number(req.params.id)]));
  } catch (error) { next(error); }
});

module.exports = router;
