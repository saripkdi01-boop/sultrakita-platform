'use strict';
(function () {
  const applyTheme = dark => {
    document.body.classList.toggle('dark', dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.classList.toggle('theme-dark-preload', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem('sultrakita-theme', dark ? 'dark' : 'light');
    localStorage.setItem('sultra-dark', String(dark));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0F1714' : '#F7F8F6');
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = dark ? '☀' : '◐';
      button.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
      button.setAttribute('aria-pressed', String(dark));
    });
  };
  const setup = () => {
    const stored = localStorage.getItem('sultrakita-theme');
    const legacy = localStorage.getItem('sultra-dark');
    const dark = stored === 'dark' || (stored !== 'light' && legacy !== 'false' && (legacy === 'true' || window.matchMedia?.('(prefers-color-scheme: dark)').matches));
    applyTheme(dark);
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark'))));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
}());
