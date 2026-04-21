const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (admin only - superadmin can create)
// @route   POST /api/auth/register
// @access  Private/SuperAdmin
const registerUser = asyncHandler(async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }
  
  const userExists = await User.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  
  const user = await User.create({
    username,
    password,
    role: role || 'admin',
  });
  
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
  
  if (user && (await user.comparePassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({
    success: true,
    data: user,
  });
});

// @desc    Get all users (superadmin only)
// @route   GET /api/auth/users
// @access  Private/SuperAdmin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc    Delete user (superadmin only)
// @route   DELETE /api/auth/users/:id
// @access  Private/SuperAdmin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  // Prevent self-deletion of superadmin
  if (req.user._id.toString() === user._id.toString() && user.role === 'superadmin') {
    res.status(400);
    throw new Error('Cannot delete your own superadmin account');
  }
  
  await user.deleteOne();
  
  res.json({
    success: true,
    message: 'User removed',
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
};