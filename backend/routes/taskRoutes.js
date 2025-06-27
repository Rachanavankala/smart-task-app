// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksDueToday,
  getUpcomingTasks,
  downloadTasks, // <-- Import the new function
} = require('../controllers/taskController.js');
const { protect } = require('../middleware/authMiddleware.js');

// Specific routes must come before general/ID-based routes
router.route('/today').get(protect, getTasksDueToday);
router.route('/upcoming').get(protect, getUpcomingTasks);
router.route('/download').get(protect, downloadTasks); // <-- Add the new route

// General routes
router.route('/').get(protect, getTasks).post(protect, createTask);
router.route('/:id').put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;