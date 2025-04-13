self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('study-connect-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './main.js',
        './logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});