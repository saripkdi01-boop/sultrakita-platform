'use strict';
(function () {
  const applyTheme = dark => {
    document.body.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('theme-dark-preload', dark);
    localStorage.setItem('sultra-dark', String(dark));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#10231f' : '#0d5c4b');
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.textContent = dark ? '☀' : '◐';
      button.setAttribute('aria-label', dark ? 'Aktifkan mode terang' : 'Aktifkan mode gelap');
      button.setAttribute('aria-pressed', String(dark));
    });
  };
  const setup = () => {
    const stored = localStorage.getItem('sultra-dark');
    applyTheme(stored === 'true' || (stored === null && window.matchMedia?.('(prefers-color-scheme: dark)').matches));
    document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark'))));
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
}());
