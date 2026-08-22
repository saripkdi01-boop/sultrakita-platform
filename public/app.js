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

  donationCta.addEventListener('click', () => { 
    dialog.showModal(); 
    message.textContent = 'Memuat data kampanye...';
    // Simulasi load data (ganti dengan fetch API asli Anda)
    setTimeout(() => {
      dialog.querySelector('#donation-raised').textContent = 'Terkumpul Rp 12.500.000';
      dialog.querySelector('#donation-target').textContent = 'Target Rp 50.000.000';
      dialog.querySelector('#donation-progress-bar').style.width = '25%';
      dialog.querySelector('#donation-supporters').textContent = '42 donatur terverifikasi';
      message.textContent = '';
    }, 600);
  });

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
    
    // Simulasi redirect ke payment gateway
    setTimeout(() => {
      message.textContent = 'Mengalihkan ke Midtrans/Xendit...';
      // window.location.href = result.data.payment_url;
    }, 1000);
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
