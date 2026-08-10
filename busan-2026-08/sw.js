/* trip-pilot service worker - build_site.py 가 생성 (직접 수정 금지) */
const CACHE_NAME = "tp-busan-2026-08-0bb2290b";
const CACHE_RE = /^tp-busan-2026-08-[0-9a-f]{8}$/;
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./busan-2026-08.ics", "./seg-d1-e2.png", "./seg-d1-e2-dark.png", "./seg-d2-e2.png", "./seg-d2-e2-dark.png", "./seg-d2-e5.png", "./seg-d2-e5-dark.png", "./seg-d2-e6.png", "./seg-d2-e6-dark.png", "./seg-d3-e2.png", "./seg-d3-e2-dark.png", "./thumb-d1-e2.png", "./thumb-d1-e2-dark.png", "./thumb-d2-e5.png", "./thumb-d2-e5-dark.png", "./thumb-dining-busan-mackerel.png", "./thumb-dining-busan-mackerel-dark.png", "./thumb-dining-yeonhwari.png", "./thumb-dining-yeonhwari-dark.png", "./thumb-dining-geumsu-bokguk.png", "./thumb-dining-geumsu-bokguk-dark.png", "./thumb-dining-thebay101.png", "./thumb-dining-thebay101-dark.png", "./thumb-dining-gaya-milmyeon.png", "./thumb-dining-gaya-milmyeon-dark.png", "./thumb-dining-haeundae-milmyeon.png", "./thumb-dining-haeundae-milmyeon-dark.png", "./thumb-dining-sangguk.png", "./thumb-dining-sangguk-dark.png", "./thumb-dining-dohuine.png", "./thumb-dining-dohuine-dark.png", "./thumb-dining-jogaeview.png", "./thumb-dining-jogaeview-dark.png", "./thumb-dining-jj-scallop.png", "./thumb-dining-jj-scallop-dark.png", "./thumb-dining-sumini.png", "./thumb-dining-sumini-dark.png", "./thumb-dining-orb-coffee.png", "./thumb-dining-orb-coffee-dark.png", "./thumb-dining-oldmug.png", "./thumb-dining-oldmug-dark.png", "./thumb-dining-geodae-gomtang.png", "./thumb-dining-geodae-gomtang-dark.png", "./thumb-dining-paris-baguette-marine.png", "./thumb-dining-paris-baguette-marine-dark.png", "./thumb-dining-subyeon-gukbap.png", "./thumb-dining-subyeon-gukbap-dark.png", "./thumb-dining-obs-marine.png", "./thumb-dining-obs-marine-dark.png", "./thumb-dining-jangeumi.png", "./thumb-dining-jangeumi-dark.png", "./thumb-dining-daebak-haejang.png", "./thumb-dining-daebak-haejang-dark.png", "./thumb-dining-inneri-with-kids.png", "./thumb-dining-inneri-with-kids-dark.png", "./thumb-dining-halmaejip.png", "./thumb-dining-halmaejip-dark.png", "./thumb-dining-buekgan-marine.png", "./thumb-dining-buekgan-marine-dark.png", "./dining.html", "./info.html"];

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
