// backend/routes/auth.js
// --- FINAL, UNIFIED AUTH VERSION ---

const express = require('express');
const router = express.Router();
const passport = require('passport'); // For Google authentication
const { registerUser, loginUser } = require('../controllers/userController');
const generateToken = require('../utils/generateToken.js'); // Import our token utility

// Regular email/password routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- GOOGLE OAUTH ROUTES ---

// @desc    Initiate authentication with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// @desc    Google authentication callback URL
// @route   GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login', // Redirect to frontend on fail
    session: false,
  }),
  (req, res) => {
    // On success, Passport attaches the user to `req.user`
    const token = generateToken(req.user._id);
    const userForFrontend = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      token: token,
    };
    const userJson = JSON.stringify(userForFrontend);
    // Redirect back to the special frontend URL to process the login
    res.redirect(`http://localhost:5173/login/success?user=${encodeURIComponent(userJson)}`);
  }
);

module.exports = router;