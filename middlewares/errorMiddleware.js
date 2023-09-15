function errorHandler(err, req, res, next) {
  console.log(err.stack);

  if (res.headerSent) {
    return next(err);
  }

  console.log('ERROR MIDDLEWARE CALLED');

  res.status(500).json({
    message: 'Internal server error',
    error: err.message,
  });
}

module.exports = errorHandler;
