/* eslint-env worker, serviceworker */
/* eslint-disable comma-dangle */
/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable prefer-arrow-callback */

const CACHE_KEY = '20230409';
const CACHE_CONTENT = [
  // Pages
  '/',
  '/changes.htm',
  '/compare.htm',
  '/comparing.htm',
  '/downloads.htm',
  '/guide.htm',
  '/matrix.htm',
  '/renames.htm',
  '/saved.htm',
  '/settings.htm',
  '/viewsvg.htm',
  // Misc
  '/favicon.ico',
  '/manifest.json',
  // '/robots.txt',
  // '/sitemap.xml',
  // Styles
  '/css/changes.css',
  '/css/common.css',
  '/css/compare.css',
  '/css/comparing.css',
  '/css/downloads.css',
  '/css/guide.css',
  '/css/index.css',
  '/css/maps.css',
  '/css/matrix.css',
  '/css/renames.css',
  '/css/saved.css',
  '/css/settings.css',
  '/css/viewsvg.css',
  // Javascript
  '/js/changes.js',
  '/js/common.js',
  '/js/compare.js',
  '/js/comparing.js',
  '/js/downloads.js',
  '/js/guide.js',
  '/js/index.js',
  '/js/maps.js',
  '/js/matrix.js',
  '/js/renames.js',
  '/js/saved.js',
  '/js/settings.js',
  '/js/viewsvg.js',
  // SVG
  '/media/favicon.svg',
  '/media/sprites.svg',
  // Static Images
  '/media/apple-touch-icon.png',
  '/media/favicon-192.png',
  '/media/favicon-192-mask.png',
  '/media/favicon-512.png',
  '/media/favicon-512-mask.png',
  '/media/page-compare.png',
  '/media/page-home1.png',
  '/media/page-home2.png',
  '/media/page-saved.png',
  '/media/page-settings.png',
  '/media/page-viewsvg.png',
  // '/media/screenshot-1-desktop.png',
  // '/media/screenshot-1-mobile.png',
  // '/media/screenshot-2-desktop.png',
  // '/media/screenshot-2-mobile.png',
  // '/media/screenshot-3-desktop.png',
  // '/media/screenshot-3-mobile.png',
  '/media/shortcut-changes.png',
  '/media/shortcut-cog.png',
  '/media/shortcut-compare.png',
  '/media/shortcut-downloads.png',
  '/media/shortcut-guide.png',
  '/media/shortcut-home.png',
  '/media/shortcut-matrix.png',
  '/media/shortcut-related.png',
  '/media/shortcut-renames.png',
  '/media/shortcut-save.png',
  // '/media/summary.png',
  // '/media/summary_large_image.png',
  // '/media/summary_wide.png',
  '/media/teams-add.png',
  '/media/teams-app.png',
  '/media/teams-manage.png',
  '/media/teams-pin.png',
  '/media/teams-upload.png',
  // Animated Images
  '/media/edit-modes.png',
  '/media/image-controls.png',
  '/media/page-comparing.png',
  '/media/page-matrix.png',
  // Glyphs
  '/media/glyphs/arrow-down.svg',
  '/media/glyphs/arrow-left.svg',
  '/media/glyphs/arrow-right.svg',
  '/media/glyphs/arrow-up.svg',
  '/media/glyphs/blocked.svg',
  '/media/glyphs/cross.svg',
  '/media/glyphs/heart.svg',
  '/media/glyphs/label-done.svg',
  '/media/glyphs/label-future.svg',
  '/media/glyphs/label-in-progress.svg',
  '/media/glyphs/label-mscw-c.svg',
  '/media/glyphs/label-mscw-m.svg',
  '/media/glyphs/label-mscw-s.svg',
  '/media/glyphs/label-mscw-w.svg',
  '/media/glyphs/label-not-yet.svg',
  '/media/glyphs/label-on-hold.svg',
  '/media/glyphs/label-phase-1.svg',
  '/media/glyphs/label-phase-2.svg',
  '/media/glyphs/label-phase-3.svg',
  '/media/glyphs/label-priority-high.svg',
  '/media/glyphs/label-priority-low.svg',
  '/media/glyphs/label-priority-medium.svg',
  '/media/glyphs/label-purchased.svg',
  '/media/glyphs/label-purchasing.svg',
  '/media/glyphs/label-testing.svg',
  '/media/glyphs/label-will.svg',
  '/media/glyphs/light-green.svg',
  '/media/glyphs/light-red.svg',
  '/media/glyphs/light-yellow.svg',
  '/media/glyphs/percent-0.svg',
  '/media/glyphs/percent-1.svg',
  '/media/glyphs/percent-2.svg',
  '/media/glyphs/percent-3.svg',
  '/media/glyphs/percent-4.svg',
  '/media/glyphs/star.svg',
  '/media/glyphs/status-green.svg',
  '/media/glyphs/status-red.svg',
  '/media/glyphs/status-yellow.svg',
  '/media/glyphs/tick.svg',
  // Diagram Pages
  '/files/Azure-AD-Premium.htm',
  '/files/CAL-All-Bridges.htm',
  '/files/CAL-Main-Bridges.htm',
  '/files/CAL-Other-Bridges.htm',
  '/files/CALs.htm',
  '/files/EMS-All.htm',
  '/files/EMS-E3.htm',
  '/files/EMS-E5.htm',
  '/files/EMS-Simple.htm',
  '/files/Intune.htm',
  '/files/Microsoft-365-Apps-All.htm',
  '/files/Microsoft-365-Apps-Business.htm',
  '/files/Microsoft-365-Apps-Enterprise.htm',
  '/files/Microsoft-365-Business-All.htm',
  '/files/Microsoft-365-Business-Basic.htm',
  '/files/Microsoft-365-Business-Premium.htm',
  '/files/Microsoft-365-Business-Standard.htm',
  '/files/Microsoft-365-Consumer.htm',
  '/files/Microsoft-365-E3.htm',
  '/files/Microsoft-365-E5.htm',
  '/files/Microsoft-365-Education-A1-(Legacy).htm',
  '/files/Microsoft-365-Education-A1-for-Devices.htm',
  '/files/Microsoft-365-Education-A3.htm',
  '/files/Microsoft-365-Education-A5.htm',
  '/files/Microsoft-365-Education-All.htm',
  '/files/Microsoft-365-Education-Student-Use-Benefits-All.htm',
  '/files/Microsoft-365-Education-Student-Use-Benefits-Simple.htm',
  '/files/Microsoft-365-Enterprise-All.htm',
  '/files/Microsoft-365-Enterprise-Landscape.htm',
  '/files/Microsoft-365-Enterprise-Venn.htm',
  '/files/Microsoft-365-F1.htm',
  '/files/Microsoft-365-F3.htm',
  '/files/Microsoft-365-F5.htm',
  '/files/Microsoft-365-Frontline-All.htm',
  '/files/Microsoft-365-Personal-and-Family.htm',
  '/files/Microsoft-Defender-CSPM.htm',
  '/files/Microsoft-Defender-for-Business.htm',
  '/files/Microsoft-Defender-for-Endpoint.htm',
  '/files/Microsoft-Defender-for-Office-365.htm',
  '/files/Microsoft-Defender-for-Servers.htm',
  '/files/Microsoft-Defender-Vulnerability-Management.htm',
  '/files/Microsoft-Project.htm',
  '/files/Microsoft-Teams-Premium.htm',
  '/files/Microsoft-Teams-Rooms.htm',
  '/files/Microsoft-Teams-Rooms-Basic.htm',
  '/files/Microsoft-Teams-Rooms-Old.htm',
  '/files/Microsoft-Teams-Rooms-Pro.htm',
  '/files/Microsoft-Visio.htm',
  '/files/Office-365-E1.htm',
  '/files/Office-365-E3.htm',
  '/files/Office-365-E5.htm',
  '/files/Office-365-Education-All.htm',
  '/files/Office-365-Education-Simple.htm',
  '/files/Office-365-Enterprise-All.htm',
  '/files/Office-365-Enterprise-Simple.htm',
  '/files/Office-365-F3.htm',
  '/files/Office-365-US-Government-All.htm',
  '/files/Office-365-US-Government-F3.htm',
  '/files/Office-365-US-Government-G1.htm',
  '/files/Office-Consumer.htm',
  '/files/Related-Services.htm',
  '/files/Windows-365.htm',
  '/files/Windows-365-Compare.htm',
  '/files/Windows-Enterprise.htm',
  '/files/Windows-Pro.htm',
  '/files/Windows-VL.htm',
];
const CACHE_MATCH_OPTIONS = { ignoreVary: true, ignoreMethod: false, ignoreSearch: false };
const HTML_OFFLINE = `<!DOCTYPE html>
<html dir="ltr" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000" />
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="icon" href="/media/favicon.svg" type="image/svg+xml" sizes="any" />
    <link rel="apple-touch-icon" sizes="180x180" href="/media/apple-touch-icon.png" />
    <link rel="manifest" href="/manifest.json" />
    <link rel="stylesheet" href="/css/error.css" />
    <title>Offline | M365 Maps</title>
  </head>
  <body>
    <img src="/media/favicon.svg" width="128" height="128" alt="" />
    <h1>Site Unreachable</h1>
    <p>Pages you have already visited remain available while offline.</p>
    <p>Go to <a href="/">home page</a></p>
  </body>
</html>`;

