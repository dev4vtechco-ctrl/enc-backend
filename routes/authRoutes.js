const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
} = require('../controllers/authController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

// Superadmin only routes
router.post('/register', protect, superAdminOnly, registerUser);
router.get('/users', protect, superAdminOnly, getUsers);
router.delete('/users/:id', protect, superAdminOnly, deleteUser);

module.exports = router;