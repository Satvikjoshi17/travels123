/**
 * GlobeTrek Travel API Backend
 * 
 * Entry point — Express app setup, route mounting, and server start.
 * 
 * API Overview:
 *   /api/skyscanner/*  — Skyscanner flight search (Sky-Scrapper RapidAPI)
 *   /api/booking/*     — Booking.com hotel search (booking-com15 RapidAPI)
 */
const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const { globalErrorHandler } = require('./middleware/errorHandler');

// Route imports
const skyscannerRoutes = require('./routes/skyscanner.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Request logger (development)
app.use((req, _res, next) => {
  if (req.path !== '/') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/skyscanner', skyscannerRoutes);
app.use('/api/booking', bookingRoutes);

// Health check
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'GlobeTrek Travel API',
    timestamp: new Date().toISOString(),
    endpoints: {
      skyscanner: [
        'GET /api/skyscanner/flights-everywhere',
        'GET /api/skyscanner/searchFlightEverywhere',
        'GET /api/skyscanner/flights',
        'GET /api/skyscanner/airports',
      ],
      booking: [
        'GET /api/booking/destinations',
        'GET /api/booking/locations',
        'GET /api/booking/hotels',
        'GET /api/booking/hotel-details',
      ],
    },
  });
});

// ─── Error Handler (must be last) ────────────────────────────
app.use(globalErrorHandler);

// ─── Start Server ────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 GlobeTrek API running on http://localhost:${config.port}`);
  console.log(`📡 Endpoints:`);
  console.log(`   Skyscanner: /api/skyscanner/flights-everywhere`);
  console.log(`   Booking:    /api/booking/destinations`);
  console.log(`   Health:     /\n`);
});
