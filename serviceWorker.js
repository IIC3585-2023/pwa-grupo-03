const staticCacheName = "pwa-g3";
const filesToCache = [
  "/",
  "./index.html",
  "./app.js",
  "./js/firebase.js",
  "./js/index.js",
  "./images/icon.svg"
]

self.addEventListener("install", function (e) {
  console.log("installing!");
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', async (event) => {
  console.log('activating!');
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
    console.log('Network: ', request.url);
    return response;
  } catch {
    console.log('Cache: ', request.url);
    return cache.match(request);
  }
}

self.addEventListener("fetch", function (event) {
  console.log('Fetch intercepted for:', event.request.url);
  if (event.request.method !== "GET") return;
  event.respondWith(networkFirst(event.request));
  // event.respondWith(
  //   caches.match(event.request).then((cachedResponse) => {
  //     if (cachedResponse) {
  //       return cachedResponse;
  //     }
  //     return fetch(event.request);
  //   }),
  // );
});
