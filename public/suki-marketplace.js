const IMAGES = {
  house: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/1b5052cb6-c8ba-48d7-b7fb-1a0f7ed163a3.png',
  kendari: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/1b4035aaf-3afa-4860-b4f5-2c7826a25475.png',
  coastal: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/1fba0edf3-8dba-4411-a5c7-6b253c8d020f.png',
  tenun: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/18977e6d3-0969-456a-b44a-73dc0e51a5f2.png',
  garden: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/11c7047dc-0962-48d4-aca3-436cc935564d.png',
  road: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/13e43a210-0da3-4c90-bf98-e1876d349752.png',
  interior: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/1361f4984-fb25-4d77-87a5-3fdbefea3aa1.png',
  commercial: 'https://image.qwenlm.ai/public_source/1b83f01c-4bbc-4233-bd27-5efcbab82278/119fb8c34-8e36-42fe-8b2b-e3bcf75ca350.png'
};

const DEMO_PROPERTIES = [
  { id: 101, title: 'Aqila Residence — Rumah Subsidi Nyaman', type: 'Rumah', area: 'Kambu', district: 'Kambu', price: 173000000, priceLabel: 'Rp 173 jt', land: 98, building: 36, beds: 2, baths: 1, units: 18, totalUnits: 48, status: 'Terverifikasi', association: 'APERSI', sikumbangId: 'KDI0610032025T001', seller: 'Aqila Property Kendari', rating: 4.9, gallery: [IMAGES.house, IMAGES.garden, IMAGES.interior], description: 'Hunian subsidi dengan tata ruang efisien, lingkungan tumbuh, dan akses mudah menuju pusat aktivitas Kambu.' },
  { id: 102, title: 'Mutiara Hills — View Kota dari Mandonga', type: 'Rumah', area: 'Mandonga', district: 'Mandonga', price: 480000000, priceLabel: 'Rp 480 jt', land: 120, building: 70, beds: 3, baths: 2, units: 7, totalUnits: 24, status: 'Baru', association: 'REI', sikumbangId: 'KDI0310082026T004', seller: 'SUKI Home Partner', rating: 4.8, gallery: [IMAGES.house, IMAGES.coastal, IMAGES.garden], description: 'Rumah modern dengan taman depan, pencahayaan natural, dan posisi elevated yang menghadap lanskap kota.' },
  { id: 103, title: 'Madinah City Square VI — Cluster Keluarga', type: 'Rumah', area: 'Baruga', district: 'Baruga', price: 735000000, priceLabel: 'Rp 735 jt', land: 144, building: 90, beds: 3, baths: 2, units: 11, totalUnits: 36, status: 'Terverifikasi', association: 'REI', sikumbangId: 'KDI0310072025T006', seller: 'Ruang Rumah Sultra', rating: 5.0, gallery: [IMAGES.garden, IMAGES.house, IMAGES.interior, IMAGES.coastal], description: 'Cluster keluarga dengan ruang komunal hijau, akses jalan lebar, dan suasana tenang untuk tumbuh bersama.' },
  { id: 104, title: 'Tapera Kendari Tahap 3B — Pilihan Terjangkau', type: 'Rumah', area: 'Poasia', district: 'Poasia', price: 185000000, priceLabel: 'Rp 185 jt', land: 96, building: 36, beds: 2, baths: 1, units: 31, totalUnits: 64, status: 'Siap huni', association: 'AP2ERSI', sikumbangId: 'KDI0910012024T002', seller: 'Tapera Kendari Official', rating: 4.7, gallery: [IMAGES.house, IMAGES.road, IMAGES.garden], description: 'Pilihan rumah terjangkau dari kawasan Tapera Kendari, dengan status supply yang dapat ditinjau.' },
  { id: 105, title: 'Ruko Boulevard Teluk — Siap Usaha', type: 'Ruko', area: 'Kendari Barat', district: 'Kendari Barat', price: 1200000000, priceLabel: 'Rp 1,2 M', land: 84, building: 168, beds: 0, baths: 2, units: 2, totalUnits: 6, status: 'Komersial', association: 'REI', sikumbangId: 'KDI0910012022T003', seller: 'Kendari Commercial Desk', rating: 4.9, gallery: [IMAGES.commercial, IMAGES.kendari, IMAGES.road], description: 'Ruko di koridor yang aktif untuk kuliner, jasa, dan kantor. Fasade terlihat dari jalur utama.' },
  { id: 106, title: 'Lahan Tropis Dekat Kampus — Potensi Tinggi', type: 'Tanah', area: 'Anduonohu', district: 'Kendari', price: 320000000, priceLabel: 'Rp 320 jt', land: 240, building: 0, beds: 0, baths: 0, units: 1, totalUnits: 1, status: 'Pilihan SUKI', association: 'Data lokasi', sikumbangId: 'SUKI-KDI-240', seller: 'Sultra Land Co.', rating: 4.8, gallery: [IMAGES.coastal, IMAGES.road, IMAGES.garden], description: 'Lahan dengan bentuk ideal untuk hunian atau kos, dekat pusat pendidikan dan akses jalan kota.' },
  { id: 107, title: 'Villa Pesisir Nambo — Investasi Akhir Pekan', type: 'Komersial', area: 'Nambo', district: 'Kendari', price: 1850000000, priceLabel: 'Rp 1,85 M', land: 450, building: 210, beds: 4, baths: 3, units: 1, totalUnits: 1, status: 'Premium', association: 'SUKI Curated', sikumbangId: 'SUKI-NAM-450', seller: 'Nambo Coastal Realty', rating: 4.9, gallery: [IMAGES.coastal, IMAGES.house, IMAGES.interior, IMAGES.kendari], description: 'Aset pesisir dengan karakter resort, cocok untuk private villa, homestay, atau ruang acara kecil.' },
  { id: 108, title: 'Rumah Tumbuh di Wua-Wua — Siap Renovasi', type: 'Rumah', area: 'Wua-Wua', district: 'Wua-Wua', price: 560000000, priceLabel: 'Rp 560 jt', land: 150, building: 75, beds: 3, baths: 2, units: 3, totalUnits: 12, status: 'Terverifikasi', association: 'REI', sikumbangId: 'KDI-WUA-150', seller: 'Ruang Rumah Sultra', rating: 4.8, gallery: [IMAGES.house, IMAGES.interior, IMAGES.garden], description: 'Rumah dengan halaman luas dan struktur yang fleksibel untuk dikembangkan sesuai kebutuhan keluarga.' }
];

