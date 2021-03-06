const PRECACHE = 'saudia-v4';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'index.html',
  './', // Alias for index.html
  'css/saudia.css',
  'fonts/frutiger/frutiger-light/unicode.frutigel.ttf',
  'fonts/frutiger/Frutiger_Roman.ttf',
  'fonts/frutiger/FTB.ttf',
  'icons/british-flag-small.png',
  'icons/SaudiaLogo.png',
  'icons/Tags_Plane.png',
  'img/bg.jpg',
  'img/Mask_Group_1.jpg',
  'img/Mask_Group_11.jpg',
  'img/Mask_Group_12.jpg',
  'img/Mask_Group_13.jpg',
  'img/Mask_Group_14.jpg',
  'img/Mask_Group_15.jpg',
  'img/Mask_Group_16.jpg',
  'img/Mask_Group_2.jpg',
  'img/Mask_Group_23.jpg',
  'img/Mask_Group_3.jpg',
  'img/Mask_Group_4.jpg',
  'img/Mask_Group_9.jpg',
  'js/global.js',
  'vendor/bootstrap/css/bootstrap.min.css',
  'vendor/jquery/jquery.min.js',
  'vendor/bootstrap-v4-rtl/dist/js/bootstrap.bundle.min.js',
  'vendor/timer.js',
  'favicon.ico',
  'vendor/bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css',
  'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
  'https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-solid-900.woff2',
  'https://use.fontawesome.com/releases/v5.0.13/webfonts/fa-brands-400.woff2'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});