'use strict';

const CACHE_NAME = 'sultrakita-shell-v6-2';
const SHELL = ['/', '/index.html', '/styles.css', '/app.js', '/taxonomy.js', '/marketplace-bridge.js', '/favicon.svg', '/site.webmanifest'];
const PRIVATE_PATHS = ['/account', '/chat', '/orders', '/payment', '/upload', '/admin'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/') || PRIVATE_PATHS.some(path => url.pathname.startsWith(path))) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(error => console.warn('[sw-cache]', error.message));
    }
    return response;
  }).catch(error => { console.warn('[sw-fetch]', error.message); return caches.match('/index.html'); })));
});
