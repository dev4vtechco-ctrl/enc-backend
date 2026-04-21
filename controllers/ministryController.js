const asyncHandler = require('express-async-handler');
const Ministry = require('../models/Ministry');
const { deleteFiles } = require('../utils/fileHelper');

// @desc    Get all ministries
// @route   GET /api/ministries
// @access  Public
const getMinistries = asyncHandler(async (req, res) => {
  const ministries = await Ministry.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: ministries.length,
    data: ministries,
  });
});

// @desc    Get single ministry
// @route   GET /api/ministries/:id
// @access  Public
const getMinistryById = asyncHandler(async (req, res) => {
  const ministry = await Ministry.findById(req.params.id);
  
  if (!ministry) {
    res.status(404);
    throw new Error('Ministry not found');
  }
  
  res.json({
    success: true,
    data: ministry,
  });
});

// @desc    Create ministry
// @route   POST /api/ministries
// @access  Private/Admin
const createMinistry = asyncHandler(async (req, res) => {
  const { title, leader, description } = req.body;
  
  if (!title || !leader || !description) {
    res.status(400);
    throw new Error('Please provide title, leader, and description');
  }
  
  const mainPhoto = req.file ? req.file.path : null;
  if (!mainPhoto) {
    res.status(400);
    throw new Error('Main photo is required');
  }
  
  const photos = req.files ? req.files.map(file => file.path) : [];
  
  const ministry = await Ministry.create({
    title,
    leader,
    description,
    main_photo: mainPhoto,
    photos,
  });
  
  res.status(201).json({
    success: true,
    data: ministry,
  });
});

// @desc    Update ministry
// @route   PUT /api/ministries/:id
// @access  Private/Admin
const updateMinistry = asyncHandler(async (req, res) => {
  const ministry = await Ministry.findById(req.params.id);
  
  if (!ministry) {
    res.status(404);
    throw new Error('Ministry not found');
  }
  
  const { title, leader, description } = req.body;
  
  if (title) ministry.title = title;
  if (leader) ministry.leader = leader;
  if (description) ministry.description = description;
  
  if (req.file) {
    await deleteFiles([ministry.main_photo]);
    ministry.main_photo = req.file.path;
  }
  
  if (req.files && req.files.length > 0) {
    await deleteFiles(ministry.photos);
    ministry.photos = req.files.map(file => file.path);
  }
  
  const updatedMinistry = await ministry.save();
  
  res.json({
    success: true,
    data: updatedMinistry,
  });
});

// @desc    Delete ministry
// @route   DELETE /api/ministries/:id
// @access  Private/Admin
const deleteMinistry = asyncHandler(async (req, res) => {
  const ministry = await Ministry.findById(req.params.id);
  
  if (!ministry) {
    res.status(404);
    throw new Error('Ministry not found');
  }
  
  const allImages = [ministry.main_photo, ...ministry.photos];
  await deleteFiles(allImages);
  
  await ministry.deleteOne();
  
  res.json({
    success: true,
    message: 'Ministry deleted successfully',
  });
});

module.exports = {
  getMinistries,
  getMinistryById,
  createMinistry,
  updateMinistry,
  deleteMinistry,
};