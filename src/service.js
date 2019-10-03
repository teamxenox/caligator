import * as precaching from 'workbox-precaching';

const revision = window.webpackRevision;

self.__precacheManifest = (self.__precacheManifest || []).concat([
    { url: "./bundle.css", revision },
    { url: "./bundle.js", revision },
    { url: "./index.html", revision },
    { url: "./index.html", revision },
    { url: "./assets/OpenSans.woff", revision },
    { url: './assets/icons/icon-72x72.png', revision },
    { url: './assets/icons/icon-96x96.png', revision },
    { url: './assets/icons/icon-128x128.png', revision },
    { url: './assets/icons/icon-144x144.png', revision },
    { url: './assets/icons/icon-152x152.png', revision },
    { url: './assets/icons/icon-192x192.png', revision },
    { url: './assets/icons/icon-384x384.png', revision },
    { url: './assets/icons/icon-512x512.png', revision },
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
