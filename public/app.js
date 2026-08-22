const $ = selector => document.querySelector(selector);
const icons = { properti:'🏠', elektronik:'📱', kendaraan:'🚗', fashion:'👕', perabotan:'🛋️', jasa:'🧰', kuliner:'🍜', 'hobi-koleksi':'📷', 'lowongan-kerja':'💼', lainnya:'🏷️' };
let categories = [];

const rupiah = value => new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 }).format(value);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[character]));
async function api(url, options) { const response = await fetch(url, options); const body = await response.json(); if (!response.ok) throw new Error(body.error || 'Permintaan gagal'); return body; }

async function loadCategories() {
  const body = await api('/api/categories'); categories = body.data;
  $('#categories').innerHTML = categories.map(category => `<button class="category" data-slug="${category.slug}"><div class="category-icon">${icons[category.slug] || '🏷️'}</div><strong>${category.name}</strong><small>Jelajahi</small></button>`).join('');
  $('#form-category').innerHTML = '<option value="">Pilih kategori</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => { $('#category-filter')?.remove(); loadListings({ category: button.dataset.slug }); document.querySelector('#jelajah').scrollIntoView({ behavior:'smooth' }); }));
}
async function loadLocations() {
  const body = await api('/api/locations');
  const options = body.data.districts.map(district => `<option value="${district}">${district}</option>`).join('');
  $('#district').innerHTML += options; $('#form-district').innerHTML = options;
}
async function loadStats() { const body = await api('/api/stats'); const summary = body.data.summary; $('#total-listings').textContent = summary.active_listings; $('#covered-districts').textContent = summary.covered_districts; }
async function loadListings(extra = {}) {
  const params = new URLSearchParams({ q: $('#search').value, district: $('#district').value, sort: $('#sort').value, ...extra });
  if (!params.get('q')) params.delete('q');
  if (!params.get('district')) params.delete('district');
  try {
    const body = await api('/api/listings?' + params);
    if (!body.data.length) { $('#listings').innerHTML = '<div class="empty">Belum ada listing yang cocok. Coba kata kunci atau wilayah lain.</div>'; return; }
    $('#listings').innerHTML = body.data.map(listing => `<article class="listing"><div class="listing-image">${icons[listing.category_slug] || '🏷️'}</div><div class="listing-body"><h3 title="${escapeHtml(listing.title)}">${escapeHtml(listing.title)}</h3><div class="listing-price">${rupiah(listing.price)}</div><div class="listing-meta">${escapeHtml(listing.category_name)} · ${escapeHtml(listing.district)}<br>${escapeHtml(listing.seller_name || 'Penjual lokal')}</div><button class="comment-button" data-listing-id="${listing.id}">Tanya / komentar</button></div></article>`).join('');
    document.querySelectorAll('.comment-button').forEach(button => button.addEventListener('click', async () => {
      const author_name = window.prompt('Nama Anda:');
      const body = author_name && window.prompt('Tulis pertanyaan atau komentar:');
      if (!author_name || !body) return;
      try { await api('/api/comments', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ listing_id:Number(button.dataset.listingId), author_name, body }) }); button.textContent = 'Komentar terkirim'; button.disabled = true; }
      catch (error) { window.alert(error.message); }
    }));
  } catch (error) { $('#listings').innerHTML = `<div class="empty">${error.message}</div>`; }
}
function openDialog() { $('#sell-dialog').showModal(); }
$('#search-button').addEventListener('click', () => loadListings()); $('#search').addEventListener('keydown', event => { if (event.key === 'Enter') loadListings(); }); $('#district').addEventListener('change', () => loadListings()); $('#sort').addEventListener('change', () => loadListings()); $('#open-sell').addEventListener('click', openDialog); $('#open-sell-cta').addEventListener('click', openDialog);
let sellerSession = null;
$('#request-otp').addEventListener('click', async () => { const phone = $('#listing-form [name="phone"]').value; try { const body = await api('/api/auth/request-otp', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ phone }) }); $('#form-message').textContent = body.data.dev_code ? `Kode demo Anda: ${body.data.dev_code}` : 'OTP dikirim melalui provider yang dikonfigurasi.'; } catch (error) { $('#form-message').textContent = error.message; } });
$('#listing-form').addEventListener('submit', async event => { event.preventDefault(); const form = event.target; const values = Object.fromEntries(new FormData(form)); try { if (!sellerSession) { const verified = await api('/api/auth/verify-otp', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify({ phone:values.phone, code:values.otp, name:values.title.slice(0, 60), role:'seller', district:values.district }) }); sellerSession = verified.data; } const listingBody = { title:values.title, description:values.description, price:Number(values.price), category_id:Number(values.category_id), seller_id:sellerSession.user.id, district:values.district }; const listing = await api('/api/listings', { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(listingBody) }); const files = form.querySelector('[name="images"]').files; if (files.length) { const uploadData = new FormData(); [...files].slice(0, 5).forEach(file => uploadData.append('images', file)); await fetch(`/api/listings/${listing.data.id}/images`, { method:'POST', body:uploadData }); } $('#form-message').textContent = 'Iklan dan foto berhasil dipublikasikan.'; form.reset(); sellerSession = null; await Promise.all([loadListings(), loadStats()]); setTimeout(() => $('#sell-dialog').close(), 1000); } catch(error) { $('#form-message').textContent = error.message; } });
Promise.all([loadCategories(), loadLocations(), loadStats(), loadListings()]).catch(error => { $('#listings').innerHTML = `<div class="empty">Gagal memuat platform: ${error.message}</div>`; });

async function submitCommunity(formId, endpoint, messageId, transform = values => values) {
  const form = document.getElementById(formId); if (!form) return;
  form.addEventListener('submit', async event => { event.preventDefault(); const message = document.getElementById(messageId); try { await api(endpoint, { method:'POST', headers:{ 'content-type':'application/json' }, body:JSON.stringify(transform(Object.fromEntries(new FormData(form)))) }); message.textContent = endpoint.includes('donation') ? 'Dukungan Anda tercatat. Terima kasih.' : 'Saran berhasil dikirim. Terima kasih sudah ikut membangun.'; form.reset(); } catch (error) { message.textContent = error.message; } });
}
submitCommunity('suggestion-form', '/api/suggestions', 'suggestion-message');
submitCommunity('donation-form', '/api/donations', 'donation-message', values => ({ ...values, amount:Number(values.amount) }));
