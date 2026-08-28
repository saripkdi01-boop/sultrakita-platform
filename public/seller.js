'use strict';

const $ = selector => document.querySelector(selector);
const params = new URLSearchParams(location.search);
const sellerId = Number(params.get('id') || 0);
const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
const safeImage = value => { const url = String(value || ''); return /^https:\/\//.test(url) || /^\/(?!\/)/.test(url) ? url.replace(/[\'"\\\n\r]/g, '') : ''; };

async function api(path) {
  const response = await fetch(path);
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) throw new Error(body.error || 'Profil seller belum tersedia.');
  return body;
}

function theme() {
  const stored = localStorage.getItem('sultra-dark');
  const dark = stored === 'true' || (stored === null && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  document.body.classList.toggle('dark', dark);
  const toggle = $('#theme-toggle');
  if (toggle) { toggle.textContent = dark ? '☀' : '◐'; toggle.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'); }
  toggle?.addEventListener('click', () => { const next = !document.body.classList.contains('dark'); localStorage.setItem('sultra-dark', String(next)); theme(); });
}

function listingCard(row) {
  const image = safeImage(row.image_url);
  return `<a class="seller-listing" href="/?listing=${Number(row.id)}#jelajah"><div class="seller-listing-media">${image ? `<img src="${esc(image)}" alt="${esc(row.title)}" loading="lazy" decoding="async" width="400" height="300">` : '◈'}</div><div class="seller-listing-body"><h3>${esc(row.title)}</h3><strong>${rupiah(row.price)}</strong><small>${esc(row.category_name || 'Marketplace')} · ${esc(row.district || row.city || 'Kendari')}</small></div></a>`;
}

async function init() {
  theme();
  const hero = $('#seller-hero');
  const listings = $('#seller-listings');
  if (!sellerId) { hero.innerHTML = '<article class="seller-card seller-error"><strong>Profil seller tidak ditemukan.</strong><a class="button button-primary" href="/">Kembali ke marketplace</a></article>'; listings.innerHTML = ''; return; }
  try {
    const result = await api(`/api/sellers/${sellerId}`);
    const { seller, listings: rows = [] } = result.data || {};
    const joined = seller.joined_at ? new Date(seller.joined_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Belum tersedia';
    const badge = seller.verified ? '<span class="seller-badge">✓ Seller terverifikasi</span>' : '<span class="seller-badge">Seller lokal</span>';
    hero.setAttribute('aria-busy', 'false');
    hero.innerHTML = `<article class="seller-card"><div class="seller-card-head"><span class="seller-avatar-xl">${esc(String(seller.name || 'S').slice(0, 1).toUpperCase())}</span><div><p class="eyebrow">Profil seller</p><h1>${esc(seller.name || 'Seller lokal')}</h1>${badge}<p>${esc(seller.district || 'Sulawesi Tenggara')} · Bergabung ${esc(joined)}</p></div></div><p>${esc(seller.bio || 'Seller lokal SultraKita. Tanyakan detail produk sebelum transaksi dan gunakan jalur chat resmi untuk keamanan bersama.')}</p><div class="seller-actions"><a class="button button-primary" href="mailto:SultrakitaPlatform@gmail.com?subject=Pertanyaan%20tentang%20seller%20${encodeURIComponent(seller.name || '')}">Hubungi bantuan</a><a class="button button-soft" href="/">Cari listing lain</a></div></article><aside class="seller-proof" aria-label="Ringkasan kepercayaan seller"><div class="proof-stat"><strong>★ ${Number(seller.rating_average || 0).toFixed(1)}</strong><span>${Number(seller.rating_count || 0)} ulasan tercatat</span></div><div class="proof-stat"><strong>${Number(rows.length || 0)}</strong><span>listing aktif saat ini</span></div><div class="proof-stat"><strong>${Number(seller.sold_count || 0)}</strong><span>listing berstatus terjual</span></div><div class="proof-stat"><strong>${seller.verified ? 'Terverifikasi' : 'Basic'}</strong><span>status trust SultraKita</span></div></aside>`;
    listings.innerHTML = rows.length ? rows.map(listingCard).join('') : '<div class="seller-loading">Seller ini belum memiliki listing aktif.</div>';
  } catch (error) {
    hero.setAttribute('aria-busy', 'false');
    hero.innerHTML = `<article class="seller-card seller-error"><strong>${esc(error.message)}</strong><a class="button button-primary" href="/">Kembali ke marketplace</a></article>`;
    listings.innerHTML = '';
  }
}

init();
