import * as precaching from 'workbox-precaching';

self.__precacheManifest = (self.__precacheManifest || []).concat([
    "./bundle.css",
    "./bundle.js",
    "./index.html",
    "./assets/close.svg",
    "./assets/menu.svg",
    "./assets/OpenSans.woff",
]);

precaching.precacheAndRoute(self.__precacheManifest || [])

self.addEventListener('install', (e) => {
    e.waitUntil(self.skipWaiting());
})

self.addEventListener('activate', (e) => {
    // This will be called only once when the service worker is activated.
    console.log('service worker activated');

    e.waitUntil(self.clients.claim()
        .then(() => {
            console.log("Clients Claimed");
        }));
});
