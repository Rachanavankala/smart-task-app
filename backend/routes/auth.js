const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/userController');
const generateToken = require('../utils/generateToken');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Google OAuth login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: process.env.NODE_ENV === 'production'
      ? 'https://smart-task-app-sigma.vercel.app/login'
      : 'http://localhost:5173/login',
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

    const frontendUrl = process.env.NODE_ENV === 'production'
      ? 'https://smart-task-app-sigma.vercel.app/login/success'
      : 'http://localhost:5173/login/success';

    res.redirect(`${frontendUrl}?user=${encodeURIComponent(userJson)}`);
  }
);

module.exports = router;
