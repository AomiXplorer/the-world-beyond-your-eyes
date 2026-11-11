/* Offline shell for The World Beyond Your Eyes.
   The shell is precached; art and audio are cached as they are played so a
   first visit stays light and a return visit works without a network. */
const VERSION = 'twbye-v2.1.0';
const SHELL = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'js/config.js', 'js/audio.js', 'js/save.js', 'js/view.js', 'js/scene.js',
  'js/engine.js', 'js/ui.js', 'js/main.js',
  'js/story/ch01.js', 'js/story/ch02.js', 'js/story/ch03.js', 'js/story/ch04.js',
  'js/story/ch05.js', 'js/story/ch06.js', 'js/story/ch07.js', 'js/story/ch08.js',
  'js/story/endings.js',
  'assets/icons/icon-192.png', 'assets/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === VERSION ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  const isDoc = req.mode === 'navigate' || /\.html?$/.test(url.pathname);
  if (isDoc) {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(VERSION).then((c) => c.put(req, copy));
        }
        return res;
      });
    })
  );
});
