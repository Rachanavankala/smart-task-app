// backend/controllers/statsController.js
// --- FINAL, COMPLETE VERSION ---

const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel.js');
const mongoose = require('mongoose');

// @desc    Get task completion stats for the last 7 days
// @route   GET /api/stats/tasks-by-day
// @access  Private
const getTaskStatsByDay = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const stats = await Task.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        isCompleted: true,
        updatedAt: { $gte: last7Days, $lte: today },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' },
          day: { $dayOfMonth: '$updatedAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
  ]);

  const formattedStats = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(new Date().getDate() - i);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const stat = stats.find(
      (s) => s._id.day === day && s._id.month === month && s._id.year === year
    );

    formattedStats.push({
      date: `${month}/${day}`,
      count: stat ? stat.count : 0,
    });
  }

  res.status(200).json(formattedStats.reverse());
});


// @desc    Get the most popular task categories for a user
// @route   GET /api/stats/popular-categories
// @access  Private
const getPopularCategories = asyncHandler(async (req, res) => {
  const stats = await Task.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        category: { $ne: null, $ne: '' }, // Category must exist
      },
    },
    {
      $group: {
        _id: '$category', // Group by the category value
        count: { $sum: 1 }, // Count tasks in each group
      },
    },
    {
      $sort: { count: -1 }, // Sort by most popular
    },
    {
      $limit: 5, // Limit to the top 5
    },
    {
      $project: {
        _id: 0,
        category: '$_id',
        count: 1,
      },
    },
  ]);

  res.status(200).json(stats);
});


module.exports = {
  getTaskStatsByDay,
  getPopularCategories,
};