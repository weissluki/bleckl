const CACHE_NAME = 'vinschgerbleckl-v3'; // Version angehoben wegen neuer Struktur
const ASSETS = [
  '/',                     // Das Hauptverzeichnis selbst
  'index.html',            // Das Hauptmenü
  'manifest.json',         // Die App-Konfiguration
  'icon-192.png',          // App-Icons
  'icon-512.png',
  'schlangateassen/index.html',
  'sackn/index.html'
];

// Dateien beim ersten Laden in den Cache sperren
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // cache.addAll bricht ab, wenn eine Datei fehlt. 
      // Falls sackn/index.html noch nicht existiert, würde es crashen.
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Cache aktivieren und alte Versionen löschen
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Netzwerk-Anfragen abfangen und aus dem Cache bedienen (Offline-Modus)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Wenn es im Cache ist, nimm es, ansonsten lade es aus dem Netzwerk
      return cachedResponse || fetch(event.request);
    })
  );
});
