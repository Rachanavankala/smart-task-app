// backend/controllers/aiController.js
// --- MORE ROBUST VERSION ---

const asyncHandler = require('express-async-handler');
const OpenAI = require('openai');
const Task = require('../models/taskModel.js');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 20 * 1000, // Add a 20-second timeout to prevent server crash
});

// @desc    Generate a task description
const generateDescription = asyncHandler(async (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Please provide a task title.');
  }

  const prompt = `Based on the following task title, generate a simple, step-by-step description for what needs to be done. Keep it concise and use a numbered or bulleted list if appropriate. Task Title: "${title}"`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    if (response && response.choices && response.choices[0]) {
      const description = response.choices[0].message.content.trim();
      res.status(200).json({ description });
    } else {
      // Handle cases where the AI gives a malformed or empty response
      throw new Error('AI service returned an invalid response.');
    }

  } catch (error) {
    // This is now more detailed and will catch timeouts
    console.error('OpenAI API Error in generateDescription:', error);
    res.status(503); // 503 Service Unavailable is more accurate here
    throw new Error('AI service is currently unavailable or timed out.');
  }
});

// @desc    Predict the next task category
const predictCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) { res.status(400); throw new Error('Please provide a task title.'); }

  const recentTasks = await Task.find({
    user: req.user.id,
    category: { $ne: null, $ne: '' },
  }).sort({ createdAt: -1 }).limit(10);

  const history = recentTasks.map(t => `- "${t.text}" is in category "${t.category}"`).join('\n');
  const prompt = `A user has this task history:\n${history}\n\nFor a new task "${title}", what is the single best category? Respond with only the category name. If unsure, say "General".`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
    });

    if (response && response.choices && response.choices[0]) {
      const category = response.choices[0].message.content.trim().replace(/"/g, '');
      res.status(200).json({ category });
    } else {
      throw new Error('AI service returned an invalid response for category.');
    }

  } catch (error) {
    console.error('OpenAI API Error in predictCategory:', error);
    res.status(503);
    throw new Error('AI service is currently unavailable or timed out.');
  }
});


module.exports = {
  generateDescription,
  predictCategory,
};