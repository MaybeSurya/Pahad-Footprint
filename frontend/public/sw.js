// Pahad Footprint — Himalayan Expedition Service Worker
// Designed for resilient 100% offline mountain navigation across Uttarakhand hills

const CACHE_NAME = 'pahad-footprint-v3.1';
const WEATHER_CACHE_NAME = 'pahad-weather-cache-v3';

// Core immutable static assets & dedicated offline mountain portal
const STATIC_PRECACHE_URLS = [
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon.svg',
  '/images/hero_mountain.webp',
  '/images/hero_mountain.jpg',
  '/images/footer_panorama.webp',
  '/images/footer_panorama.jpg',
];

// Install: Cache offline portal and static assets, skip waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
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

// Activate: Purge older caches immediately, take control of clients
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

// Fetch: Complete offline interception for Himalayan mountain expedition
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle non-GET requests (e.g. offline trip logging queue)
  if (request.method !== 'GET') {
    if (url.pathname.includes('/api/trips/log')) {
      event.respondWith(
        fetch(request.clone()).catch(() => {
          return new Response(
            JSON.stringify({
              message: 'Trip queued in offline mountain registry.',
              offline: true,
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        })
      );
      return;
    }
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 1: MaybeSurya Weather API & Air Quality endpoints
  // Target ONLY weather.maybesurya.dev and open-meteo, NEVER the app domain
  // ---------------------------------------------------------------------------
  const isWeatherEndpoint =
    url.hostname === 'weather.maybesurya.dev' ||
    url.hostname.includes('open-meteo.com');

  if (isWeatherEndpoint) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const toCache = networkResponse.clone();
            caches.open(WEATHER_CACHE_NAME).then((cache) => cache.put(request, toCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({
              status: 'offline',
              isOffline: true,
              message: 'Device is operating offline in Himalayan mountain mode.',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 2: OpenStreetMap Tiles (Cache-First with graceful fallback)
  // ---------------------------------------------------------------------------
  if (url.hostname.includes('openstreetmap.org')) {
    event.respondWith(
      caches.match(request).then((cachedTile) => {
        if (cachedTile) return cachedTile;

        return fetch(request)
          .then((networkTile) => {
            if (networkTile && networkTile.status === 200) {
              const tileToCache = networkTile.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, tileToCache));
            }
            return networkTile;
          })
          .catch(() => {
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
          });
      })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 3: Next.js static bundles, scripts, styles, fonts, icons, images
  // Cache-First with Network fallback (Never cache 404s)
  // ---------------------------------------------------------------------------
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname === '/favicon.ico' ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            return new Response('', { status: 404 });
          });
      })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 4: Next.js RSC (React Server Component) payloads & data fetching
  // Network-First. If offline and missing, return 503 so Next.js router
  // triggers hard navigation to the cached HTML page.
  // ---------------------------------------------------------------------------
  const isRSC =
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    url.pathname.startsWith('/_next/data/');

  if (isRSC) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const toCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedRSC = await caches.match(request);
          if (cachedRSC) return cachedRSC;

          // If RSC stream is not cached, return 503 so Next.js falls back to hard navigation
          return new Response('Offline: RSC unavailable', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 5: HTML Page Navigations (Full page reloads & direct URL hits)
  // Network-First: Always retrieve freshest HTML when online
  // Fallback to cached route, cached home, or rich interactive offline portal
  // ---------------------------------------------------------------------------
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache.clone());
              cache.put(url.pathname, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // 1. Exact URL match in cache
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;

          // 2. Pathname without query params
          const pathnameMatch = await caches.match(url.pathname);
          if (pathnameMatch) return pathnameMatch;

          // 3. Fallback to cached home page shell
          const cachedShell = await caches.match('/');
          if (cachedShell) return cachedShell;

          // 4. Fallback to rich, interactive offline mountain portal
          const offlinePortal = await caches.match('/offline.html');
          if (offlinePortal) return offlinePortal;

          return fetch('/offline.html');
        })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 6: Default fallback for remaining GET requests
  // Network-First with safe cache fallback
  // ---------------------------------------------------------------------------
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
        const cached = await caches.match(request);
        return cached || new Response('', { status: 404 });
      })
  );
});
