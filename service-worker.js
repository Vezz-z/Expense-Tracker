const OFFLINE_CACHE = 'app-v1.0.0'
const ASSETS = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/script.js',
    '/manifest.json'
]

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(OFFLINE_CACHE).then(cache => cache.addAll(ASSETS))
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('index.html')
                }
            })
        })
    )
})

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== OFFLINE_CACHE).map(k => caches.delete(k))
        ))
    )
})