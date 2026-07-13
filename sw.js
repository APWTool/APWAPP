const CACHE_NAME = 'autobahn-tool-v47';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const url = event.request.url || '';
                const isJson = url.includes('.json') || url.includes('.geojson');
                if (!response.ok || !isJson) return response;

                const clone = response.clone();
                clone.text().then((text) => {
                    const t = text.trim();
                    if (t.startsWith('version https://git-lfs') || t.startsWith('<!')) return;
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
                }).catch(() => {});

                return response;
            })
            .catch(() => caches.match(event.request))
    );
});
