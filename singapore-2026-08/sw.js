/* trip-pilot service worker - build_site.py 가 생성 (직접 수정 금지) */
const CACHE_NAME = "tp-singapore-2026-08-c538fc8c";
const CACHE_RE = /^tp-singapore-2026-08-[0-9a-f]{8}$/;
const PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./singapore-2026-08.ics", "./map-d2.png", "./map-d2-dark.png", "./map-d3.png", "./map-d3-dark.png", "./map-d4.png", "./map-d4-dark.png", "./map-d5.png", "./map-d5-dark.png", "./map-d6.png", "./map-d6-dark.png", "./seg-d1-e5.png", "./seg-d1-e5-dark.png", "./seg-d2-e4.png", "./seg-d2-e4-dark.png", "./seg-d2-e13.png", "./seg-d2-e13-dark.png", "./seg-d6-e7.png", "./seg-d6-e7-dark.png", "./thumb-d1-e4.png", "./thumb-d1-e4-dark.png", "./thumb-d2-e3.png", "./thumb-d2-e3-dark.png", "./thumb-d2-e4.png", "./thumb-d2-e4-dark.png", "./thumb-d2-e6.png", "./thumb-d2-e6-dark.png", "./thumb-d2-e7.png", "./thumb-d2-e7-dark.png", "./thumb-d2-e8.png", "./thumb-d2-e8-dark.png", "./thumb-d2-e9.png", "./thumb-d2-e9-dark.png", "./thumb-d2-e10.png", "./thumb-d2-e10-dark.png", "./thumb-d3-e3.png", "./thumb-d3-e3-dark.png", "./thumb-d3-e5.png", "./thumb-d3-e5-dark.png", "./thumb-d3-e7.png", "./thumb-d3-e7-dark.png", "./thumb-d3-e11.png", "./thumb-d3-e11-dark.png", "./thumb-d4-e10.png", "./thumb-d4-e10-dark.png", "./thumb-d4-e11.png", "./thumb-d4-e11-dark.png", "./thumb-d4-e8.png", "./thumb-d4-e8-dark.png", "./thumb-d5-e3.png", "./thumb-d5-e3-dark.png", "./thumb-d5-e6.png", "./thumb-d5-e6-dark.png", "./thumb-d6-e3.png", "./thumb-d6-e3-dark.png", "./thumb-d6-e5.png", "./thumb-d6-e5-dark.png", "./thumb-d6-e8.png", "./thumb-d6-e8-dark.png", "./thumb-dining-a-noodle-story.png", "./thumb-dining-a-noodle-story-dark.png", "./thumb-dining-yakun-marina-square.png", "./thumb-dining-yakun-marina-square-dark.png", "./thumb-dining-highlander.png", "./thumb-dining-highlander-dark.png", "./thumb-dining-food-republic-suntec.png", "./thumb-dining-food-republic-suntec-dark.png", "./thumb-dining-zam-zam.png", "./thumb-dining-zam-zam-dark.png", "./thumb-dining-tap-millenia.png", "./thumb-dining-tap-millenia-dark.png", "./thumb-dining-harrys-esplanade.png", "./thumb-dining-harrys-esplanade-dark.png", "./thumb-dining-violet-oon-ion.png", "./thumb-dining-violet-oon-ion-dark.png", "./thumb-dining-yum-cha-chinatown.png", "./thumb-dining-yum-cha-chinatown-dark.png", "./thumb-dining-dintaifung-suntec.png", "./thumb-dining-dintaifung-suntec-dark.png", "./thumb-dining-lau-pa-sat.png", "./thumb-dining-lau-pa-sat-dark.png", "./thumb-dining-atlas-bar.png", "./thumb-dining-atlas-bar-dark.png", "./thumb-dining-hjh-maimunah.png", "./thumb-dining-hjh-maimunah-dark.png", "./thumb-dining-adam-road.png", "./thumb-dining-adam-road-dark.png", "./thumb-dining-marche-suntec.png", "./thumb-dining-marche-suntec-dark.png", "./thumb-dining-the-halia.png", "./thumb-dining-the-halia-dark.png", "./thumb-dining-swee-choon.png", "./thumb-dining-swee-choon-dark.png", "./thumb-dining-jewel-changi.png", "./thumb-dining-jewel-changi-dark.png", "./thumb-dining-chinatown-complex.png", "./thumb-dining-chinatown-complex-dark.png", "./dining.html", "./info.html"];

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
