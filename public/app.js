// --- Utility & State ---
const $ = s => document.querySelector(s);
const icons = { properti: '🏠', elektronik: '📱', kendaraan: '🚗', fashion: '👕', perabotan: '🛋️', jasa: '🧰', kuliner: '🍜', 'hobi-koleksi': '📷', 'lowongan-kerja': '💼', lainnya: '🏷️' };
let categories = [], page = 1, totalPages = 1, sellerSession = null;

const rupiah = v => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));

async function api(url, options) {
  const r = await fetch(url, options);
  const b = await r.json();
  if (!r.ok) throw Error(b.error || 'Permintaan gagal');
  return b;
}

function toast(message) {
  const t = $('#toast');
  t.textContent = message;
  t.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// --- NEW: Intersection Observer for Light Animations ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-visible');
      observer.unobserve(entry.target); // Hanya animasi sekali
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function applyAnimations() {
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- Core Functions ---
async function loadCategories() {
  const b = await api('/api/categories');
  categories = b.data;
  $('#categories').innerHTML = categories.map(c => `
    <button class="category fade-in" data-slug="${esc(c.slug)}" aria-label="Jelajahi ${esc(c.name)}">
      <div class="category-icon">${icons[c.slug] || '🏷️'}</div>
      <strong>${esc(c.name)}</strong>
      <small>Jelajahi →</small>
    </button>
  `).join('');
  document.querySelectorAll('.category').forEach(b => b.onclick = () => {
    page = 1; loadListings({ category: b.dataset.slug });
    $('#jelajah').scrollIntoView({ behavior: 'smooth' });
    toast(`Menampilkan ${b.querySelector('strong').textContent}`);
  });
  applyAnimations();
}

async function loadListings(extra = {}) {
  $('#listings').innerHTML = '<div class="skeleton skeleton-card"></div>'.repeat(4);
  const params = new URLSearchParams({ q: $('#search').value.trim(), district: $('#district').value, sort: $('#sort').value, page, limit: 8, ...extra });
  for (const [k, v] of [...params]) if (!v) params.delete(k);

  try {
    const b = await api('/api/listings?' + params);
    totalPages = b.meta?.total_pages || 1;
    $('#result-summary').textContent = `${b.meta?.total || b.data.length} hasil · Kendari dan Sultra`;

    $('#listings').innerHTML = b.data.length ? b.data.map(l => {
      const saved = JSON.parse(localStorage.getItem('sultra-favs') || '[]').includes(l.id);
      // NEW: Support for video badge if listing has video
      const videoBadge = l.has_video ? `<div class="video-badge">▶️ Video</div>` : '';

      return `
      <article class="listing fade-in">
        <div class="listing-image">
          <span>${icons[l.category_slug] || '🏷️'}</span>
          ${videoBadge}
          <span class="listing-badge" style="background: var(--gold); color: #FFF;">${l.created_at ? 'Baru' : 'Pilihan'}</span>
        </div>
        <div class="listing-body">
          <h3 title="${esc(l.title)}">${esc(l.title)}</h3>
          <div class="listing-price">${rupiah(l.price)}</div>
          <div class="listing-meta">
            <span>${esc(l.category_name)}</span> · <span>${esc(l.district)}</span>
          </div>
          <div class="listing-actions">
            <button class="mini-action ${saved ? 'saved' : ''}" data-fav="${l.id}" style="color: ${saved ? 'var(--danger)' : 'var(--gold)'}">
              ${saved ? '♥ Tersimpan' : '♡ Simpan'}
            </button>
            <button class="mini-action" data-share="${l.id}" data-title="${esc(l.title)}">↗ Bagikan</button>
          </div>
        </div>
      </article>`;
    }).join('') : '<div class="empty">Belum ada listing yang cocok. Coba kata kunci atau wilayah lain.</div>';

    $('#load-more').hidden = page >= totalPages;
    applyAnimations(); // Terapkan animasi pada elemen baru

    // Re-attach event listeners
    document.querySelectorAll('[data-fav]').forEach(b => b.onclick = () => toggleFav(Number(b.dataset.fav), b));
    document.querySelectorAll('[data-share]').forEach(b => b.onclick = () => shareListing(b.dataset.title));
  } catch (e) {
    $('#listings').innerHTML = `<div class="empty">${esc(e.message)}</div>`;
  }
}

// --- Donation Experience Upgrade (Sesuai gaya Cream/Gold) ---
(function initDonationExperience() {
  const donationCta = document.querySelector('#donation-cta');
  if (!donationCta) return;

  const formatRupiah = value => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;
  const dialog = document.createElement('dialog');
  dialog.id = 'donation-dialog';
  dialog.innerHTML = `
    <form method="dialog" class="donation-modal" id="donation-form">
      <button class="dialog-close" value="cancel" aria-label="Tutup">×</button>
      <p class="eyebrow" style="color: var(--gold);">Dukung SultraKita</p>
      <h2 id="donation-title" style="color: var(--ink);">Bantu platform lokal terus tumbuh</h2>
      <p class="dialog-help" id="donation-description">Memuat kampanye aktif…</p>

      <div class="donation-progress" aria-live="polite">
        <div class="donation-progress-meta">
          <span id="donation-raised" style="color: var(--gold);">Terkumpul —</span>
          <span id="donation-target">Target —</span>
        </div>
        <div class="donation-progress-track"><span id="donation-progress-bar"></span></div>
        <small id="donation-supporters"></small>
      </div>

      <fieldset>
        <legend style="color: var(--ink);">Pilih nominal donasi</legend>
        <div class="donation-presets">
          ${[25000, 50000, 100000, 250000].map(amount => `<button type="button" class="donation-preset" data-amount="${amount}">${formatRupiah(amount)}</button>`).join('')}
        </div>
      </fieldset>
      <label style="color: var(--ink);">Metode pembayaran<select id="donation-payment-method" name="payment_method"><option value="qris">QRIS</option><option value="virtual_account">Virtual Account</option></select></label>

      <label style="color: var(--ink);">Nominal lainnya (Rp)
        <input id="donation-amount" name="amount" type="number" min="10000" max="100000000" step="1000" value="50000" required>
      </label>
      <label style="color: var(--ink);">Nama tampilan (opsional)
        <input id="donation-name" name="name" maxlength="100" placeholder="Hamba Allah">
      </label>

      <button class="button button-primary full" id="donation-submit" type="submit">
        Dukung sekarang <span id="donation-submit-amount">Rp 50.000</span>
      </button>
      <p class="form-message" id="donation-message" role="status" aria-live="polite"></p>
    </form>
  `;
  document.body.appendChild(dialog);

  let campaignId = 1;
  const amountInput = dialog.querySelector('#donation-amount');
  const submitAmount = dialog.querySelector('#donation-submit-amount');
  const message = dialog.querySelector('#donation-message');

  const refreshAmount = () => { submitAmount.textContent = formatRupiah(amountInput.value); };
  amountInput.addEventListener('input', refreshAmount);

  dialog.querySelectorAll('.donation-preset').forEach(button => {
    button.addEventListener('click', () => {
      amountInput.value = button.dataset.amount;
      refreshAmount();
      dialog.querySelectorAll('.donation-preset').forEach(item => item.classList.toggle('selected', item === button));
    });
  });

  async function loadDonationStats(){ const response = await fetch(`/api/donation/stats?campaign_id=${campaignId}`); const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error || 'Statistik donasi belum tersedia'); const { campaign, supporters } = result.data; dialog.querySelector('#donation-title').textContent = campaign.title; dialog.querySelector('#donation-description').textContent = campaign.description || 'Dukungan Anda membantu biaya operasional SultraKita.'; dialog.querySelector('#donation-raised').textContent = `Terkumpul ${formatRupiah(campaign.current_amount)}`; dialog.querySelector('#donation-target').textContent = `Target ${formatRupiah(campaign.target_amount)}`; dialog.querySelector('#donation-progress-bar').style.width = `${campaign.progress_percent}%`; dialog.querySelector('#donation-supporters').textContent = `${supporters} donatur terverifikasi`; }
  donationCta.addEventListener('click', async () => { dialog.showModal(); message.textContent = 'Memuat data kampanye...'; try { await loadDonationStats(); message.textContent = ''; } catch (error) { message.textContent = error.message; } });

  dialog.querySelector('#donation-form').addEventListener('submit', async event => {
    event.preventDefault();
    const submit = dialog.querySelector('#donation-submit');
    const amount = Number(amountInput.value);
    if (!Number.isSafeInteger(amount) || amount < 10000) {
      message.textContent = 'Minimal donasi Rp10.000.';
      message.style.color = 'var(--danger)';
      return;
    }
    submit.disabled = true;
    message.textContent = 'Mengalihkan ke pembayaran aman...';
    message.style.color = 'var(--muted)';

    try { const response = await fetch('/api/donations', { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ campaign_id:campaignId, amount, name:dialog.querySelector('#donation-name').value || 'Hamba Allah', payment_method:dialog.querySelector('#donation-payment-method').value }) }); const result = await response.json(); if (!response.ok || !result.success) throw new Error(result.error || 'Donasi belum dapat diproses.'); localStorage.setItem('sultrakita:last-donation', result.data.transaction_id); if (result.data.payment_url) window.location.assign(result.data.payment_url); else { message.textContent = result.data.message; await loadDonationStats(); } } catch (error) { message.textContent = error.message; message.style.color = 'var(--danger)'; } finally { submit.disabled = false; }
  });
})();

