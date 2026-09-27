// Development-safe service worker - does not cache HTML or dev chunks
const CACHE_NAME = 'celestial-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Always bypass cache in dev to avoid stale blank screens
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
