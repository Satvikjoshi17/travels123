/**
 * Global error-handling middleware.
 * Catches errors thrown from async route handlers.
 */

// Wraps an async route handler so thrown errors are forwarded to Express error middleware
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Global error handler — must be registered AFTER all routes
function globalErrorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  const statusCode = err.statusCode || err.response?.status || 500;
  const message = err.response?.data?.message || err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

module.exports = { asyncHandler, globalErrorHandler };
