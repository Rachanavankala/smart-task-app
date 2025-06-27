// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { generateDescription, predictCategory } = require('../controllers/aiController.js'); // Import new function
const { protect } = require('../middleware/authMiddleware');

router.post('/generate-description', protect, generateDescription);
router.post('/predict-category', protect, predictCategory); // <-- ADD THIS NEW ROUTE

module.exports = router;