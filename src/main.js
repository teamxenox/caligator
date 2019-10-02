import App from './App.html';
import { checkForSwSupport, registerServiceWorker } from './tools';
import * as cacheRates from '../utils/cacheRates';

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

export default app;