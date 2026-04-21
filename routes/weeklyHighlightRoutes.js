const express = require('express');
const router = express.Router();
const {
  getWeeklyHighlights,
  replaceWeeklyHighlights,
  clearWeeklyHighlights,
} = require('../controllers/weeklyHighlightController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadWeeklyImages } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getWeeklyHighlights);

// Admin routes
router.post('/', protect, adminOnly, uploadWeeklyImages, replaceWeeklyHighlights);
router.delete('/', protect, adminOnly, clearWeeklyHighlights);

module.exports = router;