export function errorHandler(err, req, res, next) {
  console.error('[ServerError]', {
    method: req.method,
    url: req.url,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred. Please try again.',
  });
}