const AGENTS = [
  { name: 'Nadia Alawiyah', role: 'Spesialis hunian keluarga', rating: '4,9', deals: '84 transaksi', image: IMAGES.interior },
  { name: 'Fajar M. Rasyid', role: 'Kawasan Kendari Barat', rating: '4,8', deals: '61 transaksi', image: IMAGES.kendari },
  { name: 'Ayu Pratiwi', role: 'Rumah subsidi & KPR', rating: '5,0', deals: '103 transaksi', image: IMAGES.garden },
  { name: 'Rizal La Ode', role: 'Komersial & lahan', rating: '4,9', deals: '47 transaksi', image: IMAGES.coastal }
];

const state = { properties: DEMO_PROPERTIES, source: 'sample', category: 'all', query: '', mode: 'buy', price: 'all', sort: 'new', saved: new Set(), currentSlides: {}, timers: new Map(), touchStart: new Map() };
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
const formatPrice = (amount) => {
  const value = Number(amount) || 0;
  if (value >= 1000000000) return `Rp ${(value / 1000000000).toFixed(value % 1000000000 ? 1 : 0).replace('.', ',')} M`;
  if (value >= 1000000) return `Rp ${Math.round(value / 1000000)} jt`;
  return `Rp ${Math.round(value / 1000)} rb`;
};
const formatRupiahInput = (value) => Number(String(value).replace(/\D/g, '')) || 0;

function toast(message) {
  const node = $('#toast');
  node.textContent = message;
  node.classList.add('show');
  clearTimeout(toast.timeout);
  toast.timeout = setTimeout(() => node.classList.remove('show'), 2700);
}

function cardStatusClass(status) {
  if (/premium|komersial/i.test(status)) return 'gold';
  if (/baru|siap/i.test(status)) return 'coral';
  return '';
}

