/**
 * Skyscanner Routes
 * 
 * GET /api/skyscanner/flights-everywhere   — Explore cheap flights from origin to all destinations
 * GET /api/skyscanner/searchFlightEverywhere — Alias for above (backward compatibility)
 * GET /api/skyscanner/flights               — Search flights on a specific route
 * GET /api/skyscanner/airports              — Autocomplete airport/city search
 */
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const controller = require('../controllers/skyscanner.controller');

router.get('/flights-everywhere', asyncHandler(controller.searchFlightsEverywhere));
router.get('/searchFlightEverywhere', asyncHandler(controller.searchFlightsEverywhere)); // alias
router.get('/flights', asyncHandler(controller.searchFlights));
router.get('/airports', asyncHandler(controller.searchAirport));

module.exports = router;
