const staticCacheName = "pwa-g3";
const filesToCache = [
  "/",
  "./index.html",
  "./app.js",
  "./js/firebase.js",
  "./js/dom.js",
  './js/utils.js',
  "./images/icon.svg"
]

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', async (event) => {
  const keys = await caches.keys();
  keys
    .filter((key) => key !== staticCacheName)
    .map((key) => event.waitUntil(caches.delete(key)));
});

async function networkFirst(request) {
  const cache = await self.caches.open(staticCacheName);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    return cache.match(request);
  }
}

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;
  event.respondWith(networkFirst(event.request));
});