function listingCard(property) {
  const slideIndex = state.currentSlides[property.id] || 0;
  const saved = state.saved.has(property.id);
  const gallery = property.gallery?.length ? property.gallery : [IMAGES.house];
  const dots = gallery.map((_, index) => `<span class="gallery-dot ${index === slideIndex ? 'active' : ''}"></span>`).join('');
  return `<article class="listing-card" data-id="${property.id}" tabindex="0" aria-label="${escapeHTML(property.title)}">
    <div class="card-gallery" data-gallery-id="${property.id}">
      <div class="gallery-track" style="transform:translateX(-${slideIndex * 100}%)">${gallery.map((image, index) => `<img class="gallery-slide" src="${escapeHTML(image)}" alt="${escapeHTML(property.title)} — foto ${index + 1}" loading="lazy" />`).join('')}</div>
      <div class="gallery-scrim"></div>
      <span class="status-badge ${cardStatusClass(property.status)}">${escapeHTML(property.status)}</span>
      <button class="card-heart ${saved ? 'saved' : ''}" data-action="save" type="button" aria-label="${saved ? 'Hapus dari tersimpan' : 'Simpan listing'}">${saved ? '♥' : '♡'}</button>
      ${gallery.length > 1 ? `<button class="gallery-arrow prev" data-action="prev" type="button" aria-label="Foto sebelumnya">‹</button><button class="gallery-arrow next" data-action="next" type="button" aria-label="Foto berikutnya">›</button><div class="gallery-dots">${dots}</div><span class="gallery-count">${slideIndex + 1} / ${gallery.length}</span>` : ''}
    </div>
    <div class="listing-content">
      <div class="listing-price">${escapeHTML(property.priceLabel || formatPrice(property.price))}<small>${property.type === 'Tanah' ? '/ kavling' : property.type === 'Ruko' || property.type === 'Komersial' ? '' : ''}</small></div>
      <h3 class="listing-title">${escapeHTML(property.title)}</h3>
      <div class="listing-location"><span class="location-pin">⌖</span>${escapeHTML(property.area)}, Kendari</div>
      <div class="spec-row">${property.building ? `<span>⌂ <b>${property.building} m²</b></span>` : ''}<span>◫ <b>${property.land} m²</b></span>${property.beds ? `<span>♧ <b>${property.beds} KT</b></span>` : ''}${property.baths ? `<span>◌ <b>${property.baths} KM</b></span>` : ''}</div>
      <div class="trust-row"><span class="trust-source"><i>✓</i> ${escapeHTML(property.sikumbangId)}</span><span class="unit-left">Sisa <b>${property.units}</b> unit</span></div>
    </div>
  </article>`;
}

function filteredProperties() {
  let list = state.properties.filter((property) => {
    const haystack = `${property.title} ${property.area} ${property.district} ${property.type} ${property.sikumbangId}`.toLowerCase();
    const typeMatch = state.category === 'all' || property.type === state.category || (state.category === 'Komersial' && ['Ruko', 'Komersial'].includes(property.type));
    const queryMatch = !state.query || haystack.includes(state.query.toLowerCase());
    const priceMatch = state.price === 'all' || (state.price === 'subsidy' && property.price < 500000000) || (state.price === 'mid' && property.price >= 500000000 && property.price <= 1000000000) || (state.price === 'premium' && property.price > 1000000000);
    const modeMatch = state.mode !== 'rent' || property.type !== 'Tanah';
    return typeMatch && queryMatch && priceMatch && modeMatch;
  });
  if (state.sort === 'low') list = list.sort((a, b) => a.price - b.price);
  if (state.sort === 'high') list = list.sort((a, b) => b.price - a.price);
  if (state.sort === 'new') list = list.sort((a, b) => b.id - a.id);
  return list;
}

function renderListings() {
  const list = filteredProperties();
  const grid = $('#listingGrid');
  if (!list.length) {
    grid.innerHTML = '<div class="empty-state"><strong>Belum menemukan yang cocok.</strong><span>Coba ganti kata kunci atau filter kawasan untuk melihat pilihan lain.</span></div>';
  } else {
    grid.innerHTML = list.map(listingCard).join('');
  }
  $('#mapCount').textContent = list.length || 0;
  const sourceLabel = state.source === 'live' ? 'listing live dari API SUKI' : 'listing pilihan untuk demo interaktif';
  $('#resultSummary').textContent = `${list.length} listing ${sourceLabel}, dengan ID lokasi yang dapat ditinjau.`;
  $('#savedCount').textContent = state.saved.size;
  $('#savedBtn').classList.toggle('has-items', state.saved.size > 0);
  restartGalleryTimers();
}

function restartGalleryTimers() {
  state.timers.forEach((timer) => clearInterval(timer));
  state.timers.clear();
  $$('.listing-card').forEach((card) => {
    const gallery = card.querySelectorAll('.gallery-slide');
    if (gallery.length < 2) return;
    const id = Number(card.dataset.id);
    state.timers.set(id, setInterval(() => moveSlide(id, 1), 5200));
  });
}

