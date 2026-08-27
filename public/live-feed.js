/* Optional live listing banner. It stays dormant when Supabase public Realtime config is not enabled. */
(function attachLiveFeed(global) {
  let subscription;
  let count = 0;
  let dismissTimer;

  function removeBanner() {
    global.document.querySelector('.live-feed-banner')?.remove();
    global.clearTimeout(dismissTimer);
  }

  function showBanner(listing) {
    removeBanner();
    count += 1;
    const banner = global.document.createElement('aside');
    banner.className = 'live-feed-banner';
    banner.setAttribute('role', 'status');
    banner.setAttribute('aria-live', 'polite');
    const pulse = global.document.createElement('span');
    pulse.className = 'live-pulse';
    pulse.setAttribute('aria-hidden', 'true');
    const message = global.document.createElement('span');
    message.className = 'live-feed-message';
    message.textContent = `${count} listing baru${listing?.district ? ` di ${listing.district}` : ' di area Sultra'}`;
    const view = global.document.createElement('button');
    view.type = 'button';
    view.className = 'live-view-btn';
    view.textContent = 'Lihat';
    view.addEventListener('click', () => {
      removeBanner();
      count = 0;
      if (typeof global.loadListings === 'function') global.loadListings();
      else global.location.reload();
    });
    const dismiss = global.document.createElement('button');
    dismiss.type = 'button';
    dismiss.className = 'live-dismiss';
    dismiss.setAttribute('aria-label', 'Tutup pemberitahuan listing baru');
    dismiss.textContent = '×';
    dismiss.addEventListener('click', removeBanner);
    banner.append(pulse, message, view, dismiss);
    global.document.body.appendChild(banner);
    dismissTimer = global.setTimeout(removeBanner, 10000);
  }

  async function start() {
    if (!global.SultraSupabase?.subscribeNewListings) return null;
    subscription = await global.SultraSupabase.subscribeNewListings(listing => {
      if (listing?.status === 'active' || !listing?.status) showBanner(listing);
    });
    return subscription;
  }

  function stop() {
    subscription?.unsubscribe?.();
    subscription = null;
    removeBanner();
  }

  global.SultraLiveFeed = { start, stop };
}(window));
