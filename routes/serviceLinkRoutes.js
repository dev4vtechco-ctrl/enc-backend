const express = require('express');
const router = express.Router();
const {
  getServiceLink,
  updateServiceLink,
} = require('../controllers/serviceLinkController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServiceLink);

// Admin routes
router.put('/', protect, adminOnly, updateServiceLink);

module.exports = router;