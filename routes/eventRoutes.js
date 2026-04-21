const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadEventMainPhoto, uploadEventPhotos } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  uploadEventMainPhoto,
  uploadEventPhotos,
  createEvent
);
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadEventMainPhoto,
  uploadEventPhotos,
  updateEvent
);
router.delete('/:id', protect, adminOnly, deleteEvent);

module.exports = router;