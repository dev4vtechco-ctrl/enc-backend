const asyncHandler = require('express-async-handler');
const WeeklyHighlight = require('../models/WeeklyHighlight');
const { deleteFiles, clearDirectory } = require('../utils/fileHelper');
const path = require('path');
const fs = require('fs-extra');

// @desc    Get weekly highlights
// @route   GET /api/weekly-highlights
// @access  Public
const getWeeklyHighlights = asyncHandler(async (req, res) => {
  const highlights = await WeeklyHighlight.getSingleton();
  res.json({
    success: true,
    data: highlights,
  });
});

// @desc    Replace all weekly highlights photos (max 20)
// @route   POST /api/weekly-highlights
// @access  Private/Admin
const replaceWeeklyHighlights = asyncHandler(async (req, res) => {
  const files = req.files;
  
  if (!files || files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }
  
  if (files.length > 20) {
    res.status(400);
    throw new Error('Maximum 20 images allowed');
  }
  
  const highlights = await WeeklyHighlight.getSingleton();
  
  // Delete all existing images
  if (highlights.images && highlights.images.length > 0) {
    await deleteFiles(highlights.images);
  }
  
  // Also clear the weekly-highlights uploads directory to remove any orphaned files
  const weeklyUploadDir = path.join(process.cwd(), 'uploads', 'weekly-highlights');
  if (await fs.pathExists(weeklyUploadDir)) {
    const existingFiles = await fs.readdir(weeklyUploadDir);
    for (const file of existingFiles) {
      await fs.remove(path.join(weeklyUploadDir, file));
    }
  }
  
  // Save new images
  const newImages = files.map(file => file.path);
  highlights.images = newImages;
  highlights.updatedAt = Date.now();
  
  await highlights.save();
  
  res.status(201).json({
    success: true,
    message: `Successfully replaced with ${newImages.length} new photos`,
    data: highlights,
  });
});

// @desc    Clear all weekly highlights photos
// @route   DELETE /api/weekly-highlights
// @access  Private/Admin
const clearWeeklyHighlights = asyncHandler(async (req, res) => {
  const highlights = await WeeklyHighlight.getSingleton();
  
  if (highlights.images && highlights.images.length > 0) {
    await deleteFiles(highlights.images);
    highlights.images = [];
    highlights.updatedAt = Date.now();
    await highlights.save();
  }
  
  res.json({
    success: true,
    message: 'All weekly highlights cleared',
    data: highlights,
  });
});

module.exports = {
  getWeeklyHighlights,
  replaceWeeklyHighlights,
  clearWeeklyHighlights,
};