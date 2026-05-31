/**
 * Skyscanner (Sky-Scrapper) Service
 * 
 * Handles all HTTP calls to the Sky-Scrapper RapidAPI.
 * Endpoints used:
 *   - searchFlightEverywhere: Explore cheapest flights from an origin to ALL destinations
 *   - searchFlights: Search flights on a specific route
 *   - searchAirport: Autocomplete airport/city search
 */
const axios = require('axios');
const config = require('../config/env');

const BASE_URL = `https://${config.skyScrapper.host}`;

const headers = {
  'X-RapidAPI-Key': config.rapidApi.key,
  'X-RapidAPI-Host': config.skyScrapper.host,
};

/**
 * Search flights from one origin to EVERYWHERE — great for "Explore" features
 */
async function searchFlightEverywhere({ originSkyId = 'NYCA', originEntityId = '27537542', oneWay = 'false', currency = 'USD' } = {}) {
  const response = await axios.get(`${BASE_URL}/api/v2/flights/searchFlightEverywhere`, {
    params: { originSkyId, originEntityId, oneWay, currency },
    headers,
  });
  return response.data;
}

/**
 * Search flights on a specific route
 */
async function searchFlights({ originSkyId, destinationSkyId, originEntityId, destinationEntityId, date, returnDate, cabinClass = 'economy', adults = 1, children = 0, infants = 0, currency = 'USD' }) {
  const params = {
    originSkyId,
    destinationSkyId,
    originEntityId,
    destinationEntityId,
    date,
    cabinClass,
    adults,
    currency,
  };
  if (returnDate) params.returnDate = returnDate;
  if (children > 0) params.children = children;
  if (infants > 0) params.infants = infants;

  const response = await axios.get(`${BASE_URL}/api/v1/flights/searchFlights`, {
    params,
    headers,
  });
  return response.data;
}

/**
 * Search/autocomplete airports and cities
 */
async function searchAirport(query) {
  const response = await axios.get(`${BASE_URL}/api/v1/flights/searchAirport`, {
    params: { query, locale: 'en-US' },
    headers,
  });
  return response.data;
}

module.exports = { searchFlightEverywhere, searchFlights, searchAirport };
