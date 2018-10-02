const PRECACHE = 'saudia-v2';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
  'app/page/index.html',
  'app/page/', // Alias for index.html
  'app/page/css/saudia.css',
  'app/page/fonts/frutiger/frutiger-light/unicode.frutigel.ttf',
  'app/page/fonts/frutiger/Frutiger_Roman.ttf',
  'app/page/fonts/frutiger/FTB.ttf',
  'app/page/icons/british-flag-small.png',
  'app/page/icons/SaudiaLogo.png',
  'app/page/icons/Tags_Plane.png',
  'app/page/img/bg.jpg',
  'app/page/img/Mask_Group_1.jpg',
  'app/page/img/Mask_Group_11.jpg',
  'app/page/img/Mask_Group_12.jpg',
  'app/page/img/Mask_Group_13.jpg',
  'app/page/img/Mask_Group_14.jpg',
  'app/page/img/Mask_Group_15.jpg',
  'app/page/img/Mask_Group_16.jpg',
  'app/page/img/Mask_Group_2.jpg',
  'app/page/img/Mask_Group_23.jpg',
  'app/page/img/Mask_Group_3.jpg',
  'app/page/img/Mask_Group_4.jpg',
  'app/page/img/Mask_Group_9.jpg',
  'app/js/global.js',
  'app/page/vendor/bootstrap/css/bootstrap.min.css',
  'app/page/vendor/jquery/jquery.min.js',
  'app/page/vendor/bootstrap-v4-rtl/dist/js/bootstrap.bundle.min.js',
  'app/page/favicon.ico',
  'app/page/vendor/bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css',
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