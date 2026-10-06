'use strict';

// Router onboarding seller: progres 4 langkah, saran AI, dan finalisasi
// (buat listing pertama + profil toko). Diekstrak dari server.js tanpa
// perubahan perilaku; dipasang di /api/seller/onboarding.
const express = require('express');
const { query, run } = require('../database');
const { requireAuth } = require('../auth');
const { normalizeRole } = require('../rbac');
const { ok, fail } = require('../lib/http');
const { positiveInt, boundedText, parseJsonObject } = require('../lib/validation');
const { currentUser } = require('../lib/sessions');
const { ensureAuthSchema } = require('../lib/schema');
const { onboardingData, onboardingFields, aiListingSuggestion } = require('../lib/onboarding');
const { parseJsonArray } = require('../lib/validation');
const { ALL_DISTRICTS } = require('../shared/taxonomy');

const router = express.Router();
const districts = ALL_DISTRICTS;

router.get('/', requireAuth, async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const [row] = await query(
      'SELECT user_id, current_step, status, account_data, store_data, product_data, completed_steps, updated_at, completed_at FROM seller_onboarding_progress WHERE user_id = ?',
      [currentUser(req)]
    );
    ok(res, row
      ? {
        ...row,
        account_data: parseJsonObject(row.account_data),
        store_data: parseJsonObject(row.store_data),
        product_data: parseJsonObject(row.product_data),
        completed_steps: parseJsonArray(row.completed_steps),
      }
      : { user_id: Number(req.user.id), current_step: 1, status: 'in_progress', account_data: {}, store_data: {}, product_data: {}, completed_steps: [] });
  } catch (error) { next(error); }
});

router.patch('/', requireAuth, async (req, res, next) => {
  try {
    await ensureAuthSchema();
    const currentStep = Math.min(4, Math.max(1, Number(req.body?.current_step || 1)));
    const accountData = onboardingData(req.body?.account_data, onboardingFields.account);
    const storeData = onboardingData(req.body?.store_data, onboardingFields.store);
    const productData = onboardingData(req.body?.product_data, onboardingFields.product);
    const completedSteps = Array.isArray(req.body?.completed_steps)
      ? [...new Set(req.body.completed_steps.map(Number).filter(step => step >= 1 && step <= 4))]
      : [];
    await run(
      'INSERT INTO seller_onboarding_progress (user_id, current_step, account_data, store_data, product_data, completed_steps) VALUES (?, ?, ?::jsonb, ?::jsonb, ?::jsonb, ?::jsonb) ON CONFLICT (user_id) DO UPDATE SET current_step = EXCLUDED.current_step, account_data = EXCLUDED.account_data, store_data = EXCLUDED.store_data, product_data = EXCLUDED.product_data, completed_steps = EXCLUDED.completed_steps, updated_at = now()',
      [currentUser(req), currentStep, JSON.stringify(accountData), JSON.stringify(storeData), JSON.stringify(productData), JSON.stringify(completedSteps)]
    );
    ok(res, {
      user_id: Number(req.user.id), current_step: currentStep, status: 'in_progress',
      account_data: accountData, store_data: storeData, product_data: productData, completed_steps: completedSteps,
    });
  } catch (error) { next(error); }
});

router.post('/suggest', requireAuth, async (req, res, next) => {
  try {
    const input = {
      ...parseJsonObject(req.body),
      photo_names: Array.isArray(req.body?.photo_names) ? req.body.photo_names.slice(0, 5).map(name => boundedText(name, 160)) : [],
    };
    ok(res, await aiListingSuggestion(input));
  } catch (error) { next(error); }
});

router.post('/finalize', requireAuth, async (req, res, next) => {
  try {
    await ensureAuthSchema();
    if (!['seller', 'admin', 'super_admin'].includes(normalizeRole(req.user.role))) return fail(res, 403, 'Akun belum memiliki hak seller');
    const storeData = onboardingData(req.body?.store_data, onboardingFields.store);
    const productData = onboardingData(req.body?.product_data, onboardingFields.product);
    const title = boundedText(productData.title, 120);
    const description = boundedText(productData.description, 2000);
    const price = Number(productData.price);
    const categoryId = Number(productData.category_id);
    const condition = productData.condition || 'new';
    const district = districts.includes(productData.district || storeData.district) ? (productData.district || storeData.district) : 'Kendari';
    if (title.length < 5 || description.length < 10 || !Number.isInteger(price) || price < 0 || !positiveInt(categoryId) || !['new', 'second'].includes(condition)) {
      return fail(res, 422, 'Detail produk belum lengkap atau belum valid');
    }
    const listingResult = await run(
      'INSERT INTO listings (seller_id, category_id, title, description, price, condition, district, city, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [currentUser(req), categoryId, title, description, price, condition, district, 'Kendari', null]
    );
    await run('UPDATE users SET store_name = COALESCE(NULLIF(?, \'\'), store_name), store_description = COALESCE(NULLIF(?, \'\'), store_description), district = ? WHERE id = ?',
      [storeData.store_name || null, storeData.store_description || null, district, currentUser(req)]);
    await run(
      "UPDATE seller_onboarding_progress SET current_step = 4, status = 'completed', product_data = ?::jsonb, store_data = ?::jsonb, completed_steps = '[1,2,3,4]'::jsonb, completed_at = now(), updated_at = now() WHERE user_id = ?",
      [JSON.stringify(productData), JSON.stringify(storeData), currentUser(req)]
    );
    const [listing] = await query('SELECT * FROM listings WHERE id = ?', [listingResult.id]);
    res.status(201);
    ok(res, { listing, message: 'Onboarding seller selesai. Produk pertama siap dipublikasikan.' });
  } catch (error) { next(error); }
});

module.exports = router;
