(() => {
  'use strict';
  const qs = (selector, root = document) => root.querySelector(selector);
  const query = values => new URLSearchParams(Object.entries(values).filter(([, value]) => value !== undefined && value !== null && value !== '')).toString();
  const date = value => value ? new Date(value).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : '-';
  const debounce = (fn, delay = 250) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };
  window.AdminUtils = { qs, query, date, debounce };
})();
