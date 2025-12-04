const CACHE_NAME = 'jarvis-mobile-v3';
const REPO_SCOPE = '/jarvis-uplink/';

const FILES_TO_CACHE = [
  REPO_SCOPE,
  REPO_SCOPE + 'index.html',
  REPO_SCOPE + 'manifest.json'
];

self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // We use 'addAll' but catch errors so one missing file doesn't break the install
      return cache.addAll(FILES_TO_CACHE).catch(err => console.error("Cache Error", err));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
  if (evt.request.mode !== 'navigate') return;
  evt.respondWith(
    fetch(evt.request).catch(() => {
      return caches.match(REPO_SCOPE) || caches.match(REPO_SCOPE + 'index.html');
    })
  );
});
