const express = require('express');
const router = express.Router();
const {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
} = require('../controllers/ministryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadMinistryMainPhoto, uploadMinistryPhotos } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getMinistries);
router.get('/:id', getMinistryById);

// Admin routes
router.post(
  '/',
  protect,
  adminOnly,
  uploadMinistryMainPhoto,
  uploadMinistryPhotos,
  createMinistry
);
router.put(
  '/:id',
  protect,
  adminOnly,
  uploadMinistryMainPhoto,
  uploadMinistryPhotos,
  updateMinistry
);
router.delete('/:id', protect, adminOnly, deleteMinistry);

module.exports = router;