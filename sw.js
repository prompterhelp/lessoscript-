/* Service worker: installable + offline. Pages load from the network but fall back to cache fast; CDN libraries are cached so Stage opens quickly */
const CACHE = 'lesson-prompter-v46';
const ASSETS = ['./', './index.html', './stage.html', './manifest.json', './icon-192.png', './icon-512.png'];
const CDN_HOSTS = ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net'];
const CDN_WARM = ['https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => {
        /* warm the PDF library in the background (not blocking install) */
        CDN_WARM.forEach(u => fetch(u, {mode: 'cors'}).then(r => r.ok && c.put(u, r)).catch(() => {}));
        return Promise.all(ASSETS.map(u => fetch(new Request(u, {cache: 'reload'})).then(r => r.ok && c.put(u, r)).catch(() => {})));
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* network first, but if the network is slow (1.5 s) answer from cache so the page never feels stuck */
function networkFirstFast(req) {
  return new Promise(resolve => {
    let done = false;
    const timer = setTimeout(() => {
      caches.match(req, {ignoreSearch: true}).then(h => { if (h && !done) { done = true; resolve(h); } });
    }, 1500);
    fetch(new Request(req.url, {cache: 'reload'}))
      .then(res => {
        clearTimeout(timer);
        const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {});
        if (!done) { done = true; resolve(res); }
      })
      .catch(() => {
        clearTimeout(timer);
        caches.match(req, {ignoreSearch: true}).then(h => h || caches.match('./index.html')).then(h => { if (!done) { done = true; resolve(h || Response.error()); } });
      });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (CDN_HOSTS.includes(url.hostname)) {
      /* libraries & fonts never change per URL: cache first, refresh quietly */
      e.respondWith(caches.match(req).then(hit => {
        const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); } return res; }).catch(() => hit || Response.error());
        return hit || net;
      }));
      return;
    }
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; }).catch(() => caches.match(req).then(r => r || Response.error())));
    return;
  }
  const isPage = req.mode === 'navigate' || /\/(index\.html|stage\.html|manifest\.json)?$/.test(url.pathname);
  if (isPage) { e.respondWith(networkFirstFast(req)); return; }
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => {
      const net = fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; }).catch(() => hit || Response.error());
      return hit || net;
    })
  );
});
