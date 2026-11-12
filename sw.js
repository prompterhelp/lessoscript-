/* Service worker: installable + offline. Pages load from the network but fall back to cache fast; CDN libraries are cached so Stage opens quickly */
const CACHE = 'lesson-prompter-v50';
const ASSETS = ['./', './index.html', './stage.html', './manifest.json', './icon-192.png', './icon-512.png',
  './css/01-base-layout.css',
  './css/02-prompter-reading-modes.css',
  './css/03-lesson-brief-pip.css',
  './css/04-reports.css',
  './css/compact-controls.css',
  './css/fancy-tabs.css',
  './css/split-view.css',
  './css/ui-fix-v1.css',
  './css/ui-unify-2.css',
  './css/ui-unify.css',
  './css/ux-fix-main.css',
  './js/01-core-state-ui.js',
  './js/02-script-import-clean.js',
  './js/03-voice-follow-read-aloud.js',
  './js/04-reports.js',
  './js/05-report-templates-fonts.js',
  './js/06-monthly-record-word-form.js',
  './js/07-cloud-sync-saved-scripts.js',
  './js/08-welcome-guide.js',
  './js/09-undo-redo.js',
  './js/10-pwa-presenter-catchup-brief-pip.js',
  './js/11-certificates.js',
  './js/12-report-extras-paste-timer.js',
  './js/13-tap-to-edit-previews.js',
  './js/14-ui-language.js',
  './js/15-split-view-boot.js',
  './js/16-split-view.js',
  './js/17-ui-unify.js',
  './js/18-ui-unify-2.js',
  './js/19-ptH-fix.js',
  './js/20-fancy-tabs.js',
  './js/21-stage-preload.js',
  './js/22-certificate-stamp.js',
  './js/stage/05-core-stage.js',
  './js/stage/06-integration-upgrades.js',
  './js/stage/07-v2-upgrades.js',
  './js/stage/08-library-cloud-database.js',
  './js/stage/09-pro-fixes-youtube-reactions.js',
  './js/stage/10-fix-black-slow-slides.js',
  './js/stage/13-reactions.js',
  './js/stage/15-words-auto-size-auto-columns-to-fill-the.js',
  './js/stage/17-words-pick-the-column-count-size-that-fi.js',
  './js/stage/19-small-stop-resume-button-in-the-top-bar-.js',
  './js/stage/21-words-markup-term-divider-meaning-note-c.js',
  './js/stage/23-restore-saved-rotation-after-reopening-a.js',
  './js/stage/25-flow-pages-patch.js',
  './js/stage/27-private-tools-window-students-never-see-.js',
  './js/stage/29-student-window-reactions-behave-exactly-.js',
  './js/stage/31-open-google-drive-docs-slides-links-or-d.js',
  './js/stage/33-v6-pinned-movable-tabs-tab-memory-studen.js',
  './js/stage/36-modern-line-icons-for-the-stage-toolbar-.js',
  './js/stage/38-words-only-term-meaning-lines-become-car.js',
  './js/stage/40-the-bar-is-rebuilt-by-the-teacher-window.js',
  './js/stage/41-pro-v10.js',
  './js/stage/42-pro-v11.js',
  './js/stage/43-pro-v12.js',
  './js/stage/45-pro-v13js.js',
  './js/stage/46-stage-sync.js',
  './js/stage/47-tb-dock.js',
  './js/stage/48-ux-fix-js.js',
  './js/stage/50-lp-fancy-v1-js.js',
  './js/stage/52-lp-theme-sync-js.js',
  './js/stage/53-remote-student.js',
  './js/stage/54-sounds-voice-clips.js',
  './js/stage/56-stu-pgload-js.js',
  './css/stage/01-panel-closed-by-default-opens-closes-wit.css',
  './css/stage/02-tablet-fix-v1.css',
  './css/stage/03-ux-fix.css',
  './css/stage/04-block.css',
  './css/stage/11-pro-web.css',
  './css/stage/12-pro-v3.css',
  './css/stage/14-pro-v4.css',
  './css/stage/16-pro-v5.css',
  './css/stage/18-pro-v6.css',
  './css/stage/20-pro-v7.css',
  './css/stage/22-pro-v4.css',
  './css/stage/24-pro-v5.css',
  './css/stage/26-pro-v6.css',
  './css/stage/28-block.css',
  './css/stage/30-pro-v7.css',
  './css/stage/32-pro-v6.css',
  './css/stage/34-tb-modern.css',
  './css/stage/35-tb-icons.css',
  './css/stage/37-pro-v8.css',
  './css/stage/39-pro-v9.css',
  './css/stage/44-pro-v13.css',
  './css/stage/49-lp-fancy-v1.css',
  './css/stage/51-lp-theme-sync.css',
  './css/stage/55-stu-pgload.css'];
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
  /* app code (js/css) is network-first too, so one update never mixes old and new files */
  const isPage = req.mode === 'navigate' || /\/(index\.html|stage\.html|manifest\.json)?$/.test(url.pathname) || /\.(js|css)$/.test(url.pathname);
  if (isPage) { e.respondWith(networkFirstFast(req)); return; }
  e.respondWith(
    caches.match(req, {ignoreSearch: true}).then(hit => {
      const net = fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(() => {}); return res; }).catch(() => hit || Response.error());
      return hit || net;
    })
  );
});
