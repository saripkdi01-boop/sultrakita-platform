'use strict';

(() => {
  const API = '/api/v2/promo';
  const state = { campaigns: [], listings: [], connections: [], current: null };
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const money = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
  const label = value => String(value || '').replaceAll('_', ' ');
  const statusClass = value => ({ PUBLISHED: 'is-green', READY: 'is-green', MANUAL_ACTION_REQUIRED: 'is-amber', AWAITING_APPROVAL: 'is-amber' }[value] || '');

  async function request(path, options = {}) {
    const headers = { accept: 'application/json', ...(options.body ? { 'content-type': 'application/json' } : {}), ...(options.headers || {}) };
    const response = await fetch(`${API}${path}`, { credentials: 'include', ...options, headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.success === false) {
      const error = new Error(body.error || `Permintaan gagal (${response.status})`);
      error.status = response.status;
      error.details = body.details;
      throw error;
    }
    return body.data;
  }

  function toast(message) {
    const element = $('#promo-toast');
    element.textContent = message;
    element.classList.add('show');
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => element.classList.remove('show'), 3000);
  }

  function showNotice(message, tone = 'warning') {
    const element = $('#overview-notice');
    element.hidden = false;
    element.dataset.tone = tone;
    element.textContent = message;
  }

  function showError(target, error) {
    const message = error.status === 401 ? 'Silakan masuk sebagai seller untuk menggunakan Promo Hub.' : error.status === 403 ? 'Akun atau listing ini tidak memiliki izin untuk aksi tersebut.' : error.message;
    if (target) {
      target.hidden = false;
      target.textContent = message;
      target.dataset.tone = 'error';
    }
    return message;
  }

  function go(section) {
    $$('[data-panel]').forEach(panel => { panel.hidden = panel.dataset.panel !== section; });
    $$('.promo-nav-item').forEach(item => item.classList.toggle('is-active', item.dataset.section === section));
    $('#promo-main').focus({ preventScroll: true });
    if (section === 'campaigns') renderCampaigns($('#all-campaigns'));
    if (section === 'connections') renderConnections();
    if (section === 'analytics') loadAnalytics();
    if (window.innerWidth <= 900) $('#promo-sidebar').classList.remove('open');
  }

  function statusTag(status) {
    return `<span class="promo-tag ${statusClass(status)}">${esc(label(status))}</span>`;
  }

  function campaignCard(campaign) {
    const channels = (campaign.channels || []).map(channel => `<span class="promo-tag">${esc(channel)}</span>`).join('');
    return `<article class="promo-campaign-card" data-campaign-id="${Number(campaign.id)}" tabindex="0" role="button" aria-label="Buka campaign ${esc(campaign.name)}"><div class="promo-campaign-card-head"><div><h4>${esc(campaign.name)}</h4><p>${esc(campaign.listing_title || 'Listing terikat')} · ${esc(campaign.location || 'Sulawesi Tenggara')}</p></div>${statusTag(campaign.status)}</div><div class="promo-campaign-meta">${channels || '<span class="promo-tag">sultrakita</span>'}<span class="promo-tag">${esc(campaign.objective)}</span></div></article>`;
  }

  function renderCampaigns(target, campaigns = state.campaigns) {
    if (!target) return;
    if (!campaigns.length) { target.innerHTML = '<div class="promo-empty">Belum ada campaign. Pilih listing aktif untuk membuat draft pertama Anda.</div>'; return; }
    target.innerHTML = campaigns.map(campaignCard).join('');
    target.querySelectorAll('[data-campaign-id]').forEach(card => {
      card.addEventListener('click', () => openCampaign(Number(card.dataset.campaignId)));
      card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openCampaign(Number(card.dataset.campaignId)); } });
    });
  }

  function renderStats() {
    const active = state.campaigns.filter(campaign => !['CANCELLED', 'PUBLISHED'].includes(campaign.status)).length;
    const stats = $('#promo-stats');
    if (!stats) return;
    stats.querySelector('article strong').textContent = String(active);
    stats.querySelector('article small').textContent = `${state.campaigns.length} total campaign`;
  }

  function renderConnections() {
    const target = $('#connections-grid');
    if (!target) return;
    target.innerHTML = state.connections.map(connection => `<article class="promo-connection"><div><h3>${esc(connection.channel)}</h3><p>${connection.direct_publish ? 'Kapabilitas native SultraKita aktif.' : 'OAuth/provider belum diaktifkan pada P0.'}</p></div><span class="promo-connection-state ${connection.state === 'CONNECTED' ? 'ready' : ''}">${esc(connection.state)}</span></article>`).join('');
  }

  async function loadCampaigns() {
    try {
      state.campaigns = await request('/campaigns?limit=50');
      renderStats();
      renderCampaigns($('#overview-campaigns'), state.campaigns.slice(0, 4));
      renderCampaigns($('#all-campaigns'), state.campaigns);
    } catch (error) {
      if (error.status === 401) showNotice('Masuk sebagai seller untuk melihat campaign Anda. Data campaign tidak dibaca dari akun lain.');
      renderCampaigns($('#overview-campaigns'), []);
      renderCampaigns($('#all-campaigns'), []);
    }
  }

  async function loadListings() {
    const select = $('#listing-select');
    try {
      state.listings = await request('/listings');
      select.innerHTML = state.listings.length ? '<option value="">Pilih listing aktif…</option>' + state.listings.map(listing => `<option value="${Number(listing.id)}">${esc(listing.title)} · ${money(listing.price)}</option>`).join('') : '<option value="">Belum ada listing aktif</option>';
      select.disabled = !state.listings.length;
    } catch (error) {
      select.innerHTML = `<option value="">${esc(error.status === 401 ? 'Masuk sebagai seller terlebih dahulu' : error.message)}</option>`;
      select.disabled = true;
      showError($('#form-feedback'), error);
    }
  }

  function renderListingPreview() {
    const id = Number($('#listing-select').value);
    const listing = state.listings.find(row => Number(row.id) === id);
    const preview = $('#listing-preview');
    if (!listing) { preview.hidden = true; preview.innerHTML = ''; return; }
    preview.hidden = false;
    preview.innerHTML = `<strong>${esc(listing.title)}</strong>${esc(listing.category_name || 'Marketplace')} · ${esc(listing.district || 'Sulawesi Tenggara')} · ${money(listing.price)}<br>${esc(String(listing.description || '').slice(0, 180))}`;
    const location = $('[name="location"]');
    if (!location.value) location.value = listing.district || 'Kendari';
  }

  async function createCampaign(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const feedback = $('#form-feedback');
    feedback.hidden = true;
    const data = new FormData(form);
    const channels = [...form.querySelectorAll('[name="channels"]:checked')].map(input => input.value);
    if (!channels.length) { feedback.hidden = false; feedback.textContent = 'Pilih minimal satu channel.'; return; }
    const body = { name: data.get('name'), listing_id: Number(data.get('listing_id')), objective: data.get('objective'), location: data.get('location'), budget: data.get('budget') ? Number(data.get('budget')) : null, cta: data.get('cta'), channels };
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.textContent = 'Menyimpan…';
    try {
      const idempotencyKey = window.crypto?.randomUUID?.() || `promo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      await request('/campaigns', { method: 'POST', headers: { 'idempotency-key': idempotencyKey }, body: JSON.stringify(body) });
      form.reset();
      form.querySelector('[value="sultrakita"]').checked = true;
      $$('.promo-check').forEach(item => item.classList.toggle('active', item.querySelector('input').checked));
      toast('Campaign draft tersimpan.');
      await loadCampaigns();
      go('campaigns');
    } catch (error) {
      showError(feedback, error);
      if (error.details) feedback.textContent += ` ${error.details.join(' · ')}`;
    } finally {
      button.disabled = false;
      button.textContent = 'Simpan sebagai draft →';
    }
  }

  function openDrawer(html) {
    $('#drawer-content').innerHTML = html;
    $('#campaign-drawer').hidden = false;
    document.body.classList.add('drawer-open');
  }

  function closeDrawer() { $('#campaign-drawer').hidden = true; document.body.classList.remove('drawer-open'); }

  async function openCampaign(id) {
    openDrawer('<div class="promo-loading">Memuat detail campaign…</div>');
    try {
      const detail = await request(`/campaigns/${id}`);
      state.current = detail;
      const campaign = detail.campaign;
      const channelRows = detail.channels || [];
      const actionButtons = [];
      if (['DRAFT', 'AWAITING_APPROVAL'].includes(campaign.status)) actionButtons.push(`<button class="promo-primary" data-action="approve" data-id="${id}">Setujui campaign</button>`);
      if (['READY', 'SCHEDULED', 'MANUAL_ACTION_REQUIRED'].includes(campaign.status) && channelRows.some(row => row.channel === 'sultrakita' && row.state !== 'PUBLISHED')) actionButtons.push(`<button class="promo-primary" data-action="publish" data-id="${id}">Publish native SultraKita</button>`);
      const exportChannels = channelRows.filter(row => row.channel !== 'sultrakita');
      const exportButtons = exportChannels.map(row => `<button class="promo-secondary" data-action="export" data-id="${id}" data-channel="${esc(row.channel)}">Export ${esc(row.channel)}</button>`).join('');
      const channelHtml = channelRows.map(row => `<div class="drawer-channel-row"><div><strong>${esc(row.channel)}</strong><small>${row.channel === 'sultrakita' ? 'Native marketplace' : 'Publikasi manual · provider belum terhubung'}</small></div>${statusTag(row.state)}</div>`).join('');
      const linksHtml = (detail.utm_links || []).map(link => `<div class="drawer-utm"><strong>${esc(link.utm_source)} · ${esc(link.utm_content)}</strong><a href="${esc(link.destination_url)}" target="_blank" rel="noopener">${esc(link.destination_url)}</a><code>source=${esc(link.utm_source)} · medium=${esc(link.utm_medium)} · campaign=${esc(link.utm_campaign)} · content=${esc(link.utm_content)}${link.utm_term ? ` · term=${esc(link.utm_term)}` : ''}</code></div>`).join('') || '<p>UTM link belum tersedia.</p>';
      openDrawer(`<span class="promo-eyebrow">CAMPAIGN #${Number(campaign.id)}</span><h2 id="drawer-title">${esc(campaign.name)}</h2><p>${esc(campaign.listing_title)} · ${money(campaign.listing_price)} · ${esc(campaign.location || campaign.listing_district || 'Sulawesi Tenggara')}</p><div class="promo-campaign-meta">${statusTag(campaign.status)}<span class="promo-tag">${esc(campaign.objective)}</span></div><div class="drawer-actions">${actionButtons.join('')}${exportButtons}</div><div class="drawer-rule"></div><span class="promo-eyebrow">CHANNEL STATE</span>${channelHtml}<div class="drawer-rule"></div><span class="promo-eyebrow">UTM LINKS</span><div class="drawer-utm">${linksHtml}</div><div id="drawer-feedback" class="promo-feedback" hidden></div>`);
      bindDrawerActions();
    } catch (error) { openDrawer(`<div class="promo-empty">${esc(showError(null, error))}</div>`); }
  }

  function bindDrawerActions() {
    $$('[data-action="approve"]').forEach(button => button.addEventListener('click', async () => {
      button.disabled = true;
      try { await request(`/campaigns/${button.dataset.id}/approve`, { method: 'POST', body: '{}' }); toast('Campaign disetujui.'); await loadCampaigns(); await openCampaign(Number(button.dataset.id)); } catch (error) { showError($('#drawer-feedback'), error); } finally { button.disabled = false; }
    }));
    $$('[data-action="publish"]').forEach(button => button.addEventListener('click', async () => {
      button.disabled = true;
      try { await request(`/campaigns/${button.dataset.id}/publish/sultrakita`, { method: 'POST', headers: { 'idempotency-key': `promo-${button.dataset.id}-sultrakita` }, body: '{}' }); toast('Listing dipromosikan native di SultraKita.'); await loadCampaigns(); await openCampaign(Number(button.dataset.id)); } catch (error) { showError($('#drawer-feedback'), error); } finally { button.disabled = false; }
    }));
    $$('[data-action="export"]').forEach(button => button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const result = await request(`/campaigns/${button.dataset.id}/export`, { method: 'POST', body: JSON.stringify({ channel: button.dataset.channel, format: 'json' }) });
        const encoded = encodeURIComponent(JSON.stringify(result.package, null, 2));
        openDrawer(`<span class="promo-eyebrow">MANUAL EXPORT · ${esc(result.channel)}</span><h2>Materi siap disalin</h2><p>${esc(result.disclaimer)}</p><div class="drawer-rule"></div><pre class="promo-export">${esc(JSON.stringify(result.package, null, 2))}</pre><div class="drawer-actions"><button class="promo-primary" id="copy-export" data-copy="${encoded}">Salin package JSON</button><button class="promo-secondary" data-close-drawer>Tutup</button></div>`);
        $('#copy-export').addEventListener('click', async event => { await navigator.clipboard.writeText(decodeURIComponent(event.currentTarget.dataset.copy)); toast('Package disalin.'); });
      } catch (error) { showError($('#drawer-feedback'), error); } finally { button.disabled = false; }
    }));
    $$('[data-close-drawer]').forEach(button => button.addEventListener('click', closeDrawer));
  }

  async function loadConnections() { try { state.connections = await request('/connections'); renderConnections(); } catch {} }
  async function loadAnalytics() {
    const target = $('#analytics-output');
    if (!target) return;
    try {
      const data = await request('/analytics');
      if (data.insufficient_data) { target.innerHTML = ''; return; }
      target.innerHTML = `<div class="promo-campaign-card"><h4>Event diterima</h4><p>${Object.values(data.totals || {}).reduce((sum, value) => sum + Number(value), 0)} event telah dideduplikasi dan dicatat.</p></div>`;
    } catch (error) { target.innerHTML = `<div class="promo-feedback">${esc(showError(null, error))}</div>`; }
  }

  function bind() {
    $$('.promo-nav-item,[data-section-target]').forEach(element => element.addEventListener('click', () => go(element.dataset.section || element.dataset.sectionTarget)));
    $('#mobile-nav').addEventListener('click', () => $('#promo-sidebar').classList.toggle('open'));
    $('#campaign-form').addEventListener('submit', createCampaign);
    $('#listing-select').addEventListener('change', renderListingPreview);
    $('#refresh-campaigns').addEventListener('click', loadCampaigns);
    $('#campaign-filter').addEventListener('change', event => renderCampaigns($('#all-campaigns'), event.target.value ? state.campaigns.filter(campaign => campaign.status === event.target.value) : state.campaigns));
    $$('.promo-check input').forEach(input => input.addEventListener('change', () => input.closest('.promo-check').classList.toggle('active', input.checked)));
    $('#campaign-drawer').addEventListener('click', event => { if (event.target.matches('[data-close-drawer]')) closeDrawer(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !$('#campaign-drawer').hidden) closeDrawer(); });
  }

  async function init() {
    bind();
    await Promise.all([loadCampaigns(), loadListings(), loadConnections()]);
  }

  window.addEventListener('DOMContentLoaded', init);
})();
