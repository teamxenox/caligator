module.exports = async function () {
	// cache currency conversion rates
	if (localStorage.caligator_rates) {
		const hours = 1;
		const intervalInMilliseconds = new Date().getTime() + 1 * hours * 60 * 60 * 1000;

		/**
		 * if rates are more than 24h old make sure to cache new Rates
		 */
		if (intervalInMilliseconds < parseInt(localStorage.caligator_rates_last_cached, 10)) {
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
		try {

			const response = await fetch(
				`https://api.exchangeratesapi.io/latest?base=USD`
			);

			if (response.status !== 200) {
				return;
			}

			const data = await response.json();
			localStorage.setItem('caligator_rates', JSON.stringify(data.rates));
			localStorage.setItem('caligator_rates_last_cached', Date.now());
		} catch (e) {
			console.log('Failed to update rates, using cache or defaults', e);
		}
	}
};
