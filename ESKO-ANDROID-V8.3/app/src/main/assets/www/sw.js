/* ESKO OPEN HUB V8.3 service worker — static cache and opt-in push notifications. */
'use strict';
const CACHE_NAME = 'esko-open-hub-v8.3-shell';
const BASE = self.registration.scope;
const SHELL = [
  './', './index.html', './style.css', './app.js', './store.js', './image-processor.js',
  './support-router.js', './manifest.webmanifest', './network-probe.bin',
  './v5/esko-v5.css', './v5/esko-v5.js', './v5/performance-core.js',
  './v5/performance-90.js', './v5/security-center.js', './v5/education.js',
  './v5/education-catalog.json', './v5/developer-studio.js', './v5/galaxy-infinity.js', './v5/bots.json', './v5/tools.json', './v5/games.json', './v5/bot-templates.json',
  './v5/ai-auto-replies.json', './v5/geometric-themes.json', './v5/store-bot-catalog.json',
  './v5/store-games.json', './v5/store-addons.json',
  './v5/omniverse-evolution.js', './v5/omniverse-advanced-50.js', './v5/titan-universe-v80.js', './v5/leveling-feature-lab-v81.js', './v5/titan-main-processor-v82.js', './v5/titan-all-in-one-v83.js',
  './assets/esko-eagle-v5.webp', './assets/esko-joker-wallpaper.webp', './assets/esko-joker-eyes.webp',
  './assets/icon-192.png', './assets/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL.map(path => new Request(new URL(path, BASE), {cache:'reload'})));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('esko-open-hub-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || /\/api(?:\/|$)/.test(url.pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) (await caches.open(CACHE_NAME)).put(new URL('./index.html', BASE), response.clone());
        return response;
      } catch (_) {
        return (await caches.match(new URL('./index.html', BASE))) || Response.error();
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, {ignoreSearch: url.pathname.endsWith('/network-probe.bin')});
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
      return response;
    } catch (_) { return Response.error(); }
  })());
});
self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (_) { data = {body: event.data?.text?.() || ''}; }
  const title = String(data.title || 'ESKO OPEN HUB').slice(0, 80);
  const body = String(data.body || 'لديك إشعار جديد.').slice(0, 240);
  event.waitUntil(self.registration.showNotification(title, {
    body,
    icon: new URL('assets/esko-eagle-v5.webp', BASE).href,
    badge: new URL('assets/esko-eagle-v5.webp', BASE).href,
    tag: String(data.tag || 'esko-update').slice(0, 80),
    data: {url: new URL(data.url || './', BASE).href}
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification.data?.url || './', BASE);
  event.waitUntil((async () => {
    const clientsList = await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const existing = clientsList.find(client => new URL(client.url).origin === target.origin && new URL(client.url).pathname.startsWith(new URL(BASE).pathname));
    if (existing) { await existing.focus(); if (existing.navigate) await existing.navigate(target.href); }
    else await self.clients.openWindow(target.href);
  })());
});
