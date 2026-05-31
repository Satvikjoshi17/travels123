/**
 * Booking.com Controller
 * Handles request/response logic for Booking.com endpoints.
 */
const bookingService = require('../services/booking.service');

async function searchDestination(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Missing required param: query' });
  }

  const data = await bookingService.searchDestination(query);
  res.json({ success: true, data });
}

async function searchHotels(req, res) {
  const {
    dest_id, search_type,
    arrival_date, departure_date,
    adults, children_age, room_qty,
    page_number, currency_code,
  } = req.query;

  if (!dest_id || !arrival_date || !departure_date) {
    return res.status(400).json({
      success: false,
      error: 'Missing required params: dest_id, arrival_date, departure_date',
    });
  }

  const data = await bookingService.searchHotels({
    dest_id,
    search_type,
    arrival_date,
    departure_date,
    adults: adults ? parseInt(adults) : 1,
    children_age,
    room_qty: room_qty ? parseInt(room_qty) : 1,
    page_number: page_number ? parseInt(page_number) : 1,
    currency_code,
  });

  res.json({ success: true, data });
}

async function getHotelDetails(req, res) {
  const {
    hotel_id, arrival_date, departure_date,
    adults, room_qty, currency_code,
  } = req.query;

  if (!hotel_id || !arrival_date || !departure_date) {
    return res.status(400).json({
      success: false,
      error: 'Missing required params: hotel_id, arrival_date, departure_date',
    });
  }

  const data = await bookingService.getHotelDetails({
    hotel_id,
    arrival_date,
    departure_date,
    adults: adults ? parseInt(adults) : 1,
    room_qty: room_qty ? parseInt(room_qty) : 1,
    currency_code,
  });

  res.json({ success: true, data });
}

module.exports = { searchDestination, searchHotels, getHotelDetails };
