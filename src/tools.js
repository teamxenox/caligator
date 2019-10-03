export function checkForSwSupport() {
    if (!('serviceWorker' in navigator)) {
        throw new Error('No Service Worker support!')
    }
}

export async function registerServiceWorker() {
    return await navigator.serviceWorker.register('./bundle.service.js');
}
