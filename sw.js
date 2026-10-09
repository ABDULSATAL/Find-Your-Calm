const CACHE_NAME = "find-your-calm-v1";

const APP_FILES = [
"./",
"./index.html",
"./manifest.json",
"./icon.svg"
];

self.addEventListener("install", (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => {
return cache.addAll(APP_FILES);
})
);

self.skipWaiting();
});

self.addEventListener("activate", (event) => {
event.waitUntil(
caches.keys().then((cacheNames) => {
return Promise.all(
cacheNames
.filter((name) => name.startsWith("find-your-calm-") && name !== CACHE_NAME)
.map((name) => caches.delete(name))
);
})
);

self.clients.claim();
});

self.addEventListener("fetch", (event) => {
if (event.request.method !== "GET") return;

const requestURL = new URL(event.request.url);

if (requestURL.origin !== self.location.origin) return;

event.respondWith(
caches.match(event.request).then((cachedResponse) => {
if (cachedResponse) return cachedResponse;

  return fetch(event.request).catch(() => {
    if (event.request.mode === "navigate") {
      return caches.match("./index.html");
    }

    return Response.error();
  });
})

);
});