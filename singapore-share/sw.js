/* trip-pilot service worker - build_site.py 가 생성 (직접 수정 금지) */
const CACHE_NAME = "tp-singapore-share-9f916fc4";
const CACHE_RE = /^tp-singapore-share-[0-9a-f]{8}$/;
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./map-d2.png", "./map-d2-dark.png", "./map-d3.png", "./map-d3-dark.png", "./map-d4.png", "./map-d4-dark.png", "./map-d5.png", "./map-d5-dark.png", "./map-d6.png", "./map-d6-dark.png", "./thumb-d2-e3.png", "./thumb-d2-e3-dark.png", "./thumb-d2-e4.png", "./thumb-d2-e4-dark.png", "./thumb-d2-e6.png", "./thumb-d2-e6-dark.png", "./thumb-d2-e7.png", "./thumb-d2-e7-dark.png", "./thumb-d2-e8.png", "./thumb-d2-e8-dark.png", "./thumb-d2-e9.png", "./thumb-d2-e9-dark.png", "./thumb-d2-e10.png", "./thumb-d2-e10-dark.png", "./thumb-d3-e3.png", "./thumb-d3-e3-dark.png", "./thumb-d3-e5.png", "./thumb-d3-e5-dark.png", "./thumb-d3-e7.png", "./thumb-d3-e7-dark.png", "./thumb-d3-e11.png", "./thumb-d3-e11-dark.png", "./thumb-d4-e6.png", "./thumb-d4-e6-dark.png", "./thumb-d4-e8.png", "./thumb-d4-e8-dark.png", "./thumb-d5-e9.png", "./thumb-d5-e9-dark.png", "./thumb-d5-e3.png", "./thumb-d5-e3-dark.png", "./thumb-d5-e6.png", "./thumb-d5-e6-dark.png", "./thumb-d6-e3.png", "./thumb-d6-e3-dark.png", "./thumb-d6-e8.png", "./thumb-d6-e8-dark.png"];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => CACHE_RE.test(k) && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') { return; }
  if (new URL(req.url).origin !== self.location.origin) { return; }
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) { return hit; }
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
