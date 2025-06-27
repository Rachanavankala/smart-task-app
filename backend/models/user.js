// backend/models/user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    // --- NEW FIELDS ---
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // By default, new users are NOT admins
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true, // By default, new accounts are active
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);