/** Service Worker Install caches core app components and diagrams. */
function swInstall(event) {
  console.log('[SW] Install', CACHE_KEY);

  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_KEY).then((cache) => cache.addAll(CACHE_CONTENT)));
}

/** Service Worker Activate deletes old caches. */
function swActivate(event) {
  console.log('[SW] Activate', CACHE_KEY);

  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.map((key) => {
    if (key !== CACHE_KEY) {
      return caches.delete(key);
    }
    return undefined;
  }))));
}

/** Service Worker Fetch goes to cache first then network (updates cache). */
function swFetch(event) {
  // console.log('[SW] Fetch', CACHE_KEY, event.request.url);

  const requestUrl = new URL(event.request.url);
  const requestPath = requestUrl.pathname + (requestUrl.search ?? '');

  event.respondWith(caches.open(CACHE_KEY).then((cache) => cache
    .match(requestPath, CACHE_MATCH_OPTIONS).then((cacheResponse) => {
      if (cacheResponse) {
        return cacheResponse;
      }

      return fetch(requestPath, { cache: 'no-cache', redirect: 'manual' }).then((fetchResponse) => {
        console.log('[SW] Cache miss', CACHE_KEY, requestPath, fetchResponse.status);
        if (fetchResponse.status === 200) {
          const responseUrl = new URL(fetchResponse.url);
          const responsePath = responseUrl.pathname + (responseUrl.search ?? '');
          cache.put(responsePath, fetchResponse.clone());
        }
        return fetchResponse;
      }).catch((error) => {
        console.log('[SW] Cache miss - error', CACHE_KEY, requestPath, error);
        return new Response(HTML_OFFLINE, {
          status: 503,
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html; charset=utf-8',
          },
        });
      });
    })));
}

self.addEventListener('install', swInstall);
self.addEventListener('activate', swActivate);
self.addEventListener('fetch', swFetch);
