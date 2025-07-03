// backend/routes/statsRoutes.js
// --- FINAL, CORRECTED VERSION ---

const express = require('express');
const router = express.Router();

// --- THIS IS THE CORRECTED IMPORT ---
const {
  getTaskStatsByDay,
  getPopularCategories,
  getCreatedVsCompletedStats, // Add the missing function here
} = require('../controllers/statsController');

const { protect } = require('../middleware/authMiddleware');

// Route for the first chart
router.route('/tasks-by-day').get(protect, getTaskStatsByDay);

// Route for the popular categories list
router.route('/popular-categories').get(protect, getPopularCategories);

// Route for the new comparison chart
router.route('/created-vs-completed').get(protect, getCreatedVsCompletedStats);

module.exports = router;