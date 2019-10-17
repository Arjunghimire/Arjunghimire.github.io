var cache_name = 'gih-cache';
var cached_urls = [
  "/offline.html",
  "/index.html",
  "/css/bootstrap.min.css",
  "/css/font-awesome.min.css",
  "/css/style.css",
  "/css/timeline.css",
  "/fonts/fontawesome-webfont.eot",
  "/fonts/fontawesome-webfont.svg",
  "/fonts/fontawesome-webfont.ttf",
  "/fonts/fontawesome-webfont.woff",
  "/fonts/fontawesome-webfont.woff2",
  "/fonts/FontAwesome.otf",
  "/js/bootstrap.min.js",
  "/js/easing.js",
  "/js/jquery-2.2.3.min.js",
  "/js/menu.js",
  "/js/move-top.js",
  "/js/responsiveslides.min.js",
  "/js/script.js",
  "/js/scrolling-nav.js",
  "/js/SmoothScroll.min.js",
  "/js/timeline.js",
  "/images/favicon.ico",
  "/images/2.png",
  "/images/banner.jpg",
  "/images/close.png",
  "/images/g2.jpg",
  "/images/g3.jpg",
  "/images/g5.jpg",
  "/images/g6.jpg",
  "/images/g7.jpg",
  "/images/g8.jpg",
  "/images/left1.png",
  "/images/move-top.png",
  "/images/right1.png",
  "/images/s1.png",
  "/images/s2.png",
  "/images/s3.png",
  "/images/s4.png",
  "/images/s5.png",
  "/images/s6.png"
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cache_name)
    .then(function (cache) {
      return cache.addAll(cached_urls);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName.startsWith('pages-cache-') && staticCacheName !== cacheName) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function (event) {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request).then(function (response) {
        if (response.status === 404) {
          return caches.match('index.html');
        }
        return caches.open(cached_urls).then(function (cache) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      });
    }).catch(function (error) {
      console.log('Error, ', error);
      return caches.match('../offline.html');
    })
  );
});