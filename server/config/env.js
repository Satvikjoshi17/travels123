/**
 * Centralized environment variable access.
 * All env vars are validated here so controllers don't need to worry about missing values.
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const config = {
  port: process.env.PORT || 5000,

  rapidApi: {
    key: process.env.RAPIDAPI_KEY,
  },

  booking: {
    host: process.env.BOOKING_HOST || 'booking-com15.p.rapidapi.com',
  },

  skyScrapper: {
    host: process.env.SKY_SCRAPPER_HOST || 'sky-scrapper.p.rapidapi.com',
  },
};

// Validate critical env vars at startup
if (!config.rapidApi.key) {
  console.error('❌ RAPIDAPI_KEY is missing in .env — API calls will fail.');
}

module.exports = config;
