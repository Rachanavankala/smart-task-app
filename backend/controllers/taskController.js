// backend/controllers/taskController.js
// --- FINAL, COMPLETE AND CORRECTED VERSION ---

const asyncHandler = require('express-async-handler');
const { Parser } = require('json2csv');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const Task = require('../models/taskModel.js');
const { logAction } = require('../services/auditLogService');

// @desc    Get all tasks for a user
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

// @desc    Get tasks due today
const getTasksDueToday = asyncHandler(async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    user: req.user.id,
    dueDate: { $gte: startOfDay, $lte: endOfDay },
    isCompleted: false,
  });
  res.status(200).json(tasks);
});

// @desc    Get upcoming tasks
const getUpcomingTasks = asyncHandler(async (req, res) => {
  // CORRECTED: Upcoming tasks are due any time after the very end of today
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    user: req.user.id,
    dueDate: { $gt: endOfToday }, // Use "greater than" the end of today
    isCompleted: false,
  }).sort({ dueDate: 1 });
  res.status(200).json(tasks);
});

// @desc    Download all tasks (CSV, Excel, or PDF)
const downloadTasks = asyncHandler(async (req, res) => {
  const { format } = req.query;
  const tasks = await Task.find({ user: req.user.id }).lean();
  if (!tasks || tasks.length === 0) {
    return res.status(404).send('No tasks found to download.');
  }
  const sanitizedTasks = tasks.map(task => ({
    text: task.text, description: task.description || 'N/A',
    category: task.category || 'N/A', dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
    isCompleted: task.isCompleted ? 'Yes' : 'No', createdAt: new Date(task.createdAt).toLocaleString(),
  }));

  if (format === 'excel') {
    try {
      const worksheet = xlsx.utils.json_to_sheet(sanitizedTasks);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Tasks');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');
      const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      return res.status(200).send(buffer);
    } catch (err) { console.error(err); return res.status(500).send('Server Error: Could not generate Excel file.'); }
  } else if (format === 'pdf') {
    try {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=tasks.pdf');
      doc.pipe(res);
      doc.fontSize(20).text('My Tasks Report', { align: 'center' }).moveDown();
      const tableTop = doc.y, itemX = 30, descriptionX = 150, categoryX = 300, dueX = 400, completedX = 480;
      doc.fontSize(10).font('Helvetica-Bold').text('Task', itemX, tableTop).text('Description', descriptionX, tableTop).text('Category', categoryX, tableTop).text('Due Date', dueX, tableTop).text('Completed', completedX, tableTop).font('Helvetica');
      doc.moveTo(itemX, doc.y + 5).lineTo(570, doc.y + 5).stroke().moveDown();
      sanitizedTasks.forEach(task => {
        const y = doc.y;
        doc.fontSize(10).text(task.text, itemX, y, { width: 110 }).text(task.description, descriptionX, y, { width: 140 }).text(task.category, categoryX, y, { width: 90 }).text(task.dueDate, dueX, y, { width: 70 }).text(task.isCompleted, completedX, y, { width: 50 });
        doc.moveDown(2.5);
      });
      doc.end();
    } catch(err) { console.error(err); res.status(500).send('Server Error: Could not generate PDF file.'); }
  } else {
    const fields = ['text', 'description', 'category', 'dueDate', 'isCompleted', 'createdAt'];
    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(sanitizedTasks);
      res.header('Content-Type', 'text/csv');
      res.attachment('tasks.csv');
      res.status(200).send(csv);
    } catch (err) { console.error(err); res.status(500).send('Server Error: Could not generate CSV.'); }
  }
});

// @desc    Create a new task
const createTask = asyncHandler(async (req, res) => {
  if (!req.body.text) { res.status(400); throw new Error('Please add a text field'); }
  const task = await Task.create({
    text: req.body.text, description: req.body.description,
    category: req.body.category, dueDate: req.body.dueDate,
    user: req.user.id,
  });
  if (task) { logAction(req.user.id, 'CREATE_TASK', { taskId: task._id }); }
  res.status(201).json(task);
});

// @desc    Update a task
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error('Task not found'); }
  if (task.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (updatedTask) { logAction(req.user.id, 'UPDATE_TASK', { taskId: updatedTask._id }); }
  res.status(200).json(updatedTask);
});

// @desc    Delete a task
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) { res.status(404); throw new Error('Task not found'); }
  if (task.user.toString() !== req.user.id) { res.status(401); throw new Error('User not authorized'); }
  const taskId = task._id;
  await task.deleteOne();
  logAction(req.user.id, 'DELETE_TASK', { taskId: taskId });
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTasksDueToday,
  getUpcomingTasks,
  downloadTasks,
};