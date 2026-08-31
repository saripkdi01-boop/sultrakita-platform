const SITE_URL = (process.env.PUBLIC_SITE_URL || 'https://sultrakita-platform.vercel.app').replace(/\/$/, '');
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const slugify = value => String(value || '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const absolute = value => value && /^https?:\/\//i.test(value) ? value : value ? `${SITE_URL}/${String(value).replace(/^\//, '')}` : `${SITE_URL}/og-image.svg`;

function layout({ title, description, canonical, image, type = 'website', body, jsonLd }) {
  const ld = jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>` : '';
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="${esc(type)}"><meta property="og:site_name" content="SultraKita"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${esc(absolute(image))}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(absolute(image))}"><link rel="stylesheet" href="/styles.css">${ld}</head><body><main class="container seo-page">${body}</main><script src="/app.js"></script></body></html>`;
}

function listingPage(listing, images = []) {
  const title = `${listing.title} — ${listing.district || 'Kendari'} | SultraKita`;
  const description = `${listing.title} di ${listing.district || 'Kendari'}, Sulawesi Tenggara. Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(listing.price || 0))}. Hubungi penjual melalui SultraKita.`;
  const canonical = `${SITE_URL}/listing/${slugify(listing.title)}-${listing.id}`;
  const image = images[0]?.file_url || listing.image_url;
  const product = { '@context': 'https://schema.org', '@type': 'Product', name: listing.title, description: listing.description, image: images.map(row => absolute(row.file_url)).filter(Boolean), offers: { '@type': 'Offer', priceCurrency: 'IDR', price: Number(listing.price), availability: listing.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', url: canonical, seller: { '@type': 'Person', name: listing.seller_name || 'Penjual SultraKita' } }, brand: { '@type': 'Brand', name: 'SultraKita' } };
  const body = `<a href="/" class="brand">SultraKita</a><nav><a href="/">Beranda</a> / <a href="/kategori/${esc(listing.category_slug || 'lainnya')}">${esc(listing.category_name || 'Marketplace')}</a> / ${esc(listing.title)}</nav><article><p class="eyebrow">${esc(listing.category_name || 'Marketplace')} · ${esc(listing.district || 'Kendari')}</p><h1>${esc(listing.title)}</h1><p class="listing-price">Rp ${new Intl.NumberFormat('id-ID').format(Number(listing.price || 0))}</p><p>${esc(listing.description)}</p><p>Penjual: <strong>${esc(listing.seller_name || 'Seller lokal')}</strong></p><a class="button button-primary" href="https://wa.me/${esc(String(listing.seller_phone || '').replace(/\D/g, ''))}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${listing.title} di SultraKita.`)}">Tanya lewat WhatsApp</a><p><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonical)}">Bagikan ke Facebook</a> · <a href="https://wa.me/?text=${encodeURIComponent(`${listing.title} — ${canonical}`)}">Bagikan ke WhatsApp</a></p></article>`;
  return layout({ title, description, canonical, image, type: 'product', body, jsonLd: product });
}

function collectionPage({ title, description, canonical, heading, intro, listings = [], jsonLd }) {
  const cards = listings.map(row => `<article class="listing"><h2><a href="/listing/${esc(slugify(row.title))}-${row.id}">${esc(row.title)}</a></h2><p>Rp ${new Intl.NumberFormat('id-ID').format(Number(row.price || 0))} · ${esc(row.district || 'Kendari')}</p><p>${esc(String(row.description || '').slice(0, 140))}</p></article>`).join('') || '<p>Belum ada listing di halaman ini. Jadilah yang pertama memasang iklan.</p>';
  return layout({ title, description, canonical, body: `<a href="/" class="brand">SultraKita</a><h1>${esc(heading)}</h1><p>${esc(intro)}</p><section class="listing-grid">${cards}</section>`, jsonLd });
}

function sellerPage(seller, listings = []) {
  const name = seller.name || 'Seller lokal';
  const district = seller.district || 'Sulawesi Tenggara';
  const canonical = `${SITE_URL}/seller/${slugify(name)}-${seller.id}`;
  const verified = seller.verification_status === 'approved';
  const description = `${name} adalah seller lokal SultraKita di ${district}. Lihat profil, status verifikasi, dan listing aktifnya.`;
  const cards = listings.map(row => `<article class="listing"><h2><a href="/listing/${esc(slugify(row.title))}-${row.id}">${esc(row.title)}</a></h2><p>Rp ${new Intl.NumberFormat('id-ID').format(Number(row.price || 0))} · ${esc(row.district || district)}</p><p>${esc(String(row.description || '').slice(0, 140))}</p></article>`).join('') || '<p>Seller ini belum memiliki listing aktif.</p>';
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Person', name, url: canonical, description, address: { '@type': 'PostalAddress', addressLocality: district, addressRegion: 'Sulawesi Tenggara', addressCountry: 'ID' }, ...(verified ? { hasCredential: { '@type': 'EducationalOccupationalCredential', credentialCategory: 'Seller terverifikasi SultraKita' } } : {}) };
  const body = `<a href="/" class="brand">SultraKita</a><nav><a href="/">Beranda</a> / Profil seller</nav><article><p class="eyebrow">Profil seller · ${esc(district)}</p><h1>${esc(name)}</h1><p>${verified ? '✓ Seller terverifikasi SultraKita' : 'Seller lokal SultraKita'}</p><p>${esc(seller.bio || 'Seller lokal SultraKita. Tanyakan detail produk sebelum transaksi dan gunakan jalur komunikasi resmi untuk keamanan bersama.')}</p><p>Rating ${Number(seller.rating_average || 0).toFixed(1)} dari ${Number(seller.rating_count || 0)} ulasan.</p></article><section class="listing-grid"><h2>Listing aktif</h2>${cards}</section>`;
  return layout({ title: `${name} — Seller ${district} | SultraKita`, description, canonical, jsonLd, body });
}
module.exports = { SITE_URL, slugify, listingPage, collectionPage, sellerPage, absolute };