// --- Initialization ---
$('#theme-toggle').onclick = () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('sultra-dark', document.body.classList.contains('dark'));
};
if (localStorage.getItem('sultra-dark') === 'true') document.body.classList.add('dark');

Promise.all([loadCategories(), loadListings()]).then(() => {
  applyAnimations(); // Pastikan animasi berjalan setelah load awal
});

(function installDonationAdminDashboard(){
  const root=document.querySelector('#admin-analytics');if(!root)return;const value=id=>document.querySelector(id)?.value.trim()||'';const headers=()=>({authorization:`Bearer ${value('#admin-session-token')}`,'x-admin-token':value('#admin-token')});const rupiah=v=>`Rp ${Number(v||0).toLocaleString('id-ID')}`;
  const load=async()=>{const r=await fetch(`/api/admin/donations/analytics?days=${value('#admin-analytics-days')||30}`,{headers:headers()});const j=await r.json();if(!r.ok||!j.success)throw new Error(j.error||'Analytics tidak dapat dimuat');const{totals,daily}=j.data;document.querySelector('#admin-attempts').textContent=totals.attempts;document.querySelector('#admin-successful').textContent=totals.successful;document.querySelector('#admin-success-rate').textContent=`${totals.success_rate}%`;document.querySelector('#admin-net-amount').textContent=rupiah(totals.net_amount);document.querySelector('#admin-daily-chart').innerHTML=daily.map(row=>`<div class="analytics-bar-row"><span>${row.date}</span><div><i style="width:${Math.min(100,Number(row.attempts)*10)}%"></i></div><strong>${row.successful}/${row.attempts} · ${rupiah(row.net_amount)}</strong></div>`).join('')||'<p>Belum ada transaksi.</p>';};
  document.querySelector('#admin-analytics-load')?.addEventListener('click',()=>load().catch(e=>{document.querySelector('#admin-daily-chart').textContent=e.message;}));
  document.querySelector('#admin-operation-form')?.addEventListener('submit',async e=>{e.preventDefault();const out=document.querySelector('#admin-operation-message'),tx=value('#admin-transaction-id'),op=value('#admin-operation');if(!window.confirm(`${op==='refund'?'Refund':'Batalkan'} transaksi ${tx}?`))return;const r=await fetch(`/api/admin/donations/${encodeURIComponent(tx)}/${op}`,{method:'POST',headers:{...headers(),'content-type':'application/json'},body:JSON.stringify({reason:value('#admin-operation-reason')})});const j=await r.json();out.textContent=j.success?`Operasi ${op} berhasil diproses.`:(j.error||'Operasi gagal');if(j.success)load().catch(()=>{});});
  document.querySelector('#admin-webhook-start')?.addEventListener('click',async e=>{e.currentTarget.disabled=true;const log=document.querySelector('#admin-webhook-logs');try{const r=await fetch('/api/admin/webhook-logs/stream',{headers:headers()});if(!r.ok||!r.body)throw new Error('Stream webhook tidak tersedia');const reader=r.body.getReader(),decoder=new TextDecoder();let buffer='';while(true){const{value,done}=await reader.read();if(done)break;buffer+=decoder.decode(value,{stream:true});const events=buffer.split('\n\n');buffer=events.pop()||'';for(const text of events){const line=text.split('\n').find(x=>x.startsWith('data: '));if(!line)continue;const row=JSON.parse(line.slice(6)),item=document.createElement('div');item.className=`webhook-log ${row.http_status>=400?'is-error':''}`;item.textContent=`${row.created_at} · ${row.provider} · ${row.event_status||'-'} · HTTP ${row.http_status} · ${row.transaction_id||'-'}`;log.prepend(item);while(log.children.length>50)log.lastChild.remove();}}}catch(error){log.textContent=error.message;e.currentTarget.disabled=false;}});
})();
