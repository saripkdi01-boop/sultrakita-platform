'use strict';

// Seller onboarding + saran listing AI — diekstrak dari server.js tanpa perubahan perilaku.
const { query } = require('../database');
const { boundedText, parseJsonObject, parseJsonArray, positiveInt } = require('./validation');

const onboardingData = (value, fields) => {
  const source = parseJsonObject(value);
  return Object.fromEntries(fields.map(field => {
    const item = source[field];
    if (Array.isArray(item)) return [field, item.slice(0, 8).map(entry => boundedText(entry, 80))];
    if (typeof item === 'number') return [field, Number.isFinite(item) ? item : ''];
    return [field, typeof item === 'boolean' ? item : boundedText(item, field === 'description' ? 2000 : 240)];
  }));
};

const onboardingFields = {
  account: ['email', 'phone', 'name'],
  store: ['store_name', 'store_category', 'store_description', 'district'],
  product: ['title', 'description', 'price', 'category_id', 'condition', 'shipping_methods', 'photo_names'],
};

const localListingSuggestion = async input => {
  const categoryId = Number(input.category_id || 0);
  let categoryName = 'produk pilihan';
  try {
    const [category] = await query('SELECT name FROM categories WHERE id = ?', [categoryId]);
    if (category?.name) categoryName = category.name;
  } catch (error) { console.error('[onboarding-category]', error.message); }
  const photoName = Array.isArray(input.photo_names) && input.photo_names[0]
    ? String(input.photo_names[0]).replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
    : '';
  const title = boundedText(photoName || `${categoryName} lokal Kendari`, 120);
  return {
    title,
    description: `Jual ${title.toLowerCase()} dari seller SultraKita. Jelaskan kondisi, kelengkapan, lokasi, dan cara bertemu aman sebelum dipublikasikan.`,
    price: Number(input.price) > 0 ? Number(input.price) : null,
    category_id: categoryId || null,
    source: 'local_fallback',
  };
};

const aiListingSuggestion = async input => {
  const fallback = await localListingSuggestion(input);
  if (!process.env.OPENAI_API_KEY) return fallback;
  const endpoint = `${process.env.OPENAI_API_BASE || 'https://api.openai.com/v1'}/chat/completions`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Anda membantu seller SultraKita membuat draft listing ringkas dalam Bahasa Indonesia. Balas JSON dengan title, description, price, category_id. Jangan membuat klaim kondisi atau harga yang tidak diberikan.' },
          { role: 'user', content: JSON.stringify({ category_id: input.category_id || null, photo_names: input.photo_names || [], title: input.title || '', description: input.description || '', price: input.price || null, district: input.district || 'Kendari' }) },
        ],
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`AI provider HTTP ${response.status}`);
    const candidate = parseJsonObject(payload.choices?.[0]?.message?.content);
    return {
      title: boundedText(candidate.title || fallback.title, 120),
      description: boundedText(candidate.description || fallback.description, 2000),
      price: Number.isFinite(Number(candidate.price)) ? Number(candidate.price) : fallback.price,
      category_id: positiveInt(candidate.category_id) ? Number(candidate.category_id) : fallback.category_id,
      source: 'openai',
    };
  } catch (error) {
    console.error('[onboarding-ai]', error.message);
    return fallback;
  }
};

module.exports = { onboardingData, onboardingFields, localListingSuggestion, aiListingSuggestion, parseJsonArray };
