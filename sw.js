const CACHE_NAME = 'autobahn-tool-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting(); // Erzwingt sofortiges Update beim Client
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Wenn online: Speichere eine Kopie im Cache und gib sie zurück
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Wenn offline: Lade aus dem Cache
                return caches.match(event.request);
            })
    );
});