function moveSlide(id, direction) {
  const property = state.properties.find((item) => item.id === id);
  if (!property || !property.gallery?.length) return;
  const total = property.gallery.length;
  state.currentSlides[id] = ((state.currentSlides[id] || 0) + direction + total) % total;
  const card = document.querySelector(`.listing-card[data-id="${id}"]`);
  if (!card) return;
  const index = state.currentSlides[id];
  const track = card.querySelector('.gallery-track');
  if (track) track.style.transform = `translateX(-${index * 100}%)`;
  $$('.gallery-dot', card).forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
  const counter = $('.gallery-count', card);
  if (counter) counter.textContent = `${index + 1} / ${total}`;
}

function renderAgents() {
  $('#agentList').innerHTML = AGENTS.map((agent) => `<div class="agent-card"><img class="agent-avatar" src="${agent.image}" alt="${escapeHTML(agent.name)}" /><div class="agent-details"><strong>${escapeHTML(agent.name)}</strong><span>${escapeHTML(agent.role)}</span><span>${escapeHTML(agent.deals)}</span></div><span class="agent-rating">★ ${agent.rating}</span></div>`).join('');
}

function detailModal(property) {
  const trustText = property.sikumbangId.startsWith('SUKI') ? 'Data lokasi SUKI' : `ID SiKumbang ${property.sikumbangId}`;
  return `<div class="detail-hero"><img src="${escapeHTML(property.gallery[0])}" alt="${escapeHTML(property.title)}" /></div><div class="detail-content"><span class="section-kicker">${escapeHTML(property.status)} · ${escapeHTML(property.type)}</span><div class="detail-price">${escapeHTML(property.priceLabel || formatPrice(property.price))}</div><h3>${escapeHTML(property.title)}</h3><div class="detail-meta">⌖ ${escapeHTML(property.area)}, Kendari · ★ ${property.rating}</div><p class="detail-note">${escapeHTML(property.description)}</p><div class="detail-trust"><span>✓ ${escapeHTML(trustText)}</span><span>${property.units} / ${property.totalUnits} unit tersisa</span></div><div class="detail-actions"><button class="primary-button" data-modal-action="contact" type="button">Hubungi agen</button><button class="outline-button" data-modal-action="save" data-id="${property.id}" type="button">${state.saved.has(property.id) ? '♥ Tersimpan' : '♡ Simpan'}</button></div></div>`;
}

function showModal(content) {
  $('#modalContent').innerHTML = content;
  $('#modalBackdrop').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  $('#modalBackdrop').classList.add('hidden');
  document.body.style.overflow = '';
}

function showPostModal() {
  showModal(`<div class="modal-inner"><span class="section-kicker">Untuk pemilik & developer</span><h3>Pasang listing di SUKI</h3><p>Bagikan properti Anda kepada pembeli di Sulawesi Tenggara. Tim SUKI akan membantu memeriksa detail lokasi dan kelengkapan informasi.</p><form class="modal-form" id="postForm"><label>Nama properti<input required name="title" placeholder="Contoh: Griya Bahari Residence" /></label><label>Lokasi<input required name="location" placeholder="Kecamatan / kawasan" /></label><label>Nomor WhatsApp<input required name="phone" placeholder="08xx-xxxx-xxxx" /></label><button class="primary-button" type="submit">Kirim minat listing <span>→</span></button></form></div>`);
}

function showMortgageModal() {
  showModal(`<div class="modal-inner"><span class="section-kicker">Simulasi KPR SUKI</span><h3>Rencanakan pembelianmu.</h3><p>Masukkan angka yang nyaman untuk mendapatkan estimasi cicilan bulanan dengan cepat.</p><form class="modal-form" id="mortgageForm"><label>Harga properti<input required name="price" inputmode="numeric" value="480000000" /></label><label>Uang muka<select name="down"><option value="20">20%</option><option value="30">30%</option><option value="10">10%</option></select></label><label>Tenor<select name="term"><option value="20">20 tahun</option><option value="15">15 tahun</option><option value="25">25 tahun</option></select></label><button class="primary-button" type="submit">Hitung estimasi <span>→</span></button></form><div class="detail-trust" style="margin-top:18px"><span>Estimasi cicilan</span><strong id="modalMortgageResult">Rp 3,8 jt / bulan</strong></div></div>`);
}

