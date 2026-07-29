/* trip-pilot service worker - build_site.py 가 생성 (직접 수정 금지) */
const CACHE_NAME = "tp-nhatrang-2026-10-9ca436dc";
const CACHE_RE = /^tp-nhatrang-2026-10-[0-9a-f]{8}$/;
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./nhatrang-2026-10.ics", "./map-d2-yeongdu.png", "./map-d2-yeongdu-dark.png", "./map-d3-yeongrak.png", "./map-d3-yeongrak-dark.png", "./map-d4.png", "./map-d4-dark.png", "./seg-d1-e3.png", "./seg-d1-e3-dark.png", "./seg-d5-e6.png", "./seg-d5-e6-dark.png", "./thumb-d1-e4.png", "./thumb-d1-e4-dark.png", "./thumb-d1-e7.png", "./thumb-d1-e7-dark.png", "./thumb-d2-e6.png", "./thumb-d2-e6-dark.png", "./thumb-d3-e3.png", "./thumb-d3-e3-dark.png", "./thumb-d3-e6.png", "./thumb-d3-e6-dark.png", "./thumb-d4-e6.png", "./thumb-d4-e6-dark.png", "./thumb-dining-costa-seafood.png", "./thumb-dining-costa-seafood-dark.png", "./thumb-dining-goguryeo.png", "./thumb-dining-goguryeo-dark.png", "./thumb-dining-louisiane-brewhouse.png", "./thumb-dining-louisiane-brewhouse-dark.png", "./thumb-dining-jj-seafood.png", "./thumb-dining-jj-seafood-dark.png", "./thumb-dining-an-thoi.png", "./thumb-dining-an-thoi-dark.png", "./thumb-dining-nem-nuong-dvq.png", "./thumb-dining-nem-nuong-dvq-dark.png", "./thumb-dining-lac-canh.png", "./thumb-dining-lac-canh-dark.png", "./thumb-dining-la-cala.png", "./thumb-dining-la-cala-dark.png", "./thumb-dining-vons-chicken.png", "./thumb-dining-vons-chicken-dark.png", "./thumb-dining-tem-nua.png", "./thumb-dining-tem-nua-dark.png", "./thumb-dining-k-mart.png", "./thumb-dining-k-mart-dark.png", "./dining.html", "./info.html"];

self.addEventListener('install', (event) => {
  /* cache.addAll 은 브라우저 HTTP 캐시를 그대로 쓴다 - 캐시명이 바뀌어 새 캐시를
     여는데도 그 안에 옛 파일이 담긴다. 실측: 배포 후 CACHE_NAME 이 최신인데
     dining.html 조각만 이전 배포본이었다(맛집 카드의 place_id 가 통째로 없었다).
     cache: 'reload' 는 HTTP 캐시를 건너뛰고 서버에서 받는다. 하나라도 실패하면
     설치를 중단해 반쪽 캐시를 남기지 않는 것은 addAll 과 같다. */
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(PRECACHE.map((u) =>
        fetch(u, { cache: 'reload' }).then((res) => {
          if (!res.ok) { throw new Error(u); }
          return cache.put(u, res);
        })
      )))
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
