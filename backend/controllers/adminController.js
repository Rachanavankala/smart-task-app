// backend/controllers/adminController.js
// --- FINAL, CORRECTED VERSION ---

const asyncHandler = require('express-async-handler');
const User = require('../models/user.js');
const Task = require('../models/taskModel.js');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Deactivate a user account
// @route   PUT /api/admin/users/:id/deactivate
// @access  Private/Admin
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isActive = false;
    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isActive: updatedUser.isActive,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all tasks for a specific user by ID
// @route   GET /api/admin/users/:id/tasks
// @access  Private/Admin
const getUserTasks = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const tasks = await Task.find({ user: req.params.id });
  res.status(200).json(tasks);
});

// @desc    Generate a summary report of overdue tasks
// @route   GET /api/admin/tasks/report
// @access  Private/Admin
const generateCriticalTasksReport = asyncHandler(async (req, res) => {
  const overdueTasks = await Task.find({
    isCompleted: false,
    dueDate: { $lt: new Date() },
  }).populate('user', 'name email');

  if (overdueTasks.length === 0) {
    return res.status(200).json({ report: 'No overdue tasks found. Great job, everyone!' });
  }

  // Safely map tasks, handling cases where a user might have been deleted
  const taskSummary = overdueTasks
    .map(task => {
      const assignedTo = task.user ? task.user.name : 'Unassigned/Deleted User';
      const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
      return `- Task: "${task.text}", Assigned to: ${assignedTo}, Due: ${dueDate}`;
    })
    .join('\n');

  const prompt = `You are an executive assistant reporting to a manager. Analyze the following list of overdue tasks and write a brief, professional summary. Highlight any users with multiple overdue tasks and identify the most critical task based on its title. Be encouraging but firm about getting these tasks done.\n\nOverdue Task List:\n${taskSummary}\n\nExecutive Report:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });
    const report = response.choices[0].message.content.trim();
    res.status(200).json({ report });
  } catch (error) {
    console.error('AI Report Generation Error:', error);
    res.status(500);
    throw new Error('Failed to generate AI report.');
  }
});

module.exports = {
  getUsers,
  deactivateUser,
  getUserTasks,
  generateCriticalTasksReport,
};