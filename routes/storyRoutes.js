const express = require('express');
const router = express.Router();
const {
  getStories,
  getStoryById,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadStoryPhotos } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getStories);
router.get('/:id', getStoryById);

// Admin routes
router.post('/', protect, adminOnly, uploadStoryPhotos, createStory);
router.put('/:id', protect, adminOnly, uploadStoryPhotos, updateStory);
router.delete('/:id', protect, adminOnly, deleteStory);

module.exports = router;