function calculateMortgage() {
  const price = formatRupiahInput($('#mortgagePrice').value);
  const down = Number($('#mortgageDown').value);
  const years = Number($('#mortgageTerm').value);
  const principal = Math.max(0, price * (1 - down / 100));
  const monthlyRate = 0.085 / 12;
  const months = years * 12;
  const payment = principal ? principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1) : 0;
  $('#mortgageResult').textContent = `${formatPrice(payment)} / bln`;
}

function mapMode(isMap) {
  $('#exploreLayout').classList.toggle('show-map', isMap);
  $$('.view-toggle').forEach((button) => button.classList.toggle('active', button.dataset.view === (isMap ? 'map' : 'list')));
}

async function loadLiveListings() {
  try {
    const response = await fetch('/api/listings?limit=50', { headers: { accept: 'application/json' } });
    if (!response.ok) throw new Error('API tidak tersedia');
    const payload = await response.json();
    const rows = Array.isArray(payload.data) ? payload.data : [];
    const propertyRows = rows.filter((item) => /properti|rumah|tanah|ruko|komers/i.test(String(item.category_name || item.category || '')));
    if (!propertyRows.length || payload.meta?.source === 'degraded') throw new Error('fallback');
    const liveProperties = propertyRows.map((item, index) => ({
      id: Number(item.id) || 1000 + index,
      title: String(item.title || 'Listing properti Sultra'),
      type: /tanah/i.test(item.category_name || '') ? 'Tanah' : /ruko|komers/i.test(item.category_name || '') ? 'Komersial' : 'Rumah',
      area: String(item.district || 'Kendari'), district: String(item.district || 'Kendari'), price: Number(item.price || 0), priceLabel: formatPrice(item.price), land: Number(item.land_area || 0), building: Number(item.building_area || 0), beds: Number(item.bedrooms || 0), baths: Number(item.bathrooms || 0), units: Number(item.available_units || 1), totalUnits: Number(item.total_units || item.available_units || 1), status: 'Terverifikasi', association: 'SUKI API', sikumbangId: String(item.external_id || item.id || 'SUKI-API'), seller: String(item.seller_name || 'Seller lokal'), rating: Number(item.seller_rating || 4.8), gallery: [String(item.image_url || IMAGES.house), IMAGES.garden, IMAGES.interior], description: String(item.description || 'Listing dari jaringan properti SUKI di Sulawesi Tenggara.')
    }));
    state.properties = liveProperties;
    state.source = 'live';
    renderListings();
  } catch (error) {
    console.info('[suki] menggunakan data curated fallback:', error.message);
  }
}

