/* Public static atlas assets only. Bump VERSION when publishing a new build. */
const VERSION = 'anatomy-studio-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const OWN_CACHE_PREFIX = 'anatomy-studio-';
const APP_SHELL = [
  './', './index.html', './explore.css', './explore.js', './scene.js',
  './organs-catalog.js', './study-data.js', './manifest.webmanifest',
  './icons/anatomy.svg', './icons/anatomy-192.png', './icons/anatomy-512.png',
];
const OFFLINE_RESOURCES = [
  ...APP_SHELL,
  './vendor/three/three.module.js',
  './vendor/three/addons/controls/OrbitControls.js',
  './vendor/three/addons/loaders/GLTFLoader.js',
  './vendor/three/addons/utils/BufferGeometryUtils.js',
  './vendor/three/addons/libs/meshopt_decoder.module.js',
  './models/optimized-body.glb',
  './models/optimized-heart.glb',
  './models/optimized-lung.glb',
];
const absolute = (path) => new URL(path, self.registration.scope).href;
const shellURLs = new Set(APP_SHELL.map(absolute));
const offlineURLs = new Set(OFFLINE_RESOURCES.map(absolute));

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    // Model files are intentionally excluded from installation.
    await cache.addAll(APP_SHELL.map((path) => new Request(absolute(path), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith(OWN_CACHE_PREFIX)
      && key !== SHELL_CACHE && key !== ASSET_CACHE).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

function isPublicResponse(response) {
  return response.status === 200 && response.type !== 'opaque'
    && !/\b(?:no-store|private)\b/i.test(response.headers.get('Cache-Control') || '');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  // Strict allowlist excludes queries, remote requests, credentials and private pages.
  if (request.method !== 'GET' || url.origin !== self.location.origin
      || url.search || request.headers.has('Authorization')
      || request.headers.has('Range') || !offlineURLs.has(url.href)) return;

  const isShell = shellURLs.has(url.href);
  event.respondWith((async () => {
    const cache = await caches.open(isShell ? SHELL_CACHE : ASSET_CACHE);
    const cached = await cache.match(request);
    if (!isShell && cached) return cached;
    try {
      const response = await fetch(request);
      if (isPublicResponse(response)) {
        // Serve even if the browser refuses additional storage.
        event.waitUntil(cache.put(request, response.clone()).catch(() => {}));
      }
      return response;
    } catch (error) {
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const index = await cache.match(absolute('./index.html'));
        if (index) return index;
      }
      return new Response('This asset is not yet available offline. Reconnect and use Download for offline.', {
        status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  })());
});

async function offlineStatus() {
  let completed = 0;
  let bytes = 0;
  const missing = [];
  const shell = await caches.open(SHELL_CACHE);
  const assets = await caches.open(ASSET_CACHE);
  for (const path of OFFLINE_RESOURCES) {
    const url = absolute(path);
    const response = await (shellURLs.has(url) ? shell : assets).match(url);
    if (response) {
      completed++;
      bytes += Number(response.headers.get('Content-Length')) || 0;
    } else missing.push(path);
  }
  return { type: 'OFFLINE_STATUS', ready: missing.length === 0, completed, total: OFFLINE_RESOURCES.length, bytes, missing, version: VERSION };
}

let pendingDownload = null;
const downloadListeners = new Set();
function broadcast(message) {
  for (const listener of downloadListeners) {
    try { listener.postMessage(message); } catch { downloadListeners.delete(listener); }
  }
}

async function downloadOffline() {
  let completed = 0;
  let bytes = 0;
  try {
    const shell = await caches.open(SHELL_CACHE);
    const assets = await caches.open(ASSET_CACHE);
    for (const path of OFFLINE_RESOURCES) {
      const url = absolute(path);
      const cache = shellURLs.has(url) ? shell : assets;
      const existing = await cache.match(url);
      if (existing) bytes += Number(existing.headers.get('Content-Length')) || 0;
      else {
        const response = await fetch(url, { credentials: 'omit', cache: 'reload' });
        if (!isPublicResponse(response)) throw new Error(`Could not download ${path} (HTTP ${response.status}).`);
        bytes += Number(response.headers.get('Content-Length')) || 0;
        await cache.put(url, response);
      }
      completed++;
      broadcast({ type: 'OFFLINE_PROGRESS', completed, total: OFFLINE_RESOURCES.length, url: path, bytes });
    }
    broadcast({ type: 'OFFLINE_COMPLETE', completed, total: OFFLINE_RESOURCES.length, bytes, ready: true, version: VERSION });
  } catch (error) {
    broadcast({ type: 'OFFLINE_ERROR', message: error.name === 'QuotaExceededError'
      ? 'Your browser has insufficient free storage. Free some space and try again.'
      : error.message, completed, total: OFFLINE_RESOURCES.length });
  } finally {
    downloadListeners.clear();
    pendingDownload = null;
  }
}

self.addEventListener('message', (event) => {
  const reply = event.ports?.[0] || event.source;
  if (!reply || !event.data || typeof event.data.type !== 'string') return;
  if (event.data.type === 'OFFLINE_STATUS') {
    event.waitUntil(offlineStatus().then((status) => reply.postMessage(status)));
  } else if (event.data.type === 'OFFLINE_DOWNLOAD') {
    downloadListeners.add(reply);
    if (!pendingDownload) pendingDownload = downloadOffline();
    event.waitUntil(pendingDownload);
  } else if (event.data.type === 'OFFLINE_CLEAR') {
    event.waitUntil((async () => {
      if (pendingDownload) {
        reply.postMessage({ type: 'OFFLINE_ERROR', message: 'Wait for the current download to finish before removing offline models.' });
        return;
      }
      await caches.delete(ASSET_CACHE);
      reply.postMessage({ ...(await offlineStatus()), type: 'OFFLINE_CLEARED', ready: false });
    })());
  }
});
