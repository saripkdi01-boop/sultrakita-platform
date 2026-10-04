/**
 * SUKI Apps — Service Worker (PWA Fase 0)
 *
 * Strategi:
 * - Navigasi (mode: navigate): network-first → cache → halaman /offline
 * - Aset immutable Next.js (/_next/static/): cache-first
 * - Aset same-origin lain (gambar, font): stale-while-revalidate
 * - /api/* dan non-GET: TIDAK PERNAH di-cache / di-intercept
 */
'use strict';

var SW_VERSION = 'suki-pwa-v1';
var STATIC_CACHE = SW_VERSION + '-static';
var PAGES_CACHE = SW_VERSION + '-pages';
var OFFLINE_URL = '/offline';
var PRECACHE = [OFFLINE_URL, '/icon-192.png', '/icon-512.png', '/manifest.webmanifest'];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(function (cache) { return cache.addAll(PRECACHE); })
      .catch(function () { /* precache boleh gagal sebagian */ })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key.indexOf(SW_VERSION) !== 0; })
            .map(function (key) { return caches.delete(key); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

function isApiPath(pathname) {
  return pathname.indexOf('/api/') === 0;
}

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  var url;
  try {
    url = new URL(request.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (isApiPath(url.pathname)) return;

  // 1) Navigasi halaman: network-first, fallback cache, lalu /offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          var copy = response.clone();
          caches.open(PAGES_CACHE).then(function (cache) {
            cache.put(request, copy).catch(function () {});
          });
          return response;
        })
        .catch(function () {
          return caches.match(request, { ignoreSearch: true }).then(function (cached) {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // 2) Aset immutable Next.js: cache-first
  if (url.pathname.indexOf('/_next/static/') === 0) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(function (cache) {
        return cache.match(request).then(function (hit) {
          if (hit) return hit;
          return fetch(request).then(function (response) {
            if (response && response.ok) cache.put(request, response.clone()).catch(function () {});
            return response;
          });
        });
      })
    );
    return;
  }

  // 3) Aset same-origin lain: stale-while-revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(function (cache) {
      return cache.match(request).then(function (hit) {
        var network = fetch(request)
          .then(function (response) {
            if (response && response.ok) cache.put(request, response.clone()).catch(function () {});
            return response;
          })
          .catch(function () { return hit; });
        return hit || network;
      });
    })
  );
});
