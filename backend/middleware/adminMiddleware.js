// backend/middleware/adminMiddleware.js
const asyncHandler = require('express-async-handler');

const admin = asyncHandler(async (req, res, next) => {
  // We assume the 'protect' middleware has already run and attached the user
  if (req.user && req.user.isAdmin) {
    next(); // If user exists and is an admin, proceed
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
});

module.exports = { admin };