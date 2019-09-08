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
  "/images/2.png",
  "/images/banner.jpg",
  "/images/close.png",
  "/images/g2.png",
  "/images/g3.png",
  "/images/g5.png",
  "/images/g6.png",
  "/images/g7.png",
  "/images/g8.png",
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

self.addEventListener("install", function(event) {
  event.waitUntil(preLoad());
});

var preLoad = function() {
  console.log("Installing web app");
  return caches.open("offline").then(function(cache) {
    console.log("caching index and important routes");
    return cache.addAll(cached_urls);
  });
};

self.addEventListener("fetch", function(event) {
  event.respondWith(
    checkResponse(event.request).catch(function() {
      return returnFromCache(event.request);
    })
  );
  event.waitUntil(addToCache(event.request));
});

var checkResponse = function(request) {
  return new Promise(function(fulfill, reject) {
    fetch(request).then(function(response) {
      if (response.status !== 404) {
        fulfill(response);
      } else {
        reject();
      }
    }, reject);
  });
};

var addToCache = function(request) {
  return caches.open("offline").then(function(cache) {
    return fetch(request).then(function(response) {
      console.log(response.url + " was cached");
      return cache.put(request, response);
    });
  });
};

var returnFromCache = function(request) {
  return caches.open("offline").then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (!matching || matching.status == 404) {
        return cache.match("index.html");
      } else {
        return matching;
      }
    });
  });
};
