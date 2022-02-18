module.exports = async function(config) {
	// cache currency conversion rates
	if (config.has('rates')) {
        const hours = 1;
		const intervalInMilliseconds = new Date().getTime() + 1 * hours * 60 * 60 * 1000;

		/**
		 * if rates are more than 24h old make sure to cache new Rates
		 */
		if (intervalInMilliseconds < config.get('last_cached')) {
			await cacheRates();
		}
	} else {
		/**
		 * cache Rates if rates doesnt exist already
		 * on app first run
		 */
		await cacheRates();
	}

	/**
	 * function to get latest rates from openexchangerates and cache them
	 * to electron store
	 */
	async function cacheRates() {
		const axios = require('axios');

		const response = await axios(
			`https://api.exchangeratesapi.io/latest?base=INR`
		);

		if (response.status === 200) {
			config.set({
				rates: response.data.rates,
				last_cached: new Date()
			});
		}

		return;
	}
};
