/* TN State HUB PWA service worker – GitHub Pages /TNL/ scope */
const CACHE_NAME = 'tn-state-hub-shell-v6-root-icons';
const BASE_URL = new URL('./', self.registration.scope);
const APP_SHELL = [
  new URL('./', BASE_URL).href,
  new URL('./index.html', BASE_URL).href,
  new URL('./manifest.webmanifest', BASE_URL).href,
  new URL('./icon-192.png', BASE_URL).href,
  new URL('./icon-512.png', BASE_URL).href,
  new URL('./apple-touch-icon.png', BASE_URL).href
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async url => {
      try { const response = await fetch(url, {cache:'reload'}); if (response.ok) await cache.put(url, response); }
      catch (e) { /* A missing optional asset must not prevent installation. */ }
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('tn-state-hub-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(new URL('./index.html', BASE_URL).href, response.clone());
        }
        return response;
      } catch (error) {
        return (await caches.match(new URL('./index.html', BASE_URL).href)) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  })());
});
