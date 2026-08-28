(() => {
  const POLICY_VERSION = '2026-08-27-v1';
  const CONSENT_KEY = 'sultrakita-policy-consent';
  const SESSION_KEY = 'sultrakita-policy-session';

  const readConsent = () => {
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      return value && typeof value === 'object' ? value : null;
    } catch (error) {
      console.warn('[policy-consent]', error.message);
      return null;
    }
  };

  const hasCurrentConsent = () => {
    const consent = readConsent();
    return Boolean(consent?.version === POLICY_VERSION && consent.terms && consent.privacy && consent.accepted_at);
  };

  const markSession = () => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ version: POLICY_VERSION, started_at: new Date().toISOString() })); } catch (error) { console.warn('[policy-session]', error.message); }
  };

  const ensureModal = () => {
    let dialog = document.querySelector('#policy-consent-dialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'policy-consent-dialog';
    dialog.className = 'policy-consent-dialog';
    dialog.innerHTML = `<form method="dialog" class="policy-consent-card"><div class="policy-consent-head"><div><span class="eyebrow">Sebelum melanjutkan</span><h2>Jaga ruang SultraKita tetap aman.</h2><p>Persetujuan ini membantu kami mengelola akun, listing, pesan, dan transaksi secara bertanggung jawab.</p></div><button class="dialog-close" value="cancel" aria-label="Tutup">×</button></div><div class="policy-consent-links"><a href="/terms.html" target="_blank" rel="noopener">Baca Syarat & Ketentuan <span>↗</span></a><a href="/privacy.html" target="_blank" rel="noopener">Baca Kebijakan Privasi <span>↗</span></a></div><label class="policy-check"><input id="policy-terms-check" type="checkbox"><span>Saya telah membaca dan menyetujui <a href="/terms.html" target="_blank" rel="noopener">Syarat & Ketentuan</a>.</span></label><label class="policy-check"><input id="policy-privacy-check" type="checkbox"><span>Saya memahami <a href="/privacy.html" target="_blank" rel="noopener">Kebijakan Privasi</a> dan pemrosesan data yang dijelaskan di dalamnya.</span></label><p class="policy-consent-note">Versi policy: ${POLICY_VERSION}. Anda dapat meminta akses, koreksi, atau penghapusan data melalui SultrakitaPlatform@gmail.com.</p><div class="policy-consent-actions"><button class="button button-quiet" value="cancel">Nanti</button><button class="button button-primary" id="policy-consent-accept" value="accept" disabled>Saya setuju & lanjut</button></div></form>`;
    document.body.appendChild(dialog);
    const terms = dialog.querySelector('#policy-terms-check');
    const privacy = dialog.querySelector('#policy-privacy-check');
    const accept = dialog.querySelector('#policy-consent-accept');
    const sync = () => { accept.disabled = !(terms.checked && privacy.checked); };
    terms.addEventListener('change', sync); privacy.addEventListener('change', sync);
    dialog.addEventListener('close', () => { if (dialog.returnValue !== 'accept') dialog.dataset.cancelled = 'true'; });
    return dialog;
  };

  const requireConsent = (context = 'fitur ini', callback = () => {}) => {
    if (hasCurrentConsent()) { markSession(); callback(); return true; }
    const dialog = ensureModal();
    dialog.dataset.context = context;
    dialog.dataset.cancelled = 'false';
    dialog.querySelector('#policy-terms-check').checked = false;
    dialog.querySelector('#policy-privacy-check').checked = false;
    dialog.querySelector('#policy-consent-accept').disabled = true;
    dialog.querySelector('p').textContent = `Persetujuan ini dibutuhkan sebelum ${context}. Kami hanya memakai data sesuai tujuan yang dijelaskan dalam kebijakan.`;
    dialog.addEventListener('close', () => {
      if (dialog.returnValue !== 'accept') return;
      const record = { version: POLICY_VERSION, terms: true, privacy: true, accepted_at: new Date().toISOString() };
      try { localStorage.setItem(CONSENT_KEY, JSON.stringify(record)); } catch (error) { console.warn('[policy-consent-save]', error.message); }
      markSession();
      callback();
    }, { once: true });
    dialog.showModal();
    return false;
  };

  const revoke = () => { localStorage.removeItem(CONSENT_KEY); sessionStorage.removeItem(SESSION_KEY); };
  window.SultraPolicy = { version: POLICY_VERSION, hasConsent: hasCurrentConsent, require: requireConsent, revoke };
})();
