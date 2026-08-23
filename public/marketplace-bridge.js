(() => {
  'use strict';

  const SAFE_ZONES = [
    { name: 'Eks MTQ Kendari', query: 'Eks MTQ Kendari' },
    { name: 'Tugu Religi Kendari', query: 'Tugu Religi Kendari' },
    { name: 'Kampus UHO', query: 'Universitas Halu Oleo Kendari' },
    { name: 'Kendari Beach', query: 'Kendari Beach' },
    { name: 'Polresta Kendari', query: 'Polresta Kendari' }
  ];

  const rupiah = value => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value || 0));
  const clean = value => String(value ?? '').replace(/[<>\r\n]/g, ' ').trim();
  const listingUrl = item => `${location.origin}/listing/${encodeURIComponent(clean(item.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))}-${Number(item.id)}`;
  const whatsappUrl = (item, spot = SAFE_ZONES[0].name) => {
    const text = `Halo, saya tertarik dengan listing “${clean(item.title)}” di SultraKita. Harga tercantum ${rupiah(item.price)}. Apakah masih tersedia? Jika cocok, saya usul bertemu di ${clean(spot)}. Detail: ${listingUrl(item)}`;
    const phone = clean(item.seller_phone || '').replace(/\D/g, ''); return `https://wa.me/${phone || ''}?text=${encodeURIComponent(text)}`;
  };
  const fbText = item => [`${clean(item.title)}`, `Harga: ${rupiah(item.price)}`, `Kondisi: ${clean(item.condition || 'Belum dicantumkan')}`, `Kategori: ${clean(item.category_name || 'Marketplace lokal')}`, `Lokasi: ${clean(item.district || item.city || 'Kendari')}, Sulawesi Tenggara`, '', clean(item.description || 'Hubungi penjual untuk detail lengkap.'), '', `Lihat detail dan hubungi penjual: ${listingUrl(item)}`].join('\n');

  function downloadFlyer(item) {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1080;
    const context = canvas.getContext('2d'); const gradient = context.createLinearGradient(0, 0, 1080, 1080); gradient.addColorStop(0, '#173c36'); gradient.addColorStop(1, '#2b685a'); context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1080);
    context.fillStyle = '#f8f4ed'; context.fillRect(54, 54, 972, 972); context.fillStyle = '#173c36'; context.font = '700 42px Inter, Arial'; context.fillText('SULTRAKITA', 98, 132); context.fillStyle = '#ef8764'; context.font = '700 26px Inter, Arial'; context.fillText('LISTING LOKAL', 98, 178);
    context.fillStyle = '#173c36'; context.font = '700 54px Inter, Arial'; const title = clean(item.title).slice(0, 42); context.fillText(title, 98, 290, 850); context.fillStyle = '#ef8764'; context.font = '700 62px Inter, Arial'; context.fillText(rupiah(item.price), 98, 410); context.fillStyle = '#536762'; context.font = '400 30px Inter, Arial'; context.fillText(`${clean(item.district || 'Kendari')} · ${clean(item.condition || 'Hubungi penjual')}`, 98, 466, 850);
    context.fillStyle = '#173c36'; context.font = '400 29px Inter, Arial'; const description = clean(item.description || 'Temukan detail lengkap dan hubungi penjual lokal.').slice(0, 130); const words = description.split(' '); let line = ''; let y = 580; for (const word of words) { const next = `${line} ${word}`.trim(); if (context.measureText(next).width > 830) { context.fillText(line, 98, y); y += 44; line = word; } else line = next; } if (line) context.fillText(line, 98, y);
    context.fillStyle = '#173c36'; context.fillRect(98, 850, 420, 78); context.fillStyle = '#fff'; context.font = '700 28px Inter, Arial'; context.fillText('sultrakita.id', 132, 900); context.fillStyle = '#536762'; context.font = '400 22px Inter, Arial'; context.fillText('Temukan yang dekat, tumbuh bersama.', 98, 972);
    const anchor = document.createElement('a'); anchor.download = `sultrakita-${Number(item.id)}.png`; anchor.href = canvas.toDataURL('image/png'); anchor.click();
  }

  const safeZoneLinks = () => `<details class="safe-zone-picker"><summary>Rekomendasi titik COD aman</summary><div>${SAFE_ZONES.map(zone => `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zone.query)}" target="_blank" rel="noopener">${zone.name} ↗</a>`).join('')}</div><small>Pilih tempat ramai dan tetap verifikasi transaksi secara langsung.</small></details>`;

  function initCommandPalette() {
    const dialog = document.createElement('dialog'); dialog.id = 'command-palette'; dialog.innerHTML = '<form method="dialog" class="command-modal"><label for="command-input">Cari di SultraKita</label><input id="command-input" type="search" placeholder="Cari listing, kategori, atau wilayah…" autocomplete="off"><div id="command-results" class="command-results"></div><button class="dialog-close" value="cancel" aria-label="Tutup">×</button></form>'; document.body.appendChild(dialog);
    const input = dialog.querySelector('#command-input'); const results = dialog.querySelector('#command-results');
    const render = () => { const query = input.value.trim(); const links = [{ label: 'Jelajahi listing terbaru', href: '#jelajah' }, { label: 'Pasang iklan', action: 'sell' }, { label: 'Kategori', href: '#kategori' }, ...SAFE_ZONES.map(zone => ({ label: `COD aman: ${zone.name}`, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(zone.query)}`, external: true }))].filter(item => !query || item.label.toLowerCase().includes(query.toLowerCase())); results.innerHTML = links.slice(0, 8).map(item => item.action === 'sell' ? `<button type="button" data-command-action="sell">${item.label}</button>` : `<a href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>${item.label}</a>`).join('') || '<p>Tidak ada saran. Tekan Enter untuk mencari.</p>'; };
    input.addEventListener('input', render); results.addEventListener('click', event => { if (event.target.closest('[data-command-action="sell"]')) { dialog.close(); document.querySelector('#sell-dialog')?.showModal(); } }); document.addEventListener('keydown', event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.showModal(); input.value = ''; render(); input.focus(); } }); dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  }

  window.SultraBridge = { SAFE_ZONES, whatsappUrl, fbText, downloadFlyer, safeZoneLinks, initCommandPalette };
})();
