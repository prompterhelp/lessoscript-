/* Service worker: installable + offline, but ALWAYS fetches the newest app when online */
const CACHE = 'lesson-prompter-v17';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(ASSETS.map(u => fetch(new Request(u, {cache: 'reload'})).then(r => r.ok && c.put(u, r)).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; }).catch(() => caches.match(req)));
    return;
  }
  const isPage = req.mode === 'navigate' || /\/(index\.html|manifest\.json)?$/.test(url.pathname);
  if (isPage) {
    /* network-first: new versions show up immediately; cache is only the offline fallback */
    e.respondWith(
      fetch(new Request(req.url, {cache: 'reload'}))
        .then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; })
        .catch(() => caches.match(req, {ignoreSearch: true}).then(h => h || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => {
      const net = fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; }).catch(() => hit);
      return hit || net;
    })
  );
});
