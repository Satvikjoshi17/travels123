/**
 * Booking.com Routes
 * 
 * GET /api/booking/destinations   — Search destinations (cities, landmarks, hotels)
 * GET /api/booking/locations      — Alias for destinations (backward compatibility)
 * GET /api/booking/hotels         — Search hotels with prices
 * GET /api/booking/hotel-details  — Get detailed info for a specific hotel
 */
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const controller = require('../controllers/booking.controller');

router.get('/destinations', asyncHandler(controller.searchDestination));
router.get('/locations', asyncHandler(controller.searchDestination)); // alias
router.get('/hotels', asyncHandler(controller.searchHotels));
router.get('/hotel-details', asyncHandler(controller.getHotelDetails));

module.exports = router;
