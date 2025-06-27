const errorHandler = (err, req, res, next) => {
  // If the response status code is 200 (OK), change it to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // This part ensures the error is ALWAYS logged to your backend console
  console.error('--- ERROR ---'.red);
  console.error(err.stack.red);
  console.error('-------------'.red);

  res.json({
    message: err.message,
    // Only show the detailed stack trace if we are not in 'production' mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};