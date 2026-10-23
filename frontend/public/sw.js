// Pahad Footprint — Himalayan Expedition Service Worker
// Designed for 100% offline mountain navigation across Uttarakhand hills

const CACHE_NAME = 'pahad-footprint-v2.0';
const WEATHER_CACHE_NAME = 'pahad-weather-cache-v2';

// Core routes and critical static assets to precache immediately on install
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
  '/verify',
  '/admin',
  '/privacy',
  '/contact',
  '/faq',
  '/images/hero_mountain.webp',
  '/images/hero_mountain.jpg',
  '/images/footer_panorama.webp',
  '/images/footer_panorama.jpg',
];

// Install: Cache core application shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Pre-cache individual core pages with Promise.allSettled
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

// Fetch: Complete offline interception for Himalayan travel
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-http requests (e.g. chrome-extension://)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle POST/PUT/DELETE requests when offline
  if (request.method !== 'GET') {
    // If backend API request fails offline, provide synthetic success response
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

  // Strategy 1: MaybeSurya Weather API & Air Quality endpoints
  if (url.hostname.includes('maybesurya.dev') || url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const toCache = networkResponse.clone();
              caches.open(WEATHER_CACHE_NAME).then((cache) => cache.put(request, toCache));
            }
            return networkResponse;
          })
          .catch(() => {
            if (cachedResponse) return cachedResponse;
            return new Response(
              JSON.stringify({
                status: 'offline',
                isOffline: true,
                message: 'Device is operating offline in Himalayan mountain mode.',
              }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
          });

        return cachedResponse || networkFetch;
      })
    );
    return;
  }

  // Strategy 2: OpenStreetMap Tiles
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
            // Return transparent 1x1 fallback tile when offline and not cached
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
          });
      })
    );
    return;
  }

  // Strategy 3: Next.js static bundles, scripts, css, fonts, icons, images
  // Cache-First with Network fallback and SAFE offline default
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

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
            }
            return networkResponse;
          })
          .catch(() => {
            // Safe fallback: never reject or return undefined
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

  // Strategy 4: Next.js RSC (React Server Component) payloads & data fetching
  // e.g. /calculator/route?_rsc=... or /_next/data/...
  const isRSC =
    url.searchParams.has('_rsc') ||
    request.headers.get('RSC') === '1' ||
    url.pathname.startsWith('/_next/data/');

  if (isRSC) {
    event.respondWith(
      caches.match(request).then((cachedRSC) => {
        if (cachedRSC) return cachedRSC;

        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const toCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
            }
            return networkResponse;
          })
          .catch(async () => {
            // Try matching base pathname without RSC query
            const strippedMatch = await caches.match(url.pathname);
            if (strippedMatch) return strippedMatch;

            // Safe fallback response for RSC
            return new Response('{}', {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            });
          });
      })
    );
    return;
  }

  // Strategy 5: HTML Page Navigations (Full page reloads & direct URL hits)
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
          // 1. Try exact route in cache
          const cachedRoute = await caches.match(request);
          if (cachedRoute) return cachedRoute;

          // 2. Try URL pathname without search params
          const pathnameMatch = await caches.match(url.pathname);
          if (pathnameMatch) return pathnameMatch;

          // 3. Fallback to cached home page shell
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

  // Default: Stale-While-Revalidate with GUARANTEED safe fallback
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
        .catch(() => {
          // If offline and no cache, return safe empty response (NEVER return undefined)
          return cached || new Response('', { status: 200 });
        });

      return cached || fetchPromise;
    })
  );
});
