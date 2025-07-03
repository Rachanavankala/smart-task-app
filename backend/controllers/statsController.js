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
const getCreatedVsCompletedStats = asyncHandler(async (req, res) => {
  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(today.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const stats = await Task.aggregate([
    // 1. Get all tasks created or updated in the last 7 days for the user
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user.id),
        $or: [
          { createdAt: { $gte: last7Days } },
          { updatedAt: { $gte: last7Days }, isCompleted: true },
        ],
      },
    },
    // 2. Project fields to normalize created and completed dates
    {
      $project: {
        createdDate: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        completedDate: {
          $cond: [
            { $and: [{ $eq: ['$isCompleted', true] }, { $gte: ['$updatedAt', last7Days] }] },
            { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            null,
          ],
        },
      },
    },
    // 3. Unwind the data to process created and completed events separately
    {
      $facet: {
        created: [
          { $group: { _id: '$createdDate', count: { $sum: 1 } } },
        ],
        completed: [
          { $match: { completedDate: { $ne: null } } },
          { $group: { _id: '$completedDate', count: { $sum: 1 } } },
        ],
      },
    },
  ]);

  // 4. Format the data for the frontend chart
  const formattedStats = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const label = `${date.getMonth() + 1}/${date.getDate()}`;
    formattedStats[label] = { created: 0, completed: 0 };
  }

  stats[0].created.forEach(item => {
    const label = `${new Date(item._id).getUTCMonth() + 1}/${new Date(item._id).getUTCDate()}`;
    if (formattedStats[label]) {
      formattedStats[label].created = item.count;
    }
  });
  stats[0].completed.forEach(item => {
    const label = `${new Date(item._id).getUTCMonth() + 1}/${new Date(item._id).getUTCDate()}`;
    if (formattedStats[label]) {
      formattedStats[label].completed = item.count;
    }
  });
  
  const labels = Object.keys(formattedStats);
  const createdData = labels.map(label => formattedStats[label].created);
  const completedData = labels.map(label => formattedStats[label].completed);

  res.status(200).json({ labels, createdData, completedData });
});




module.exports = {
  getTaskStatsByDay,
  getPopularCategories,
};