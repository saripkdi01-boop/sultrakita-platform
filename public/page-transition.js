'use strict';

(function () {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  document.documentElement.classList.add('page-ready');
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download') || link.origin !== location.origin || link.pathname === location.pathname && link.search === location.search) return;
    event.preventDefault();
    document.documentElement.classList.add('page-leaving');
    window.setTimeout(() => location.assign(link.href), 120);
  });
})();
