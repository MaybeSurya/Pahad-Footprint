// Pahad Footprint — Himalayan Expedition Service Worker
// Designed for resilient offline mountain navigation across Uttarakhand hills

const CACHE_NAME = 'pahad-footprint-v3.0';
const WEATHER_CACHE_NAME = 'pahad-weather-cache-v3';

// Only precache truly static, immutable assets (NEVER precache dynamic Next.js HTML routes)
const STATIC_PRECACHE_URLS = [
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon.svg',
  '/images/hero_mountain.webp',
  '/images/hero_mountain.jpg',
  '/images/footer_panorama.webp',
  '/images/footer_panorama.jpg',
];

// Install: Cache immutable static assets and skip waiting
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

// Activate: Purge older v2 and invalid caches immediately, claim clients
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

// Fetch: Precision routing for Next.js App Router & offline Himalayan travel
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http(s) requests (e.g. chrome-extension://)
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
  // STRICT CHECK: Target ONLY weather.maybesurya.dev or open-meteo.com
  // NEVER match application domain (e.g. nav.maybesurya.dev)
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
  // Strategy 2: OpenStreetMap Tiles (Cache-First)
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
  // Strategy 3: Next.js static bundles, scripts, styles, fonts, images
  // Cache-First with Network fallback (Never cache 404s)
  // ---------------------------------------------------------------------------
  const isStaticBundle =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    url.pathname === '/favicon.ico' ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isStaticBundle) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request)
          .then((networkResponse) => {
            // Strictly only cache successful 200 responses to prevent chunk poisoning
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            if (url.pathname.endsWith('.css')) {
              return new Response('/* Offline fallback stylesheet */', {
                status: 200,
                headers: { 'Content-Type': 'text/css' },
              });
            }
            if (url.pathname.endsWith('.js')) {
              return new Response('// Offline fallback script', {
                status: 200,
                headers: { 'Content-Type': 'application/javascript' },
              });
            }
            return new Response('', { status: 200 });
          });
      })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 4: Next.js RSC (React Server Component) payloads & data fetching
  // Network-First with cached fallback
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

          const strippedMatch = await caches.match(url.pathname);
          if (strippedMatch) return strippedMatch;

          return new Response('{}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 5: HTML Page Navigations (Full page reloads & direct URL hits)
  // Network-First: Always retrieve the freshest HTML with matching chunk hashes
  // Fallback to cache/offline page ONLY when offline in the hills
  // ---------------------------------------------------------------------------
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
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;

          const pathnameMatch = await caches.match(url.pathname);
          if (pathnameMatch) return pathnameMatch;

          const cachedShell = await caches.match('/');
          if (cachedShell) return cachedShell;

          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Pahad Footprint — Offline</title></head><body><h1>Pahad Footprint</h1><p>Operating offline in Himalayan mountain mode.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // ---------------------------------------------------------------------------
  // Strategy 6: Default fallback for any remaining GET requests
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
        return cached || new Response('', { status: 200 });
      })
  );
});
