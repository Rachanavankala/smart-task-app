// backend/server.js
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Passport config
require('./config/passport')(passport);

const port = process.env.PORT || 5000;
connectDB();

const app = express();

// ✅ CORS Allowed Origins
const allowedOrigins = [
  'https://smart-task-app-sigma.vercel.app',
  'https://smart-task-kskgde1l-vankala-rachanas-projects.vercel.app',
];

// ✅ CORS Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ Session Middleware
app.use(session({
  secret: 'a secret for the session', // Change this in production!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secret: true,
    sameSite: 'none',
    secure: true // required for cross-site cookies on HTTPS
  }
}));

// ✅ Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// ✅ Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/tasks', require('./routes/taskRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/stats', require('./routes/statsRoutes.js'));
app.use('/api/ai', require('./routes/aiRoutes.js'));

// ✅ Error Handler
app.use(errorHandler);

// ✅ Start Server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
