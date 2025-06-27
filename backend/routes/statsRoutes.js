// backend/routes/statsRoutes.js
// --- FINAL, CORRECTED VERSION ---

const express = require('express');
const router = express.Router();

// --- THIS IS THE CORRECTED IMPORT ---
const {
  getTaskStatsByDay,
  getPopularCategories, // Add the missing function here
} = require('../controllers/statsController');

const { protect } = require('../middleware/authMiddleware');

// Route for the chart data
router.route('/tasks-by-day').get(protect, getTaskStatsByDay);

// Route for the popular categories list
router.route('/popular-categories').get(protect, getPopularCategories);

module.exports = router;