// backend/server.js
// backend/server.js
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const cors = require('cors');
const session = require('express-session'); // Import session
const passport = require('passport'); // Import passport
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Passport config
require('./config/passport')(passport);

const port = process.env.PORT || 5000;
connectDB();
const app = express();
app.use(cors({
    origin:'https://smart-task-app-sigma.vercel.app',
    credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session Middleware (must be before Passport)
app.use(session({
    secret: 'a secret for the session', // Change in production
    resave: false,
    saveUninitialized: false,
    cookie:{
        secret:true,
        sameSite:'none'
    }
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/tasks', require('./routes/taskRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js')); // <-- ADD THIS LINE
app.use('/api/stats', require('./routes/statsRoutes.js')); 
// in server.js, with your other routes
app.use('/api/ai', require('./routes/aiRoutes.js')); // <-- ADD THIS LINE

// Custom Error Handler...

app.use(errorHandler);
app.listen(port, () => console.log(`Server running on port ${port}`));
// In server.js


// Custom Error Handler...