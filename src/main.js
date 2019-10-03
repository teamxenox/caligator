import App from './App.html';
import { checkForSwSupport, registerServiceWorker } from './tools';
import * as cacheRates from '../utils/cacheRates';
import { AppStore } from './App.store';

const app = new App({
	target: document.body,
});

if (!window.dev) {
	(async () => {
		checkForSwSupport();
		await registerServiceWorker();
	})()
} else {
	console.log('Detected Dev Mode');
}

cacheRates();

window.addEventListener('beforeinstallprompt ', e => {
	AppStore.set({ installPrompt: e });
});

window.addEventListener('appinstalled', e => {
	console.log('window.appinstalled', e);
});

export default app;