const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.js",
  "/db.js",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png"
];

const CACHE_NAME = "static-cache-v2";


// install 
self.addEventListener("install", function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});

//activate will clean and refresh cache data.
self.addEventListener("activate", function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);  // this is removing old cache data when coming back up.
          }
        })
      );
    })
  );

  self.clients.claim();
});

// fetch event monitor to serve requests with a cache first process.
self.addEventListener("fetch", function(evt) {
  evt.respondWith(
    caches.match(evt.request).then(function(response) {
      return response || fetch(evt.request);
    })
  );
});

