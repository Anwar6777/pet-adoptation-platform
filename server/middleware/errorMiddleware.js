export const notFound = (request, _response, next) => {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _request, response, _next) => {
  let statusCode = error.statusCode || response.statusCode;
  if (statusCode === 200) statusCode = 500;

  if (error.name === 'CastError') {
    statusCode = 404;
    error.message = 'Requested resource was not found.';
  }

  if (error.code === 11000) {
    statusCode = 400;
    error.message = 'A record with that value already exists.';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    error.message = Object.values(error.errors).map((item) => item.message).join(' ');
  }

  response.status(statusCode).json({
    message: error.message || 'Something went wrong. Please try again.',
  });
};
