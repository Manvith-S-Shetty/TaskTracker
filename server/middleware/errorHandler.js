/**
 * Express error-handling middleware.
 * Express identifies this as an error handler because it has exactly four arguments: (err, req, res, next).
 */
const errorHandler = (err, req, res, next) => {
  // Create a shallow copy of the error object and preserve the message
  let error = { ...err };
  error.message = err.message;

  // Log the stack trace in development console for debugging
  console.error(err.stack);

  // 1. Mongoose Bad ObjectID (CastError)
  // Occurs when MongoDB expects a 24-character hex ID, but gets a malformed string.
  if (err.name === 'CastError') {
    error.message = `Resource not found with id of ${err.value}`;
    error.statusCode = 404;
  }

  // 2. Mongoose Duplicate Key Error (e.g., trying to save a unique field with a value that already exists)
  // MongoDB error code 11000 represents a duplicate key violation.
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.statusCode = 400;
  }

  // 3. Mongoose Validation Error
  // Occurs when required fields are missing or schema validation rules fail.
  if (err.name === 'ValidationError') {
    // Map through the validation errors and extract the custom validation messages
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error.message = message;
    error.statusCode = 400;
  }

  // Fallback to internal server error if no status code is assigned
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;
