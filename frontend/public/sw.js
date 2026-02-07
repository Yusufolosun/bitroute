// Service Worker for offline support and caching

const CACHE_NAME = 'bitroute-v1';
const urlsToCache = [
    '/',
    '/legal/terms',
    '/legal/privacy',
    '/legal/risks',
];

// Install service worker
self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Fetch with network-first strategy
self.addEventListener('fetch', (event: any) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone response and cache it
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, responseClone));
                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(event.request);
            })
    );
});

// Clean up old caches
self.addEventListener('activate', (event: any) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
});
