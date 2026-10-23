// Pahad Footprint — Himalayan Expedition Service Worker
// Designed for 100% offline mountain navigation across Uttarakhand hills

const CACHE_NAME = 'pahad-footprint-v1.3';
const WEATHER_CACHE_NAME = 'pahad-weather-cache-v1';

const STATIC_PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icons/icon.svg',
  '/calculator/route',
  '/calculator/transport',
  '/calculator/stay',
  '/calculator/habits',
  '/calculator/results',
  '/methodology',
  '/restoration',
  '/admin',
  '/images/hero_mountain.webp',
  '/images/footer_panorama.webp',
];

// Install: Cache core application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Use Promise.allSettled so individual route delays don't abort SW installation
      return Promise.allSettled(
        STATIC_PRECACHE_URLS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[PWA SW] Pre-cache item skipped:', url, err);
          })
        )
      );
    })
  );
});

// Activate: Clean up older caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== WEATHER_CACHE_NAME) {
            console.log('[PWA SW] Removing outdated cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: Multi-strategy caching for offline Himalayan travel
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests and chrome-extension schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Strategy 1: MaybeSurya Weather API & Air Quality endpoints
  // Network-First with cache fallback for remote hill stations
  if (url.hostname.includes('maybesurya.dev') || url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(WEATHER_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Device is offline in hills — return last known cached weather
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Synthetic offline response if no previous cache
          return new Response(
            JSON.stringify({
              status: 'offline',
              offlineMessage: 'Device is operating offline in Himalayan mountain mode.',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // Strategy 2: OpenStreetMap Tiles
  // Cache-First with network fallback so mountain maps remain viewable offline
  if (url.hostname.includes('openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedTile) => {
        if (cachedTile) return cachedTile;

        return fetch(request)
          .then((networkTile) => {
            if (networkTile && networkTile.status === 200) {
              const tileToCache = networkTile.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, tileToCache);
              });
            }
            return networkTile;
          })
          .catch(() => {
            // Return transparent 1x1 fallback tile when offline and not cached
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
          });
      })
    );
    return;
  }

  // Strategy 3: Next.js static bundles, fonts, and images
  // Cache-First strategy
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Strategy 4: HTML Page Navigations
  // Network-First with instant fallback to cached app shell / page
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Try matching exact route in cache
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;

          // Fallback to cached home page or calculator shell
          const cachedFallback = await caches.match('/');
          if (cachedFallback) return cachedFallback;

          return new Response(
            '<html><body><h1>Pahad Footprint — Offline Field Guide</h1><p>You are viewing this mountain guide offline.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Default: Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