function bindEvents() {
  window.addEventListener('scroll', () => $('#topbar').classList.toggle('is-sticky', window.scrollY > 30), { passive: true });
  $('#menuBtn').addEventListener('click', () => toast('Menu mobile SUKI siap dikembangkan pada rilis berikutnya.'));
  $('#accountBtn').addEventListener('click', () => toast('Profil La Ode Rizky · Kendari'));
  $('#savedBtn').addEventListener('click', () => {
    if (!state.saved.size) return toast('Belum ada listing tersimpan. Pilih ♡ pada kartu properti.');
    state.query = '';
    state.category = 'all';
    renderListings();
    document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' });
    toast(`${state.saved.size} listing tersimpan di koleksi kamu.`);
  });
  ['#postListingBtn', '#trustPostBtn'].forEach((selector) => $(selector).addEventListener('click', showPostModal));
  $('#commercialBtn').addEventListener('click', () => { state.category = 'Komersial'; $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.category === 'Komersial')); renderListings(); document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' }); });
  $('#allAgentsBtn').addEventListener('click', () => toast('Direktori agen SUKI akan segera dibuka.'));
  $('#locateBtn').addEventListener('click', () => toast('Pusat peta dipindahkan ke Kendari.'));
  $('#expandMapBtn').addEventListener('click', () => toast('Mode peta besar tersedia saat peta interaktif diaktifkan.'));
  $('#mortgageBtn').addEventListener('click', showMortgageModal);
  $('#mortgagePrice').addEventListener('input', calculateMortgage);
  $('#mortgageDown').addEventListener('change', calculateMortgage);
  $('#mortgageTerm').addEventListener('change', calculateMortgage);
  $('#newsletterBtn').addEventListener('click', () => { const email = $('#newsletterEmail').value.trim(); if (!email || !email.includes('@')) return toast('Masukkan email yang valid terlebih dahulu.'); toast('Terima kasih. Pilihan baru akan dikirim ke inbox kamu.'); $('#newsletterEmail').value = ''; });
  $$('.search-tab').forEach((tab) => tab.addEventListener('click', () => { state.mode = tab.dataset.mode; $$('.search-tab').forEach((item) => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); }); }));
  $$('.search-suggestions button').forEach((button) => button.addEventListener('click', () => { $('#locationInput').value = button.dataset.query; state.query = button.dataset.query; document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' }); renderListings(); }));
  $('#searchBtn').addEventListener('click', () => { state.query = $('#locationInput').value.trim(); state.price = $('#priceFilter').value; state.category = $('#typeFilter').value === 'all' ? 'all' : $('#typeFilter').value; $$('.filter-chip').forEach((chip) => chip.classList.toggle('active', chip.dataset.category === state.category)); renderListings(); document.querySelector('#explore').scrollIntoView({ behavior: 'smooth' }); });
  $('#locationInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') $('#searchBtn').click(); });
  $('#typeFilter').addEventListener('change', () => { state.category = $('#typeFilter').value === 'all' ? 'all' : $('#typeFilter').value; renderListings(); });
  $('#priceFilter').addEventListener('change', () => { state.price = $('#priceFilter').value; renderListings(); });
  $('#sortFilter').addEventListener('change', () => { state.sort = $('#sortFilter').value; renderListings(); });
  $$('.filter-chip').forEach((chip) => chip.addEventListener('click', () => { state.category = chip.dataset.category; $$('.filter-chip').forEach((item) => item.classList.toggle('active', item === chip)); renderListings(); }));
  $$('.view-toggle').forEach((button) => button.addEventListener('click', () => mapMode(button.dataset.view === 'map')));
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBackdrop').addEventListener('click', (event) => { if (event.target === $('#modalBackdrop')) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });
  document.addEventListener('click', (event) => {
    const actionNode = event.target.closest('[data-action]');
    const card = event.target.closest('.listing-card');
    if (actionNode && card) {
      event.stopPropagation();
      const id = Number(card.dataset.id);
      if (actionNode.dataset.action === 'prev') moveSlide(id, -1);
      if (actionNode.dataset.action === 'next') moveSlide(id, 1);
      if (actionNode.dataset.action === 'save') { state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id); renderListings(); toast(state.saved.has(id) ? 'Listing disimpan ke koleksi.' : 'Listing dihapus dari koleksi.'); }
      return;
    }
    if (card && !event.target.closest('button')) { const property = state.properties.find((item) => item.id === Number(card.dataset.id)); if (property) showModal(detailModal(property)); }
    const modalAction = event.target.closest('[data-modal-action]');
    if (modalAction?.dataset.modalAction === 'contact') { closeModal(); toast('Agen akan menghubungi kamu melalui SUKI Chat.'); }
    if (modalAction?.dataset.modalAction === 'save') { const id = Number(modalAction.dataset.id); state.saved.has(id) ? state.saved.delete(id) : state.saved.add(id); renderListings(); showModal(detailModal(state.properties.find((item) => item.id === id))); }
  });
  document.addEventListener('pointerdown', (event) => { const gallery = event.target.closest('.card-gallery'); if (gallery) state.touchStart.set(gallery.dataset.galleryId, event.clientX); });
  document.addEventListener('pointerup', (event) => { const gallery = event.target.closest('.card-gallery'); if (!gallery) return; const start = state.touchStart.get(gallery.dataset.galleryId); if (start == null) return; const delta = event.clientX - start; if (Math.abs(delta) > 35) moveSlide(Number(gallery.dataset.galleryId), delta < 0 ? 1 : -1); state.touchStart.delete(gallery.dataset.galleryId); });
  document.addEventListener('submit', (event) => { if (event.target.id === 'postForm') { event.preventDefault(); closeModal(); toast('Terima kasih. Tim SUKI akan menghubungi kamu.'); } if (event.target.id === 'mortgageForm') { event.preventDefault(); const data = new FormData(event.target); const price = formatRupiahInput(data.get('price')); const down = Number(data.get('down')); const years = Number(data.get('term')); const principal = price * (1 - down / 100); const rate = .085 / 12; const months = years * 12; const payment = principal ? principal * rate * Math.pow(1 + rate, months) / (Math.pow(1 + rate, months) - 1) : 0; $('#modalMortgageResult').textContent = `${formatPrice(payment)} / bulan`; } });
}

function init() {
  renderAgents();
  renderListings();
  calculateMortgage();
  bindEvents();
  loadLiveListings();
}

document.addEventListener('DOMContentLoaded', init);
