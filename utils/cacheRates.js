module.exports = async function(config) {

        // cache currency conversion rates
        if(config.has('rates')) {
          const h24ms = new Date().getTime() + (1 * 24 * 60 * 60 * 1000);

          /**
           * if rates are more than 24h old make sure to cache new Rates
           */
          if (h24ms < config.get('last_cached')) {
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

          const appId = 'ee2f6479bd2d4938b47ccda233d14c55';

          const response = await axios(`https://openexchangerates.org/api/latest.json?app_id=${appId}`);

          if(response.status === 200) {

              config.set({
                  rates: response.data.rates,
                  last_cached: new Date()
              });

          };

          return;
      };
}
