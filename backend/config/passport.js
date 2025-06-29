// backend/config/passport.js
// --- SMARTER VERSION ---

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:`${process.env.CLIENT_URL}/api/auth/google/callback`,

      },
      async (accessToken, refreshToken, profile, done) => {
        // Get the user's profile info from Google
        const googleUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };

        try {
          // Find a user in our database based on their Google ID
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            // If the user is found, we're done. Log them in.
            return done(null, user);
          } else {
            // If no user is found with that Google ID, let's check by email
            user = await User.findOne({ email: googleUser.email });

            if (user) {
              // If a user with that email exists, LINK the accounts
              // Add the googleId to their existing profile and save it
              user.googleId = googleUser.googleId;
              await user.save();
              return done(null, user);
            } else {
              // If no user is found at all, create a brand new user
              user = await User.create(googleUser);
              return done(null, user);
            }
          }
        } catch (err) {
          console.error(err);
          return done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};