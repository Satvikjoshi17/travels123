/**
 * Skyscanner Controller
 * Handles request/response logic for Skyscanner endpoints.
 */
const skyscannerService = require('../services/skyscanner.service');

async function searchFlightsEverywhere(req, res) {
  const { originSkyId, originEntityId, oneWay, currency } = req.query;

  const data = await skyscannerService.searchFlightEverywhere({
    originSkyId,
    originEntityId,
    oneWay,
    currency,
  });

  res.json({ success: true, data });
}

async function searchFlights(req, res) {
  const {
    originSkyId, destinationSkyId,
    originEntityId, destinationEntityId,
    date, returnDate,
    cabinClass, adults, children, infants, currency,
  } = req.query;

  if (!originSkyId || !destinationSkyId || !originEntityId || !destinationEntityId || !date) {
    return res.status(400).json({
      success: false,
      error: 'Missing required params: originSkyId, destinationSkyId, originEntityId, destinationEntityId, date',
    });
  }

  const data = await skyscannerService.searchFlights({
    originSkyId,
    destinationSkyId,
    originEntityId,
    destinationEntityId,
    date,
    returnDate,
    cabinClass,
    adults: adults ? parseInt(adults) : 1,
    children: children ? parseInt(children) : 0,
    infants: infants ? parseInt(infants) : 0,
    currency,
  });

  res.json({ success: true, data });
}

async function searchAirport(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Missing required param: query' });
  }

  const data = await skyscannerService.searchAirport(query);
  res.json({ success: true, data });
}

module.exports = { searchFlightsEverywhere, searchFlights, searchAirport };
