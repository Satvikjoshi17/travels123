/**
 * Booking.com Service (via booking-com15 RapidAPI)
 * 
 * Handles all HTTP calls to the Booking.com RapidAPI.
 * Endpoints used:
 *   - searchDestination: Search for destinations/cities/hotels by name
 *   - searchHotels: Search available hotels with prices
 *   - getHotelDetails: Get detailed info about a specific hotel
 */
const axios = require('axios');
const config = require('../config/env');

const BASE_URL = `https://${config.booking.host}`;

const headers = {
  'X-RapidAPI-Key': config.rapidApi.key,
  'X-RapidAPI-Host': config.booking.host,
};

/**
 * Search destinations — returns cities, hotels, landmarks matching a query
 */
async function searchDestination(query) {
  const response = await axios.get(`${BASE_URL}/api/v1/hotels/searchDestination`, {
    params: { query },
    headers,
  });
  return response.data;
}

/**
 * Search hotels with prices at a destination
 */
async function searchHotels({ dest_id, search_type = 'CITY', arrival_date, departure_date, adults = 1, children_age, room_qty = 1, page_number = 1, units = 'metric', temperature_unit = 'c', languagecode = 'en-us', currency_code = 'USD' }) {
  const params = {
    dest_id,
    search_type,
    arrival_date,
    departure_date,
    adults,
    room_qty,
    page_number,
    units,
    temperature_unit,
    languagecode,
    currency_code,
  };
  if (children_age) params.children_age = children_age;

  const response = await axios.get(`${BASE_URL}/api/v1/hotels/searchHotels`, {
    params,
    headers,
  });
  return response.data;
}

/**
 * Get detailed information about a specific hotel
 */
async function getHotelDetails({ hotel_id, arrival_date, departure_date, adults = 1, room_qty = 1, units = 'metric', temperature_unit = 'c', languagecode = 'en-us', currency_code = 'USD' }) {
  const response = await axios.get(`${BASE_URL}/api/v1/hotels/getHotelDetails`, {
    params: {
      hotel_id,
      arrival_date,
      departure_date,
      adults,
      room_qty,
      units,
      temperature_unit,
      languagecode,
      currency_code,
    },
    headers,
  });
  return response.data;
}

module.exports = { searchDestination, searchHotels, getHotelDetails };
