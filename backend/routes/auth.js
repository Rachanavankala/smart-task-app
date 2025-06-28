// backend/routes/auth.js
// --- FINAL, CORRECTED VERSION ---

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/userController');
const generateToken = require('../utils/generateToken.js');

// This route correctly uses .post() for registration
router.post('/register', registerUser);

// --- THIS IS THE LINE WE ARE FIXING ---
// It must be router.post(), not router.get() or anything else.
router.post('/login', loginUser);

// Google routes correctly use .get()
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login', // We'll update this later if needed
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const userForFrontend = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      token: token,
    };
    const userJson = JSON.stringify(userForFrontend);
    // This needs to be your live Vercel URL
    const frontendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://smart-task-app-sigma.vercel.app/login/success' 
      : 'http://localhost:5173/login/success';
    res.redirect(`${frontendUrl}?user=${encodeURIComponent(userJson)}`);
  }
);

module.exports = router;