'use strict';

// Router halaman SEO server-rendered: listing, seller, kategori, wilayah,
// pencarian, sitemap, robots. Diekstrak dari server.js tanpa perubahan
// perilaku; dipasang di root (/).
const express = require('express');
const { query } = require('../database');
const { positiveInt, escapeXml } = require('../lib/validation');
const { SITE_URL, slugify, listingPage, collectionPage, sellerPage } = require('../seo');

const router = express.Router();

router.get('/listing/:slug-:id', async (req, res, next) => {
  try {
    const [listing] = await query(
      "SELECT l.*, c.name AS category_name, c.slug AS category_slug, u.name AS seller_name, u.phone AS seller_phone FROM listings l LEFT JOIN categories c ON c.id = l.category_id LEFT JOIN users u ON u.id = l.seller_id WHERE l.id = ? AND l.status = 'active'",
      [Number(req.params.id)]
    );
    if (!listing) return res.status(404).send('Listing tidak ditemukan');
    const images = await query('SELECT file_url, sort_order FROM listing_images WHERE listing_id = ? ORDER BY sort_order LIMIT 5', [listing.id]);
    return res.type('html').send(listingPage(listing, images));
  } catch (error) { return next(error); }
});

router.get('/seller/:slug-:id', async (req, res, next) => {
  try {
    const sellerId = Number(req.params.id);
    if (!positiveInt(sellerId)) return res.status(404).send('Seller tidak ditemukan');
    const [seller] = await query(
      "SELECT id, name, bio, district, rating_average, rating_count, verification_status FROM users WHERE id = ? AND role IN ('seller', 'admin', 'super_admin')",
      [sellerId]
    );
    if (!seller) return res.status(404).send('Seller tidak ditemukan');
    const listings = await query(
      "SELECT id, title, description, price, district FROM listings WHERE seller_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 50",
      [sellerId]
    );
    return res.type('html').send(sellerPage(seller, listings));
  } catch (error) { return next(error); }
});

router.get('/kategori/:slug', async (req, res, next) => {
  try {
    const [category] = await query('SELECT id, name, slug FROM categories WHERE slug = ?', [req.params.slug]);
    if (!category) return res.status(404).send('Kategori tidak ditemukan');
    const listings = await query(
      "SELECT id, title, description, price, district FROM listings WHERE category_id = ? AND status = 'active' ORDER BY created_at DESC LIMIT 24",
      [category.id]
    );
    return res.type('html').send(collectionPage({
      title: category.name + ' di Sulawesi Tenggara | SultraKita',
      description: 'Temukan ' + category.name.toLowerCase() + ' dari penjual lokal di Kendari dan Sulawesi Tenggara.',
      canonical: SITE_URL + '/kategori/' + category.slug,
      heading: category.name + ' di Sulawesi Tenggara',
      intro: 'Jelajahi listing ' + category.name.toLowerCase() + ' dari warga dan UMKM lokal Sultra.',
      listings,
    }));
  } catch (error) { return next(error); }
});

router.get('/wilayah/:slug', async (req, res, next) => {
  try {
    const district = String(req.params.slug).replace(/-/g, ' ');
    const listings = await query(
      "SELECT id, title, description, price, district FROM listings WHERE lower(district) = lower(?) AND status = 'active' ORDER BY created_at DESC LIMIT 24",
      [district]
    );
    const canonical = SITE_URL + '/wilayah/' + slugify(district);
    return res.type('html').send(collectionPage({
      title: 'Jual beli di ' + district + ' | SultraKita',
      description: 'Marketplace lokal untuk jual beli barang, jasa, dan kebutuhan warga di ' + district + ', Sulawesi Tenggara.',
      canonical,
      heading: 'Jual beli di ' + district,
      intro: 'Temukan penawaran dari penjual lokal di ' + district + '. Bertemu di tempat aman dan waspadai penipuan.',
      listings,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Place',
        name: district,
        address: { '@type': 'PostalAddress', addressLocality: district, addressRegion: 'Sulawesi Tenggara', addressCountry: 'ID' },
      },
    }));
  } catch (error) { return next(error); }
});

router.get('/kategori/:category/:district', async (req, res, next) => {
  try {
    const [category] = await query('SELECT id, name, slug FROM categories WHERE slug = ?', [req.params.category]);
    if (!category) return res.status(404).send('Kategori tidak ditemukan');
    const district = String(req.params.district).replace(/-/g, ' ');
    const listings = await query(
      "SELECT id, title, description, price, district FROM listings WHERE category_id = ? AND lower(district) = lower(?) AND status = 'active' ORDER BY created_at DESC LIMIT 24",
      [category.id, district]
    );
    return res.type('html').send(collectionPage({
      title: category.name + ' di ' + district + ' | SultraKita',
      description: 'Temukan ' + category.name.toLowerCase() + ' di ' + district + ', Sulawesi Tenggara.',
      canonical: SITE_URL + '/kategori/' + category.slug + '/' + slugify(district),
      heading: category.name + ' di ' + district,
      intro: 'Pilihan listing lokal ' + category.name.toLowerCase() + ' untuk warga ' + district + '.',
      listings,
    }));
  } catch (error) { return next(error); }
});

router.get('/cari', async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim().slice(0, 100);
    const listings = q
      ? await query(
        "SELECT id, title, description, price, district FROM listings WHERE status = 'active' AND (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '')) @@ plainto_tsquery('simple', ?) OR title ILIKE ?) ORDER BY created_at DESC LIMIT 24",
        [q, '%' + q + '%']
      )
      : [];
    return res.type('html').send(collectionPage({
      title: 'Cari ' + (q || 'listing') + ' | SultraKita',
      description: 'Hasil pencarian listing marketplace lokal SultraKita.',
      canonical: SITE_URL + '/cari?q=' + encodeURIComponent(q),
      heading: q ? 'Hasil pencarian: ' + q : 'Cari listing lokal',
      intro: 'Temukan barang dan jasa dari warga Sulawesi Tenggara.',
      listings,
    }));
  } catch (error) { return next(error); }
});

router.get('/sitemap.xml', async (_req, res, next) => {
  try {
    const listings = await query("SELECT id, title, updated_at FROM listings WHERE status = 'active' ORDER BY updated_at DESC LIMIT 5000");
    const categories = await query('SELECT slug FROM categories ORDER BY id');
    const sellers = await query("SELECT id, name FROM users WHERE role IN ('seller', 'admin', 'super_admin') ORDER BY id LIMIT 5000");
    const urls = [
      SITE_URL + '/',
      ...categories.map(row => SITE_URL + '/kategori/' + row.slug),
      ...listings.map(row => SITE_URL + '/listing/' + slugify(row.title) + '-' + row.id),
      ...sellers.map(row => SITE_URL + '/seller/' + slugify(row.name) + '-' + row.id),
    ];
    const xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
      + urls.map(url => '<url><loc>' + escapeXml(url) + '</loc></url>').join('') + '</urlset>';
    return res.type('application/xml').send(xml);
  } catch (error) { return next(error); }
});

router.get('/robots.txt', (_req, res) => res.type('text/plain').send(
  'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nSitemap: ' + SITE_URL + '/sitemap.xml\n'
));

router.get('/dukung', (_req, res) => res.redirect(302, '/#dukungan'));

module.exports = router;
