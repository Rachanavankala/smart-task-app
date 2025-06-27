// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getUsers, deactivateUser, getUserTasks, generateCriticalTasksReport } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id/deactivate').put(protect, admin, deactivateUser);
router.route('/users/:id/tasks').get(protect, admin, getUserTasks);
router.route('/tasks/report').get(protect, admin, generateCriticalTasksReport);

module.exports = router;