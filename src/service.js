import * as precaching from 'workbox-precaching';

const revision = window.webpackRevision;

self.__precacheManifest = (self.__precacheManifest || []).concat([
    { url: "./bundle.css", revision },
    { url: "./bundle.js", revision },
    { url: "./index.html", revision },
    { url: "./assets/close.svg", revision },
    { url: "./assets/menu.svg", revision },
    { url: "./assets/OpenSans.woff", revision },
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
